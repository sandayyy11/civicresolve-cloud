const express = require("express");

const router = express.Router();

const User = require("../models/User");
const Issue = require("../models/Issue");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { singleImage } = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const categorizeIssue = require("../services/aiService");
const Notification = require("../models/Notification");
const { findPotentialDuplicates } = require("../services/duplicateDetectionService");
const { getLocationContext, hasValidCoordinates } = require("../services/locationService");
const { calculatePriority } = require("../services/priorityService");
const {
  canDeleteIssue,
  canSubmitFeedback,
} = require("../services/issueAuthorizationService");
const {
  ISSUE_CATEGORIES,
  isValidObjectId,
  parsePagination,
  validateIssueInput,
} = require("../services/validationService");

router.post("/", authMiddleware, authorizeRoles("citizen"), singleImage, async (req, res) => {
  try {
    const { title, description,  latitude,
  longitude,} = req.body;
    const inputError = validateIssueInput(req.body);
    if (inputError) return res.status(400).json({ success: false, message: inputError });
    

    

let imageUrl = "";


   if (req.file) {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "civicresolve" }, (error, uploadResult) => {
      if (error) return reject(error);
      resolve(uploadResult);
    });
    stream.end(req.file.buffer);
  });

  imageUrl = result.secure_url;
}

// AI categorization is an enhancement, NOT a hard dependency.
// If Gemini fails (quota exceeded, timeout, etc.), categorizeIssue
// returns a safe fallback with aiUnavailable=true.
const locationContext = await getLocationContext(latitude, longitude);
const aiResult = await categorizeIssue(description, locationContext);
const aiUnavailable = aiResult.aiUnavailable === true;
const priorityAssessment = calculatePriority({
  category: aiResult.category,
  description,
  locationContext,
  supportCount: 1,
  aiAssessment: aiResult,
});

// Find available workers with the same specialization
let workers = await User.find({
  role: "worker",
  specialization: aiResult.category,
  isAvailable: true,
});

// Fall back to available general-purpose workers when no specialist is available
if (workers.length === 0 && aiResult.category !== "Other") {
  workers = await User.find({
    role: "worker",
    specialization: "Other",
    isAvailable: true,
  });
}

// Automatically choose the worker with the fewest assigned active issues
let assignedWorker = null;

if (workers.length > 0) {
  let minIssues = Infinity;

  for (const worker of workers) {
    const issueCount = await Issue.countDocuments({
      assignedTo: worker._id,
      status: { $ne: "Resolved" },
    });

    if (issueCount < minIssues) {
      minIssues = issueCount;
      assignedWorker = worker;
    }
  }
}

console.log(aiResult);

    const issueData = {
  title,
  description,

  category: aiResult.category,
  priority: priorityAssessment.priority,
  summary: aiResult.summary,
  locationContext,
  priorityReason: priorityAssessment.priorityReason,
  priorityReasons: priorityAssessment.priorityReasons,
  priorityConfidence: priorityAssessment.confidence,

  imageUrl,

  reportedBy: req.user.id,
  assignedTo: assignedWorker ? assignedWorker._id : null,
};

    // Keep location optional for citizens who decline or cannot provide it.
    if (hasValidCoordinates(latitude, longitude)) {
      issueData.location = { latitude: Number(latitude), longitude: Number(longitude) };
    }

    const issue = new Issue(issueData);

    await issue.save();

    if (assignedWorker) {
      await Notification.create({
        user: assignedWorker._id,
        relatedIssue: issue._id,
        title: "New complaint assigned",
        message: `You have been assigned the complaint: ${issue.title}`,
        type: "assignment",
      });
    }

    res.status(201).json({
      success: true,
      message: aiUnavailable
        ? "Complaint submitted successfully. AI-assisted analysis is temporarily unavailable, so priority was determined using CivicResolve's built-in safety and location rules."
        : "Issue reported successfully",
      issue,
      aiUnavailable,
    });

  } catch (error) {
    // Do NOT expose internal error details to the frontend.
    console.error("Complaint creation failed:", error);
    res.status(500).json({
      success: false,
      message: "We couldn't submit your complaint. Please try again.",
    });
  }
});

