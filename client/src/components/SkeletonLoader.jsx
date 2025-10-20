import React from "react";

// Base SkeletonLoader component
const SkeletonLoader = ({
  className = "",
  variant = "rectangular",
  width = "w-full",
  height = "h-4",
  lines = 1,
}) => {
  const baseClasses =
    "animate-pulse bg-gray-200 dark:bg-surface-700 relative overflow-hidden";

  const shimmerClasses = `
    before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer 
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
  `;

  const getVariantClasses = () => {
    switch (variant) {
      case "text":
        return "rounded";
      case "circular":
        return "rounded-full";
      case "card":
        return "rounded-xl";
      default:
        return "rounded-lg";
    }
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${shimmerClasses} ${getVariantClasses()} ${height} ${
              index === lines - 1 ? "w-3/4" : width
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${shimmerClasses} ${getVariantClasses()} ${width} ${height} ${className}`}
    />
  );
};

// Pre-built skeletons
export const VenueCardSkeleton = () => (
  <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden">
    <SkeletonLoader variant="rectangular" height="h-48" />
    <div className="p-6 space-y-4">
      <SkeletonLoader variant="text" height="h-6" width="w-3/4" />
      <SkeletonLoader variant="text" height="h-4" width="w-1/2" />
      <div className="flex justify-between items-center">
        <SkeletonLoader variant="text" height="h-4" width="w-1/3" />
        <SkeletonLoader variant="text" height="h-4" width="w-1/4" />
      </div>
      <div className="flex gap-2">
        <SkeletonLoader variant="rectangular" height="h-6" width="w-16" />
        <SkeletonLoader variant="rectangular" height="h-6" width="w-20" />
        <SkeletonLoader variant="rectangular" height="h-6" width="w-14" />
      </div>
      <div className="flex gap-3 mt-6">
        <SkeletonLoader variant="rectangular" height="h-10" width="flex-1" />
        <SkeletonLoader variant="rectangular" height="h-10" width="w-10" />
      </div>
    </div>
  </div>
);

export const VenueDetailSkeleton = () => (
  <div className="space-y-8">
    <SkeletonLoader variant="card" height="h-96" />

    <div className="bg-white dark:bg-surface-800 rounded-2xl p-8 space-y-6">
      <div className="space-y-4">
        <SkeletonLoader variant="text" height="h-8" width="w-2/3" />
        <SkeletonLoader variant="text" height="h-5" width="w-1/2" />
        <div className="flex space-x-4">
          <SkeletonLoader variant="text" height="h-4" width="w-24" />
          <SkeletonLoader variant="text" height="h-4" width="w-32" />
        </div>
      </div>
      <SkeletonLoader variant="text" lines={3} height="h-4" />
    </div>

    <div className="bg-white dark:bg-surface-800 rounded-2xl p-8 space-y-6">
      <SkeletonLoader variant="text" height="h-6" width="w-48" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonLoader key={index} variant="rectangular" height="h-12" />
        ))}
      </div>
    </div>
  </div>
);

export const ReviewSkeleton = () => (
  <div className="space-y-4 border-b border-gray-200 dark:border-surface-700 pb-6">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <SkeletonLoader variant="text" height="h-5" width="w-32" />
        <div className="flex space-x-2">
          <SkeletonLoader variant="rectangular" height="h-4" width="w-20" />
          <SkeletonLoader variant="text" height="h-4" width="w-16" />
        </div>
      </div>
      <SkeletonLoader variant="text" height="h-4" width="w-20" />
    </div>
    <SkeletonLoader variant="text" lines={2} height="h-4" />
  </div>
);

export const DashboardStatSkeleton = () => (
  <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonLoader variant="text" height="h-4" width="w-24" />
        <SkeletonLoader variant="text" height="h-8" width="w-16" />
        <SkeletonLoader variant="text" height="h-3" width="w-32" />
      </div>
      <SkeletonLoader variant="circular" width="w-12" height="h-12" />
    </div>
  </div>
);

export default SkeletonLoader;
