
import privateAxiosInstance from '../../auth/privateAxiosInstance.js';

const handleBookmarkClick = async (lectureId, lastPosition = 0) => { 
    const body = {
        lastPosition: lastPosition ? lastPosition : 0
    };
  try {
    // Implementation for bookmarking lecture
    const res = await privateAxiosInstance.post(`/bookmarks/toggle/${lectureId}`, body);
    console.log('Bookmark response:', res.data);
  } catch(err){
    console.error(err.response?.data || err.message);
  }
};

export default handleBookmarkClick;