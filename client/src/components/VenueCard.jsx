import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, Star, Phone } from "lucide-react"; // Lucide-react → Icon library for modern, lightweight SVG icons

// ✅ VenueCard Component
// This component displays venue details in card format.
// It is reusable and accepts a single 'venue' object as props.
const VenueCard = ({ venue, className = "" }) => {
  // Determine if layout is list view (used for responsive design)
  const isListView = className.includes("lg:flex-row");

  return (
    <div
      className={`bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}
    >
      {/* 🖼️ Venue Image Section */}
      <div
        className={`relative overflow-hidden ${
          isListView ? "lg:w-1/3 h-48 lg:h-full" : "h-48"
        }`}
      >
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />

        {/* ⭐ Rating Badge (top-right corner) */}
        <div className="absolute top-4 right-4 bg-white dark:bg-surface-800 rounded-full px-3 py-1 flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-primary-900 dark:text-text-dark">
            {venue.rating}
          </span>
        </div>
      </div>

      {/* 📄 Venue Content Section */}
      <div
        className={`p-6 ${
          isListView ? "lg:w-2/3 flex flex-col justify-between" : ""
        }`}
      >
        {/* Top content area */}
        <div>
          {/* Venue name + price */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-primary-900 dark:text-text-dark line-clamp-1 flex-1 mr-4">
              {venue.name}
            </h3>

            <div className="text-right">
              <p className="text-2xl font-bold text-gold-600">
                ₨{venue.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {venue.priceType}
              </p>
            </div>
          </div>

          {/* 📍 Location */}
          <div className="flex items-center text-text-light dark:text-text-dark mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{venue.location}</span>
          </div>

          {/* 👥 Capacity + Reviews */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-text-light dark:text-text-dark">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">Up to {venue.capacity} guests</span>
            </div>
            <div className="flex items-center text-text-light dark:text-text-dark">
              <span className="text-sm">{venue.reviews} reviews</span>
            </div>
          </div>

          {/* 🏷️ Amenities */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {venue.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-surface-700 text-text-light dark:text-text-dark text-xs rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {/* Show extra count if amenities exceed 3 */}
              {venue.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-surface-700 text-text-light dark:text-text-dark text-xs rounded-full">
                  +{venue.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 📞 Buttons Section */}
        <div className="flex gap-3">
          {/* Navigate to Venue Details Page */}
          <Link
            to={`/venue/${venue.id}`}
            className="flex-1 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors duration-200"
          >
            View Details
          </Link>

          {/* Contact Button */}
          <button className="p-2 border border-gray-300 dark:border-surface-600 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors duration-200">
            <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
