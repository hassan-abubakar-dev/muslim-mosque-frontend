import { useState, useEffect } from 'react';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';

const UploadLactureModel = ({ setShowUploadTypeModal, cat}) => {
  const [title, setTitle] = useState('');
  // teacherName removed as per request
  const [type, setType] = useState('audio');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  useEffect(() => {
    setError('');
    setSuccess('');
  }, [title, file, type]);

  /**
 * Get duration of an audio or video file in seconds
 * @param {File} file - the selected audio/video file
 * @returns {Promise<number>} - duration in seconds
 */
const getFileDuration = (file) => {
  return new Promise((resolve, reject) => {
    let media;

    if (file.type.startsWith("audio")) {
      media = new Audio();
    } else if (file.type.startsWith("video")) {
      media = document.createElement("video");
    } else {
      return resolve(0); // unknown type
    }

    media.preload = "metadata";

    media.onloadedmetadata = () => {
      resolve(media.duration); // duration in seconds
    };

    media.onerror = () => reject("Cannot read file duration");

    // Create object URL to load file locally in browser
    media.src = URL.createObjectURL(file);
  });
};

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (!title.trim()) {
    setError('Please provide a title for the lecture.');
    return;
  }

  if (!file) {
    setError('Please select a file to upload.');
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Send file info to backend to get signed PUT URL
    const res1 = await privateAxiosInstance.post(`/lectures/generate-upload-url/${cat?.id}`, {
      fileName: file.name,
      fileType: file.type,
      type
    });

    const { uploadUrl, key } = res1.data;
        const duration = await getFileDuration(file);

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });

    // 3️⃣ Save lecture metadata in backend
    const res2 = await privateAxiosInstance.post(`/lectures/save-metadata/${cat?.id}`, {
      title,
      type,
      key,
      duration
    });

    if(res2.status < 400){
      console.log(res2, 'save metadata res');
    }

    setLoading(false);
    setSuccess('Lecture uploaded successfully.');

  } catch (err) {
    console.error(err.response || err, 'Upload error');
    setLoading(false);
    setError('Upload failed. Try again.');
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => setShowUploadTypeModal(false)} />

      <div className="relative w-full max-w-lg bg-white rounded-lg p-6 mx-4">
        <h2 className="text-lg font-semibold text-gray-800">Upload Lecture</h2>
        <p className="text-sm text-gray-600 mt-1">Provide a title and select a {type} file to upload.</p>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-emerald-700">{success}</div>}

          <label className="block">
            <span className="text-sm text-gray-700">Title *</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lecture title" className="mt-1 w-full px-3 py-2 border rounded-md outline-none" />
          </label>


          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input type="radio" checked={type === 'audio'} onChange={() => setType('audio')} />
              <span className="text-sm">Audio</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={type === 'video'} onChange={() => setType('video')} />
              <span className="text-sm">Video</span>
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-gray-700">Select {type} file *</span>
            <input type="file" accept={type + "/*"} onChange={handleFileChange} className="mt-1 block w-full" />
          </label>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowUploadTypeModal(false)} className="px-4 py-2 rounded-md bg-gray-100">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-emerald-700 text-white disabled:opacity-60">
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadLactureModel;
