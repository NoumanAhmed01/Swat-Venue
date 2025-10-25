const Booking = require('../models/Booking');
const Venue = require('../models/Venue');

exports.createBooking = async (req, res) => {
  try {
    const { venue, eventDate, eventType, guestCount, message, phone, email } = req.body;

    const venueExists = await Venue.findById(venue);
    if (!venueExists) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const existingBooking = await Booking.findOne({
      venue,
      eventDate,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This date is already booked' });
    }

    const booking = await Booking.create({
      venue,
      customer: req.user.id,
      customerName: req.user.name,
      eventDate,
      eventType,
      guestCount,
      message,
      phone: phone || req.user.phone,
      email: email || req.user.email,
      amount: venueExists.price,
      status: 'pending'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('venue', 'name location price')
      .populate('customer', 'name email phone');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user.id })
      .populate('venue', 'name location price images')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVenueBookings = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venueId);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ venue: req.params.venueId })
      .populate('customer', 'name email phone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('venue', 'name location')
      .populate('customer', 'name email phone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const venue = await Venue.findById(booking.venue);
    if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReservedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({
      venue: req.params.venueId,
      status: { $in: ['confirmed', 'pending'] },
      eventDate: { $gte: new Date() }
    }).select('eventDate');

    const reservedDates = bookings.map(booking => booking.eventDate);

    res.json({
      success: true,
      data: reservedDates
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
