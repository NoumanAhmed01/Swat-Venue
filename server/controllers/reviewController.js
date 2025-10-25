const Review = require('../models/Review');
const Venue = require('../models/Venue');

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
    const { rating, comment, eventType } = req.body;
    const venueId = req.params.venueId;

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    const existingReview = await Review.findOne({
      venue: venueId,
      customer: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this venue' });
    }

    const review = await Review.create({
      venue: venueId,
      customer: req.user.id,
      customerName: req.user.name,
      rating,
      comment,
      eventType
    });

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
