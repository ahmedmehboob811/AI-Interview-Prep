const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Load environment variables
if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Helper to extract clean text from Gemini response
const getTextFromResponse = (result) => {
  return result.response.text().trim() || "";
};

// ✅ Default fallback questions (used if AI fails)
const FALLBACK_QUESTIONS = [
  "Tell me about yourself and your professional background.",
  "What is your greatest strength and how has it helped you succeed?",
  "Describe a challenging project you worked on and how you handled it.",
  "How do you stay updated with the latest developments in your field?",
  "Where do you see yourself in five years, and how does this role fit into your career path?"
];

// 🔥 Safer + production-ready question generator
const generateInterviewQuestions = async (
  role = "Software Engineer",
  experience = "Entry Level",
  topicToFocus = "General Skills",
  numberOfQuestions = 5
) => {
  console.log("📨 Prompt Inputs:", { role, experience, topicToFocus, numberOfQuestions });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // ✅ Stronger prompt — ensures proper JSON output
    const prompt = `
You are an AI interview assistant. 
Generate ${numberOfQuestions} interview questions as a **pure JSON array of strings**.

- Role: ${role}
- Experience level: ${experience}
- Focus topics: ${topicToFocus}

❌ Do NOT include explanations, formatting, or text outside JSON.
✅ Only return a valid JSON array. Example: ["Q1","Q2","Q3"]
    `;

    const result = await model.generateContent(prompt);
    const text = getTextFromResponse(result);
    console.log("🧠 Raw AI output:", text); // <-- This helps you debug bad responses

    let questions;

    try {
      questions = JSON.parse(text);
    } catch {
      // Try extracting JSON if Gemini wrapped it in markdown or text
      const jsonMatch = text.match(/\[([\s\S]*)\]/);
      if (jsonMatch) {
        questions = JSON.parse(`[${jsonMatch[1]}]`);
      }
    }

    // If still invalid, fallback
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      console.warn("⚠️ AI did not return valid JSON. Using fallback questions.");
      questions = FALLBACK_QUESTIONS.slice(0, numberOfQuestions);
    }

    return questions;
  } catch (error) {
    console.error("❌ Error generating interview questions:", error.message);
    console.error(error.stack);

    // Always return fallback so the backend never crashes
    return FALLBACK_QUESTIONS.slice(0, numberOfQuestions);
  }
};

const generateConceptExplanation = async (question) => {
  console.log("📨 Generating explanation for:", question);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
You are an AI interview coach providing guidance on how to answer common interview questions.

For the following interview question, provide a clear, concise explanation of how to approach and answer it effectively. Include key points to cover, tips for structuring the response, and examples if helpful.

Question: ${question}

Format your response using Markdown for better readability, including headings, lists, and code blocks where appropriate.

Keep the explanation under 300 words. Be accurate and helpful.
    `;

    const result = await model.generateContent(prompt);
    const text = getTextFromResponse(result);
    console.log("🧠 Raw explanation output:", text);

    return text || "Sorry, I couldn't generate an explanation at this time.";
  } catch (error) {
    console.error("❌ Error generating concept explanation:", error.message);
    return "An error occurred while generating the explanation. Please try again.";
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
