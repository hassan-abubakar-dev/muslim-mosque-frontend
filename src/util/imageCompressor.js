import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.5,        // Target size: 500KB (Perfect for profile pics)
    maxWidthOrHeight: 800, // we Keeps it a reasonable resolution
    useWebWorker: true,    // Offloads the heavy work from the main thread
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Compression failed:", error);
    throw error;
  }
};