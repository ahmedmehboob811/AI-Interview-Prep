// ✅ 1. Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ 2. Import routes & middleware
const authRoutes = require("./routes/authRoute");
const sessionRoutes = require("./routes/sessionRoute");
const questionRoutes = require("./routes/questionRoute");
const { protect } = require("./middlewares/authMiddleware");

// ✅ 3. Import AI controllers
const {
  generateInterviewQuestions,
  generateConceptExplanation,
} = require("./controllers/aiController");

// 🧪 4. Debug middleware — log request origins (helps debug CORS)
app.use((req, res, next) => {
  console.log("🌐 Incoming request:");
  console.log("   Origin:", req.headers.origin);
  console.log("   URL:", req.originalUrl);
  console.log("   Method:", req.method);
  next();
});

// ✅ 5. CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",                    // local dev frontend
      "https://ai-interview-prep.vercel.app",     // your deployed frontend domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ✅ 6. Handle preflight (important for POST/OPTIONS)
app.options("*", cors());

// ✅ 7. Express body parser
app.use(express.json());

// ✅ 8. Check environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Missing GEMINI_API_KEY. Please set it in your .env file.");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.warn("⚠️ MONGO_URI not found. Falling back to local MongoDB.");
}

// ✅ 9. MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/interview-prep")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// ✅ 10. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

// ✅ 11. AI routes (protected)
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

// ✅ 12. Health check route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API is running successfully!",
    geminiKeyLoaded: !!process.env.GEMINI_API_KEY,
    mongoConnected: mongoose.connection.readyState === 1,
  });
});

// ✅ 13. AI connectivity test route (optional)
app.get("/api/ai/test", async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent("Hello Gemini! Are you online?");
    const reply = await result.response.text();

    res.json({
      status: "✅ Gemini API connected successfully",
      reply,
    });
  } catch (error) {
    console.error("❌ Gemini API test failed:", error.message);
    res.status(500).json({
      status: "❌ Gemini API connection failed",
      error: error.message,
    });
  }
});

// ✅ 14. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
