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

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    profileImage: {
      type: String,
      trim: true,
      default: "",
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

    specialization: {
  type: String,
  enum: [
    "Road",
    "Garbage",
    "Water",
    "Electricity",
    "Other",
  ],
  default: "Other",
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
    
    averageRating: {
  type: Number,
  default: 0,
},

totalRatings: {
  type: Number,
  default: 0,
},

ratingSum: {
  type: Number,
  default: 0,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);