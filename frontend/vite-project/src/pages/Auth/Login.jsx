import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/userContext';

import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import Input from "../../components/Inputs/Input";
import { API_PATHS } from "../../utils/apiPaths";

const Login = ({ setcurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      // Save user data in context
      login(response.data.token, response.data.user);

      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      {/* Heading */}
      <h3 className="text-xl font-bold text-black">Welcome Back 👋</h3>
      <p className="text-sm text-gray-700 mt-1 mb-6">
        Please enter your details to log in
      </p>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="email"
          required
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Signup Redirect */}
      <p className="text-sm mt-4 text-center">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={() => setcurrentPage("signup")}
          className="text-blue-500 hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
