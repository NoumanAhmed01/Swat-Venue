const Menu = require("../models/Menu");
const Venue = require("../models/Venue");

// GET MENUS BY VENUE
exports.getMenusByVenue = async (req, res) => {
  try {
    const menus = await Menu.find({ venue: req.params.venueId });

    res.json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE MENU (for owner/admin)
exports.createMenu = async (req, res) => {
  try {
    const { venue: venueId } = req.body;

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    // Check ownership
    if (venue.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to add menu to this venue" });
    }

    const menu = await Menu.create(req.body);

    res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MENU
exports.updateMenu = async (req, res) => {
  try {
    let menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const venue = await Venue.findById(menu.venue);

    // Check ownership
    if (
      venue &&
      venue.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this menu" });
    }

    menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MENU
exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    const venue = await Venue.findById(menu.venue);

    // Check ownership
    if (
      venue &&
      venue.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this menu" });
    }

    await menu.deleteOne();

    res.json({
      success: true,
      message: "Menu removed",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
