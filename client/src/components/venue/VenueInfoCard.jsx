// src/components/venue/VenueInfoCard.jsx
import React from "react";
import { MapPin, Users, Star } from "lucide-react";

const VenueInfoCard = ({ venue }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 dark:text-text-dark mb-2">
            {venue.name}
          </h1>
          <div className="flex items-start text-text-light dark:text-text-dark mb-4">
            <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{venue.address}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
              <span className="font-semibold text-text-light dark:text-text-dark">
                {venue.rating}
              </span>
              <span className="text-gray-500 ml-1">
                ({venue.reviews} reviews)
              </span>
            </div>
            <div className="flex items-center text-text-light dark:text-text-dark">
              <Users className="h-5 w-5 mr-1" />
              <span>Up to {venue.capacity} guests</span>
            </div>
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-4">
          About This Venue
        </h3>
        <p className="text-text-light dark:text-text-dark leading-relaxed">
          {venue.description}
        </p>
      </div>
    </div>
  );
};

export default VenueInfoCard;
