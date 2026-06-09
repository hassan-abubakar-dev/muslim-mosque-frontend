
import privateAxiosInstance from '../../auth/privateAxiosInstance.js';

const isDev = import.meta.env.VITE_ENV === 'development';

const handleBookmarkClick = async (lectureId, lastPosition = 0) => { 
    const body = {
        lastPosition
    };
  try {
    // Implementation for bookmarking lecture
    const res = await privateAxiosInstance.post(`/bookmarks/toggle/${lectureId}`, body);
    if (isDev) {
      console.log('Bookmark response:', res.data);
    }
  } catch(err){
    if (isDev) {
      console.error(err.response?.data || err.message);
    }
  }
};

export default handleBookmarkClick;