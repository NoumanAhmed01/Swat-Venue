// src/components/venue/VenueMediaGallery.jsx
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";

const VenueMediaGallery = ({ images = [], videos = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (fullscreenImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [fullscreenImage]);

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
      <div className="bg-white dark:bg-surface-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-surface-700">
        <div className="p-2 sm:p-4">
          <div className="relative rounded-2xl overflow-hidden group">
            <div className="relative">
              {/* Main Media Container - Cinematic Aspect Ratio on Desktop */}
              <div className="relative aspect-[16/10] sm:aspect-video lg:aspect-[21/9] w-full overflow-hidden bg-gray-100 dark:bg-surface-700 shadow-inner">
                {currentMedia.type === "image" ? (
                  <img
                    src={currentMedia.url}
                    alt={`Venue - Media ${currentIndex + 1}`}
                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-105"
                    onClick={() => setFullscreenImage(currentMedia.url)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <video
                      controls
                      className="w-full h-full object-contain"
                      poster={images?.[0]}
                    >
                      <source src={currentMedia.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                {/* Navigation Arrows - Only show on hover or mobile */}
                {allMedia.length > 1 && (
                  <>
                    <button
                      onClick={prevMedia}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-surface-800/90 dark:hover:bg-surface-800 text-primary-900 dark:text-white p-2.5 sm:p-3 rounded-full transition-all duration-300 shadow-xl opacity-0 group-hover:opacity-100 md:translate-x-[-10px] group-hover:translate-x-0 hidden md:flex items-center justify-center"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                      onClick={nextMedia}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white dark:bg-surface-800/90 dark:hover:bg-surface-800 text-primary-900 dark:text-white p-2.5 sm:p-3 rounded-full transition-all duration-300 shadow-xl opacity-0 group-hover:opacity-100 md:translate-x-[10px] group-hover:translate-x-0 hidden md:flex items-center justify-center"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Progress Bar (Always visible on all screens) */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-200/30">
                      <div
                        className="h-full bg-gold-500 transition-all duration-300"
                        style={{
                          width: `${((currentIndex + 1) / allMedia.length) * 100}%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Enhanced Thumbnails Grid */}
              {allMedia.length > 1 && (
                <div className="mt-4 px-1">
                  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {allMedia.map((media, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative flex-shrink-0 w-20 sm:w-28 lg:w-32 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 snap-start ${
                          index === currentIndex
                            ? "border-gold-500 ring-2 ring-gold-500/20 scale-[0.98]"
                            : "border-transparent hover:border-gray-300 dark:hover:border-gray-600 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {media.type === "image" ? (
                          <img
                            src={media.url}
                            alt={`Thumb ${index + 1}`}
                            className="w-full h-20 object-fill"
                          />
                        ) : (
                          <div className="w-full h-full relative bg-black">
                            {images?.[0] && (
                              <img
                                src={images[0]}
                                alt={`Video Thumb ${index + 1}`}
                                className="w-full h-full object-cover opacity-60"
                              />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-lg" />
                            </div>
                          </div>
                        )}

                        {index === currentIndex && (
                          <div className="absolute inset-0 bg-gold-500/10" />
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

      {/* Fullscreen Image Modal - FIXED VERSION */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-95"
          onClick={() => setFullscreenImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-[10000]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImage(null);
              }}
              className="text-white p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="h-10 w-10" />
            </button>
          </div>

          {/* Image Container - Fixed centering */}
          <div
            className="flex items-center justify-center w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullscreenImage}
              alt="Venue Full"
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
              style={{
                display: "block",
                margin: "auto",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VenueMediaGallery;
