import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Filter, Grid2x2 as Grid, List } from "lucide-react";
import VenueCard from "../components/VenueCard";
import FilterSidebar from "../components/FilterSidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { VenueCardSkeleton } from "../components/SkeletonLoader";
import venuesData from "../data/venues.json";

const Venues = () => {
  const [searchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const venuesPerPage = 12;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVenues(venuesData);
      setFilteredVenues(venuesData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply search params on load
    const location = searchParams.get("location");
    const guests = searchParams.get("guests");
    if (location || guests) {
      const newFilters = {
        ...filters,
        ...(location && { location }),
        ...(guests && { minCapacity: guests }),
      };
      setFilters(newFilters);
      applyFilters(venues, newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, venues]);

  const applyFilters = (venuesList, filterOptions) => {
    let filtered = [...venuesList];

    if (filterOptions.location) {
      filtered = filtered.filter((venue) =>
        venue.location
          .toLowerCase()
          .includes(filterOptions.location.toLowerCase())
      );
    }

    if (filterOptions.minPrice) {
      filtered = filtered.filter(
        (venue) => venue.price >= parseInt(filterOptions.minPrice)
      );
    }

    if (filterOptions.maxPrice) {
      filtered = filtered.filter(
        (venue) => venue.price <= parseInt(filterOptions.maxPrice)
      );
    }

    if (filterOptions.minCapacity) {
      filtered = filtered.filter(
        (venue) => venue.capacity >= parseInt(filterOptions.minCapacity)
      );
    }

    if (filterOptions.maxCapacity) {
      filtered = filtered.filter(
        (venue) => venue.capacity <= parseInt(filterOptions.maxCapacity)
      );
    }

    if (filterOptions.amenities && filterOptions.amenities.length > 0) {
      filtered = filtered.filter((venue) =>
        filterOptions.amenities.some((amenity) =>
          venue.amenities.includes(amenity)
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "capacity":
          return b.capacity - a.capacity;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredVenues(filtered);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(venues, newFilters);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    applyFilters(venues, filters);
  };

  // Pagination
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);
  const startIndex = (currentPage - 1) * venuesPerPage;
  const endIndex = startIndex + venuesPerPage;
  const currentVenues = filteredVenues.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-surface-900">
        <div className="flex min-h-screen">
          {/* Filter Sidebar Skeleton */}
          <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-surface-800 shadow-xl border-r border-gray-200 dark:border-surface-700">
            <div className="p-4 space-y-6">
              <div className="h-6 bg-gray-200 dark:bg-surface-700 rounded animate-pulse"></div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-surface-700 rounded animate-pulse w-1/2"></div>
                  <div className="h-10 bg-gray-200 dark:bg-surface-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1 w-full lg:pl-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8 space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-surface-700 rounded animate-pulse w-1/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-surface-700 rounded animate-pulse w-1/4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <VenueCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
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

      <div className="min-h-screen bg-gray-50 dark:bg-surface-900">
        <div className="flex min-h-screen">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={filterSidebarOpen}
            onClose={() => setFilterSidebarOpen(false)}
            onFiltersChange={handleFiltersChange}
          />

          {/* Main Content */}
          <div className="flex-1 w-full lg:pl-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Event Venues in Swat
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredVenues.length} venues found
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <button
                  onClick={() => setFilterSidebarOpen(true)}
                  className="lg:hidden flex items-center space-x-2 bg-white dark:bg-surface-800 px-4 py-2 rounded-lg border border-gray-300 dark:border-surface-600 hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors duration-200"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex bg-white dark:bg-surface-800 rounded-lg border border-gray-300 dark:border-surface-600">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-l-lg transition-colors duration-200 ${
                        viewMode === "grid"
                          ? "bg-gold-500 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-700"
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-r-lg transition-colors duration-200 ${
                        viewMode === "list"
                          ? "bg-gold-500 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-700"
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-white dark:bg-surface-800 border border-gray-300 dark:border-surface-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:text-text-dark"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="capacity">Largest Capacity</option>
                  </select>
                </div>
              </div>

              {/* Venues Grid/List */}
              {filteredVenues.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <Filter className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No venues found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters to find more venues
                  </p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "space-y-6"
                  }
                >
                  {currentVenues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      className={
                        viewMode === "list" ? "lg:flex lg:flex-row lg:h-64" : ""
                      }
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-surface-600 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      Math.max(1, Math.min(totalPages - 4, currentPage - 2)) +
                      i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                          currentPage === pageNum
                            ? "bg-gold-500 text-white"
                            : "border border-gray-300 dark:border-surface-600 hover:bg-gray-50 dark:hover:bg-surface-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 dark:border-surface-600 rounded-lg hover:bg-gray-50 dark:hover:bg-surface-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Venues;
