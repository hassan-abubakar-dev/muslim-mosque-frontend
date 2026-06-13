import { useState, useEffect } from 'react';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';
import axios from 'axios';
import { usePreventLeave } from '../../util/usePreventLeave';

const isDev = import.meta.env.VITE_ENV === 'development';

const UploadLectureModal = ({ setShowUploadTypeModal, cat, fetchLectures, setLectures, setLectureCount }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('audio');
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [title, file, type, videoUrl]);

  useEffect(() => {
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setVideoId('');
      setThumbnailUrl('');
      return;
    }

    const idMatch = trimmed.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|shorts\/|v\/)|youtube\.com\/watch\?.*v=)([A-Za-z0-9_-]{11})/i
    );
    const directIdMatch = trimmed.match(/^[A-Za-z0-9_-]{11}$/);
    const extractedId = idMatch?.[1] || directIdMatch?.[0] || '';

    if (extractedId) {
      setVideoId(extractedId);
      setThumbnailUrl(`https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`);
    } else {
      setVideoId('');
      setThumbnailUrl('');
    }
  }, [videoUrl]);

usePreventLeave(loading);

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
    setError('');
    setSuccess('');
    setFile(null);
    setVideoUrl('');
    setVideoId('');
    setThumbnailUrl('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const getFileDuration = (file) => {
    return new Promise((resolve, reject) => {
      let media;

      if (file.type.startsWith('audio')) {
        media = new Audio();
      } else if (file.type.startsWith('video')) {
        media = document.createElement('video');
      } else {
        return resolve(0);
      }

      media.preload = 'metadata';
      media.onloadedmetadata = () => resolve(media.duration);
      media.onerror = () => reject('Cannot read file duration');
      media.src = URL.createObjectURL(file);
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  if (loading) return;

  // 1. Basic validation
  if (!title.trim()) return setError('Please provide a title for the lecture.');
  if (type === 'audio' && !file) return setError('Please select an audio file.');
  if (type === 'video' && !videoId) return setError('Please provide a YouTube ID.');

  // 2. Client-side size validation (100MB Limit)
  if (type === 'audio' && file) {
    const MAX_SIZE_MB = 100;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(0)}MB). Please upload a file under ${MAX_SIZE_MB}MB or use the YouTube option.`);
    }
  }

  setLoading(true);

  try {
    if (type === 'audio') {
      // 3. Get signed URL with original file metadata
      const res1 = await privateAxiosInstance.post(`/signed-url/generate-upload-url`, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size, 
      });

      const { uploadUrl, key } = res1.data;
      const duration = await getFileDuration(file);

      // 4. Direct Upload
    const uploadRes = await axios.put(uploadUrl, file, {
  headers: { 'Content-Type': file.type },
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setProgress(percentCompleted);
  },
});

    // 2. You can still check the status if you want to be extra safe
if (uploadRes.status !== 200) {
  throw new Error('Audio upload failed');
}

      // 5. Save metadata
      const audioRes = await privateAxiosInstance.post(`/lectures/save-metadata/${cat?.id}`, {
        title,
        type,
        key,
        duration,
        mosqueId: cat?.mosqueId,
        metadata: {
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }
      });

      setLectures(prev => [{...audioRes.data.lecture}, ...prev]);
    } else {
      // Video logic
      const videoRes = await privateAxiosInstance.post(`/lectures/save-metadata/${cat?.id}`, {
        title,
        type,
        thumbnail: thumbnailUrl,
        videoId,
        mosqueId: cat?.mosqueId,
      });
      setLectures(prev => [{...videoRes.data.lecture}, ...prev]);
    }

    setLectureCount(prev => prev + 1);
    setSuccess('Lecture saved successfully.');
    setTitle('');
    setFile(null);
    setVideoId('');
    setShowUploadTypeModal(false);


  } catch (err) {
    console.error(err);
    setError('Save failed. Please try again.');
  } finally {
    setLoading(false);
    setProgress(0);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/40" onClick={() => setShowUploadTypeModal(false)} />

      <div className="relative w-full max-w-2xl max-h-[calc(100vh-4rem)] rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 flex flex-col">
        <div className="flex-shrink-0 flex flex-col gap-5 border-b border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Upload Lecture</h2>
              <p className="text-sm text-slate-500 mt-1">
                Select audio for local upload, or choose video to save a YouTube link.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {setShowUploadTypeModal(false); setFile(null)}}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>

        <form className="flex-1 overflow-y-auto flex flex-col gap-5 p-6" onSubmit={handleSubmit}>
            {error && <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{success}</div>}

    {loading && type === 'audio' && (
  <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
    <div 
      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300" 
      style={{ width: `${progress}%` }}
    />
    <p className="text-xs text-slate-500 mt-1">Uploading: {progress}%</p>
  </div>
)}
 
            <label className="grid gap-2 text-sm text-slate-700">
              <span className="font-medium">Lecture Title</span>
              <input
              disabled={loading}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lecture title"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-300 focus:bg-white"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              {['audio', 'video'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleTypeChange(option)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    type === option
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-sm font-semibold capitalize">{option}</span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    {option === 'audio'
                      ? 'Upload local audio file'
                      : 'Save a YouTube lecture link'}
                  </span>
                </button>
              ))}
            </div>

            {type === 'audio' ? (
              <label className="grid gap-2 text-sm text-slate-700">
                <span className="font-medium">Audio File</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                />
              </label>
            ) : (
              <div className="grid gap-4">
                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-5 shadow-sm">
                  <p className="text-sm text-emerald-700 font-semibold">Admin Instructions</p>
                  <p className="mt-2 text-sm text-slate-700 leading-6">
                    💡 How to get a valid link: Open YouTube ➔ Find your Lecture ➔ Click 'Share' ➔ Copy the link ➔ Paste it below.
                  </p>
                </div>

                <label className="grid gap-2 text-sm text-slate-700">
                  <span className="font-medium">YouTube Lecture Link</span>
                  <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube URL or video ID"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-emerald-300 focus:bg-white"
                  />
                </label>

                {thumbnailUrl ? (
                  <div className="grid gap-3 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4 sm:grid-cols-[120px_1fr] items-center">
                    <img
                      src={thumbnailUrl}
                      alt="Lecture thumbnail"
                      className="h-28 w-full rounded-2xl object-cover shadow-sm"
                    />
                    <div className="space-y-2">
                      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-800">
                        Video ID: {videoId}
                      </span>
                      <p className="text-sm text-slate-700">
                        Valid YouTube ID detected. The preview is generated instantly from YouTube’s thumbnail service.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Paste a YouTube watch link, shorts link, embed link, or raw video ID.</p>
                )}
              </div>
            )}

            <div className="flex-shrink-0 flex flex-col gap-3 sm:flex-row sm:justify-end border-t border-slate-200 p-6 mt-auto -mx-6 -mb-6">
              <button
                type="button"
                onClick={() => {setShowUploadTypeModal(false); setFile(null)}}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (type === 'video' ? !videoId : !file)}
                className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-emerald-800"
              >
                {loading ? 'Saving...' : type === 'video' ? 'Save Video Link' : 'Upload Audio'}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UploadLectureModal;
