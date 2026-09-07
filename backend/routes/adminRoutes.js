const express = require("express");
const bcrypt = require("bcrypt");
const Issue = require("../models/Issue");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const Notification = require("../models/Notification");
const { ISSUE_CATEGORIES, ISSUE_STATUSES, isValidEmail, isValidObjectId, requiredText, validatePassword } = require("../services/validationService");

const router = express.Router();

router.post(
  "/create-worker",
  authMiddleware,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { name, email, password, specialization } = req.body;
      const validationError = requiredText(name, "Name", { max: 100 })
        || (!isValidEmail(email) ? "A valid email is required" : null)
        || validatePassword(password)
        || (!ISSUE_CATEGORIES.includes(specialization) ? "Invalid specialization" : null);
      if (validationError) return res.status(400).json({ success: false, message: validationError });

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
        specialization,
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

      if (!isValidObjectId(req.params.issueId) || !isValidObjectId(workerId)) {
        return res.status(400).json({ success: false, message: "Invalid issue or worker ID" });
      }

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

router.get("/citizens", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const citizens = await User.find({ role: "citizen" }).select("name email createdAt");

    res.status(200).json({
      success: true,
      count: citizens.length,
      citizens,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

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

router.patch("/issues/:issueId/status", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!isValidObjectId(req.params.issueId)) {
      return res.status(400).json({ success: false, message: "Invalid issue ID" });
    }
    if (!ISSUE_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid issue status" });
    }

    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });

    const previousStatus = issue.status;
    issue.status = status;
    await issue.save();

    if (status === "In Progress" && previousStatus !== "In Progress") {
      await Notification.create({
        user: issue.reportedBy,
        relatedIssue: issue._id,
        title: "Complaint in progress",
        message: `Your complaint \"${issue.title}\" is now in progress.`,
        type: "status_update",
      });
    }

    res.status(200).json({ success: true, issue });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to update issue status" });
  }
});

router.patch("/issues/:issueId/resolve", authMiddleware, authorizeRoles("admin"), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.issueId)) {
      return res.status(400).json({ success: false, message: "Invalid issue ID" });
    }
    if (req.body.resolutionNote !== undefined && (typeof req.body.resolutionNote !== "string" || req.body.resolutionNote.length > 2000)) {
      return res.status(400).json({ success: false, message: "Resolution note must be at most 2000 characters" });
    }
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });

    issue.status = "Resolved";
    issue.resolutionNote = req.body.resolutionNote || "";
    await issue.save();
    await Notification.create({
      user: issue.reportedBy,
      relatedIssue: issue._id,
      title: "Complaint resolved",
      message: `Your complaint \"${issue.title}\" has been resolved.`,
      type: "resolved",
    });

    res.status(200).json({ success: true, issue });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to resolve issue" });
  }
});

module.exports = router;
