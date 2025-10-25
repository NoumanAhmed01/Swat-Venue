const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getVenueInquiries,
  getOwnerInquiries,
  updateInquiryStatus
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', createInquiry);
router.get('/venue/:venueId', protect, authorize('owner', 'admin'), getVenueInquiries);
router.get('/owner/my-inquiries', protect, authorize('owner', 'admin'), getOwnerInquiries);
router.patch('/:id/status', protect, authorize('owner', 'admin'), updateInquiryStatus);

module.exports = router;
