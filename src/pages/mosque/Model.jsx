import { useState } from "react";
import privateAxiosInstance from "../../../auth/privateAxiosInstance";
import { uploadImageToCloudinary } from "../../util/cloudinary.js";


const Model = ({ newCategory, setNewCategory, setShowModal, isEdit, initialCategory, setError, activeMosque, fetchAllCategories }) => {

    const isDev = import.meta.env.VITE_ENV === 'development'

    const [loading, setLoading] = useState(false);
    const [createCategoryError, setCreateCategoryError] = useState('');

    const validate = () => {
    // 1. Determine the name to check
    const nameToCheck = newCategory?.name === "Other" ? newCategory?.customName : newCategory?.name;

    // 2. Check for required fields
    if (!nameToCheck || nameToCheck.trim() === "") {
        setCreateCategoryError("Category name is required.");
        return false;
    }
    if (!newCategory?.teacherName || newCategory?.teacherName.trim() === "") {
        setCreateCategoryError("Teacher name is required.");
        return false;
    }
    
    // Clear error if validation passes
    setCreateCategoryError("");
    return true;
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => {
        const updated = { ...prev, [name]: value };
        // If they change the dropdown to something other than "Other", clear customName
        if (name === "name" && value !== "Other") {
            delete updated.customName;
        }
        return updated;
    });
};

    const [uploadedFile, setUploadedFile] = useState(null);

   

const handleCreateCategory = async () => {
  if (!validate()) return;
  setLoading(true);
  setCreateCategoryError(""); // Clear previous errors

  const finalName = newCategory?.name === "Other" ? newCategory?.customName : newCategory?.name;

  try {
    // 1. Define variables in scope
    let imageUrl = null;
    let publicId = null;
     let compressedFile = null;

    // 2. Upload to Cloudinary if a file exists
    if (uploadedFile) {
      compressedFile = await compressImage(uploadedFile);
      const result = await uploadImageToCloudinary(compressedFile);
      imageUrl = result.imageUrl;
      publicId = result.publicId;
      if (isDev) {
        console.log('publicId, imageUrl', publicId, imageUrl);
      }
    }

    // 3. Prepare body with Cloudinary data
    const body = {
      name: finalName,
      teacherName: newCategory?.teacherName,
      information: newCategory?.information,
      // Map to your new fields
      ...(imageUrl ? { imageUrl, publicId,  
        metadata: {
        size: compressedFile.size, // In bytes
        type: compressedFile.type, // e.g., 'image/webp'
        lastModified: compressedFile.lastModified
    } } : {}),
    };

    // 4. Send to backend
    const res = await privateAxiosInstance.post(
      `/categories/create-category/${activeMosque.id}`,
      body
    );

    // 5. Success Handling
    if (res.status < 400) {

      setShowModal(false);
      setNewCategory(initialCategory);
      setUploadedFile(null); // Don't forget to clear this!
      await fetchAllCategories(activeMosque.id);
    }

  } catch (err) {
    // Keep your specific error handling logic
    if (isDev) {
      console.log(err?.response?.data || err);
    }
    if (err.response?.data?.message === "Teacher name is required") {
      setCreateCategoryError("Teacher name is required");
    } else if (err.response?.data?.message === "Category with this name and teacher already exists") {
      setCreateCategoryError("Category with this name and teacher already exists");
    } else {
      setShowModal(false);
      setError(true);
    }
    if (isDev) {
      console.error(err.response?.data || err.message);
    }
  } finally {
    setLoading(false);
  }
};

const handleUpdateCategory = async () => {
  if (!validate()) return;
  setLoading(true);

  const finalName = newCategory?.name === "Other" ? newCategory?.customName : newCategory?.name;

  try {
    // 1. Prepare values to be sent to backend
    let imageUrl = newCategory?.imageUrl || null; // Keep existing if no new one
    let publicId = newCategory?.publicId || null;
    let compressedFile = null;
    let metadata = null;

    // 2. Upload to Cloudinary ONLY if user selected a new image
    if (uploadedFile) {
      compressedFile = await compressImage(uploadedFile);
      const result = await uploadImageToCloudinary(compressedFile);
      imageUrl = result.imageUrl;
      publicId = result.publicId;
       metadata = {
        size: compressedFile.size, // In bytes
        type: compressedFile.type, // e.g., 'image/webp'
        lastModified: compressedFile.lastModified
    }
    }

    // 3. Send updated data to backend
    const res = await privateAxiosInstance.put(
      `/categories/update-category/${newCategory.id}`,
      {
        name: finalName,
        teacherName: newCategory?.teacherName,
        information: newCategory?.information,
        imageUrl,    // Sending the new or existing URL
        publicId,    // Sending the new or existing publicId
        metadata
      }
    );

    // 4. Success handling
    if (res.status < 400) {
      
      setNewCategory(initialCategory);
      setShowModal(false);
      setUploadedFile(null);
      await fetchAllCategories(activeMosque.id);
     
    }
  } catch (err) {
     if (isDev) {
       console.log(err.response.data || err);
     }
    setLoading(false);
    if (isDev) console.log(err.response?.data || err.message);

    if (err.response?.data?.message === "Category with this name and teacher already exists") {
      setCreateCategoryError("Category with this name and teacher already exists");
    } else {
      setError(true);
    }
  } finally {
    setLoading(false);
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
                        value={newCategory?.name}
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
                {newCategory?.name === "Other" && (
                    <label className="block mb-2">
                        <span className="text-gray-700 text-sm">Custom Category Name *</span>
                        <input
                            type="text"
                            name="customName"
                            value={newCategory?.customName || ""}
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
                        value={newCategory?.information ? newCategory?.information : ''}
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
                        value={newCategory?.teacherName || ""}
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
                            onClick={() => handleCreateCategory(activeMosque.id)}
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