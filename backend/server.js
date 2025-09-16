const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoute");
const sessionRoutes = require("./routes/sessionRoute");
const questionRoutes = require("./routes/questionRoute");

const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions } = require("./controllers/aiController");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/interview-prep")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

// AI Routes
app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);

// Health Check
app.get("/", (req, res) => res.json({ message: "API running 🚀" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
