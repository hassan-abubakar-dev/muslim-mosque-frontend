import { useEffect } from 'react';

export const usePreventLeave = (isUploading) => {
  useEffect(() => {
    if (!isUploading) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Upload in progress. Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isUploading]);
};