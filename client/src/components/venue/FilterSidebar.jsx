// src/components/venue/FilterSidebar.jsx
import React, { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";

const FilterSidebar = ({
  isOpen,
  onClose,
  onFiltersChange,
  initialFilters,
}) => {
  // Initialize with initialFilters if provided
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    minCapacity: "",
    maxCapacity: "",
    amenities: [],
  });

  // Track if we're on desktop (responsive)
  const [isDesktop, setIsDesktop] = useState(false);

  // Update local filters when initialFilters changes (from parent)
  useEffect(() => {
    if (initialFilters) {
      // Don't include search in sidebar filters
      const { search, ...sidebarFilters } = initialFilters;
      setFilters(sidebarFilters);
    }
  }, [initialFilters]);

  // Check screen size on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  const locations = [
    "Mingora, Swat",
    "Kalam, Swat",
    "Saidu Sharif, Swat",
    "Bahrain, Swat",
    "Malam Jabba, Swat",
    "Dir, Upper Dir",
    "Chitral",
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Apply filters immediately on desktop
    if (isDesktop) {
      onFiltersChange({ ...newFilters, search: initialFilters?.search || "" });
    }
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];

    const newFilters = { ...filters, amenities: newAmenities };
    setFilters(newFilters);

    // Apply filters immediately on desktop
    if (isDesktop) {
      onFiltersChange({ ...newFilters, search: initialFilters?.search || "" });
    }
  };

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
    onFiltersChange({ ...emptyFilters, search: initialFilters?.search || "" });
  };

  // Apply filters and close sidebar on mobile
  const applyAndClose = () => {
    onFiltersChange({ ...filters, search: initialFilters?.search || "" });
    onClose();
  };

  const sidebarContent = (
    <div
      className="h-full overflow-y-auto px-4 pb-6 no-scrollbar"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-surface-800 z-10 p-4 border-b border-gray-200 dark:border-gray-700">
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
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Apply Button for Mobile - Only show when NOT desktop */}
        {!isDesktop && (
          <div className="mt-4">
            <button
              onClick={applyAndClose}
              className="w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="pt-4 space-y-6">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            Location
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark"
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            Price Range (PKR)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark"
            />
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark"
            />
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            Guest Capacity
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              min="1"
              value={filters.minCapacity}
              onChange={(e) =>
                handleFilterChange("minCapacity", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark"
            />
            <input
              type="number"
              placeholder="Max"
              min="1"
              value={filters.maxCapacity}
              onChange={(e) =>
                handleFilterChange("maxCapacity", e.target.value)
              }
              className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
            Amenities
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 no-scrollbar">
            {amenitiesList.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-700 cursor-pointer transition-colors duration-200"
                onClick={() => handleAmenityToggle(amenity)}
              >
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => {}} // Handled by onClick
                    className="rounded border-gray-300 text-gold-600 focus:ring-gold-500 focus:ring-2 h-4 w-4"
                    id={`amenity-${amenity}`}
                  />
                </div>
                <label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm text-text-light dark:text-text-dark font-medium cursor-pointer select-none flex-1"
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <aside
      className={`h-full bg-white dark:bg-surface-800 overflow-hidden
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {sidebarContent}
    </aside>
  );
};

export default FilterSidebar;
