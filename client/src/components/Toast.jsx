// 🧩 Import React for component creation
import React from "react";

// 📦 Importing Toaster component from react-hot-toast library
// It handles global toast notifications throughout the app
import { Toaster } from "react-hot-toast";

// ⚙️ ToastProvider Component — provides centralized toast configuration
const ToastProvider = () => {
  return (
    <Toaster
      // 🔝 Position of toast notifications on screen
      position="top-right"
      // 🎨 Global toast styling options
      toastOptions={{
        duration: 4000, // Toast disappears after 4 seconds

        // 💅 Default toast style
        style: {
          background: "#374151", // Tailwind gray-700 shade
          color: "#fff", // White text color
          borderRadius: "0.5rem", // Rounded corners
        },

        // ✅ Success toast style override
        success: {
          style: {
            background: "#059669", // Tailwind green-600 shade
          },
        },

        // ❌ Error toast style override
        error: {
          style: {
            background: "#DC2626", // Tailwind red-600 shade
          },
        },
      }}
    />
  );
};

export default ToastProvider;
