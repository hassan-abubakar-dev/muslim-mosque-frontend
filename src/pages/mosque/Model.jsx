import { useState } from "react";
import privateAxiosInstance from "../../../auth/privateAxiosInstance";


const Model = ({ newCategory, setNewCategory, setShowModal, isEdit, initialCategory, setError, mosqueFromState }) => {

    const isDev = import.meta.env.VITE_ENV === 'development'

    const [loading, setLoading] = useState(false);
    const [createCategoryError, setCreateCategoryError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCategory((prev) => ({ ...prev, [name]: value }));
    };

    const [uploadedFile, setUploadedFile] = useState(null);

    const handleCreateCategory = async () => {
  setLoading(true);

  try {
    let fileKey = null;


    if (uploadedFile) {
      const res1 = await privateAxiosInstance.post(
        `/signed-url/generate-upload-url`,
        {
          fileName: uploadedFile.name,
          fileType: uploadedFile.type,
        }
      );

      const { uploadUrl, key } = res1.data;

      // 🔹 STEP 2: Upload directly to R2
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": uploadedFile.type,
        },
        body: uploadedFile,
      });

      fileKey = key; // 🔥 important
    }

    // 🔹 STEP 3: Send data to backend
    const body = {
      name: newCategory.name,
      teacherName: newCategory.teacherName,
      information: newCategory.information,
      fileKey, // will be null if no image
    };

    const res = await privateAxiosInstance.post(
      `/categories/create-category/${mosqueFromState.id}`,
      body
    );

    // success
    if (res.status < 400) {
      setShowModal(false);
      setCreateCategoryError("");
      setNewCategory(initialCategory);
    }

  } catch (err) {
    if (err.response?.data?.message === "Teacher name is required") {
      setCreateCategoryError("Teacher name is required");
    } else if (
      err.response?.data?.message ===
      "Category with this name and teacher already exists"
    ) {
      setCreateCategoryError(
        "Category with this name and teacher already exists"
      );
    } else {
      setShowModal(false);
      setError(true);
    }

    console.error(err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};

   const handleUpdateCategory = async () => {
  setLoading(true);

  try {
    let fileKey = null;

    // 🔥 STEP 1: upload to R2 IF user selected new image
    if (uploadedFile) {
      const res1 = await privateAxiosInstance.post(
        `/signed-url/generate-upload-url`,
        {
          fileName: uploadedFile.name,
          fileType: uploadedFile.type,
        }
      );

      const { uploadUrl, key } = res1.data;

      // upload file directly to R2
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": uploadedFile.type,
        },
        body: uploadedFile,
      });

      fileKey = key; // 🔥 this is what backend needs
    }

    // 🔥 STEP 2: send data to backend (NO formData anymore)
    const res = await privateAxiosInstance.put(
      `/categories/update-category/${newCategory.id}`,
      {
        name: newCategory.name,
        teacherName: newCategory.teacherName,
        information: newCategory.information,
        fileKey // null if no new image
      }
    );

    if (res.status < 400) {
      setNewCategory(initialCategory);
      setShowModal(false);
      setLoading(false);

      if (isDev) console.log(res.data);
    }

  } catch (err) {
    setLoading(false);

    if (isDev) {
      console.log(err.response?.data || err.message);
    }

    if (
      err.response?.data?.message ===
      "Category with this name and teacher already exists"
    ) {
      setCreateCategoryError(
        "Category with this name and teacher already exists"
      );
    } else {
      setError(true);
    }
  }
};

    const cancel = () => {
        setShowModal(false);
        setNewCategory(initialCategory);
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
                <h2 className="text-xl font-semibold text-emerald-800 mb-4">Create Category</h2>
                {createCategoryError && <div className="text-sm text-red-600">{createCategoryError}</div>}
                {/* Category Name */}
                <label className="block mb-2">
                    <span className="text-gray-700 text-sm">Category Name *</span>
                    <select
                        name="name"
                        required
                        value={newCategory.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    >
                        <option value="Quran">Quran</option>
                        <option value="Hadith">Hadith</option>
                        <option value="Tafseer">Tafseer</option>
                        <option value="Fiqh">Fiqh</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                {/* Show input if "Other" selected */}
                {newCategory.name === "Other" && (
                    <label className="block mb-2">
                        <span className="text-gray-700 text-sm">Custom Category Name *</span>
                        <input
                            type="text"
                            name="customName"
                            value={newCategory.customName || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                            placeholder="Enter category name"
                        />
                    </label>
                )}

                {/* Category Info */}
                <label className="block mb-2">
                    <span className="text-gray-700 text-sm">Category Info</span>
                    <textarea
                        name="information"
                        value={newCategory.information ? newCategory.information : ''}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        placeholder="Enter category description"
                    />
                </label>

                {/* Teacher Name */}
                <label className="block mb-2">
                    <span className="text-gray-700 text-sm">Teacher Name</span>
                    <input
                        type="text"
                        name="teacherName"
                        required
                        value={newCategory.teacherName || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        placeholder="Enter teacher name"
                    />
                </label>

                {/* Teacher Image Upload */}
                <label className="block mb-4">
                    <span className="text-gray-700 text-sm">Teacher Image</span>
                    <input
                        type="file"
                        name="teacherImage"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setNewCategory((prev) => ({ ...prev, teacherImage: file }));
                            setUploadedFile(file);
                        }}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md
                     file:border-0 file:text-sm file:font-semibold
                     file:bg-emerald-700 file:text-white hover:file:bg-emerald-800"
                    />
                </label>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                    <button
                        onClick={cancel}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    {!isEdit && (
                        <button
                            onClick={() => handleCreateCategory(mosqueFromState.id)}
                            disabled={loading}
                            className="px-4 py-2 bg-emerald-700 text-white rounded-md cursor-pointer hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    )}
                    {isEdit && (
                        <button
                            onClick={handleUpdateCategory}
                            disabled={loading}
                            className="px-4 py-2 bg-emerald-700 text-white rounded-md cursor-pointer hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Model;