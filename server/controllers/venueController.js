const Venue = require("../models/Venue");
const User = require("../models/User");
const Menu = require("../models/Menu");
const { cloudinary } = require("../config/cloudinary");
const {
  deleteFromCloudinary,
  deleteVideoFromCloudinary,
  extractPublicId,
} = require("../config/cloudinary");

const uploadToCloudinary = async (file, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `swatvenue/${folder}`,
      resource_type: resourceType,
    };

    if (resourceType === "image") {
      uploadOptions.transformation = [
        { width: 1200, height: 800, crop: "limit", quality: "auto" },
      ];
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};

exports.getAllVenues = async (req, res) => {
  try {
    const {
      location,
      minCapacity,
      maxCapacity,
      minPrice,
      maxPrice,
      amenities,
      search,
      status,
    } = req.query;

    let query = {};

    if (status) {
      if (status === "all") {
        // Don't filter by status - show all venues
      } else {
        query.status = status;
      }
    } else {
      // Default: only show approved venues for public listing
      query.status = "approved";
    }

    if (location && location !== "all") {
      // Use text search for performance if possible, otherwise keep regex for partial matching
      query.location = { $regex: location, $options: "i" };
    }

    if (minCapacity || maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
      if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    if (amenities) {
      const amenitiesArray = amenities.split(",");
      query.amenities = { $all: amenitiesArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const venues = await Venue.find(query)
      .populate("owner", "name email phone")
      .sort("-createdAt");

    res.json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.json({
      success: true,
      data: venue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVenue = async (req, res) => {
  try {
    const imageUrls = [];
    const videoUrls = [];

    // Upload images to Cloudinary
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const url = await uploadToCloudinary(file, "images", "image");
        imageUrls.push(url);
      }
    }

    // Upload videos to Cloudinary
    if (req.files && req.files.videos) {
      for (const file of req.files.videos) {
        const url = await uploadToCloudinary(file, "videos", "video");
        videoUrls.push(url);
      }
    }

    // -------------------------------
    // 1️⃣ PREPARE VENUE DATA
    // -------------------------------
    const venueData = {
      ...req.body,
      owner: req.user.id,
      ownerName: req.user.name,
      phone: req.body.phone || req.user.phone,
      images: imageUrls,
      videos: videoUrls,
    };

    if (typeof venueData.amenities === "string") {
      venueData.amenities = JSON.parse(venueData.amenities);
    }

    // Create Venue
    const venue = await Venue.create(venueData);

    // ✅ CREATE MENUS IF PROVIDED
    if (req.body.menus) {
      try {
        const menusData = JSON.parse(req.body.menus);
        if (Array.isArray(menusData)) {
          const menusToCreate = menusData
            .filter((m) => m.name && m.pricePerHead)
            .map((m) => ({
              ...m,
              venue: venue._id,
            }));

          if (menusToCreate.length > 0) {
            await Menu.insertMany(menusToCreate);
          }
        }
      } catch (menuError) {
        console.error("Error creating menus:", menuError);
      }
    }

    // Link venue to user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { venues: venue._id },
    });

    res.status(201).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    console.error("Create venue error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    const venueId = req.params.id;
    let venue = await Venue.findById(venueId);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Check ownership
    if (venue.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this venue" });
    }

    // 1. Prepare Update Data from req.body
    // Destructure to isolate arrays that need special handling
    const { 
      images: bodyImages, 
      videos: bodyVideos, 
      deletedImages, 
      deletedVideos, 
      amenities,
      capacity,
      price,
      ...otherFields 
    } = req.body;

    const updateData = { ...otherFields };

    // Explicitly cast numeric fields (since they come from FormData as strings)
    if (capacity) updateData.capacity = Number(capacity);
    if (price) updateData.price = Number(price);

    // Parse amenities if it's a JSON string
    if (amenities) {
      try {
        updateData.amenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities;
      } catch (e) {
        console.error("Error parsing amenities:", e);
      }
    }

    // 2. Handle Image Updates
    let finalImages = Array.isArray(venue.images) ? [...venue.images] : [];

    // Handle Deletions
    if (deletedImages) {
      try {
        const toDelete = typeof deletedImages === "string" ? JSON.parse(deletedImages) : deletedImages;
        if (Array.isArray(toDelete)) {
          for (const imageUrl of toDelete) {
            const publicId = extractPublicId(imageUrl);
            if (publicId) {
              await deleteFromCloudinary(publicId).catch(err => console.error("Cloudinary delete error:", err));
            }
          }
          finalImages = finalImages.filter(img => !toDelete.includes(img));
        }
      } catch (e) {
        console.error("Error parsing deletedImages:", e);
      }
    }

    // Handle New Image Uploads
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        try {
          const url = await uploadToCloudinary(file, "images", "image");
          finalImages.push(url);
        } catch (uploadErr) {
          console.error("Cloudinary upload error (image):", uploadErr);
        }
      }
    }
    updateData.images = finalImages;

    // 3. Handle Video Updates
    let finalVideos = Array.isArray(venue.videos) ? [...venue.videos] : [];

    // Handle Deletions
    if (deletedVideos) {
      try {
        const toDelete = typeof deletedVideos === "string" ? JSON.parse(deletedVideos) : deletedVideos;
        if (Array.isArray(toDelete)) {
          for (const videoUrl of toDelete) {
            const publicId = extractPublicId(videoUrl);
            if (publicId) {
              await deleteVideoFromCloudinary(publicId).catch(err => console.error("Cloudinary video delete error:", err));
            }
          }
          finalVideos = finalVideos.filter(vid => !toDelete.includes(vid));
        }
      } catch (e) {
        console.error("Error parsing deletedVideos:", e);
      }
    }

    // Handle New Video Uploads
    if (req.files && req.files.videos) {
      for (const file of req.files.videos) {
        try {
          const url = await uploadToCloudinary(file, "videos", "video");
          finalVideos.push(url);
        } catch (uploadErr) {
          console.error("Cloudinary upload error (video):", uploadErr);
        }
      }
    }
    updateData.videos = finalVideos;

    // 4. Save to Database
    const updatedVenue = await Venue.findByIdAndUpdate(venueId, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: updatedVenue,
    });
  } catch (error) {
    console.error("Update venue critical error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error during venue update" 
    });
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    if (venue.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this venue" });
    }

    if (venue.images && venue.images.length > 0) {
      for (const imageUrl of venue.images) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
    }

    if (venue.videos && venue.videos.length > 0) {
      for (const videoUrl of venue.videos) {
        const publicId = extractPublicId(videoUrl);
        if (publicId) {
          await deleteVideoFromCloudinary(publicId);
        }
      }
    }

    await venue.deleteOne();

    await User.findByIdAndUpdate(venue.owner, {
      $pull: { venues: venue._id },
    });

    res.json({
      success: true,
      message: "Venue deleted successfully",
    });
  } catch (error) {
    console.error("Delete venue error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ owner: req.user.id }).sort("-createdAt");

    res.json({
      success: true,
      count: venues.length,
      data: venues,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.json({
      success: true,
      data: venue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.json({
      success: true,
      data: venue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
