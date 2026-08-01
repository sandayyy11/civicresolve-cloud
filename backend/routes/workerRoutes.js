const express = require("express");

const router = express.Router();

const Issue = require("../models/Issue");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

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

      const { status, resolutionNote} = req.body;

      const issue = await Issue.findById(req.params.issueId);

      if (!issue) {
        return res.status(404).json({
          success: false,
          message: "Issue not found"
        });
      }

      // Worker can only update their own assigned issue
      if (issue.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not assigned to this issue"
        });
      }

      issue.status = status;

      if (resolutionNote) {
    issue.resolutionNote = resolutionNote;
}

      await issue.save();

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

module.exports = router;