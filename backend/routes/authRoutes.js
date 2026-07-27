const User = require("../models/User");
const express = require("express");

const router = express.Router();

// Temporary storage (instead of a database)
const users = [];

// GET - View all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST - Register a new user
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;