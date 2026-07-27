require("dotenv").config();
const connectDB = require("./config/db");


const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;



app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");

// Home Route
app.get("/", (req, res) => {
  res.send("🚀 Welcome to the CivicResolve Backend!");
});

// Health Route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running successfully!",
    timestamp: new Date(),
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);

connectDB();
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});