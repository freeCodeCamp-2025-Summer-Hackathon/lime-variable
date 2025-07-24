import React, { useState, useEffect } from 'react';

const PhotoUploadModal = ({ onClose, onSubmit, taskId }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedPhoto(imageUrl);
    }
  };

  const handleAddPhoto = () => {
    if (selectedPhoto && onSubmit) {
      onSubmit(taskId, selectedPhoto);
    }
  };

  const handleClose = () => {
    setSelectedPhoto(null);
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      if (selectedPhoto) {
        URL.revokeObjectURL(selectedPhoto);
      }
    };
  }, [selectedPhoto]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Proof Photo
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Take a photo to show you've completed the task!
        </p>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {selectedPhoto && (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedPhoto}
              alt="Selected proof"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={handleAddPhoto}
            disabled={!selectedPhoto}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
          >
            📷 Add Photo
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors  cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadModal;
