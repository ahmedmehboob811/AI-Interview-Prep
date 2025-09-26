import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import SummaryCard from "../../components/Cards/SummaryCard";
import moment from "moment";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import axiosInstance from "../../utils/axiosInstance";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModel, setOpenCreateModel] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });
  const [deleting, setDeleting] = useState(false);

  // ✅ Fetch sessions from backend
  const fetchAllSessions = async () => {
    try {
      console.log("Fetching sessions...");
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      console.log("📦 Full sessions response:", response.data);

      const sessionArray =
        response.data?.sessions ||
        response.data?.data ||
        response.data?.allSessions ||
        [];

      if (Array.isArray(sessionArray)) {
        setSessions(sessionArray);
      } else {
        console.warn("⚠️ Unexpected sessions format:", response.data);
        setSessions([]);
      }
    } catch (error) {
      console.error("❌ Error fetching sessions:", error);
      toast.error("Failed to load sessions.");
      setFetchError(error.message || "Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete session
  const deleteSession = async () => {
    try {
      setDeleting(true);
      if (openDeleteAlert.data && openDeleteAlert.data._id) {
        await axiosInstance.delete(
          API_PATHS.SESSION.DELETE(openDeleteAlert.data._id)
        );
        toast.success("Session deleted successfully");
        setOpenDeleteAlert({ open: false, data: null });
        fetchAllSessions();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Failed to delete session.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-500">No sessions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-6">
            {sessions.map((data, index) => {
              if (!data) return null;
              return (
                <SummaryCard
                  key={data._id || index}
                  colors={CARD_BG[index % CARD_BG.length].bgcolor}
                  role={data.role || "N/A"}
                  topicToFocus={data.topicToFocus || "N/A"}
                  experience={data.experience || "N/A"}
                  questions={Array.isArray(data.questions) ? data.questions : []}
                  description={data.description || "No description provided"}
                  lastUpdated={
                    data.updatedAt
                      ? moment(data.updatedAt).format("Do MMM YYYY")
                      : "N/A"
                  }
                  onSelect={() =>
                    navigate(`/interview-prep/${data._id || ""}`)
                  }
                  onDelete={() => setOpenDeleteAlert({ open: true, data })}
                />
              );
            })}
          </div>
        )}

        {/* ➕ Floating Add Button */}
        <button
          className="h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20"
          onClick={() => setOpenCreateModel(true)}
        >
          <LuPlus className="text-2xl text-white" />
        </button>
      </div>

      {/* 🛠️ Create Session Modal */}
      <Modal
        isOpen={openCreateModel}
        onClose={() => setOpenCreateModel(false)}
        hideHeader
      >
        <CreateSessionForm
          onSessionCreated={(newSession) => {
            console.log("✅ New session created:", newSession);
            setOpenCreateModel(false);
            // Instant UI update
            setSessions((prev) => [...prev, newSession]);
            // Also refresh from backend
            fetchAllSessions();
          }}
        />
      </Modal>

      {/* 🗑️ Delete Confirmation Modal */}
      <Modal
        isOpen={openDeleteAlert.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Session"
        actionLabel="Delete"
        onAction={deleteSession}
        loading={deleting}
      >
        <div className="p-4">
          <p>Are you sure you want to delete this session? This cannot be undone.</p>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
