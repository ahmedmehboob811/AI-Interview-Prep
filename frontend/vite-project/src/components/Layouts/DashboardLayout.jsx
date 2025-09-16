import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  // Wait until loading is finished before deciding
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  // Redirect if no user
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
};

export default DashboardLayout;
