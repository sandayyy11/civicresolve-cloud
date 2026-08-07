const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Road",
        "Garbage",
        "Water",
        "Electricity",
        "Other",
      ],
      required: true,
    },
    priority: {
  type: String,
  enum: ["Low", "Medium", "High"],
  default: "Medium",
},

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    
    imageUrl: {
  type: String,
  default: "",
},
  location: {
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
},
    resolutionNote: {
    type: String,
    default: ""
},
summary: {
  type: String,
  default: "",
},

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    
    },

    assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
},

supportCount: {
  type: Number,
  default: 1,
},

supporters: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

assignmentType: {
  type: String,
  enum: ["Automatic", "Manual"],
  default: "Automatic",
},

resolvedImage: {
  type: String,
  default: "",
},



feedback: {
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },

  comment: {
    type: String,
    default: "",
  },

  submittedAt: Date,
},

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);