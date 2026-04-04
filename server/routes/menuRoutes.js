const express = require("express");
const router = express.Router();

const {
  getMenusByVenue,
  createMenu,
} = require("../controllers/menuController");

const { protect, authorize } = require("../middleware/auth");

// Get menus for a specific venue (PUBLIC)
router.get("/venue/:venueId", getMenusByVenue);

// Create menu (ONLY OWNER/ADMIN)
router.post("/", protect, authorize("owner", "admin"), createMenu);

module.exports = router;
