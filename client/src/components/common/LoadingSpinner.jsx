import React from "react";

// Loading spinner component
// Used to show a spinning loader during API calls or authentication checks
const LoadingSpinner = ({ size = "md", className = "" }) => {
  // Define size classes based on prop
  const sizeClasses = {
    sm: "h-4 w-4", // small spinner
    md: "h-8 w-8", // medium spinner
    lg: "h-12 w-12", // large spinner
  };

  // Return the spinner circle
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-gold-500 ${sizeClasses[size]} ${className}`}
    ></div>
  );
};

export default LoadingSpinner;
