import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const { user, logout } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-16 sticky top-0 z-30 bg-gradient-to-r from-white via-orange-100 to-orange-200 backdrop-blur-md shadow-md transition-all duration-500">
      <div className="container mx-auto flex items-center justify-between gap-5 h-full px-4 md:px-0">
        {/* Brand */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-lg md:text-xl font-bold leading-5 transition-colors ${
              isActive ? "text-orange-600" : "text-black hover:text-orange-600"
            }`
          }
        >
          Interview Prep AI
        </NavLink>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-700">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="bg-rose-500 text-white px-5 py-1.5 rounded-full shadow-sm hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/"
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-xs md:text-sm font-semibold text-white px-5 py-2 rounded-full shadow-sm hover:from-orange-500 hover:to-orange-600 hover:scale-105 active:scale-95 border border-white transition-all duration-300"
            >
              Login/Signup
            </NavLink>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-2xl text-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col items-center py-4 gap-4 animate-slideDown">
          {user ? (
            <>
              <span className="text-sm text-gray-700">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="bg-rose-500 text-white px-5 py-1.5 rounded-full shadow-sm hover:bg-rose-600 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/"
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-sm font-semibold text-white px-5 py-2 rounded-full shadow-sm hover:from-orange-500 hover:to-orange-600 hover:scale-105 active:scale-95 border border-white transition-all duration-300"
            >
              Login/Signup
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
