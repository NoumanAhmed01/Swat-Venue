import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  X,
  Calendar,
  Users,
  Mail,
  Phone,
  MessageSquare,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { bookingAPI } from "../utils/api";
import BookingCalendar from "./BookingCalendar";
import LoadingSpinner from "./LoadingSpinner";

const bookingSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  eventType: yup.string().required("Event type is required"),
  guestCount: yup
    .number()
    .typeError("Guest count must be a number")
    .positive("Guest count must be positive")
    .integer("Guest count must be a whole number")
    .required("Guest count is required"),
  message: yup.string(),
});

const BookingForm = ({ venue, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [reservedDates, setReservedDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(bookingSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email);
      if (user.phone) {
        setValue("phone", user.phone);
      }
    }
  }, [user, setValue]);

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        setLoadingDates(true);
        const response = await bookingAPI.getReservedDates(
          venue._id || venue.id
        );
        if (response.data.success) {
          setReservedDates(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      } finally {
        setLoadingDates(false);
      }
    };

    if (venue) {
      fetchReservedDates();
    }
  }, [venue]);

  const onSubmit = async (data) => {
    try {
      if (!selectedDate) {
        toast.error("Please select an event date from the calendar");
        return;
      }

      const bookingData = {
        venue: venue._id || venue.id,
        eventDate: selectedDate.toISOString(),
        eventType: data.eventType,
        guestCount: Number(data.guestCount),
        phone: data.phone,
        email: data.email,
        name: data.name,
        message: data.message || "",
      };

      const response = await bookingAPI.create(bookingData);

      if (response.data.success) {
        toast.success("Booking request submitted successfully!");
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create booking. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const eventTypes = [
    "Wedding",
    "Birthday Party",
    "Corporate Event",
    "Conference",
    "Anniversary",
    "Engagement",
    "Reception",
    "Seminar",
    "Workshop",
    "Other",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Book This Venue
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Complete the form below to request a booking
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name and Email - First Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                {...register("name")}
                type="text"
                className={`w-full p-3 border ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="your@email.com"
                className={`w-full p-3 border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone and Event Type - Second Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+92 300 1234567"
                className={`w-full p-3 border ${
                  errors.phone
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Type
              </label>
              <select
                {...register("eventType")}
                className={`w-full p-3 border ${
                  errors.eventType
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.eventType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.eventType.message}
                </p>
              )}
            </div>
          </div>

          {/* Event Date and Guest Count - Third Line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Date
              </label>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className={`w-full p-3 border ${
                  errors.eventDate
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg text-left bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
              >
                {selectedDate ? (
                  selectedDate.toLocaleDateString()
                ) : (
                  <span className="text-gray-400">Select event date</span>
                )}
              </button>
              {showCalendar && (
                <div className="absolute z-50 mt-2 left-0 right-0 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 shadow-xl">
                  {loadingDates ? (
                    <div className="flex items-center justify-center py-4">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : (
                    <BookingCalendar
                      venueId={venue._id || venue.id}
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      reservedDates={reservedDates}
                    />
                  )}
                </div>
              )}
              {!selectedDate && (
                <p className="text-red-500 text-xs mt-1">
                  Please select an event date
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Guests
              </label>
              <input
                type="number"
                {...register("guestCount")}
                placeholder="e.g., 150"
                min="1"
                max={venue.capacity}
                className={`w-full p-3 border ${
                  errors.guestCount
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm`}
              />
              {errors.guestCount && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.guestCount.message}
                </p>
              )}
            </div>
          </div>

          {/* Additional Message - Full Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Message (Optional)
            </label>
            <textarea
              {...register("message")}
              placeholder="Any special requirements?"
              rows="3"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedDate}
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Book Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
