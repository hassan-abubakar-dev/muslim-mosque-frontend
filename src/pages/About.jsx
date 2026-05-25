import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Info, Code, Lightbulb, Bug, MessageSquare, CheckCircle, Mail } from "lucide-react";

const AboutPage = () => {
  const { loggedInUser } = useContext(UserContext);
  
  const [formData, setFormData] = useState({
    type: "suggestion",
    message: "",
    email: "",
    contactConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Automatically handle email pre-filling if user state updates
  useEffect(() => {
    if (loggedInUser?.email) {
      setFormData((prev) => ({ ...prev, email: loggedInUser.email }));
    }
  }, [loggedInUser]);

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare payload dynamically based on consent
    const payload = {
      type: formData.type,
      message: formData.message,
      // If they don't want a follow-up, we don't send the email to backend
      email: formData.contactConsent ? formData.email : null, 
      userId: loggedInUser?.id || null
    };

    try {
      console.log("Submitting Feedback Payload:", payload);
      
      // ⚡ Connects directly to your upcoming feedback controller endpoint
      // await privateAxiosInstance.post('/feedback', payload);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate write
      setIsSuccess(true);
      
      // Reset text box but keep email context
      setFormData((prev) => ({ ...prev, message: "", contactConsent: false }));
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 mt-16 select-none">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* 1. ABOUT PLATFORM PLATFORM SUMMARY BLOCK */}
        <section className="bg-white rounded-[2rem] shadow-xs p-8 border border-slate-100 transition-all">
          <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center gap-2">
            <Info size={20} className="text-indigo-600" /> About the Platform
          </h2>
          <p className="text-slate-600 leading-relaxed text-xs font-medium">
            This community engagement platform is engineered to make mosque communication channels, 
            media assets, and structural Islamic knowledge fluidly accessible. Our core mission is to 
            bridge communication gaps between management modules and local communities using high-fidelity system design architecture.
          </p>
          <div className="mt-4">
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 uppercase tracking-wider border border-indigo-100/50">
              Production Build v1.1 • Enterprise Architecture
            </span>
          </div>
        </section>

        {/* 2. DEVELOPER PROFILE INFORMATION BADGE */}
        <section className="bg-white rounded-[2rem] shadow-xs p-8 border border-slate-100 transition-all">
          <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Code size={20} className="text-indigo-600" /> Behind the Code
          </h2>
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm tracking-wide shadow-xs shadow-indigo-600/20">
              HM
            </div>
            <div>
              <p className="text-slate-900 font-bold text-sm">Hassan M.</p>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                Lead Software Engineer / Architect
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            Engineered with a focus on cost-efficient cloud scaling, optimized query performance, 
            and modern UX responsiveness. System mechanics prioritize data integrity and straightforward 
            administration interfaces.
          </p>
        </section>

        {/* 3. CORE INTERACTIVE FEEDBACK AND BUG MECHANICS BOX */}
        <section className="bg-white rounded-[2rem] shadow-xs p-8 border border-slate-100 relative transition-all">
          <h2 className="text-xl font-black text-slate-900 mb-2">
            Community Suggestions Hub
          </h2>
          <p className="text-xs text-gray-400 font-semibold mb-6">
            Have a suggestion, bug report, or feature request? Share your insights directly with administration.
          </p>

          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center justify-center space-y-3 bg-emerald-50/40 rounded-2xl border border-emerald-100 animate-fadeIn">
              <CheckCircle size={32} className="text-emerald-600 animate-bounce" />
              <h4 className="text-sm font-bold text-slate-800">Feedback Logged Safely</h4>
              <p className="text-[11px] text-gray-400 font-medium max-w-xs px-4">
                Assalamu Alaikum. Your thoughts have been dispatched to our administrative tracking panel.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* INTERACTIVE CARDS PRESET SELECT GRID */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                  Select Feedback Category
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "suggestion", label: "Suggestion", icon: Lightbulb, color: "text-amber-500" },
                    { id: "bug", label: "Report Bug", icon: Bug, color: "text-rose-500" },
                    { id: "feedback", label: "General View", icon: MessageSquare, color: "text-indigo-500" },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = formData.type === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTypeSelect(item.id)}
                        className={`p-3.5 border rounded-xl flex flex-col gap-2 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-600/10"
                            : "border-slate-200 hover:bg-slate-50/80"
                        }`}
                      >
                        <IconComponent size={16} className={item.color} />
                        <span className={`text-xs font-bold ${isSelected ? "text-indigo-950" : "text-slate-700"}`}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MESSAGE ENTRY CONTAINER FIELD */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block">
                  Your Message Text
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details, structural ideas, or just say Assalamu Alaikum..."
                  className="w-full border border-slate-200 bg-slate-50/40 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none placeholder:text-gray-400"
                />
              </div>

              {/* REPLY PERMISSION TOGGLE MECHANISM */}
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <input
                  type="checkbox"
                  id="contactConsent"
                  checked={formData.contactConsent}
                  onChange={(e) => setFormData({ ...formData, contactConsent: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 accent-indigo-600 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="contactConsent" className="text-xs text-slate-700 font-bold cursor-pointer select-none">
                  I would like an email reply back when this ticket is resolved
                </label>
              </div>

              {/* CONDITIONAL, EDITABLE EMAIL CAPTURE TRACK */}
              {(formData.contactConsent || !loggedInUser) && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Mail size={12} className="text-gray-400" /> Correspondence Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full border border-slate-200 bg-slate-50/40 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                  {loggedInUser && (
                    <p className="text-[10px] text-indigo-500 font-medium px-0.5">
                      ℹ️ Pre-filled from your profile credentials. Feel free to modify this to a preferred reply destination.
                    </p>
                  )}
                </div>
              )}

              {/* ACTION CALL SUBMIT INTERACTIVE CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-indigo-700 shadow-xs shadow-indigo-600/10 transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed border border-transparent disabled:border-slate-200"
              >
                {isSubmitting ? "Processing Transmission..." : "Submit Opinion Vector"}
              </button>
            </form>
          )}
        </section>

        {/* COMPONENT PRESENTATION FOOTER LINE SUBTEXT */}
        <footer className="text-center text-gray-400 text-[10px] uppercase font-bold tracking-widest pt-4">
          © 2026 Masjiba Network • Designed for Functional Impact
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;