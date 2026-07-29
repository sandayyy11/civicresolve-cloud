require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@civicresolve.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create admin
    const admin = new User({
      name: "System Admin",
      email: "admin@civicresolve.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    console.log("Email: admin@civicresolve.com");
    console.log("Password: Admin@123");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();