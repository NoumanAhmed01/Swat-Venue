const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getVenueBookings,
  getOwnerBookings,
  getAllBookings,
  updateBookingStatus,
  getReservedDates,
  deleteBooking,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getUserBookings);
router.get(
  "/owner/my-bookings",
  protect,
  authorize("owner", "admin"),
  getOwnerBookings
);
router.get(
  "/venue/:venueId",
  protect,
  authorize("owner", "admin"),
  getVenueBookings
);
router.get("/venue/:venueId/reserved-dates", getReservedDates);
router.get("/all", protect, authorize("admin"), getAllBookings);
router.patch(
  "/:id/status",
  protect,
  authorize("owner", "admin"),
  updateBookingStatus
);
router.delete("/:id", protect, deleteBooking);

module.exports = router;
