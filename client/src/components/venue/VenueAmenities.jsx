// src/components/venue/VenueAmenities.jsx
import React from "react";
import {
  Wifi,
  Car,
  Music,
  Camera,
  Utensils,
  Building,
  Check,
} from "lucide-react";

const amenityIcons = {
  WiFi: Wifi,
  Parking: Car,
  "Sound System": Music,
  "Photography Area": Camera,
  Catering: Utensils,
  AC: Building,
};

const VenueAmenities = ({ amenities = [] }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-6">
        Amenities & Features
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {amenities.map((amenity, index) => {
          const IconComponent = amenityIcons[amenity] || Check;
          return (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-surface-700 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-600 transition-colors duration-200"
            >
              <IconComponent className="h-5 w-5 text-gold-600 flex-shrink-0" />
              <span className="text-primary-900 dark:text-text-dark text-sm sm:text-base">
                {amenity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VenueAmenities;
