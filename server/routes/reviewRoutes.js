const express = require('express');
const router = express.Router();
const {
  getVenueReviews,
  createReview,
  updateReview,
  deleteReview,
  addOwnerReply
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/venue/:venueId', getVenueReviews);
router.post('/venue/:venueId', protect, createReview);
router.post('/:id/reply', protect, authorize('owner', 'admin'), addOwnerReply);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
