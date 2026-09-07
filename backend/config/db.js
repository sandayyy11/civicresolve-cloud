const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URI || !String(process.env.MONGODB_URI).trim()) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error("Database connection error detected; check the MongoDB configuration.");
    process.exit(1);
  }
};

module.exports = connectDB;