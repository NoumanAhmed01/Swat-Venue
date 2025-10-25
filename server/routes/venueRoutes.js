const express = require('express');
const router = express.Router();
const {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getOwnerVenues,
  approveVenue,
  rejectVenue
} = require('../controllers/venueController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllVenues);
router.get('/owner/my-venues', protect, authorize('owner', 'admin'), getOwnerVenues);
router.get('/:id', getVenueById);
router.post('/', protect, authorize('owner', 'admin'), createVenue);
router.put('/:id', protect, authorize('owner', 'admin'), updateVenue);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteVenue);
router.patch('/:id/approve', protect, authorize('admin'), approveVenue);
router.patch('/:id/reject', protect, authorize('admin'), rejectVenue);

module.exports = router;
