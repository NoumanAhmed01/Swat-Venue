// src/pages/owner/forms/VenueStep3.jsx
import React from "react";
import { DollarSign, Phone } from "lucide-react";

const VenueStep3 = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Pricing & Contact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price *
          </label>
          <input
            type="number"
            {...register("price")}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter price in PKR"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price Type *
          </label>
          <select
            {...register("priceType")}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="per day">Per Day</option>
            <option value="per event">Per Event</option>
            <option value="per hour">Per Hour</option>
          </select>
          {errors.priceType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.priceType.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className=" text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
          <Phone className="h-4 w-4" />
          Contact Number *
        </label>
        <input
          type="tel"
          {...register("phone")}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Enter contact number"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>
    </div>
  );
};

export default VenueStep3;
