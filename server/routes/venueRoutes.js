const express = require("express");
const router = express.Router();
const {
  getAllVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getOwnerVenues,
  approveVenue,
  rejectVenue,
} = require("../controllers/venueController");
const { protect, authorize } = require("../middleware/auth");
const { uploadVenueMedia } = require("../middleware/upload");

router.get("/", getAllVenues);
router.get(
  "/owner/my-venues",
  protect,
  authorize("owner", "admin"),
  getOwnerVenues
);
router.get("/:id", getVenueById);
router.post(
  "/",
  protect,
  authorize("owner", "admin"),
  uploadVenueMedia,
  createVenue
);
router.put(
  "/:id",
  protect,
  authorize("owner", "admin"),
  uploadVenueMedia,
  updateVenue
);
router.delete("/:id", protect, authorize("owner", "admin"), deleteVenue);
router.patch("/:id/approve", protect, authorize("admin"), approveVenue);
router.patch("/:id/reject", protect, authorize("admin"), rejectVenue);

module.exports = router;
