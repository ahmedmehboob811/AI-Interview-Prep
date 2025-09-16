import React, { useContext } from "react";
import { UserContext } from "../context/userContext";

const ProfileCard = () => {
  const { user, logout } = useContext(UserContext);

  // If no user, show fallback card
  if (!user) {
    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg w-80 sm:w-96 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-gray-400 text-3xl">👤</span>
        </div>
        <p className="text-gray-600 font-medium">Not logged in</p>
        <p className="text-sm text-gray-500 mt-1">
          Please log in to view your profile
        </p>
      </div>
    );
  }

  // If user exists, show profile
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg w-80 sm:w-96 flex flex-col items-center">
      {/* Profile Image */}
      <div className="relative mb-4">
        <img
          src={user.profileImageUrl || "/vite.svg"}
          alt={user.name ? `${user.name}'s profile` : "Profile image"}
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
        />
        {/* Status Indicator */}
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      {/* User Info */}
      <h3 className="text-xl font-bold text-gray-800 mb-1">
        {user.name || "Unnamed User"}
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {user.email || "No email available"}
      </p>

      {/* Logout Button */}
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to log out?")) {
            logout();
          }
        }}
        className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:scale-95 transition-all font-medium"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileCard;
