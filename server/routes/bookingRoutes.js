const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getVenueBookings,
  getAllBookings,
  updateBookingStatus,
  getReservedDates
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/venue/:venueId', protect, authorize('owner', 'admin'), getVenueBookings);
router.get('/venue/:venueId/reserved-dates', getReservedDates);
router.get('/all', protect, authorize('admin'), getAllBookings);
router.patch('/:id/status', protect, authorize('owner', 'admin'), updateBookingStatus);

module.exports = router;
