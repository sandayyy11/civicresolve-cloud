require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const adminRoutes = require("./routes/adminRoutes");
const workerRoutes = require("./routes/workerRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const validateRequiredEnv = () => {
  const required = ["MONGODB_URI", "JWT_SECRET"];
  const missing = required.filter(
    (key) => !process.env[key] || !String(process.env[key]).trim()
  );

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

const startServer = async () => {
  validateRequiredEnv();
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("❌ Server startup failed");
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = app;