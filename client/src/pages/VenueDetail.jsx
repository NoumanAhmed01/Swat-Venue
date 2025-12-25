// src/pages/user/VenueDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { VenueDetailSkeleton } from "../components/common/SkeletonLoader";
import Review from "../components/venue/Review";
import BookingForm from "../components/booking/BookingForm";
import { venueAPI } from "../utils/api";

// Import new components
import VenueMediaGallery from "../components/venue/VenueMediaGallery";
import VenueInfoCard from "../components/venue/VenueInfoCard";
import VenueAmenities from "../components/venue/VenueAmenities";
import VenuePricingCard from "../components/venue/VenuePricingCard";
import VenueLocationMap from "../components/venue/VenueLocationMap";

const VenueDetail = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await venueAPI.getById(id);
        setVenue(response.data.data);
      } catch (error) {
        console.error("Error fetching venue:", error);
        toast.error("Failed to load venue details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  const handleReviewSubmitted = async () => {
    try {
      const response = await venueAPI.getById(id);
      setVenue(response.data.data);
    } catch (error) {
      console.error("Error refreshing venue:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-surface-900">
        <div className="bg-white dark:bg-surface-800 px-4 py-3 border-b border-gray-200 dark:border-surface-700">
          <div className="max-w-7xl mx-auto">
            <div className="h-6 bg-gray-200 dark:bg-surface-700 rounded animate-pulse w-32"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VenueDetailSkeleton />
            </div>
            <div className="space-y-6">
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-lg">
                <div className="text-center mb-6 space-y-2">
                  <div className="h-8 bg-gray-200 dark:bg-surface-700 rounded animate-pulse w-24 mx-auto"></div>
                  <div className="h-4 bg-gray-200 dark:bg-surface-700 rounded animate-pulse w-16 mx-auto"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-200 dark:bg-surface-700 rounded animate-pulse"></div>
                  <div className="h-12 bg-gray-200 dark:bg-surface-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Venue Not Found
          </h1>
          <Link
            to="/venues"
            className="text-gold-600 hover:text-gold-700 font-medium"
          >
            Back to Venues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{venue.name} - SwatVenue</title>
        <meta
          name="description"
          content={`${venue.name} in ${venue.location}. ${
            venue.description
          } Capacity: ${
            venue.capacity
          } guests. Price: ₨${venue.price.toLocaleString()} ${
            venue.priceType
          }.`}
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Media Gallery */}
              <VenueMediaGallery
                images={venue.images || []}
                videos={venue.videos || []}
              />

              {/* Venue Info */}
              <VenueInfoCard venue={venue} />

              {/* Amenities */}
              <VenueAmenities amenities={venue.amenities || []} />

              {/* Reviews */}
              <Review
                venueId={venue._id || venue.id}
                venueRating={venue.rating}
                onReviewSubmitted={handleReviewSubmitted}
              />

              {/* Location Map */}
              <VenueLocationMap geoLocation={venue.geoLocation} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <VenuePricingCard
                venue={venue}
                onBookNow={() => setBookingModalOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {bookingModalOpen && (
          <BookingForm
            venue={venue}
            onClose={() => setBookingModalOpen(false)}
            onSuccess={() => {
              toast.success("Booking request submitted successfully!");
            }}
          />
        )}
      </div>
    </>
  );
};

export default VenueDetail;
