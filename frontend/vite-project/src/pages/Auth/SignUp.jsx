import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { uploadImage } from '../../utils/uploadImage';
import { toast } from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';

const SignUp = ({ setcurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !name) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    let profileImageUrl = '';
    if (profileImage) {
      setUploading(true);
      profileImageUrl = await uploadImage(profileImage);
      setUploading(false);
      if (!profileImageUrl) {
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }
    }

    try {
      await axiosInstance.post(API_PATHS.AUTH.REGISTER, { email, password, name, profileImageUrl });
      toast.success("Signup successful! Please login.");
      setcurrentPage("login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create Account</h3>
      <p className='text-xs text-gray-700 mt-[5px] mb-6'>Please enter your details to sign up</p>
      <form onSubmit={handleSignUp}>
        <div className="mb-4 flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              {profileImage ? (
                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-2xl">+</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          {uploading && <p className="text-xs text-gray-500 mt-2">Uploading image...</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="Min 8 Character"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className='w-full bg-green-500 text-white py-2 rounded-md mt-4 disabled:opacity-50'
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <p className='text-sm mt-4 text-center'>
        Already have an account? <button onClick={() => setcurrentPage("login")} className='text-green-500'>Login</button>
      </p>
    </div>
  );
};

export default SignUp;
