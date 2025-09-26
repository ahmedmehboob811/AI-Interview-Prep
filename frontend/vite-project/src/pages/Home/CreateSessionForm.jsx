import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import toast from "react-hot-toast";

const CreateSessionForm = ({ onSessionCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("Entry Level");
  const [topicToFocus, setTopicToFocus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        title,
        description,
        role,
        experience,
        topicToFocus,
      });

      if (res.data.success) {
        toast.success("✅ Session created successfully!");
        onSessionCreated?.(res.data.session);

        // Reset form
        setTitle("");
        setDescription("");
        setRole("");
        setTopicToFocus("");
      } else {
        throw new Error(res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("❌ Error creating session:", err);
      const msg = err.response?.data?.message || "Failed to create session.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCreateSession}
      className="p-6 bg-white shadow-md rounded-lg space-y-4 w-full max-w-lg mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800">Create Interview Session</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Session Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Role (e.g. Frontend Developer)"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />

      <select
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="Entry Level">Entry Level</option>
        <option value="Mid Level">Mid Level</option>
        <option value="Senior">Senior</option>
      </select>

      <input
        type="text"
        placeholder="Topic to Focus (e.g. React, Data Structures)"
        value={topicToFocus}
        onChange={(e) => setTopicToFocus(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? <SpinnerLoader /> : "Create Session"}
      </button>
    </form>
  );
};

export default CreateSessionForm;
