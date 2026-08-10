const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("[userRoutes] GET /profile route entered");
    console.log("[userRoutes] req.user before User.findById:", req.user);
    console.log("[userRoutes] req.user.id:", req.user && req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    console.log("[userRoutes] PATCH /profile route entered");
    console.log("[userRoutes] req.user before update:", req.user);
    console.log("[userRoutes] req.user.id:", req.user && req.user.id);

    const allowedUpdates = ["name", "phone", "address", "profileImage"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((field) => allowedUpdates.includes(field));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: "Only name, phone, address, and profileImage can be updated",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    updates.forEach((field) => {
      user[field] = req.body[field];
    });

    await user.save();

    const updatedUser = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
