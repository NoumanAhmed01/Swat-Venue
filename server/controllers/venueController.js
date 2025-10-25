const Venue = require('../models/Venue');
const User = require('../models/User');

exports.getAllVenues = async (req, res) => {
  try {
    const { location, minCapacity, maxCapacity, minPrice, maxPrice, amenities, search, status } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'approved';
    }

    if (location && location !== 'all') {
      query.location = new RegExp(location, 'i');
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
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const venues = await Venue.find(query).populate('owner', 'name email phone').sort('-createdAt');

    res.json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('owner', 'name email phone');

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createVenue = async (req, res) => {
  try {
    const venueData = {
      ...req.body,
      owner: req.user.id,
      ownerName: req.user.name,
      phone: req.body.phone || req.user.phone
    };

    const venue = await Venue.create(venueData);

    await User.findByIdAndUpdate(req.user.id, {
      $push: { venues: venue._id }
    });

    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this venue' });
    }

    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this venue' });
    }

    await venue.deleteOne();

    await User.findByIdAndUpdate(venue.owner, {
      $pull: { venues: venue._id }
    });

    res.json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ owner: req.user.id }).sort('-createdAt');

    res.json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
