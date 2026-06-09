const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole,
  getStats,
  updateUserStatus,
  updateProfilePicture,
  deleteProfilePicture,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const { uploadImages, uploadProfilePicture } = require("../middleware/upload");

router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/stats", protect, authorize("admin"), getStats);

router.post(
  "/profile-picture",
  protect,
  uploadProfilePicture.single("profilePicture"),
  updateProfilePicture
);
router.delete("/profile-picture", protect, deleteProfilePicture);

router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);
router.patch("/:id/role", protect, authorize("admin"), updateUserRole);
router.patch("/:id/status", protect, authorize("admin"), updateUserStatus);

module.exports = router;
