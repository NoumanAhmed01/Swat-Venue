const express = require("express");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", createContact);
router.get("/", protect, authorize("admin"), getAllContacts);
router.patch("/:id", protect, authorize("admin"), updateContactStatus);
router.delete("/:id", protect, authorize("admin"), deleteContact);

module.exports = router;
