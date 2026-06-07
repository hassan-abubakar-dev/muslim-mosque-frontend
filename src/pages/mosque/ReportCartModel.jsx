import React, { useState } from 'react';
import { AlertTriangle, FileText, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';

export default function ReportFormModal({ mosqueId, mosqueName, onClose, onSubmitSuccess }) {
  // Form State Layout
  const [reasonCategory, setReasonCategory] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Predefined reason options that match your Sequelize ENUM exactly
  const options = [
    { id: 'fake_account', label: 'Fake Account / Spammed Profile' },
    { id: 'unislamic_media', label: 'Unislamic Media or Content' },
    { id: 'wrong_location', label: 'Incorrect Location / Wrong Address' },
    { id: 'inappropriate_info', label: 'Inappropriate Information' },
    { id: 'other', label: 'Other Reason (Write custom text below)' },
  ];

// Replace your existing handleSubmit with this:
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!reasonCategory) return;

  setIsSubmitting(true);
  setSubmitError(null);

  try {
   
    await privateAxiosInstance.post(`/reports/create/${mosqueId}`, {
      reasonCategory,
      customReason,
      mosqueName
    });

    
    setIsSuccess(true);
    // Success timeout
    setTimeout(() => {
      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    }, 2000);

  } catch (err) {
    // Show the specific error message from the backend if it exists
    setSubmitError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    console.error('Report submission error:', err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden border border-gray-100 transition-all">
        
        {/* Header Block Section */}
        <div className="bg-rose-600 p-5 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-rose-200 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
          <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
            <ShieldAlert size={20} /> Report Profile
          </h3>
          <p className="text-xs text-rose-100 font-medium mt-0.5">
            Help us verify content on <span className="font-bold">"{mosqueName}"</span>
          </p>
        </div>

        {/* Dynamic Success View State */}
        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h4 className="text-base font-bold text-slate-800">Report Submitted</h4>
            <p className="text-xs text-gray-400 font-medium max-w-xs">
              Thank you. The system administrators will audit this mosque profile information immediately.
            </p>
          </div>
        ) : (
          /* Main Interactive Form Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Reason Selection Cards List */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1">
                Select Reason for Flagging
              </label>
              
              <div className="grid grid-cols-1 gap-2">
                {options.map((opt) => (
                  <label 
                    key={opt.id}
                    className={`p-3 border rounded-xl flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${
                      reasonCategory === opt.id 
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-600/10' 
                        : 'border-gray-200 text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <AlertTriangle size={14} className={reasonCategory === opt.id ? 'text-indigo-600' : 'text-gray-400'} />
                      {opt.label}
                    </span>
                    <input 
                      type="radio" 
                      name="reasonCategory" 
                      value={opt.id} 
                      checked={reasonCategory === opt.id}
                      onChange={(e) => setReasonCategory(e.target.value)}
                      className="w-3.5 h-3.5 text-indigo-600 accent-indigo-600 cursor-pointer" 
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Input Block: Shows always or dynamic if 'other' is picked */}
            {(reasonCategory === 'other' || reasonCategory !== '') && (
              <div className="space-y-1.5 transition-all duration-200">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={13} className="text-gray-400" />
                  Additional Notes {reasonCategory !== 'other' && <span className="text-gray-400 font-normal">(Optional)</span>}
                </label>
                <textarea
                  rows={3}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={reasonCategory === 'other' ? "Please explicitly describe the issue so admins can inspect it..." : "Provide extra details here if necessary..."}
                  required={reasonCategory === 'other'}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none placeholder:text-gray-400"
                />
              </div>
            )}

            {submitError && (
              <p className="text-[11px] text-red-600 font-bold bg-red-50 p-2 rounded-lg text-center">
                {submitError}
              </p>
            )}

            {/* Action Buttons Container */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-50">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 border text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!reasonCategory || isSubmitting}
                className={`px-5 py-2 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 ${
                  !reasonCategory || isSubmitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border'
                    : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Submit Flag'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}