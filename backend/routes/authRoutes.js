const express = require("express");

const router = express.Router();

// Temporary storage (instead of a database)
const users = [];

// GET - View all users
router.get("/users", (req, res) => {
  res.json(users);
});

// POST - Register a new user
router.post("/register", (req, res) => {
  const user = req.body;

  users.push(user);

  res.json({
    success: true,
    message: "User registered successfully!",
    data: user,
  });
});

module.exports = router;