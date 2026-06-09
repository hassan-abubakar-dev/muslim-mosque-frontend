import { useState, useRef, useEffect } from 'react';
import { Camera, Save, CheckCircle, Users, Shield } from 'lucide-react'; // Swapped HelpCircle for structural team icons
import { useUserContext } from '../context/UserContext';
import privateAxiosInstance from '../../auth/privateAxiosInstance';
import { useNavigate } from 'react-router-dom';
import ProfileSkeleton from '../components/loadingSkeletons/ProfileSkeletonLoader';
import { uploadImageToCloudinary } from '../util/cloudinary.js';

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { loggedInUser, userProfile, fetchUserProfile, setUserProfile } = useUserContext();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Show preview immediately
    }
  };

  // Handle API Upload
 const handleUpload = async () => {
  if (!selectedFile) return;

  setUploading(true);
  setError(null); // Clear previous errors

  try {
    // 1. Upload to Cloudinary
    const { imageUrl, publicId } = await uploadImageToCloudinary(selectedFile);
    
    // 2. Update Database
    const apiRes = await privateAxiosInstance.put('/profiles/update-user-profile', { 
      imageUrl, 
      publicId 
    });

    if (apiRes.status < 400) {
      setUserProfile(apiRes.data.userProfile);
      setSelectedFile(null);
      // Optional: Success notification here
    }
    
  } catch (err) {
    console.error('Upload error:', err.response?.data || err.message);
    setError('Failed to update profile. Please try again.');
  } finally {
    setUploading(false); // ALWAYS runs, regardless of success or failure
  }
};

  // Determine if user is associated with any mosque hub records
  const isMosqueAdmin = loggedInUser?.managedMosques && loggedInUser?.managedMosques?.length > 0;

if(!loggedInUser){
  return <ProfileSkeleton />
}else{
    return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 my-10 mb-20">
        
        {/* Error Message Box */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        {/* Profile Header Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {/* Avatar Image */}
            <img
              src={previewUrl || userProfile} // Shows instant preview if selected, otherwise defaults to saved user profile image
              alt={loggedInUser?.firstName}
              className="w-40 h-40 rounded-full object-cover border-4 border-emerald-700 shadow-lg"
            />
            
            {/* Camera Overlay Icon */}
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 p-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-all shadow-md cursor-pointer"
            >
              <Camera size={20} />
            </button>
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <h1 className="text-3xl font-bold text-emerald-900">
              {loggedInUser?.firstName} {loggedInUser?.surName}
            </h1>
            {isMosqueAdmin && (
              <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                <CheckCircle size={12} className="mr-1" /> MOSQUE HUB ADMIN
              </div>
            )}
          </div>
          
          <p className="text-gray-500 font-medium">{loggedInUser?.email}</p>
          
          {/* Save Button - Only shows when a new image is selected */}
          {selectedFile && (
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md animate-bounce cursor-pointer"
            >
              <Save size={18} />
              {uploading ? 'Uploading...' : 'Save New Photo'}
            </button>
          )}
        </div>

        {/* Info Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Account Role</label>
            <p className="text-gray-700 font-semibold capitalize">{loggedInUser?.role}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Member Since</label>
            <p className="text-gray-700 font-semibold">{loggedInUser?.createdAt}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Gender</label>
            <p className="text-gray-700 font-semibold capitalize">{loggedInUser?.gender}</p>
          </div>
        </div>

        {/* Managed Mosques Section */}
        {isMosqueAdmin && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Managing Mosques</h3>
            <div className="space-y-3">
              {loggedInUser?.managedMosques?.map((mosque) => {
                // Determine user's assignment authority layer level for this individual card mapping node
                // Note: The lower condition falls back gracefully for database master users
              const isPrimaryOwner = mosque.MosqueAdmin?.role === 'owner';

                return (
                  <div 
                    key={mosque.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-emerald-100/50 rounded-xl bg-emerald-50/10 gap-4"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white mr-4 shrink-0 font-bold text-lg">
                        {mosque.name ? mosque.name[0].toUpperCase() : 'M'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{mosque.name}</p>
                        <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <Shield size={12} /> {isPrimaryOwner ? 'Primary Owner' : 'Assistant Support Staff'}
                        </p> 
                      </div>
                    </div>

                    {/* 🎯 CONTEXT-AWARE RULES: Only primary owners see the button for this specific location */}
                    {isPrimaryOwner && (
                      <button
                        onClick={() => navigate(`/mosque-team-settings/${mosque.id}`, { 
                          state: { mosqueId: mosque.id, mosqueName: mosque.name } 
                        })}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-emerald-700 text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer text-nowrap self-end sm:self-center"
                      >
                        <Users size={14} />
                        Manage Team
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
};

export default Profile;


