import { useState, useEffect } from 'react';
import { X, PhoneOutgoing, Send } from 'lucide-react';
import privateAxiosInstance from '../../../auth/privateAxiosInstance.js'

const CreateAnnouncementModal = ({ isOpen, onClose, mosqueFromState, onCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setContent('');
      setImageFile(null);
      setPreviewUrl(null);
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const uploadImageToCloudinary = async () => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error?.message || 'Cloudinary upload failed');
    }

    return await response.json();
  };

  const handleSubmit = async () => {
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = null;
      let imagePublicId = null;

      if (imageFile) {
        const uploadResult = await uploadImageToCloudinary();
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }

      const body = {
        title: title.trim(),
        content: content.trim(),
        ...(imageUrl ? { imageUrl, imagePublicId } : {}),
      };

      // Update this endpoint as needed in your API
      const url = mosqueFromState
        ? `/announcements/create-announcement/${mosqueFromState.id}`
        : '/announcements/create-announcement';

      const res = await privateAxiosInstance.post(url, body);

      if (res.status >= 400) {
        throw new Error(res.data?.message || 'Unable to create announcement');
      }

      setTitle('');
      setContent('');
      setImageFile(null);
      setPreviewUrl(null);
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Create announcement failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-800">Create Announcement</h2>
            <p className="mt-1 text-sm text-gray-500">Add title, message, and optional image for this mosque.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4 pb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="Write the announcement details here..."
                className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image (optional)</label>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <PhoneOutgoing className="text-emerald-600" />
                <span className="text-sm text-gray-600">Upload an image if you want to attach one.</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-3 w-full text-sm text-gray-600"
              />
              {previewUrl && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200">
                  <img src={previewUrl} alt="Preview" className="h-56 w-full object-cover" />
                </div>
              )}
            </div>

            {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex flex-col gap-3 border-t border-gray-200 p-6 pt-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Create Announcement'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
