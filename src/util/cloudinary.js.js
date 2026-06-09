export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      // THIS IS THE KEY: Cloudinary usually sends error details in 'data.error.message'
      throw new Error(data.error?.message || "Upload failed");
    }

    return { imageUrl: data.secure_url, publicId: data.public_id };
  } catch (error) {
    console.error("Cloudinary Utility Error:", error); // Logs actual error
    throw error; // Rethrows to be caught by handleSubmit
  }
};