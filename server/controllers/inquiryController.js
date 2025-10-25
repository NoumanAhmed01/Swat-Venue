const Inquiry = require('../models/Inquiry');
const Venue = require('../models/Venue');

exports.createInquiry = async (req, res) => {
  try {
    const { venue, name, email, phone, eventDate, eventType, guestCount, message } = req.body;

    const venueExists = await Venue.findById(venue);
    if (!venueExists) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const inquiry = await Inquiry.create({
      venue,
      name,
      email,
      phone,
      eventDate,
      eventType,
      guestCount,
      message
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate('venue', 'name location phone ownerName');

    res.status(201).json({
      success: true,
      data: populatedInquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVenueInquiries = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venueId);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const inquiries = await Inquiry.find({ venue: req.params.venueId })
      .sort('-createdAt');

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOwnerInquiries = async (req, res) => {
  try {
    const venues = await Venue.find({ owner: req.user.id }).select('_id');
    const venueIds = venues.map(v => v._id);

    const inquiries = await Inquiry.find({ venue: { $in: venueIds } })
      .populate('venue', 'name location')
      .sort('-createdAt');

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status, response } = req.body;
    const inquiry = await Inquiry.findById(req.params.id).populate('venue');

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    if (inquiry.venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    inquiry.status = status;
    if (response) {
      inquiry.response = response;
    }

    await inquiry.save();

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
