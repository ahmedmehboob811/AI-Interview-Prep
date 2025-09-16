// controllers/aiController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "AI service not configured" });
    }

    // Simple prompt (no need for external util)
    const prompt = `Generate ${numberOfQuestions} interview questions for a ${role} with ${experience} years of experience.
Focus on: ${topicToFocus}.
Return ONLY a valid JSON array of strings.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    const rawText = result.response.text();

    // Remove code fences if Gemini adds them
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch (err) {
      console.error("❌ Parse error. Raw AI output:", rawText);
      return res.status(500).json({
        message: "Failed to parse AI response",
        raw: rawText,
        error: err.message,
      });
    }

    // ✅ Always return { questions: [...] }
    res.status(200).json({ questions });
  } catch (error) {
    console.error("❌ Error generating questions:", error);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions };
