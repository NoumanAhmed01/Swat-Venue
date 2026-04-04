const Menu = require("../models/Menu");

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
    const menu = await Menu.create(req.body);

    res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
