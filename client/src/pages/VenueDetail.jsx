// src/pages/user/VenueDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "../components/common/Toast";
import { VenueDetailSkeleton } from "../components/common/SkeletonLoader";
import Review from "../components/venue/Review";
import BookingForm from "../components/booking/BookingForm";
import { venueAPI, menuAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";

// Import new components
import VenueMediaGallery from "../components/venue/VenueMediaGallery";
import VenueInfoCard from "../components/venue/VenueInfoCard";
import VenueAmenities from "../components/venue/VenueAmenities";
import VenuePricingCard from "../components/venue/VenuePricingCard";
import VenueLocationMap from "../components/venue/VenueLocationMap";
import Menu from "../components/venue/Menu";

//Animation
import { motion, fadeInUp } from "../components/animation/Animation";

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [menus, setMenus] = useState([]); // ✅ NEW
  const [selectedMenu, setSelectedMenu] = useState(null); // ✅ NEW
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

  // ✅ FETCH MENUS
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await menuAPI.getByVenue(id);
        setMenus(res.data.data);
      } catch (err) {
        console.error("Error fetching menus", err);
      }
    };

    fetchMenus();
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

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
      >
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

              {/* ✅ MENU ADDED HERE */}
              <Menu
                menus={menus}
                selectedMenu={selectedMenu}
                setSelectedMenu={setSelectedMenu}
              />

              {/* Reviews */}
              <Review
                venueId={venue._id || venue.id}
                venueRating={venue.rating}
                onReviewSubmitted={handleReviewSubmitted}
              />

              {/* Location Map */}
              <VenueLocationMap address={venue.address} name={venue.name} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <VenuePricingCard
                venue={venue}
                onBookNow={() => {
                  // ✅ CHECK AUTHENTICATION
                  if (!user) {
                    toast("Please login to book this venue", { type: "info" });
                    navigate("/auth/login", {
                      state: { from: `/venue/${id}` },
                    });
                    return;
                  }

                  // ✅ CHECK MENU SELECTED
                  if (!selectedMenu) {
                    toast.error("Please select a menu first");
                    return;
                  }
                  setBookingModalOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Modal - Moved outside motion.div to fix z-index/fixed positioning issues */}
      {bookingModalOpen && (
        <BookingForm
          venue={venue}
          selectedMenu={selectedMenu} // ✅ PASS MENU
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </>
  );
};

export default VenueDetail;
