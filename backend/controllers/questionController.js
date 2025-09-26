const Question = require("../models/Question");
const Session = require("../models/Session");

// 📌 Add Questions to a Session
exports.addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    // Validate input
    if (!sessionId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. 'sessionId' and a non-empty 'questions' array are required.",
      });
    }

    // Validate session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    // Validate question objects
    const invalidQuestion = questions.find(q => !q.question || typeof q.question !== "string");
    if (invalidQuestion) {
      return res.status(400).json({
        success: false,
        message: "Each question must have a valid 'question' field (string).",
      });
    }

    // Create questions
    const createdQuestions = await Question.insertMany(
      questions.map(q => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
      }))
    );

    // Add questions to session
    session.questions.push(...createdQuestions.map(q => q._id));
    await session.save();

    return res.status(201).json({
      success: true,
      message: "Questions added successfully.",
      questions: createdQuestions,
    });
  } catch (error) {
    console.error("❌ Error in addQuestionsToSession:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding questions.",
      error: error.message,
    });
  }
};

// 📍 Toggle Pin/Unpin a Question
exports.togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    return res.status(200).json({
      success: true,
      message: `Question ${question.isPinned ? "pinned" : "unpinned"} successfully.`,
      question,
    });
  } catch (error) {
    console.error("❌ Error in togglePinQuestion:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while toggling pin status.",
      error: error.message,
    });
  }
};

// 📝 Update Question Note
exports.updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    question.note = note || "";
    await question.save();

    return res.status(200).json({
      success: true,
      message: "Note updated successfully.",
      question,
    });
  } catch (error) {
    console.error("❌ Error in updateQuestionNote:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating note.",
      error: error.message,
    });
  }
};
