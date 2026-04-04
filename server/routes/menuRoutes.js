const express = require("express");
const router = express.Router();

const {
  getMenusByVenue,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController");

const { protect, authorize } = require("../middleware/auth");

// Get menus for a specific venue (PUBLIC)
router.get("/venue/:venueId", getMenusByVenue);

// Create, Update, Delete menu (ONLY OWNER/ADMIN)
router.post("/", protect, authorize("owner", "admin"), createMenu);
router.put("/:id", protect, authorize("owner", "admin"), updateMenu);
router.delete("/:id", protect, authorize("owner", "admin"), deleteMenu);

module.exports = router;
