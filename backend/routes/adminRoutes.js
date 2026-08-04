const express = require("express");
const bcrypt = require("bcrypt");
const Issue = require("../models/Issue");
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
router.patch(
  "/assign-worker/:issueId",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { workerId } = req.body;

      const Issue = require("../models/Issue");

      // Find the worker
      const worker = await User.findById(workerId);

      if (!worker) {
        return res.status(404).json({
          success: false,
          message: "Worker not found",
        });
      }

      // Make sure selected user is actually a worker
      if (worker.role !== "worker") {
        return res.status(400).json({
          success: false,
          message: "Selected user is not a worker",
        });
      }

      // Find issue
      const issue = await Issue.findById(req.params.issueId);

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: "Issue not found",
        });
      }

      // Assign worker
      issue.assignedTo = worker._id;

      await issue.save();

      res.status(200).json({
        success: true,
        message: "Worker assigned successfully",
        issue,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);
router.get(
  "/workers",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const workers = await User.find({ role: "worker" }).select("-password");

      res.status(200).json({
        success: true,
        count: workers.length,
        workers,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get("/dashboard", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {

    const totalIssues = await Issue.countDocuments();

    const pendingIssues = await Issue.countDocuments({
      status: "Pending",
    });

    const inProgressIssues = await Issue.countDocuments({
      status: "In Progress",
    });

    const resolvedIssues = await Issue.countDocuments({
      status: "Resolved",
    });

    const totalWorkers = await User.countDocuments({
      role: "worker",
    });

    const totalCitizens = await User.countDocuments({
      role: "citizen",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalIssues,
        pendingIssues,
        inProgressIssues,
        resolvedIssues,
        totalWorkers,
        totalCitizens,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

module.exports = router;