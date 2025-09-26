const Session = require("../models/Session");
const Question = require("../models/Question");
const { generateInterviewQuestions } = require("../services/aiService");

exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicToFocus, description } = req.body;

    if (!role || !experience || !topicToFocus) {
      return res.status(400).json({ success: false, message: "Role, experience, and topicToFocus are required" });
    }

    // Generate initial questions using AI
    const questions = await generateInterviewQuestions(role, experience, topicToFocus, 5);

    // Create Question documents
    const questionDocs = questions.map(q => ({
      question: q,
      answer: "",
      isPinned: false,
    }));

    const newQuestions = await Question.insertMany(questionDocs);

    // Create Session
    const session = await Session.create({
      user: req.user._id,
      role,
      experience,
      topicToFocus,
      description,
      questions: newQuestions.map(q => q._id),
    });

    // Update questions with session reference
    await Question.updateMany(
      { _id: { $in: newQuestions.map(q => q._id) } },
      { session: session._id }
    );

    // Populate questions for response
    await session.populate("questions");

    res.status(201).json({ success: true, session });
  } catch (error) {
    console.error("❌ Error creating session:", error.message);
    res.status(500).json({ success: false, message: "Failed to create session" });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id }).populate("questions");
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("❌ Error fetching sessions:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch sessions" });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("questions");
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });
    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("❌ Error fetching session:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch session" });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    // Delete associated questions
    await Question.deleteMany({ session: session._id });

    // Delete the session
    await session.deleteOne();
    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting session:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete session" });
  }
};

exports.aiGenerateMoreQuestions = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: "Session not found" });

    const questions = await generateInterviewQuestions(
      session.role,
      session.experience,
      session.topicToFocus,
      5
    );

    const questionDocs = questions.map(q => ({
      session: session._id,
      question: q,
      answer: "",
      isPinned: false,
    }));

    const newQuestions = await Question.insertMany(questionDocs);
    session.questions.push(...newQuestions.map(q => q._id));
    await session.save();

    res.status(201).json({ success: true, questions: newQuestions });
  } catch (error) {
    console.error("❌ Error generating more questions:", error.message);
    res.status(500).json({ success: false, message: "Failed to generate more questions" });
  }
};
