const Venue = require("../models/Venue");
const User = require("../models/User");
const Menu = require("../models/Menu");
const { cloudinary } = require("../config/cloudinary");
const {
  deleteFromCloudinary,
  deleteVideoFromCloudinary,
  extractPublicId,
} = require("../config/cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
      query.location = new RegExp(location, "i");
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
    // 1️⃣ GET ADDRESS FROM FRONTEND
    // -------------------------------
    const { address } = req.body;
    console.log("📌 Received address from frontend:", address); // <--- ADD THIS

    if (!address) {
      return res.status(400).json({ message: "Address is required!" });
    }
    console.log("Received address:", req.body.address);

    // -------------------------------
    // 2️⃣ GEOCODE ADDRESS → COORDINATES
    // -------------------------------
    const geoData = await geocodingClient
      .forwardGeocode({
        query: address,
        limit: 1,
      })
      .send();

    // If no match found
    if (!geoData.body.features.length) {
      return res
        .status(400)
        .json({ message: "Unable to find location for this address" });
    }

    const coordinates = geoData.body.features[0].center; // [lng, lat]
    console.log("📌 Mapbox returned coordinates:", coordinates); // <--- ADD THIS
    // -------------------------------
    // 3️⃣ PREPARE VENUE DATA
    // -------------------------------
    const venueData = {
      ...req.body,
      owner: req.user.id,
      ownerName: req.user.name,
      phone: req.body.phone || req.user.phone,
      images: imageUrls,
      videos: videoUrls,
      geoLocation: {
        type: "Point",
        coordinates: coordinates, // [lng, lat]
      },
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
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    if (venue.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this venue" });
    }

    const updateData = { ...req.body };

    if (typeof updateData.amenities === "string") {
      updateData.amenities = JSON.parse(updateData.amenities);
    }

    if (req.body.deletedImages) {
      const deletedImages = JSON.parse(req.body.deletedImages);
      for (const imageUrl of deletedImages) {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
      updateData.images = venue.images.filter(
        (img) => !deletedImages.includes(img)
      );
    }

    if (req.body.deletedVideos) {
      const deletedVideos = JSON.parse(req.body.deletedVideos);
      for (const videoUrl of deletedVideos) {
        const publicId = extractPublicId(videoUrl);
        if (publicId) {
          await deleteVideoFromCloudinary(publicId);
        }
      }
      updateData.videos = venue.videos.filter(
        (vid) => !deletedVideos.includes(vid)
      );
    }

    const newImageUrls = [...(updateData.images || venue.images)];
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const url = await uploadToCloudinary(file, "images", "image");
        newImageUrls.push(url);
      }
    }
    updateData.images = newImageUrls;

    const newVideoUrls = [...(updateData.videos || venue.videos)];
    if (req.files && req.files.videos) {
      for (const file of req.files.videos) {
        const url = await uploadToCloudinary(file, "videos", "video");
        newVideoUrls.push(url);
      }
    }
    updateData.videos = newVideoUrls;

    venue = await Venue.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: venue,
    });
  } catch (error) {
    console.error("Update venue error:", error);
    res.status(500).json({ message: error.message });
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
