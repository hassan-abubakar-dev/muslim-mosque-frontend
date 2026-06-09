import privateAxiosInstance from '../../auth/privateAxiosInstance.js';

const isDev = import.meta.env.VITE_ENV === 'development';

/**
 * Reusable utility to toggle a video inside the user's online library
 * @param {string|number} lectureId 
 */
const handleVideoLibraryToggle = async (lectureId) => {
  try {
    const res = await privateAxiosInstance.post(`/video-library/toggle-save/${lectureId}`);
    return res.data; // Returns { status: 'success', isSaved: true/false }
  } catch (err) {
    if (isDev) {
      console.error("Utility Error toggling video library status:", err.response?.data || err.message);
    }
    throw err;
  }
};

export default handleVideoLibraryToggle;