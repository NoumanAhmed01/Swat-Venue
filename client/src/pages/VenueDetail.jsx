// src/pages/user/VenueDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
            {t("venue.not_found")}
          </h1>
          <Link
            to="/venues"
            className="text-gold-600 hover:text-gold-700 font-medium"
          >
            {t("venue.back_to_venues")}
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
                    toast(t("venue.login_to_book"), { type: "info" });
                    navigate("/auth/login", {
                      state: { from: `/venue/${id}` },
                    });
                    return;
                  }

                  // ✅ CHECK MENU SELECTED
                  if (!selectedMenu) {
                    toast.error(t("venue.select_menu_first"));
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

      {/* WhatsApp Floating Button with Sonar Animation */}
      {venue?.phone && (
        <a
          href={`https://wa.me/${venue.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
            i18n.language === "ur" 
              ? `اسلام علیکم، میں سوات وینیو پر آپ کے وینیو "${venue.name}" میں دلچسپی رکھتا ہوں۔ کیا آپ مزید تفصیلات فراہم کر سکتے ہیں؟`
              : `Hi, I'm interested in your venue "${venue.name}" on SwatVenue. Could you please provide more details?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 group flex items-center justify-center"
          title={t("venue.chat_with_owner")}
        >
          {/* Sonar Rings */}
          <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-sonar opacity-60"></span>
          <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-sonar [animation-delay:1s] opacity-40"></span>
          
          <div className="relative bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 flex items-center justify-center">
            {/* Tooltip */}
            <div className="absolute -top-12 right-0 bg-white dark:bg-surface-800 text-primary-900 dark:text-text-dark px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-gray-100 dark:border-surface-700 whitespace-nowrap pointer-events-none">
              {t("venue.chat_with_owner")}
              <div className="absolute -bottom-1 right-5 w-2 h-2 bg-white dark:bg-surface-800 rotate-45 border-r border-b border-gray-100 dark:border-surface-700"></div>
            </div>
            
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
        </a>
      )}
    </>
  );
};

export default VenueDetail;
