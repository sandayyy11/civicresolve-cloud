const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function categorizeIssue(description) {
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

Return exactly in this format:

{
  "category": "...",
  "priority": "...",
  "summary": "..."
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

return JSON.parse(text);

  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = categorizeIssue;