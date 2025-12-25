// src/components/venue/VenuePricingCard.jsx
import React from "react";
import { Phone, Mail } from "lucide-react";

const VenuePricingCard = ({ venue, onBookNow }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-lg sticky top-6">
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gold-600">
          ₨{venue.price.toLocaleString()}
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          {venue.priceType}
        </div>
      </div>
      <button
        onClick={onBookNow}
        className="w-full bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Book Now
      </button>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-400">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-text-dark mb-4">
          Contact Information
        </h3>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-gold-600 flex-shrink-0" />
            <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base truncate">
              {venue.phone}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-gold-600 flex-shrink-0" />
            <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base truncate">
              {venue.ownerName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuePricingCard;
