import { useState, useEffect } from 'react';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';

const UploadLectureModal = ({ setShowUploadTypeModal, cat, fetchLectures, setLectures }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('audio');
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  console.log('mosqueid', cat.mosqueId);

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

  useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (loading) {
      e.preventDefault();
      e.returnValue = "Upload in progress. Are you sure you want to leave?";
    }
  };
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [loading]);

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

    if (!title.trim()) {
      setError('Please provide a title for the lecture.');
      return;
    }

    if (type === 'audio' && !file) {
      setError('Please select an audio file to upload.');
      return;
    }

    if (type === 'video' && !videoId) {
      setError('Please paste a valid YouTube link or video ID.');
      return;
    }

    setLoading(true);

    try {
      if (type === 'audio') {
        const res1 = await privateAxiosInstance.post(`/signed-url/generate-upload-url`, {
          fileName: file.name,
          fileType: file.type,
        });

        const { uploadUrl, key } = res1.data;
        const duration = await getFileDuration(file);

        const uploadRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) {
          setError('Audio upload failed. Please try again.');
          return;
        }

       const audioRes = await privateAxiosInstance.post(`/lectures/save-metadata/${cat?.id}`, {
          title,
          type,
          key,
          duration,
          mosqueId: cat?.mosqueId,
        });

        setLectures(prev=> [{...audioRes.data.lecture}, ...prev])
      } else {
       const videoRes = await privateAxiosInstance.post(`/lectures/save-metadata/${cat?.id}`, {
          title,
          type,
          thumbnail: thumbnailUrl,
          videoId,
          mosqueId: cat?.mosqueId,
        });
        console.log(videoRes)

        setLectures(prev=> [ {...videoRes.data.lecture}, ...prev])
      }

      setSuccess('Lecture saved successfully.');
      setTitle('');
      setFile(null);
      setVideoUrl('');
      setVideoId('');
      setThumbnailUrl('');
      console.log('Lecture metadata saved successfully');
      setShowUploadTypeModal(false);
      // fetchLectures(); // Refresh the lectures list

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Save failed. Please try again.');
    } finally {
      setLoading(false);
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
              onClick={() => setShowUploadTypeModal(false)}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>

        <form className="flex-1 overflow-y-auto flex flex-col gap-5 p-6" onSubmit={handleSubmit}>
            {error && <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{success}</div>}

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
                onClick={() => setShowUploadTypeModal(false)}
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
