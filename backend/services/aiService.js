const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Fallback categorization used when Gemini is unavailable.
 * Uses simple keyword matching to determine category and priority.
 */
function fallbackCategorize(description) {
  const text = (description || "").toLowerCase();

  let category = "Other";
  let priority = "Medium";

  // Check for more specific keywords first to avoid false matches
  if (/garbage|trash|waste|rubbish|bin|dump|litter|recycl|garbage bin|trash bin/.test(text)) {
    category = "Garbage";
  } else if (/water|leak|pipe|drain|sewage|flood|tap|plumb|water pipe|water leak|water supply/.test(text)) {
    category = "Water";
  } else if (/electric|streetlight|street light|power|wire|pole|voltage|current|electricity|light not working/.test(text)) {
    category = "Electricity";
  } else if (/pothole|road|traffic|sidewalk|pavement|speed bump|manhole|street surface|road surface/.test(text)) {
    category = "Road";
  }

  if (/urgent|danger|hazard|severe|critical|emergency|immediate|serious/.test(text)) {
    priority = "High";
  } else if (/minor|small|slight|cosmetic|low/.test(text)) {
    priority = "Low";
  }

  return {
    category,
    priority,
    summary: description ? description.slice(0, 150) : "",
  };
}

async function categorizeIssue(description, locationContext = { nearbyPlaces: [] }) {
  try {
    const prompt = `
You are an AI assistant for a civic complaint application.

Analyze the complaint below.

Return ONLY valid JSON.

Categories:
- Road
- Garbage
- Water
- Electricity
- Other

Priority:
- Low
- Medium
- High

Location context from verified geographic data:
${(locationContext.nearbyPlaces || []).map((place) => `- ${place.type}: ${place.distanceMeters}m`).join("\n") || "- No verified nearby public locations"}

Use location only as a supporting factor; a nearby location alone must not make a minor complaint High.

Return exactly in this format:

{
  "category": "...",
  "priority": "...",
  "summary": "...",
  "confidence": "low, medium, or high",
  "priorityReason": "short citizen-safe explanation",
  "locationFactors": ["only relevant nearby factors"]
}

Complaint:
${description}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text.trim();

// Remove Markdown code fences if Gemini adds them
text = text.replace(/```json/g, "").replace(/```/g, "").trim();

const result = JSON.parse(text);

// Validate the result has the expected fields
if (!result.category || !result.priority) {
  return { ...fallbackCategorize(description), aiUnavailable: true };
}

return { ...result, aiUnavailable: false };

  } catch (error) {
    // Gemini is unavailable (quota exceeded, timeout, etc.)
    // Do NOT throw — return a safe fallback so complaint submission continues.
    console.error("Gemini categorization failed, using fallback:", error.message);
    return { ...fallbackCategorize(description), aiUnavailable: true };
  }
}

/**
 * Uses the existing Gemini AI infrastructure to determine whether two
 * complaints refer to the same underlying civic issue.
 *
 * @param {Object} newComplaint - { category, title, description }
 * @param {Object} existingComplaint - { category, title, description }
 * @returns {Promise<{isDuplicate: boolean, similarityScore: number, reason: string}>}
 */
async function checkDuplicateSimilarity(newComplaint, existingComplaint) {
  try {
    const prompt = `
You are an AI assistant for a civic complaint application.

Determine if the following two complaints refer to the same underlying civic issue.

Complaint A:
Category: ${newComplaint.category}
Title: ${newComplaint.title}
Description: ${newComplaint.description}

Complaint B:
Category: ${existingComplaint.category}
Title: ${existingComplaint.title}
Description: ${existingComplaint.description}

Return ONLY valid JSON in this format:
{
  "isDuplicate": true or false,
  "similarityScore": number between 0 and 1,
  "reason": "brief explanation"
}

Rules:
- If the categories are different, they are NOT duplicates.
- If the categories are the same, compare the title and description to determine if they describe the same issue.
- A similarity score of 1.0 means they are definitely the same issue.
- A similarity score of 0.0 means they are completely different issues.
- Be conservative: only flag as duplicate when there is strong evidence they refer to the same issue.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = response.text.trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const result = JSON.parse(text);

    return {
      isDuplicate: Boolean(result.isDuplicate),
      similarityScore: Math.max(0, Math.min(1, Number(result.similarityScore) || 0)),
      reason: result.reason || "",
    };
  } catch (error) {
    console.error("AI duplicate similarity check failed:", error.message);
    // Return a neutral result so the caller can use text-based similarity
    return {
      isDuplicate: false,
      similarityScore: 0,
      reason: "AI check failed",
    };
  }
}

module.exports = categorizeIssue;
module.exports.checkDuplicateSimilarity = checkDuplicateSimilarity;
module.exports.fallbackCategorize = fallbackCategorize;
