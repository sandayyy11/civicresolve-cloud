const express = require("express");

const router = express.Router();

const Issue = require("../models/Issue");
const Notification = require("../models/Notification");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { isValidObjectId } = require("../services/validationService");

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("worker"),
  async (req, res) => {
    try {
      const issues = await Issue.find({
        assignedTo: req.user.id,
      })
        .populate("reportedBy", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: issues.length,
        issues,
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
  "/update-status/:issueId",
  authMiddleware,
  authorizeRoles("worker"),
  async (req, res) => {
    try {

      const { status } = req.body;
      if (!isValidObjectId(req.params.issueId)) {
        return res.status(400).json({ success: false, message: "Invalid issue ID" });
      }

      const issue = await Issue.findById(req.params.issueId);

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: "Issue not found"
        });
      }

      // Worker can only update their own assigned issue
      if (!issue.assignedTo || issue.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this issue"
        });
      }

      if (!["Pending", "In Progress"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid worker status update" });
      }

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

      res.status(200).json({
        success: true,
        message: "Issue status updated successfully",
        issue
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }
  }
);

router.patch(
  "/resolve/:issueId",
  authMiddleware,
  authorizeRoles("worker"),
  async (req, res) => {
    try {
      const { resolutionNote } = req.body;
      if (!isValidObjectId(req.params.issueId)) {
        return res.status(400).json({ success: false, message: "Invalid issue ID" });
      }
      if (typeof resolutionNote !== "string" || resolutionNote.trim().length === 0 || resolutionNote.length > 2000) {
        return res.status(400).json({ success: false, message: "Resolution note must be between 1 and 2000 characters" });
      }
      const issue = await Issue.findById(req.params.issueId);

      if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });
      if (!issue.assignedTo || issue.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "You are not assigned to this issue" });
      }
      if (issue.status !== "In Progress") {
        return res.status(400).json({ success: false, message: "Only in-progress issues can be resolved" });
      }

      issue.status = "Resolved";
      issue.resolutionNote = resolutionNote || "";
      await issue.save();

      await Notification.create({
        user: issue.reportedBy,
        relatedIssue: issue._id,
        title: "Complaint resolved",
        message: `Your complaint \"${issue.title}\" has been resolved.`,
        type: "resolved",
      });

      res.status(200).json({ success: true, message: "Issue resolved successfully", issue });
    } catch (error) {
      res.status(500).json({ success: false, message: "Unable to resolve issue" });
    }
  }
);

module.exports = router;
