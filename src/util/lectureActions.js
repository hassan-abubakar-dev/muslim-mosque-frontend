import privateAxiosInstance from "../../auth/privateAxiosInstance.js";

const isDev = import.meta.env.VITE_ENV === 'development';

export const lectureUtils = {
  
  // 1. Unified Bookmark Logic
  toggleBookmark: async (lectureId, lastPosition = 0) => {
    
    try {
      const res = await privateAxiosInstance.post(`/bookmarks/toggle/${lectureId}`, { lastPosition });
      // if (isDev) {
      //   console.log("Saving bookmark for lecture:", lectureId, "at position:", lastPosition);
      // }
   
      return res.data;
    } catch (err) {
      if (isDev) {
        console.error("Bookmark API error:", err.response?.data || err);
      }
      throw err;
    }
  },

  // 2. Unified Library Toggle Logic
  toggleVideoLibrary: async (lectureId) => {
    try {
      const res = await privateAxiosInstance.post(`/video-library/toggle-save/${lectureId}`);
      return res.data; // { status: 'success', isSaved: true/false }
    } catch (err) {
      if (isDev) {
        console.error("Library API error:", err.response?.data || err);
      }
      throw err;
    }
  },

  // --- UI/State Helpers ---

  updateBookmarkState: (lectureId, lastPosition, setLectures, setAudioModalLecture) => {
    setLectures(prev => prev.map(l => 
      l.id === lectureId 
        ? { ...l, bookmarks: l.bookmarks?.length > 0 ? [] : [{ id: 'temp-id', lectureId, lastPosition }] } 
        : l
    ));

    if (setAudioModalLecture) {
      setAudioModalLecture(prev => prev && prev.id === lectureId 
        ? { ...prev, bookmarks: prev.bookmarks?.length > 0 ? [] : [{ id: 'temp-id', lectureId, lastPosition }] } 
        : prev
      );
    }
  },

handleDownload: (lecture, setVideoForLibrary) => {
    if (lecture.type === 'video') {
      if (typeof setVideoForLibrary === 'function') {
        setVideoForLibrary(lecture);
      }
    } else if (lecture.url) {
      const link = document.createElement('a');
      link.href = lecture.url;
      link.setAttribute('download', `${lecture.title}.mp3`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  


confirmLibrarySave: async (videoForLibrary, updateStateCallback, setIsLibraryMutating, setVideoForLibrary) => {
  if (!videoForLibrary) return;
  setIsLibraryMutating(true);
  try {
    const data = await lectureUtils.toggleVideoLibrary(videoForLibrary.id);
    if (data.status === 'success') {
      // It executes the specific instructions passed by the page
      updateStateCallback(data.isSaved);
    }
    setVideoForLibrary(null);
  } catch (err) {
    if(isDev){
      console.error("Library save error:", err?.response?.data || err);
    }
  } finally {
    setIsLibraryMutating(false);
  }
}
};