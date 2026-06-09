import { useState, useEffect } from 'react';
import privateAxiosInstance from '../../../auth/privateAxiosInstance';

const DeleteUserModal = ({ isOpen, onClose, userEmail }) => {
  const [typedEmail, setTypedEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirmDelete = async () => {
    if (typedEmail !== userEmail) return;
    
    setIsDeleting(true);
    try {
     const res = await privateAxiosInstance.delete('/users/delete-account');

  
      // Cleanup: Remove auth tokens
      localStorage.removeItem('accessToken');
      
      // Redirect to home/login
      window.location.href = '/'; 
    } catch (err) {
      console.error("Deletion failed:", err);
      setIsDeleting(false);
    }
  };

  const cancel = () => {
    setTypedEmail('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white p-6 rounded-2xl max-w-sm w-full">
        <h3 className="text-lg font-bold text-red-600 mb-2">Delete Account?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Type your email <strong>{userEmail}</strong> to confirm you want to delete your account permanently.
        </p>
        
        <input 
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter your email"
        />

        <div className="flex gap-2">
          <button onClick={cancel} className="flex-1 bg-gray-100 py-2 rounded font-bold">Cancel</button>
          <button 
            disabled={typedEmail !== userEmail || isDeleting}
            onClick={handleConfirmDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded font-bold disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;