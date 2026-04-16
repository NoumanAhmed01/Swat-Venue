const Review = require('../models/Review');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');

exports.getVenueReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ venue: req.params.venueId })
      .populate('customer', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { rating, comment, bookingId } = req.body;
    const venueId = req.params.venueId;

    // 1. Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // 2. Verify the booking
    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user.id,
      venue: venueId,
      status: 'confirmed'
    });

    if (!booking) {
      return res.status(400).json({ 
        message: 'You can only review venues with a confirmed booking.' 
      });
    }

    // 3. Check if event date has passed
    if (new Date(booking.eventDate) > new Date()) {
      return res.status(400).json({ 
        message: 'You can only review an event after it has taken place.' 
      });
    }

    // 4. Check if this booking was already reviewed
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'This booking has already been reviewed.' });
    }

    // 5. Create the review
    const review = await Review.create({
      venue: venueId,
      customer: req.user.id,
      customerName: req.user.name,
      booking: bookingId,
      rating,
      comment,
      eventType: booking.eventType
    });

    // 6. Update Venue rating
    const reviews = await Review.find({ venue: venueId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Venue.findByIdAndUpdate(venueId, {
      rating: avgRating.toFixed(1),
      reviews: reviews.length
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    const reviews = await Review.find({ venue: review.venue });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Venue.findByIdAndUpdate(review.venue, {
      rating: avgRating.toFixed(1)
    });

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const venueId = review.venue;
    await review.deleteOne();

    const reviews = await Review.find({ venue: venueId });
    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
      : 0;

    await Venue.findByIdAndUpdate(venueId, {
      rating: avgRating.toFixed(1),
      reviews: reviews.length
    });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
