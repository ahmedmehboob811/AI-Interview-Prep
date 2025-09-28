import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserProvider } from './context/userContext.jsx';

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";

const App = () => (
  <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/interview-prep/:sessionId" element={<InterviewPrep />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3000, style: { fontSize: "13px" } }}
      />
    </Router>
  </UserProvider>
);

export default App;
