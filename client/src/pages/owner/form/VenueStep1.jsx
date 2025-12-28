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
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter venue name"
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
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter complete address"
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
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Describe your venue, its features, and what makes it special"
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
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
