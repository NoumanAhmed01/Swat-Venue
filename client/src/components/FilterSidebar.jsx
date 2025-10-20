import React, { useState } from "react";
import { Filter, X } from "lucide-react"; // Lucide icons for clean UI

// FilterSidebar Component
const FilterSidebar = ({ isOpen, onClose, onFiltersChange }) => {
  // Local state to store selected filters
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    minCapacity: "",
    maxCapacity: "",
    amenities: [],
  });

  // List of amenities for selection
  const amenitiesList = [
    "AC",
    "Parking",
    "Catering",
    "Sound System",
    "Stage",
    "WiFi",
    "Garden",
    "Pool",
    "Bridal Suite",
    "VIP Lounge",
    "Valet Parking",
    "Photography Area",
    "Dance Floor",
    "Bar",
    "Kitchen",
  ];

  // Predefined location options
  const locations = [
    "Mingora, Swat",
    "Kalam, Swat",
    "Saidu Sharif, Swat",
    "Bahrain, Swat",
    "Malam Jabba, Swat",
    "Dir, Upper Dir",
    "Chitral",
  ];

  // Handle generic filter input change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters); // Send updated filters to parent
  };

  // Toggle amenity selection
  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];

    handleFilterChange("amenities", newAmenities);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters = {
      location: "",
      minPrice: "",
      maxPrice: "",
      minCapacity: "",
      maxCapacity: "",
      amenities: [],
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  // Sidebar inner content
  const sidebarContent = (
    <div className="h-full overflow-y-auto">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gold-600" />
            <h2 className="text-lg font-semibold text-primary-900 dark:text-text-dark">
              Filters
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={clearFilters}
              className="text-sm text-gold-600 hover:text-gold-700 transition-colors duration-200"
            >
              Clear All
            </button>

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="p-4 space-y-6">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            Price Range (PKR)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
            />
          </div>
        </div>

        {/* Guest Capacity Filter */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            Guest Capacity
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minCapacity}
              onChange={(e) =>
                handleFilterChange("minCapacity", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxCapacity}
              onChange={(e) =>
                handleFilterChange("maxCapacity", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
            />
          </div>
        </div>

        {/* Amenities Filter */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            Amenities
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-700 cursor-pointer transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 focus:ring-2 h-4 w-4"
                />
                <span className="text-sm text-text-light dark:text-text-dark font-medium">
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay (for dark background behind sidebar) */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-surface-800 shadow-xl border-r border-gray-200 dark:border-surface-700 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default FilterSidebar;
