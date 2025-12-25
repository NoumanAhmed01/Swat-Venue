// src/components/venue/VenueMediaGallery.jsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

const VenueMediaGallery = ({ images = [], videos = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const allMedia = [
    ...images.map((url) => ({ type: "image", url })),
    ...videos.map((url) => ({ type: "video", url })),
  ];

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const currentMedia = allMedia[currentIndex];

  return (
    <>
      <div className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="relative">
              <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100 dark:bg-surface-700">
                {currentMedia.type === "image" ? (
                  <img
                    src={currentMedia.url}
                    alt={`Venue - Media ${currentIndex + 1}`}
                    className="w-full h-64 md:h-80 lg:h-96 object-center cursor-pointer"
                    onClick={() => setFullscreenImage(currentMedia.url)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <video
                      controls
                      className="w-full h-64 md:h-80 lg:h-96 object-contain"
                      poster={images?.[0]}
                    >
                      <source src={currentMedia.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {allMedia.length > 1 && (
                  <>
                    <button
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                    >
                      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    <button
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                    >
                      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {allMedia.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentIndex(index)}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                            index === currentIndex
                              ? "bg-white scale-125"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {allMedia.length > 1 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {allMedia.slice(0, 4).map((media, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === currentIndex
                            ? "border-gold-500 ring-2 ring-gold-500/20"
                            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            alt={`Media ${index + 1}`}
                            className="w-full h-20 object-cover"
                          />
                        ) : (
                          <div className="w-full h-full relative bg-black">
                            {images?.[0] && (
                              <img
                                src={images[0]}
                                alt={`Video ${index + 1}`}
                                className="w-full h-full object-cover opacity-60"
                              />
                            )}
                            <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white absolute inset-0 m-auto" />
                          </div>
                        )}

                        {index === 3 && allMedia.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm sm:text-base">
                              +{allMedia.length - 4}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenImage(null);
            }}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={fullscreenImage}
            alt="Fullscreen view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default VenueMediaGallery;
