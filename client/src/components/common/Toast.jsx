import React from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader,
} from "lucide-react";

// Export toast instance for use in other components
export { toast };

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={16}
      containerClassName="!z-[9999] p-4"
      toastOptions={{
        duration: 4000,
        className: "!p-0 !bg-transparent !shadow-none !max-w-full",
        style: {
          background: "transparent",
          padding: 0,
          margin: 0,
          boxShadow: "none",
          maxWidth: "100%",
        },
        success: {
          duration: 4000,
        },
        error: {
          duration: 5000,
        },
        loading: {
          duration: Infinity,
        },
      }}
    >
      {(t) => {
        const { id, type, message } = t;

        const isSuccess = type === "success";
        const isError = type === "error";
        const isInfo = type === "info";
        const isLoading = type === "loading";

        // Enhanced color scheme for premium look
        const bgColor = isSuccess
          ? "bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500"
          : isError
          ? "bg-gradient-to-r from-red-500 via-red-600 to-red-500"
          : isInfo
          ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500"
          : isLoading
          ? "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500"
          : "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700";

        const Icon = isLoading
          ? Loader
          : isSuccess
          ? CheckCircle
          : isError
          ? AlertCircle
          : isInfo
          ? Info
          : AlertTriangle;

        const iconColor = isLoading
          ? "text-amber-100 animate-spin"
          : isSuccess
          ? "text-emerald-100"
          : isError
          ? "text-red-100"
          : isInfo
          ? "text-blue-100"
          : "text-gray-100";

        const borderColor = isLoading
          ? "border-amber-300/30"
          : isSuccess
          ? "border-emerald-300/30"
          : isError
          ? "border-red-300/30"
          : isInfo
          ? "border-blue-300/30"
          : "border-gray-300/30";

        return (
          <div
            className={`
              ${bgColor} 
              text-white 
              rounded-xl 
              shadow-2xl 
              ring-1 ring-white/20 
              backdrop-blur-md 
              border-l-4 ${borderColor}
              max-w-xs sm:max-w-sm md:max-w-md 
              w-full 
              transform transition-all duration-300
              ${t.visible ? "animate-slide-in" : "animate-slide-out"}
              hover:shadow-3xl hover:scale-[1.02] transition-all duration-300
            `}
          >
            <div className="p-4 flex items-start gap-3">
              <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base break-words leading-relaxed tracking-wide">
                  {typeof message === "string"
                    ? message
                    : JSON.stringify(message)}
                </p>
              </div>

              {!isLoading && (
                <button
                  onClick={() => toast.dismiss(id)}
                  className="text-white/70 hover:text-white transition-all duration-200 flex-shrink-0 hover:scale-110 active:scale-95"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Animated Progress Bar */}
            <div className="h-1 w-full bg-white/10 rounded-b-xl overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-white/80 to-white/40 animate-progress"
                style={{
                  animationDuration: `${t.duration}ms`,
                  animationPlayState: t.visible ? "running" : "paused",
                }}
              />
            </div>
          </div>
        );
      }}
    </Toaster>
  );
};

export default ToastProvider;
