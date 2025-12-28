// src/components/common/StatsCard.jsx
import React from "react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  isActive = false,
  onClick,
  className = "",
}) => {
  // Color configurations
  const colorConfig = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      activeColor: "bg-blue-500",
    },
    green: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      activeColor: "bg-emerald-500",
    },
    gold: {
      bg: "bg-gold-50 dark:bg-gold-900/20",
      text: "text-gold-600 dark:text-gold-400",
      border: "border-gold-200 dark:border-gold-800",
      activeColor: "bg-gold-500",
    },
    red: {
      bg: "bg-rose-50 dark:bg-rose-900/20",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
      activeColor: "bg-rose-500",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      activeColor: "bg-purple-500",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      activeColor: "bg-amber-500",
    },
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 
        rounded-xl p-4 
        border ${config.border}
        ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <Icon className={`h-5 w-5 ${config.text}`} />
          </div>
        )}
      </div>
      {/* Progress bar indicator */}
      {onClick && (
        <div
          className={`mt-3 h-1 rounded-full ${
            isActive ? config.activeColor : "bg-gray-200 dark:bg-gray-700"
          }`}
        />
      )}
    </div>
  );
};

export default StatsCard;
