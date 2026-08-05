const express = require("express");

const router = express.Router();

const Issue = require("../models/Issue");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const categorizeIssue = require("../services/aiService");

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.post("/", authMiddleware,upload.single("image"), async (req, res) => {
  try {
    const { title, description,  latitude,
  longitude,} = req.body;
    

    

let imageUrl = "";


   if (req.file) {
  const result = await cloudinary.uploader.upload(
    `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
    {
      folder: "civicresolve",
    }
  );

  imageUrl = result.secure_url;
}

const aiResult = await categorizeIssue(description);

console.log(aiResult);

    const issue = new Issue({
  title,
  description,

  category: aiResult.category,
  priority: aiResult.priority,
  summary: aiResult.summary,

  imageUrl,

  location: {
    latitude,
    longitude,
  },

  reportedBy: req.user.id,
});

    await issue.save();

    res.status(201).json({
      success: true,
      message: "Issue reported successfully",
      issue,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
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


router.get("/", async (req, res) => {
  try {
    const { status, category, search, page = 1,
  limit = 5, } = req.query;

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

    const issues = await Issue.find(filter)
  .populate("reportedBy", "name email")
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(Number(limit));

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

router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    issue.status = status;

    await issue.save();

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      issue,
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
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
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

router.patch("/:id/support", authMiddleware, async (req, res) => {
  try {
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

router.post("/check-duplicates", authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, category } = req.body;

    const issues = await Issue.find({
      category,
      status: { $ne: "Resolved" },
    });

    const nearbyIssues = issues.filter((issue) => {
      if (!issue.location) return false;

      const distance = getDistance(
        latitude,
        longitude,
        issue.location.latitude,
        issue.location.longitude
      );

      return distance <= 10000;
    });

    res.json({
      success: true,
      duplicates: nearbyIssues,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;