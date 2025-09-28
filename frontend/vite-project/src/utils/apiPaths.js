export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
  },
  AI: {
    GENERATE_QUESTION: "/api/ai/generate-questions",
    GENERATE_EXPLANATION: "/api/ai/generate-explanation",
  },
  SESSION: {
    CREATE: "/api/sessions/create",
    GET_ALL: "/api/sessions/my-sessions",
    GET_ONE: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
    AI_GENERATE_MORE_QUESTIONS: (id) =>
      `/api/sessions/${id}/ai-generate-more-questions`,
  },
  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add",
    TOGGLE_PIN: (id) => `/api/questions/${id}/pin`,
    UPDATE_ONE: (id) => `/api/questions/${id}/note`,
  },
};
