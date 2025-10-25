import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  MapPin,
  Users,
  Star,
  Phone,
  Mail,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  ArrowLeft,
  Check,
  ChevronDown,
  Wifi,
  Car,
  Music,
  Camera,
  Utensils,
  Building,
  X,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  VenueDetailSkeleton,
  ReviewSkeleton,
} from "../components/SkeletonLoader";
import BookingCalendar from "../components/BookingCalendar";
import Review from "../components/Review";
import { venueAPI } from "../utils/api";
import BookingForm from "../components/BookingForm";

const bookingSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  eventDate: yup.string().required("Event date is required"),
  eventType: yup.string().required("Event type is required"),
  guestCount: yup
    .number()
    .required("Guest count is required")
    .min(1, "At least 1 guest is required"),
  message: yup.string(),
});

const VenueDetail = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(bookingSchema),
  });

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

  const onSubmit = async (data) => {
    try {
      if (!selectedDate) {
        toast.error("Please select an event date from the calendar");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        "Booking request sent successfully! We'll contact you soon."
      );
      reset();
      setSelectedDate(null);
      setBookingModalOpen(false);
    } catch (error) {
      toast.error("Failed to send booking request. Please try again.");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === venue.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? venue.images.length - 1 : prev - 1
    );
  };

  const amenityIcons = {
    WiFi: Wifi,
    Parking: Car,
    "Sound System": Music,
    "Photography Area": Camera,
    Catering: Utensils,
    AC: Building,
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
        {/* Back Button */}
        <div className="bg-white dark:bg-surface-800 px-4 py-3 border-b border-gray-200 dark:border-surface-700">
          <div className="max-w-7xl mx-auto">
            <Link
              to="/venues"
              className="inline-flex items-center space-x-2 text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Venues</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <img
                    src={venue.images[currentImageIndex]}
                    alt={`${venue.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover"
                  />
                  {venue.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {venue.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white bg-opacity-50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Thumbnail Gallery */}
                {venue.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {venue.images.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative rounded-lg overflow-hidden ${
                          index === currentImageIndex
                            ? "ring-2 ring-gold-500"
                            : ""
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${venue.name} thumbnail ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        {index === 3 && venue.images.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold">
                            +{venue.images.length - 4}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Venue Info */}
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-text-dark mb-2">
                      {venue.name}
                    </h1>
                    <div className="flex items-center text-text-light dark:text-text-dark mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{venue.address}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold">{venue.rating}</span>
                        <span className="text-gray-500 ml-1">
                          ({venue.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center text-text-light dark:text-text-dark">
                        <Users className="h-5 w-5 mr-1" />
                        <span>Up to {venue.capacity} guests</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-4">
                    About This Venue
                  </h3>
                  <p className="text-text-light dark:text-text-dark leading-relaxed">
                    {venue.description}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-6">
                  Amenities & Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {venue.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || Check;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-surface-700 rounded-lg"
                      >
                        <IconComponent className="h-5 w-5 text-gold-600" />
                        <span className="text-primary-900 dark:text-text-dark">
                          {amenity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews */}
              <Review
                venueId={venue._id || venue.id}
                venueRating={venue.rating}
                onReviewSubmitted={handleReviewSubmitted}
              />

              {/* Location Map Placeholder */}
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-6">
                  Location
                </h3>
                <div className="bg-gray-200 dark:bg-surface-700 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Interactive map would appear here
                    </p>
                    <p className="text-sm text-gray-400">{venue.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-lg sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gold-600">
                    ₨{venue.price.toLocaleString()}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {venue.priceType}
                  </div>
                </div>
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Book Now
                </button>
              </div>

              {/* Owner Info */}
              <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-primary-900 dark:text-text-dark mb-4">
                  Venue Owner
                </h3>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-gold-600" />
                    <span>{venue.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-gold-600" />
                    <span>{venue.ownerName}@example.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal - Updated UI  */}
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
