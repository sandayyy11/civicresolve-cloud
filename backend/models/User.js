const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["citizen", "worker", "admin"],
      default: "citizen",
    },

    // Worker Service Area
    serviceArea: {
      center: {
        latitude: {
          type: Number,
        },
        longitude: {
          type: Number,
        },
      },

      radiusKm: {
        type: Number,
        default: 5,
      },
    },

    // Worker Availability
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);