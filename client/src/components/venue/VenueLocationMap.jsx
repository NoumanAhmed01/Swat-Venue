// src/components/venue/VenueLocationMap.jsx
import React from "react";
import Map from "../map/Map";

const VenueLocationMap = ({ address, name }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-3 sm:p-8">
      <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-4">
        Location
      </h3>
      {/* FIX: Add a fixed height container with relative positioning and overflow hidden */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden">
        <Map address={address} venueName={name} zoom={15} />
      </div>
    </div>
  );
};

export default VenueLocationMap;
