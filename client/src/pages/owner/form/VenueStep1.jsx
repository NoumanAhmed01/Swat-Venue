// src/pages/owner/forms/VenueStep1.jsx
import React from "react";
import { Building, MapPin } from "lucide-react";

const locations = [
  "Mingora, Swat",
  "Kabal, Swat",
  "Saidu Sharif, Swat",
  "Bahrain, Swat",
  "Kalam, Swat",
  "Malam Jabba, Swat",
  "Dir, Upper Dir",
  "Chitral",
];

const VenueStep1 = ({ register, errors }) => {
  // Helper to restrict venue name (allow alphabets, numbers, and spaces)
  const handleNameKeyDown = (e) => {
    if ([8, 46, 9, 27, 13, 32].indexOf(e.keyCode) !== -1 ||
        (e.ctrlKey === true && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
    }
    // Allow letters (A-Z) and numbers (0-9)
    if ((e.keyCode < 65 || e.keyCode > 90) && (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Building className="h-5 w-5" />
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Venue Name *
          </label>
          <input
            {...register("name")}
            onKeyDown={handleNameKeyDown}
            className={`w-full px-4 py-3 border ${
              errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
            placeholder="Enter venue name (e.g., Grand Palace)"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Location *
          </label>
          <select
            {...register("location")}
            className={`w-full px-4 py-3 border ${
              errors.location ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            } rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
          >
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Full Address *
        </label>
        <textarea
          rows={3}
          {...register("address")}
          className={`w-full px-4 py-3 border ${
            errors.address ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          } rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
          placeholder="Enter complete address with street number and landmarks"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          rows={4}
          {...register("description")}
          className={`w-full px-4 py-3 border ${
            errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          } rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
          placeholder="Describe your venue, its features, and what makes it special (min. 20 characters)"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Maximum Capacity *
        </label>
        <input
          type="number"
          {...register("capacity")}
          className={`w-full px-4 py-3 border ${
            errors.capacity ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          } rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
          placeholder="Enter maximum guest capacity"
        />
        {errors.capacity && (
          <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
        )}
      </div>
    </div>
  );
};

export default VenueStep1;
