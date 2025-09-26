import React, { useState, useContext, useEffect, useRef } from "react";
import download from "../assets/download.jpg";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import Modal from "../components/Modal";
import { UserContext } from "../context/userContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const dropdownRef = useRef(null);

  const [openAuthModel, setopenAuthModel] = useState(false);
  const [currentPage, setcurrentPage] = useState("login");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCTA = () => {
    navigate("/dashboard");
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
    setDropdownOpen(false);
  };

  return (
    <>
      <div className="w-full min-h-full bg-[#FFFCEF] relative">
        {/* Blurred background effect */}
        <div className="w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0 z-0"></div>

        <div className="container mx-auto px-4 pt-6 pb-[100px] md:pb-[200px] relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-8 md:mb-16">
            <div className="text-lg md:text-xl text-black font-bold">
              Interview Prep AI
            </div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center space-x-2 cursor-pointer select-none"
                  onClick={toggleDropdown}
                >
                  <img
                    src={user.profileImageUrl || "/vite.svg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-black font-semibold">{user.name}</span>
                  <FiChevronDown className="text-black" />
                </div>

                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20 transform transition-all duration-200 ${
                    dropdownOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-xs md:text-sm font-semibold text-white px-4 md:px-7 py-2 md:py-2.5 rounded-full hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
                onClick={() => setopenAuthModel(true)}
              >
                Login/Signup
              </button>
            )}
          </header>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center">
            {/* Left */}
            <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
              <div className="flex items-center w-25 gap-2 text-[11px] md:text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-4">
                AI-Powered
              </div>

              <h1 className="text-3xl md:text-5xl text-black font-medium leading-tight">
                Ace Interview with
                <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>

              <p className="text-sm md:text-[17px] text-gray-900 mt-6 mb-6">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way. From
                preparation to mastery – your ultimate interview toolkit is here.
              </p>

              <button
                className="bg-black text-xs md:text-sm font-semibold text-white px-4 md:px-7 py-2 md:py-2.5 rounded-full hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>

            {/* Right */}
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={download}
                alt="Interview practice illustration"
                className="w-[80%] md:w-[70%] rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full min-h-full bg-[#FFFCEF] relative z-10 mt-10">
        <div className="container mx-auto px-4 pt-10 pb-20">
          <section className="mt-5">
            <h2 className="text-2xl font-medium text-center mb-12">
              Features That Make You Shine
            </h2>

            <div className="flex flex-col items-center gap-8">
              {/* First row (3 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {APP_FEATURES.slice(0, 3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Second row (2 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {APP_FEATURES.slice(3).map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-[#FFFEF8] p-6 rounded-xl shadow-xs hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                  >
                    <h3 className="text-base font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-sm bg-gray-50 text-gray-600 text-center p-5 mt-5">
        Made by <span className="font-semibold">MEHBOOB AHMED</span>
      </footer>

      {/* Auth Modal */}
      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setopenAuthModel(false);
          setcurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setcurrentPage={setcurrentPage} />}
          {currentPage === "signup" && <SignUp setcurrentPage={setcurrentPage} />}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
