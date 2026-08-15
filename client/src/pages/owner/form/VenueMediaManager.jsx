// src/components/venue/VenueMediaManager.jsx
import React from "react";
import { Camera, Video, Plus, X } from "lucide-react";

const VenueMediaManager = ({
  existingImages = [],
  existingVideos = [],
  newImageFiles = [],
  newVideoFiles = [],
  deletedImages = [],
  deletedVideos = [],
  imagesOrder = [],
  onMakeCover,
  onRemoveExistingImage,
  onRemoveExistingVideo,
  onRemoveNewImage,
  onRemoveNewVideo,
  onAddNewImages,
  onAddNewVideos,
}) => {
  return (
    <>
      {/* Images Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Venue Images
        </label>

        {imagesOrder.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {imagesOrder.map((item, index) => {
              const isNew = item.startsWith("new_");
              if (isNew) {
                const fileIndex = parseInt(item.split("_")[1], 10);
                const file = newImageFiles[fileIndex];
                if (!file) return null;
                return (
                  <div key={item} className="relative group rounded-lg overflow-hidden border-2 border-gold-500">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New Preview`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveNewImage(fileIndex)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute top-1 left-1 bg-gold-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold z-10">
                      New
                    </span>
                    {index === 0 ? (
                      <span className="absolute bottom-1.5 left-1.5 bg-gold-600 text-white text-xs px-2 py-0.5 rounded shadow font-semibold z-10">
                        ★ Display Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onMakeCover(item)}
                        className="absolute bottom-1.5 left-1.5 bg-black/60 hover:bg-gold-600 text-white text-xs px-2 py-0.5 rounded shadow font-medium transition-colors z-10"
                      >
                        Set Cover
                      </button>
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={item} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={item}
                      alt={`Existing`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveExistingImage(item)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {index === 0 ? (
                      <span className="absolute bottom-1.5 left-1.5 bg-gold-600 text-white text-xs px-2 py-0.5 rounded shadow font-semibold z-10">
                        ★ Display Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onMakeCover(item)}
                        className="absolute bottom-1.5 left-1.5 bg-black/60 hover:bg-gold-600 text-white text-xs px-2 py-0.5 rounded shadow font-medium transition-colors z-10"
                      >
                        Set Cover
                      </button>
                    )}
                  </div>
                );
              }
            })}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const totalImages =
                  existingImages.length -
                  deletedImages.length +
                  newImageFiles.length +
                  files.length;

                if (totalImages > 10) {
                  toast.error("Maximum 10 images allowed");
                  return;
                }
                onAddNewImages(files);
              }}
              className="hidden"
              id="new-image-upload"
            />
            <label
              htmlFor="new-image-upload"
              className="inline-flex items-center space-x-2 bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add More Images</span>
            </label>
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Venue Videos
        </label>

        {existingVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {existingVideos.map((videoUrl, index) => (
              <div key={index} className="relative">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-32 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onRemoveExistingVideo(videoUrl)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {newVideoFiles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {newVideoFiles.map((file, index) => (
              <div key={index} className="relative">
                <video
                  src={URL.createObjectURL(file)}
                  controls
                  className="w-full h-32 rounded-lg border-2 border-gold-500"
                />
                <button
                  type="button"
                  onClick={() => onRemoveNewVideo(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="absolute bottom-1 left-1 bg-gold-500 text-white text-xs px-2 py-1 rounded">
                  New
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
          <div className="text-center">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                const totalVideos =
                  existingVideos.length -
                  deletedVideos.length +
                  newVideoFiles.length +
                  files.length;

                if (totalVideos > 2) {
                  toast.error("Maximum 2 videos allowed");
                  return;
                }
                onAddNewVideos(files);
              }}
              className="hidden"
              id="new-video-upload"
            />
            <label
              htmlFor="new-video-upload"
              className="inline-flex items-center space-x-2 bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add More Videos</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default VenueMediaManager;
