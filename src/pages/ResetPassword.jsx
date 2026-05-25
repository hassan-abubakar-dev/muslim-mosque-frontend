import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MasjibaLogoMark from '../assets/masjiba-logo-mark.png';
import publicAxiosInstance from "../../auth/publicAxiosInstance";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🛠️ CHANGED HERE: Extract both email and the secure validation token from router state context
  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  // State Monitoring
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // 🛡️ Frontend Guardrail: Enforce identical input matches
    if (form.password !== form.confirmPassword) {
      setLoading(false);
      return setError("Passwords do not match.");
    }

    // 🛡️ Frontend Guardrail: Basic password length check
    if (form.password.length < 6) {
      setLoading(false);
      return setError("Password must be at least 6 characters long.");
    }

    try {
      // 🚀 🛠️ CHANGED HERE: Send BOTH password and token inside the POST body request array
      const response = await publicAxiosInstance.post("/auths/reset-password", {
        token: resetToken,
        password: form.password
      });

      if (response.status < 400) {
        setSuccess("Password updated successfully! Redirecting to login...");
        
        // Clear local form states
        setForm({ password: "", confirmPassword: "" });

        // Redirect them back to login page to sign in with new credentials
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (err) {
      console.error("Error during password reset execution:", err);
      setError(err?.response?.data?.message || "Failed to update password. Please request a new code.");
    } finally {
      setLoading(false);
    }
  };

  // 🛡️ CHANGED HERE: Tightened guardrail to ensure an intruder can't load the page without a reset pass
  if (!email || !resetToken) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6 text-center">
          <p className="text-sm text-red-600 font-medium mb-4">Invalid or missing account recovery session tokens.</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
          >
            Return to Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6">
        
        {/* BRANDING LOGO & HEADER SECTION */}
        <div className="flex flex-col items-center text-center mb-5">
          <img 
            src={MasjibaLogoMark} 
            alt="Masjiba Logo" 
            className="h-20 w-auto object-contain mb-3" 
          />
          <h1 className="text-xl font-semibold text-emerald-800">Set New Password</h1>
          <p className="text-sm text-gray-600 mt-1">
            Please type your secure new account credentials below for <span className="font-semibold text-slate-800">{email}</span>.
          </p>
        </div>

        {/* INTERACTIVE FORM SYSTEM */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded-md text-center">
              {success}
            </div>
          )}

          {/* NEW PASSWORD FIELD */}
          <label className="block">
            <span className="text-gray-700 text-sm">New Password *</span>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm"
            />
          </label>

          {/* CONFIRM NEW PASSWORD FIELD */}
          <label className="block">
            <span className="text-gray-700 text-sm">Confirm New Password *</span>
            <input
              type="password"
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm"
            />
          </label>

          {/* ACTION SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer transition-colors text-sm"
            >
              {loading ? "Updating password..." : "Update Password"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;