import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuAlertCircle, LuList } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import RoleInfoHeader from "./RoleInfoHeader";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadLoader, setIsUploadLoader] = useState(false);

  // ✅ Fetch session details
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  // ✅ Generate explanation
  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setIsLoading(true);
      setExplanation(null);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question }
      );

      if (response.data && response.data.explanation) {
        setExplanation(response.data.explanation);
      }
    } catch (error) {
      console.error("Error generating explanation:", error);
      setErrorMsg("Failed to fetch explanation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Toggle pin
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.TOGGLE_PIN(questionId)
      );
      if (response.data && response.data.success) {
        toast.success("Question pin status updated");
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  // ✅ Upload more questions
  const uploadMoreQuestion = async () => {
    try {
      setIsUploadLoader(true);
      const response = await axiosInstance.post(
        API_PATHS.SESSION.AI_GENERATE_MORE_QUESTIONS(sessionId)
      );
      if (response.data && response.data.session) {
        toast.success("More Questions Uploaded Successfully");
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error uploading questions:", error);
    } finally {
      setIsUploadLoader(false);
    }
  };

  // ✅ Load session on mount
  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [sessionId]);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicToFocus={sessionData?.topicToFocus || ""}
        experience={sessionData?.experience || ""}
        questions={sessionData?.questions?.length || 0}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4 md:px-0">
        <h2 className="text-lg font-semibold text-black">Interview Q&A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"
            }`}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => (
                <motion.div
                  key={data._id || index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                    delay: index * 0.1,
                    damping: 15,
                  }}
                  layout
                  layoutId={`question-${data._id || index}`}
                >
                  <QuestionCard
                    question={data?.question}
                    answer={data?.answer}
                    onLearnMore={() =>
                      generateConceptExplanation(data?.question)
                    }
                    isPinned={data?.isPinned}
                    onTogglePin={() => toggleQuestionPinStatus(data._id)}
                  />

                  {/* Upload More Questions Button (last question only) */}
                  {sessionData?.questions.length === index + 1 && (
                    <div className="flex items-center justify-center h-32">
                      <button
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={isLoading || isUploadLoader}
                        onClick={uploadMoreQuestion}
                      >
                        {isUploadLoader ? (
                          <>
                            <SpinnerLoader size="20px" color="white" />
                            <span className="ml-2">Uploading...</span>
                          </>
                        ) : (
                          <span>Upload More Questions</span>
                        )}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Drawer for Explanation */}
        <Drawer
          isOpen={openLearnMoreDrawer}
          onClose={() => setOpenLearnMoreDrawer(false)}
          title={
            !isLoading && explanation
              ? "Concept Explanation"
              : "Explanation Panel"
          }
          width={openLearnMoreDrawer ? "40%" : "0%"}
        >
          {errorMsg ? (
            <div className="flex gap-2 text-sm text-amber-600 font-medium">
              <LuAlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-32">
              <SpinnerLoader />
            </div>
          ) : explanation ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Concept Explanation
              </h3>
              <p className="text-gray-700 whitespace-pre-line">
                {explanation}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <LuList size={48} className="mb-4" />
              <p>No explanation available. Please try again later.</p>
            </div>
          )}
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