router.get("/my", authMiddleware, authorizeRoles("citizen"), async (req, res) => {
  try {
    const issues = await Issue.find({
      reportedBy: req.user.id,
    })
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
});


router.get("/", authMiddleware, authorizeRoles("citizen", "admin"), async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const pagination = parsePagination(req.query);
    if (pagination.error) return res.status(400).json({ success: false, message: pagination.error });
    const { page, limit } = pagination;
    if (status && !["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status filter" });
    }
    if (category && !ISSUE_CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category filter" });
    }
    if (search !== undefined && (typeof search !== "string" || search.length > 200)) {
      return res.status(400).json({ success: false, message: "Invalid search query" });
    }

     let filter = {};
     const skip = (page - 1) * limit;
     if (status) {
      filter.status = status;
      }

      if (category) {
       filter.category = category;
     }

      if (search) {
        filter.title = {
         $regex: search,
          $options: "i",
       };
}

    let issueQuery = Issue.find(filter).sort({ createdAt: -1 });
    if (req.user.role === "admin") {
      issueQuery = issueQuery
        .populate("reportedBy", "name email")
        .populate("assignedTo", "name email specialization");
    } else {
      // Citizens need map data, but not reporter, worker, feedback, or other
      // administrative details for every complaint.
      issueQuery = issueQuery.select(
        "title description category priority status imageUrl location summary supportCount locationContext priorityReason createdAt updatedAt"
      );
    }

    const issues = await issueQuery.skip(skip).limit(Number(limit));

  const totalIssues = await Issue.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: issues.length,
      totalIssues,
      currentPage: Number(page),
      totalPages: Math.ceil(totalIssues / Number(limit)),
      issues,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid issue ID" });
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    if (!canDeleteIssue(req.user, issue)) {
      return res.status(403).json({ success: false, message: "You do not have permission to delete this issue" });
    }

    await issue.deleteOne();

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.patch("/:id/support", authMiddleware, authorizeRoles("citizen"), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid issue ID" });
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    // Check if user already supported
    const alreadySupported = issue.supporters.some(
      (supporter) => supporter.toString() === req.user.id
    );

    if (alreadySupported) {
      return res.status(400).json({
        success: false,
        message: "You have already supported this complaint.",
      });
    }

    // Add supporter
    issue.supporters.push(req.user.id);

    // Increase count
    issue.supportCount += 1;

    // Reassess from stored verified location data. Supporting a report never
    // causes another Gemini or Overpass request.
    const updatedPriority = calculatePriority({
      category: issue.category,
      description: issue.description,
      locationContext: issue.locationContext,
      supportCount: issue.supportCount,
      aiAssessment: { aiUnavailable: true },
    });
    issue.priority = updatedPriority.priority;
    issue.priorityReason = updatedPriority.priorityReason;
    issue.priorityReasons = updatedPriority.priorityReasons;
    issue.priorityConfidence = updatedPriority.confidence;

    await issue.save();

    res.status(200).json({
      success: true,
      message: "Complaint supported successfully",
      supportCount: issue.supportCount,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/check-duplicates", authMiddleware, authorizeRoles("citizen"), async (req, res) => {
  try {
    const { title, description, category, latitude, longitude } = req.body;
    const inputError = validateIssueInput({ title, description, category, latitude, longitude });
    if (inputError) return res.status(400).json({ success: false, message: inputError });

    const duplicates = await findPotentialDuplicates({
      title,
      description,
      category,
      latitude,
      longitude,
    });

    res.json({
      success: true,
      duplicates,
    });

  } catch (error) {
    // Do NOT expose internal error details. Return empty duplicates
    // so the frontend can proceed with complaint submission.
    console.error("Duplicate check failed:", error.message);
    res.json({
      success: true,
      duplicates: [],
    });
  }
});

router.patch("/:id/feedback", authMiddleware, async (req, res) => {
  try {

    const { rating, comment } = req.body;
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid issue ID" });
    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: "Rating must be an integer from 1 to 5" });
    }
    if (comment !== undefined && (typeof comment !== "string" || comment.length > 1000)) {
      return res.status(400).json({ success: false, message: "Feedback comment must be at most 1000 characters" });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    if (!canSubmitFeedback(req.user, issue)) {
      return res.status(403).json({ success: false, message: "Only the reporting citizen can submit feedback for a resolved complaint." });
    }

    if (issue.feedback && issue.feedback.rating) {
      return res.status(400).json({
        success: false,
        message: "Feedback has already been submitted for this complaint.",
      });
    }

    issue.feedback = {
      rating,
      comment,
      submittedAt: new Date(),
    };

    await issue.save();

    const workerId = issue.assignedTo?.toString();

    if (workerId) {
      const worker = await User.findById(workerId);

      if (worker) {
        const numericRating = Number(rating);
        const currentRatingSum = Number(worker.ratingSum ?? 0);
        const currentTotalRatings = Number(worker.totalRatings ?? 0);

        worker.ratingSum = currentRatingSum + numericRating;
        worker.totalRatings = currentTotalRatings + 1;
        worker.averageRating = worker.totalRatings > 0
          ? Number(worker.ratingSum) / Number(worker.totalRatings)
          : 0;

        await worker.save();

        await Notification.create({
          user: worker._id,
          relatedIssue: issue._id,
          title: "New feedback received",
          message: `You received feedback for the complaint: ${issue.title}`,
          type: "feedback",
        });
      }
    }

    res.json({
      success: true,
      issue,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

module.exports = router;
