import { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Globe, MapPin } from "lucide-react";
import privateAxiosInstance from "../../../auth/privateAxiosInstance";
import { useUserContext } from "../../context/UserContext";
 import { toggleMosqueFollow } from '../../util/follow.js';
import MosqueProfileSkeleton from "../../components/loadingSkeletons/MosqueProfileSkeleton.jsx";
import { uploadImageToCloudinary } from "../../util/cloudinary.js.js";

const MosqueProfile = ({ mosque }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
const {loggedInUser, followMosqueIds, setMosques} = useUserContext();
  // original image (fallback source)
  const [originalImage, setOriginalImage] = useState(null);

  const isOwner = loggedInUser?.managedMosques?.some(
    (m) => String(m.id) === String(mosque?.id)
  );
  const isFollowing = followMosqueIds?.includes(String(mosque?.id));

const [loadingProfile, setLoadingProfile] = useState(true);


useEffect(() => {
  setOriginalImage(mosque?.mosqueProfile?.image);
}, [mosque?.mosqueProfile?.image]);



useEffect(() => {
  if(mosque) {
    setLoadingProfile(false);
  }
}, [mosque]); 

// Inside HomePage component
const handleFollowMosque = async (e, mosque) => {
  e.stopPropagation();
  
  const { success, newStatus } = await toggleMosqueFollow(mosque.id);
  
  if (success) {
    setMosques(prev => prev.map(m => 
      m.id === mosque.id ? { ...m, isFollowing: newStatus } : m
    ));
  }
};

  // SELECT IMAGE
  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // CANCEL CHANGE
  const handleCancel = () => {
    setSelectedImage(null);
    setPreview(null);
  };

  // SAVE (UPLOAD)
 const handleUpload = async () => {
    if (!selectedImage) return;

    setUploading(true);

    try {
      const { imageUrl, publicId } = await uploadImageToCloudinary(selectedImage);

      const apiRes = await privateAxiosInstance.put(`/profiles/update-mosque-profile/${mosque.id}`, { 
        imageUrl, 
        publicId 
      });

      if (apiRes.status < 400) {
        const newImageUrl = imageUrl;

        // 2. Update local UI state
        setOriginalImage(newImageUrl);

        // 3. Update mosque list in context so the shared state stays in sync
        setMosques(prev => prev.map(m =>
          m.id === mosque.id
            ? { ...m, mosqueProfile: { ...m.mosqueProfile, image: newImageUrl } }
            : m
        ));
      }

      setPreview(null);
      setSelectedImage(null);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const showPending = mosque.status === 'pending' || mosque.status === 'suspended';

  if(loadingProfile){

    return (
      <MosqueProfileSkeleton />
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full md:w-[87%] mx-auto ">

      {/* IMAGE SECTION */}
      <div className="relative h-[340px] w-full group bg-gray-200">

        {/* IMAGE (preview overrides original) */}
        <img
          src={preview || originalImage}
          className="h-full w-full object-cover"
          alt="Mosque"
        />

        {/* TOP OVERLAY (only when editing) */}
        {preview && (
          <div className="absolute top-0 left-0 right-0 bg-black/60 text-white flex items-center justify-between px-4 py-3">

            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <p className="text-sm">Preview mode</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-1.5 bg-white/20 rounded-lg hover:bg-white/30"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-1.5 bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                {uploading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* CAMERA BUTTON */}
        <label className="absolute bottom-3 right-3 bg-emerald-700 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-emerald-800">
          <Camera className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSelectImage}
          />
        </label>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-4">

        {/* NAME + STATUS */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {mosque.name}
          </h2>

         <span className={`text-xs px-2 py-1 rounded-full font-medium ${
    showPending 
      ? 'bg-amber-100 text-amber-700' 
      : 'bg-emerald-100 text-emerald-700'
  }`}>
    {showPending ? 'Under Review' : 'Verified'}
  </span>
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>
            {mosque.localGovernment}, {mosque.state}, {mosque.country}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 mt-2 line-clamp-3">
          {mosque.description}
        </p>

        {/* FOOTER */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {mosque.followersCount} {mosque.followersCount > 1 ? "followers" : "follower"}
          </span>
 \

 {loggedInUser && (
        <span className="text-sm text-emerald-600 font-medium">
          {/* 3. Priority logic: If they are the Admin, show Admin, else show Following status */}
          {isOwner 
            ? <span className="bg-emerald-50 px-2 py-1 rounded-md font-bold">Admin</span> 
            : (isFollowing ? "Following" : "Not Following")
          }
        </span>
      )}
        </div>
      </div>
    </div>
  );
};

export default MosqueProfile;