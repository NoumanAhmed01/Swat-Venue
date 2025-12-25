// src/utils/venueFilters.js

/**
 * Apply filters to venues with proper validation
 */
export const filterVenues = (venues, filters) => {
  return venues.filter((venue) => {
    // Search by name or description
    if (filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.toLowerCase().trim();
      const venueName = (venue.name || "").toLowerCase();
      const venueDescription = (venue.description || "").toLowerCase();
      const venueLocation = (venue.location || "").toLowerCase();

      if (
        !venueName.includes(searchTerm) &&
        !venueDescription.includes(searchTerm) &&
        !venueLocation.includes(searchTerm)
      ) {
        return false;
      }
    }

    // Location filter
    if (filters.location && filters.location.trim() !== "") {
      const venueLocation = (venue.location || "").toLowerCase();
      const searchLocation = filters.location.toLowerCase().trim();
      if (!venueLocation.includes(searchLocation)) {
        return false;
      }
    }

    // Price range filter
    const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

    if (minPrice !== null && !isNaN(minPrice)) {
      if (venue.price < minPrice) return false;
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
      if (venue.price > maxPrice) return false;
    }

    // Capacity range filter
    const minCapacity = filters.minCapacity
      ? Number(filters.minCapacity)
      : null;
    const maxCapacity = filters.maxCapacity
      ? Number(filters.maxCapacity)
      : null;

    if (minCapacity !== null && !isNaN(minCapacity)) {
      if (venue.capacity < minCapacity) return false;
    }

    if (maxCapacity !== null && !isNaN(maxCapacity)) {
      if (venue.capacity > maxCapacity) return false;
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      const venueAmenities = venue.amenities || [];
      const hasAllAmenities = filters.amenities.every((amenity) =>
        venueAmenities.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }

    return true;
  });
};

/**
 * Sort venues by selected criteria
 */
export const sortVenues = (venues, sortBy) => {
  const sorted = [...venues];

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "capacity":
      return sorted.sort((a, b) => b.capacity - a.capacity);
    case "name":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
};

/**
 * Parse search params to filters
 */
export const getFiltersFromSearchParams = (searchParams) => {
  const location = searchParams.get("location") || "";
  const guests = searchParams.get("guests") || "";

  return {
    search: searchParams.get("search") || "",
    location: location,
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minCapacity: guests || searchParams.get("minCapacity") || "",
    maxCapacity: searchParams.get("maxCapacity") || "",
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
  };
};
