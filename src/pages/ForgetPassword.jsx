import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import MasjibaLogoMark from '../assets/masjiba-logo-mark.png'; 
import publicAxiosInstance from "../../auth/publicAxiosInstance";
const isDev = import.meta.env.VITE_ENV === 'development';
const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // State Monitoring
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Capture the exact input value right now to protect it from timing drops
    const submittedEmail = email.trim();

    try {
      // 🚀 Fire API Request to your Auth endpoint route
      const response = await publicAxiosInstance.post("/auths/forgot-password", { email: submittedEmail });
      
      if (response.status < 400) {
        setSuccess("If this email is registered, a verification code has been sent.");
        if (isDev) {
          console.log("Password recovery request successful:", response.data);
        }
        // 🛠️ FIX: Navigate FIRST using the captured email string so the next page can display it
        navigate('/verify-email', { state: { email: submittedEmail, flowType: 'recovery' }, replace: true });
        
        // Reset local form input field safely after navigation trigger
        setEmail("");
      }

    } catch (err) {
      if (isDev) {
        console.error("Error during password recovery request:", err);
      }
      // Since the backend safely handles missing emails, an error here means a real 500 server or network drop
      setError(err?.response?.data?.message || "Something went wrong on the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-xl font-semibold text-emerald-800">Account Recovery</h1>
          <p className="text-sm text-gray-600 mt-1">
            Enter your email address to receive a secure verification code pin.
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

          {/* SINGLE EMAIL SEARCH FIELD */}
          <label className="block">
            <span className="text-gray-700 text-sm">Email Address *</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
              {loading ? "Searching account..." : "Send Verification Code"}
            </button>
          </div>
        </form>

        {/* CONTEXTUAL NAVIGATION RETURN TRACE */}
        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer transition-colors"
          >
            ← Back to Log In
          </button>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;