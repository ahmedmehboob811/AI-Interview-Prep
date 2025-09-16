import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import toast from "react-hot-toast";

const CreateSessionForm = ({ onSessionCreated }) => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicToFocus: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicToFocus, description } = formData;

    if (!role || !experience || !topicToFocus) {
      setError("⚠️ Please fill all the required fields.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // 1️⃣ Ask backend AI for questions
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTION,
        {
          role,
          experience: Number(experience),
          topicToFocus,
          numberOfQuestions: 10,
        }
      );

      const generatedQuestions = aiResponse.data?.questions || [];
      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error("AI did not return valid questions.");
      }

      // 2️⃣ Create the session in DB
      const sessionResponse = await axiosInstance.post(
        API_PATHS.SESSION.CREATE,
        {
          role,
          experience: Number(experience),
          topicToFocus,
          description,
          questions: generatedQuestions,
        }
      );

      const session = sessionResponse.data?.session;
      if (!session?._id) {
        throw new Error("Backend did not return session ID.");
      }

      toast.success("✅ Session created successfully!");
      if (onSessionCreated) onSessionCreated(session);

      // Navigate to the new session page
      navigate(`/interview-prep/${session._id}`);
    } catch (err) {
      console.error("❌ Error creating session:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">
        Start a New Interview Journey
      </h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Fill out a few quick details and unlock your personalized set of
        interview questions!
      </p>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target Role"
          placeholder="e.g., Frontend Developer, UI/UX Designer"
          type="text"
        />

        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange("experience", target.value)}
          label="Years of Experience"
          placeholder="e.g., 1, 3, 5+"
          type="number"
        />

        <Input
          value={formData.topicToFocus}
          onChange={({ target }) =>
            handleChange("topicToFocus", target.value)
          }
          label="Topics to Focus On"
          placeholder="Comma-separated, e.g., React, Node.js, MongoDB"
          type="text"
        />

        <Input
          value={formData.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label="Description"
          placeholder="Any specific goals or notes for this session"
          type="text"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded mt-2 w-full hover:bg-blue-600 disabled:opacity-70 flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading && <SpinnerLoader />}
          {!isLoading && "Create Session"}
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
