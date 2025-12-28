// src/pages/owner/forms/VenueStep2.jsx
import React from "react";
import { Camera, Video, Plus, X } from "lucide-react";

const amenitiesList = [
  "AC",
  "Parking",
  "Catering",
  "Sound System",
  "Stage",
  "WiFi",
  "Garden",
  "Pool",
  "Bridal Suite",
  "VIP Lounge",
  "Valet Parking",
  "Photography Area",
  "Dance Floor",
  "Bar",
  "Kitchen",
  "Security",
];

const VenueStep2 = ({
  register,
  errors,
  selectedAmenities,
  handleAmenityToggle,
  imageFiles,
  setImageFiles,
  videoFiles,
  setVideoFiles,
}) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + videoFiles.length > 2) {
      toast.error("Maximum 2 videos allowed");
      return;
    }
    setVideoFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Camera className="h-5 w-5" />
        Images, Videos & Amenities
      </h2>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Venue Images (Max 10)
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Upload high-quality images of your venue
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center space-x-2 bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Choose Images</span>
            </label>
          </div>
        </div>

        {/* Image Preview */}
        {imageFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Venue Videos (Max 2)
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Upload short videos showing your venue highlights
            </p>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="inline-flex items-center space-x-2 bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Choose Videos</span>
            </label>
          </div>
        </div>

        {/* Video Preview */}
        {videoFiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {videoFiles.map((file, index) => (
              <div key={index} className="relative">
                <video
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-full h-32 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amenities *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded border-gray-300 text-gold-600 focus:ring-gold-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {amenity}
              </span>
            </label>
          ))}
        </div>
        {errors.amenities && (
          <p className="text-red-500 text-sm mt-1">
            {errors.amenities.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VenueStep2;
