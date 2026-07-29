const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/create-worker",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create worker
      const worker = new User({
        name,
        email,
        password: hashedPassword,
        role: "worker",
      });

      await worker.save();

      res.status(201).json({
        success: true,
        message: "Worker created successfully",
        worker: {
          id: worker._id,
          name: worker.name,
          email: worker.email,
          role: worker.role,
        },
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;