import { useState, useRef, useEffect } from 'react';
import { Camera, Save, CheckCircle } from 'lucide-react'; // Using lucide-react for icons
import { useUserContext } from '../context/UserContext';
import privateAxiosInstance from '../../auth/privateAxiosInstance';



const Profile = () => {


 
  const [user, setUser] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { loggedInUser, userProfile, fetchUserProfile, setUserProfile } = useUserContext();
  const [error, setError] = useState(null);

    useEffect(() => {
    setUser(loggedInUser);
  }, [loggedInUser]);

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
    setUploading(true);
    try {

      const formData = new FormData();
      formData.append('image', selectedFile);

  formData.append("file", selectedFile);
  
    formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
 
    const imageUrl = data.secure_url;
    const publicId = data.public_id;
   const apiRes = await privateAxiosInstance.put('/profiles/update-user-profile', { imageUrl, publicId });
   if(apiRes.status < 400){
    console.log('Profile updated successfully', apiRes.data.userProfile);
      setUserProfile(apiRes.data.userProfile); // Refresh profile data to show new image
   }

      
      setUploading(false);
      setSelectedFile(null);

    } catch (err) {
      setUploading(false);
      console.error('Upload error:', err.response?.data || err.message);
      setError('upload fail')
    }
  };

  // Determine if user is a Mosque Admin
  const isMosqueAdmin = user.managedMosques && user.managedMosques.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-20">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 my-10 mb-20">
        {/* error message */}
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
              src={userProfile}
              alt={user.firstName}
              className="w-40 h-40 rounded-full object-cover border-4 border-emerald-700 shadow-lg"
            />
            
            {/* Camera Overlay Icon */}
            <button 
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 p-2 bg-emerald-700 text-white rounded-full hover:bg-emerald-800 transition-all shadow-md"
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
              {user.firstName} {user.surName}
            </h1>
            {isMosqueAdmin && (
              <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                <CheckCircle size={12} className="mr-1" /> MOSQUE ADMIN
              </div>
            )}
          </div>
          
          <p className="text-gray-500 font-medium">{user.email}</p>
          
          {/* Save Button - Only shows when a new image is selected */}
          {selectedFile && (
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md animate-bounce"
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
            <p className="text-gray-700 font-semibold capitalize">{user.role}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Member Since</label>
            <p className="text-gray-700 font-semibold">{user.createdAt}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Gender</label>
            <p className="text-gray-700 font-semibold capitalize">{user.gender}</p>
          </div>
 
        </div>

          {/* Managed Mosques Section (Only shows if admin) */}
        {isMosqueAdmin && (
          <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Managing Mosques</h3>
            <div className="space-y-3">
              {user.managedMosques.map((mosque) => (
                <div key={mosque.id} className="flex items-center p-3 border border-emerald-50 rounded-xl bg-emerald-50/30">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white mr-4">
                    <span className="font-bold text-lg">{mosque.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{mosque.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">Official Administrator</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;

