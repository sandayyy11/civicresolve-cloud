 const Issue = require("../models/Issue");
// Keep duplicate candidates local to the reported location. A 1 km radius is
// broad enough for adjacent reports while avoiding city-wide comparisons.
const DUPLICATE_RADIUS_METERS = 1000;
const MAX_CANDIDATES = 100;

// Similarity thresholds (0 to 1)
const HIGH_CONFIDENCE_THRESHOLD = 0.8;
const MEDIUM_CONFIDENCE_THRESHOLD = 0.6;

/**
 * Calculate the haversine distance between two coordinates in meters.
 */
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

function hasCoordinates(latitude, longitude) {
  return !(
    latitude === undefined || latitude === null || latitude === ""
    || longitude === undefined || longitude === null || longitude === ""
  );
}

/**
 * Compute a simple text-based similarity score (0 to 1) as a fallback
 * when the AI service is unavailable. Uses token overlap with stemming.
 */
function textSimilarity(textA, textB) {
  if (!textA || !textB) return 0;

  // Simple stemming: remove common suffixes
  const stem = (word) => {
    return word
      .replace(/ing$/, "")
      .replace(/ed$/, "")
      .replace(/es$/, "")
      .replace(/s$/, "")
      .replace(/ly$/, "");
  };

  const normalize = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .map(stem);

  const tokensA = new Set(normalize(textA));
  const tokensB = new Set(normalize(textB));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection++;
  }

  // Use Dice coefficient: 2 * |A ∩ B| / (|A| + |B|)
  // This gives more weight to shared tokens than Jaccard.
  return (2 * intersection) / (tokensA.size + tokensB.size);
}

/**
 * Determine duplicate confidence for a pair of complaints.
 *
 * Decision model:
 *   LOCATION (nearby) + SAME CATEGORY + ISSUE SIMILARITY → DUPLICATE CONFIDENCE
 *
 * Confidence levels:
 *   - high:   similarityScore >= 0.8  → strong duplicate evidence
 *   - medium: similarityScore >= 0.6  → possible duplicate, warn but allow
 *   - low:    similarityScore < 0.6   → treat as new complaint
 *
 * @param {Object} newComplaint - { category, title, description }
 * @param {Object} existingComplaint - { category, title, description }
 * @returns {Promise<{confidence: string, similarityScore: number, reason: string}>}
 */
async function evaluateDuplicateConfidence(newComplaint, existingComplaint) {
  // Different categories are never duplicates
  if (newComplaint.category !== existingComplaint.category) {
    return {
      confidence: "low",
      similarityScore: 0,
      reason: "Different categories",
    };
  }

  // Deliberately deterministic: one submission must never generate one Gemini
  // request per nearby database candidate.
  const score = Math.max(
    textSimilarity(newComplaint.title, existingComplaint.title),
    textSimilarity(newComplaint.description, existingComplaint.description)
  );

  if (score >= HIGH_CONFIDENCE_THRESHOLD) {
    return {
      confidence: "high",
      similarityScore: score,
      reason: "Text-based similarity",
    };
  }

  if (score >= MEDIUM_CONFIDENCE_THRESHOLD) {
    return {
      confidence: "medium",
      similarityScore: score,
      reason: "Text-based similarity",
    };
  }

  return {
    confidence: "low",
    similarityScore: score,
    reason: "Text-based similarity",
  };
}

/**
 * Find potential duplicate complaints for a new complaint.
 *
 * Logic:
 * 1. Find existing complaints within the geographic radius (10km).
 * 2. For each nearby complaint, evaluate duplicate confidence using
 *    category + title + description similarity.
 * 3. Return only complaints with medium or high confidence.
 * 4. Never block based on location alone.
 *
 * @param {Object} params - { title, description, category, latitude, longitude }
 * @returns {Promise<Array>} Array of potential duplicates with confidence info
 */
async function findPotentialDuplicates({
  title,
  description,
  category,
  latitude,
  longitude,
}) {
  // If no location provided, we cannot determine proximity → no duplicates
  if (!hasCoordinates(latitude, longitude)) {
    return [];
  }

  // If no title/description provided, we cannot assess issue similarity
  // → return no duplicates (backward compatibility with old API contract)
  if (!title || !description) {
    return [];
  }

  // Restrict in the database before calculating distances locally. A
  // geospatial index is not yet present, so category plus a strict bound is
  // the safe practical prefilter.
  const issues = await Issue.find({
    status: { $ne: "Resolved" },
    category,
  }).select(
    "title description category status location summary imageUrl supportCount"
  ).sort({ createdAt: -1 }).limit(MAX_CANDIDATES).lean();

  const nearbyIssues = issues.filter((issue) => {
    if (
      !issue.location
      || issue.location.latitude === undefined || issue.location.latitude === null
      || issue.location.longitude === undefined || issue.location.longitude === null
    ) {
      return false;
    }

    const distance = getDistance(
      Number(latitude),
      Number(longitude),
      issue.location.latitude,
      issue.location.longitude
    );

    return distance <= DUPLICATE_RADIUS_METERS;
  });

  const newComplaint = { category, title, description };

  const potentialDuplicates = [];

  for (const existing of nearbyIssues) {
    const result = await evaluateDuplicateConfidence(newComplaint, {
      category: existing.category,
      title: existing.title,
      description: existing.description,
    });

    if (result.confidence === "high" || result.confidence === "medium") {
      const distance = getDistance(
        Number(latitude),
        Number(longitude),
        existing.location.latitude,
        existing.location.longitude
      );

      potentialDuplicates.push({
        _id: existing._id,
        title: existing.title,
        category: existing.category,
        status: existing.status,
        summary: existing.summary,
        imageUrl: existing.imageUrl,
        supportCount: existing.supportCount,
        distanceMeters: Math.round(distance),
        confidence: result.confidence,
        similarityScore: result.similarityScore,
        reason: result.reason,
      });
    }
  }

  // Sort by confidence (high first) then by similarity score (descending)
  potentialDuplicates.sort((a, b) => {
    const confidenceOrder = { high: 0, medium: 1 };
    const confDiff = confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
    if (confDiff !== 0) return confDiff;
    return b.similarityScore - a.similarityScore;
  });

  return potentialDuplicates;
}

module.exports = {
  findPotentialDuplicates,
  evaluateDuplicateConfidence,
  getDistance,
  hasCoordinates,
  DUPLICATE_RADIUS_METERS,
  MAX_CANDIDATES,
  HIGH_CONFIDENCE_THRESHOLD,
  MEDIUM_CONFIDENCE_THRESHOLD,
};
