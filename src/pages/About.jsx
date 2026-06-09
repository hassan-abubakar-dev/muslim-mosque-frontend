import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Info, CheckCircle, Mail, ChevronDown, Facebook, Twitter, Github, Globe } from "lucide-react";
import privateAxiosInstance from "../../auth/privateAxiosInstance";

const isDev = import.meta.env.VITE_ENV === 'development';

const AboutPage = () => {
  const { loggedInUser } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    type: "suggestion",
    message: "",
    email: loggedInUser?.email || "",
    contactConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (loggedInUser?.email) {
      setFormData((prev) => ({ ...prev, email: loggedInUser.email }));
    }
  }, [loggedInUser]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace '/api/feedback' with your actual backend endpoint
     const res = await privateAxiosInstance.post("/feedback/submit", formData);
      
      if(res.status < 400){
        setIsSuccess(true);
      setFormData((prev) => ({ ...prev, message: "", contactConsent: false }));
     
      setTimeout(() => setIsSuccess(false), 3000);
      
      }
    } catch (error) {
      if (isDev) {
        console.error("Feedback submission error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 mt-16 select-none">
      <div className="max-w-2xl mx-auto space-y-10">

        {/* 1. ABOUT PLATFORM */}
        <section className="bg-white rounded-[2rem] shadow-sm p-10 border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-5 flex items-center gap-3">
            <Info size={28} className="text-emerald-700" /> About the Platform
          </h2>
          <p className="text-slate-600 leading-relaxed text-base font-medium">
            This community engagement platform is engineered to make mosque communication channels, 
            media assets, and structural Islamic knowledge fluidly accessible. Our core mission is to 
            bridge communication gaps between management modules and local communities using high-fidelity system design architecture.
          </p>
        </section>

        {/* 2. COMMUNITY SUGGESTIONS HUB */}
        <section className="bg-white rounded-[2rem] shadow-sm p-10 border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 mb-3">Community Suggestions Hub</h2>
          <p className="text-base text-slate-500 font-medium mb-8">
            Have a suggestion, bug report, or inquiry? Share your insights directly with administration.
          </p>

          {isSuccess ? (
            <div className="py-12 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
              <CheckCircle size={48} className="text-emerald-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-slate-900">Feedback Logged Safely</h4>
              <p className="text-base text-emerald-800 mt-2">Assalamu Alaikum. Your thoughts have been dispatched.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* CATEGORY */}
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">Feedback Category</label>
                <div className="relative">
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl p-4 text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 outline-none transition-all cursor-pointer"
                  >
                    <option value="suggestion">💡 Suggestion</option>
                    <option value="bug">🐛 Report Bug</option>
                    <option value="work_inquiry">💼 Work Inquiry</option>
                    <option value="praise">🌟 Praise</option>
                    <option value="general_feedback">💬 General Feedback</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-5 text-slate-400 pointer-events-none" size={24} />
                </div>
              </div>

              {/* MESSAGE */}
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest block">Your Message</label>
                <textarea
                  rows="5" required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details, structural ideas, or just say Assalamu Alaikum..."
                  className="w-full border border-slate-200 bg-slate-50 rounded-xl p-4 text-base font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 outline-none resize-none"
                />
              </div>

              {/* EMAIL & CONSENT */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-500 uppercase tracking-widest block flex items-center gap-2">
                    <Mail size={16} /> Correspondence Email <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl p-4 text-base font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-700 outline-none"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.contactConsent}
                    onChange={(e) => setFormData({...formData, contactConsent: e.target.checked})}
                    className="w-5 h-5 accent-emerald-700 rounded"
                  />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-800 transition-colors">
                    I would like an email reply regarding this feedback.
                  </span>
                </label>
              </div>

              <button
                type="submit" disabled={isSubmitting}
                className="w-full bg-emerald-700 text-white py-4 rounded-xl text-base font-black uppercase tracking-wider hover:bg-emerald-800 transition-all cursor-pointer disabled:bg-slate-300"
              >
                {isSubmitting ? "Processing Transmission..." : "Submit Opinion Vector"}
              </button>
            </form>
          )}
        </section>

        {/* 4. FOOTER & SOCIALS */}
        <footer className="pt-8 pb-12 space-y-8">
          <div className="flex justify-center gap-8 text-slate-400">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700 transition-colors"><Facebook size={28} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700 transition-colors"><Twitter size={28} /></a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700 transition-colors"><Github size={28} /></a>
            <a href="https://yourwebsite.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700 transition-colors"><Globe size={28} /></a>
          </div>
          <div className="text-center text-slate-500 text-xs uppercase font-black tracking-[0.2em]">
            <p>© 2026 Masjiba Network • Designed for Impact</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;