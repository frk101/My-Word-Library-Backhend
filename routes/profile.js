const express = require("express");
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  deleteUser,
} = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/update", authMiddleware, updateProfile);
router.post("/upload", authMiddleware, uploadProfilePicture);
router.delete("/delete", authMiddleware, deleteUser);

module.exports = router;
