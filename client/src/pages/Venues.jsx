// src/pages/user/Venues.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Filter, Search } from "lucide-react";
import VenueCard from "../components/venue/VenueCard";
import FilterSidebar from "../components/venue/FilterSidebar";
import Pagination from "../components/venue/Pagination"; // NEW IMPORT
import { VenueCardSkeleton } from "../components/common/SkeletonLoader";
import { venueAPI } from "../utils/api";
import {
  filterVenues,
  sortVenues,
  getFiltersFromSearchParams,
} from "../utils/venueFilter";

const Venues = () => {
  const [searchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    minCapacity: "",
    maxCapacity: "",
    amenities: [],
  });

  const venuesPerPage = 12;

  // Fetch venues on mount
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await venueAPI.getAll();
        setVenues(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    if (venues.length > 0) {
      const initialFilters = getFiltersFromSearchParams(searchParams);
      setFilters(initialFilters);
    }
  }, [searchParams, venues]);

  // Apply filtering and sorting with useMemo for performance
  const filteredAndSortedVenues = useMemo(() => {
    let filtered = filterVenues(venues, filters);
    filtered = sortVenues(filtered, sortBy);
    return filtered;
  }, [venues, filters, sortBy]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);

    if (window.innerWidth < 1024) {
      setFilterSidebarOpen(false);
    }
  };

  // Handle sort changes
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (window.innerWidth < 1024) {
        setFilterSidebarOpen(false);
      }
    }
  };

  // Reset filters (excluding search)
  const handleClearFilters = () => {
    const emptyFilters = {
      ...filters,
      location: "",
      minPrice: "",
      maxPrice: "",
      minCapacity: "",
      maxCapacity: "",
      amenities: [],
    };
    setFilters(emptyFilters);
    handleFiltersChange(emptyFilters);
  };

  // Clear search only
  const handleClearSearch = () => {
    const newFilters = { ...filters, search: "" };
    setFilters(newFilters);
    handleFiltersChange(newFilters);
  };

  // Check if any filter is active (excluding search)
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "search") return false;
    if (key === "amenities") {
      return value.length > 0;
    }
    return value !== "" && value !== null && value !== undefined;
  });

  const totalPages = Math.ceil(filteredAndSortedVenues.length / venuesPerPage);
  const startIndex = (currentPage - 1) * venuesPerPage;
  const endIndex = startIndex + venuesPerPage;
  const currentVenues = filteredAndSortedVenues.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-surface-900 flex">
        <div className="hidden lg:block w-80 border-r border-gray-200 dark:border-surface-700 p-4">
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-8 bg-gray-300 dark:bg-surface-700 rounded"
              ></div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <VenueCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Browse Venues - SwatVenue</title>
        <meta
          name="description"
          content="Browse and filter through hundreds of verified event venues in Swat valley. Find the perfect space for your special event."
        />
      </Helmet>

      {/* Mobile Filter Sidebar Modal */}
      {filterSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setFilterSidebarOpen(false)}
          />
          <div
            className="fixed inset-y-0 left-0 w-80 max-w-full bg-white dark:bg-surface-800 shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <FilterSidebar
              isOpen={filterSidebarOpen}
              onClose={() => setFilterSidebarOpen(false)}
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </div>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-surface-900 min-h-screen">
        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 h-[calc(100vh-80px)] sticky top-[70px] overflow-y-auto border-r border-gray-200 dark:border-surface-700">
            <FilterSidebar
              isOpen={true}
              onClose={() => setFilterSidebarOpen(false)}
              onFiltersChange={handleFiltersChange}
              initialFilters={filters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Event Venues in Swat
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      {filteredAndSortedVenues.length}{" "}
                      {filteredAndSortedVenues.length === 1
                        ? "venue"
                        : "venues"}{" "}
                      found
                      {hasActiveFilters && " (with filters applied)"}
                    </p>
                  </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="lg:hidden mb-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={handleSearchChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Search venues..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-surface-800 dark:text-text-dark"
                    />
                  </div>
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                {/* Mobile: Filter + Sort in same line */}
                <div className="w-full lg:hidden flex items-center justify-between gap-4">
                  <button
                    onClick={() => setFilterSidebarOpen(true)}
                    className="flex items-center space-x-2 bg-white dark:bg-surface-800 px-4 py-2 rounded-lg border border-gray-300 dark:border-surface-600 hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors duration-200 flex-shrink-0"
                  >
                    <Filter className="h-5 w-5 text-gold-400 dark:text-gold-500" />
                    <span className="text-black dark:text-white">Filters</span>
                    {hasActiveFilters && (
                      <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </button>

                  <div className="flex-1">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-text-dark"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="capacity">Largest Capacity</option>
                    </select>
                  </div>
                </div>

                {/* Desktop: Search + Sort in same row */}
                <div className="hidden lg:flex w-full flex-row items-center justify-between gap-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={filters.search}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Search by venue name..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-surface-800 dark:text-text-dark"
                      />
                    </div>
                  </div>

                  <div className="w-48">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:text-text-dark"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="capacity">Largest Capacity</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* No Results */}
              {filteredAndSortedVenues.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No venues found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {filters.search.trim() !== ""
                      ? `No results found for "${filters.search}". Try different search terms.`
                      : "Try adjusting your filters to find more venues."}
                  </p>
                  {(hasActiveFilters || filters.search.trim() !== "") && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {filters.search.trim() !== "" && (
                        <button
                          onClick={handleClearSearch}
                          className="bg-gray-200 dark:bg-surface-700 hover:bg-gray-300 dark:hover:bg-surface-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                          Clear Search
                        </button>
                      )}
                      {hasActiveFilters && (
                        <button
                          onClick={handleClearFilters}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Venue Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentVenues.map((venue, index) => (
                      <VenueCard
                        key={
                          venue._id?.toString() ||
                          venue.id?.toString() ||
                          `venue-${index}`
                        }
                        venue={venue}
                      />
                    ))}
                  </div>

                  {/* Pagination - Using extracted component */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Venues;
