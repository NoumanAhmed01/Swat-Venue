const Venue = require("../models/Venue");
const User = require("../models/User");
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
      query.status = status;
    } else {
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

    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const url = await uploadToCloudinary(file, "images", "image");
        imageUrls.push(url);
      }
    }

    if (req.files && req.files.videos) {
      for (const file of req.files.videos) {
        const url = await uploadToCloudinary(file, "videos", "video");
        videoUrls.push(url);
      }
    }

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

    const venue = await Venue.create(venueData);

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
