const express = require('express');
const router = express.Router();
const {
  getVenueReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/venue/:venueId', getVenueReviews);
router.post('/venue/:venueId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
