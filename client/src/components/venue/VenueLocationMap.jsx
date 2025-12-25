// src/components/venue/VenueLocationMap.jsx
import React from "react";
import Map from "../map/Map";

const VenueLocationMap = ({ geoLocation }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-6">
        Location
      </h3>
      <div className="rounded-lg overflow-hidden h-64 sm:h-80">
        <Map
          key={geoLocation?.coordinates?.join(",")}
          center={geoLocation?.coordinates || [72.36015, 34.77175]}
          zoom={12}
        />
      </div>
    </div>
  );
};

export default VenueLocationMap;
