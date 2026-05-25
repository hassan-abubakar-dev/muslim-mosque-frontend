// 📄 src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, KeyRound, Save, Loader2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext.jsx';
import privateAxiosInstance from '../../auth/privateAxiosInstance.js';

const Settings = () => {
  const navigate = useNavigate();
  const { loggedInUser, userProfile } = useUserContext();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'
  
  // Profile form submission state tracker
  const [profileForm, setProfileForm] = useState({
    firstName: loggedInUser?.firstName || '',
    surName: loggedInUser?.surName || '',
    email: loggedInUser?.email || '',
    gender: loggedInUser?.gender || '',
  });

  // Keep state perfectly updated if context asynchronously initializes late
  useEffect(() => {
    if (loggedInUser) {
      setProfileForm({
        firstName: loggedInUser.firstName || '',
        surName: loggedInUser.surName || '',
        email: loggedInUser.email || '',
        gender: loggedInUser.gender || '',
      });
    }
  }, [loggedInUser]);

  // Password mutation state architecture
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // Notification handling

  // 1. UPDATE PROFILE DATA HANDLER
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await privateAxiosInstance.put('/users/update-profile', {
        firstName: profileForm.firstName,
        surName: profileForm.surName,
        gender: profileForm.gender
      });
      if (res.data?.status === 'success' || res.status < 400) {
        setMessage({ type: 'success', text: 'Profile changes updated successfully!' });
        console.log('Profile updated successfully:', res.data);
      }
    } catch (err) {
        console.error('Profile update error:', err.response?.data || err.message);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  // 2. PASSWORD MUTATION SUBMIT HANDLER
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      return setMessage({ type: 'error', text: 'New passwords do not match!' });
    }
    
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await privateAxiosInstance.put('/auths/change-password', {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword
      });
      
      if (res.data?.status === 'success' || res.status < 400) {
        console.log('Password changed successfully:', res.data);
        setMessage({ type: 'success', text: 'Your password has been securely reset!' });
        setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Clear fields
      }
    } catch (err) {
        console.error('Password change error:', err.response?.data || err.message);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Credentials update rejected.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Hub Page Title Row */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-sm text-gray-500 font-medium">Manage your personal presence and configuration security profiles</p>
        </div>

        {/* 🌟 1. High-Fidelity Tab Switcher Row */}
        <div className="flex bg-gray-200/60 p-1 rounded-2xl mb-8 max-w-sm">
          <button
            type="button"
            onClick={() => { setActiveTab('profile'); setMessage({ type: '', text: '' }); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-emerald-950 shadow-xs border border-gray-100'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4" />
            Profile Details
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('security'); setMessage({ type: '', text: '' }); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-emerald-950 shadow-xs border border-gray-100'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Security & Password
          </button>
        </div>

        {/* Status Toast Message Block */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-xs font-semibold border ${
            message.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            {message.text}
          </div>
        )}

        {/* 🌟 2. Central Settings Content Container Sheet */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xs p-6 sm:p-10">
          
          {/* 🪪 PANEL A: PROFILE DETAILS INTERFACE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {/* Dynamic Photo Redirect Interaction Circle */}
              <div className="flex flex-col items-center sm:flex-row gap-5 border-b border-gray-50 pb-6">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="relative group w-24 h-24 rounded-full overflow-hidden shadow-inner border-2 border-emerald-700/20 shrink-0 cursor-pointer block"
                  title="Click to manage image"
                >
                  <img src={userProfile} alt="User Avatar" className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </button>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-gray-800 text-base">Profile Photograph</h3>
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 mt-0.5 justify-center sm:justify-start cursor-pointer"
                  >
                    <span>Manage profile photo on primary dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Identity Form Slots Layout Grid */}
              <div className="grid grid-cols-1 gap-5">
                
                {/* Responsive Dual Column Name Grid Structure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name Input Slot */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-hidden text-sm text-gray-800 focus:border-emerald-700 focus:bg-white transition"
                      placeholder="Enter first name"
                    />
                  </div>

                  {/* Surname Input Slot */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Surname</label>
                    <input
                      type="text"
                      required
                      value={profileForm.surName}
                      onChange={(e) => setProfileForm({ ...profileForm, surName: e.target.value })}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-hidden text-sm text-gray-800 focus:border-emerald-700 focus:bg-white transition"
                      placeholder="Enter surname"
                    />
                  </div>
                </div>

                {/* Secure Read-Only Locked Email Input Slot */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Email Address (Locked)</label>
                  <input
                    type="email"
                    disabled
                    value={profileForm.email}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 outline-hidden text-sm text-gray-400 font-medium cursor-not-allowed select-none"
                    placeholder="name@example.com"
                  />
                  <p className="text-[11px] text-gray-400 pl-1 mt-0.5 leading-normal">
                    Email address identity is securely managed and locked to protect system authentication.
                  </p>
                </div>

                {/* Structured Gender Dropdown Selection Slot */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Gender</label>
                  <div className="relative">
                    <select
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-hidden text-sm text-gray-800 focus:border-emerald-700 focus:bg-white transition cursor-pointer appearance-none capitalize"
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    
                    {/* Custom Down Chevron Icon Overlay Component */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Trigger Action row */}
              <div className="pt-4 border-t border-gray-50 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-linear-to-r from-emerald-800 to-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs hover:opacity-95 transition tracking-wide flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* 🔐 PANEL B: SECURITY & PASSWORD UPDATES MODULE */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">Update Security Credentials</h3>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">Ensure a highly distinct pass-phrase sequence layout to safeguard account control records</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Current Account Password</label>
                  <input
                    type="password"
                    required
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-hidden text-sm text-gray-800 focus:border-emerald-700 focus:bg-white transition"
                    placeholder="••••••••"
                  />
                </div>

                <div className="border-t border-gray-50 my-2 pt-2" />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">New Target Password</label>
                  <input
                    type="password"
                    required
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-hidden text-sm text-gray-800 focus:border-emerald-700 focus:bg-white transition"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider pl-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-hidden text-sm text-gray-800 focus:border-emerald-700 focus:bg-white transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Trigger Action row */}
              <div className="pt-4 border-t border-gray-50 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-linear-to-r from-emerald-800 to-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs hover:opacity-95 transition tracking-wide flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Update Credentials
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;