const { 
  generateInterviewQuestions, 
  generateConceptExplanation 
} = require("../services/aiService");

// 🧠 Controller: Generate Interview Questions
const generateInterviewQuestionsController = async (req, res) => {
  try {
    const { role, experience, topicToFocus, numberOfQuestions } = req.body;

    // Basic validation
    if (!role || !experience) {
      return res.status(400).json({
        success: false,
        message: "Role and experience are required fields.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured. Missing GEMINI_API_KEY.",
      });
    }

    const questions = await generateInterviewQuestions(
      role,
      experience,
      topicToFocus || "core skills and problem-solving",
      numberOfQuestions || 5
    );

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("❌ Error generating interview questions:", error.stack || error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate interview questions.",
      error: error.message,
    });
  }
};

// 📚 Controller: Generate Concept Explanation
const generateConceptExplanationController = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question field is required.",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured. Missing GEMINI_API_KEY.",
      });
    }

    const explanation = await generateConceptExplanation(question);

    return res.status(200).json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error("❌ Error generating explanation:", error.stack || error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate concept explanation.",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions: generateInterviewQuestionsController,
  generateConceptExplanation: generateConceptExplanationController,
};
