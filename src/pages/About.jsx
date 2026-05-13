import React, { useState } from "react";

const AboutPage = () => {
  const [formData, setFormData] = useState({
    type: "suggestion",
    message: "",
    contactConsent: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Mock API Call:", formData);
    alert("This is a mock! In production, data will be stored securely.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* 1. ABOUT APP */}
        <section className="bg-white rounded-2xl shadow-sm p-7 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            About the Platform
          </h2>

          <p className="text-gray-600 leading-relaxed text-sm">
            This platform is designed to make mosque information and Islamic
            content easily accessible to the community. It aims to simplify how
            people connect with local mosques, follow updates, and access
            beneficial knowledge in a structured and modern way.
          </p>

          <div className="mt-4">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
              Version 1.0 • Active Development
            </span>
          </div>
        </section>

        {/* 2. DEVELOPER (SUBTLE + PROFESSIONAL) */}
        <section className="bg-white rounded-2xl shadow-sm p-7 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Behind the Project
          </h2>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
              HM
            </div>
            <div>
              <p className="text-gray-800 font-medium">Hassan M.</p>
              <p className="text-xs text-gray-500">
                Software Engineer
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            This project is part of an effort to build meaningful digital tools
            that solve real community problems. The focus is on clean system
            design, scalability, and long-term usability.
          </p>

          <p className="text-xs text-gray-500 mt-3">
            Feedback, ideas, and thoughtful suggestions are always welcome.
          </p>
        </section>

        {/* 3. FEEDBACK FORM */}
        <section className="bg-white rounded-2xl shadow-sm p-7 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Feedback & Suggestions
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* TYPE */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Message Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="suggestion">💡 Suggestion</option>
                <option value="bug">🐞 Report an Issue</option>
                <option value="feedback">⭐ General Feedback</option>
              </select>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                rows="4"
                required
                placeholder="How can we help? Share feedback, report bugs, work inquiry or just say Assalamu Alaikum..."
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>

            {/* CONSENT */}
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactConsent: e.target.checked,
                  })
                }
              />
              <label className="ml-2 text-xs text-gray-500">
                Allow follow-up if needed
              </label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
            >
              Send Message
            </button>
          </form>
        </section>

        {/* FOOTER */}
        <footer className="text-center text-gray-400 text-xs pt-4">
          © 2026 Mosque App • Built with purpose
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;