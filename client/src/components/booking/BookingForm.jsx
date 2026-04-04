import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "../common/Toast";
import {
  X,
  Calendar as CalendarIcon,
  Users,
  CreditCard,
  Utensils,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { bookingAPI } from "../../utils/api";
import BookingCalendar from "./BookingCalendar";

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

const BookingForm = ({ venue, selectedMenu, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [reservedDates, setReservedDates] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
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

  const guestCount = watch("guestCount");

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const fetchReservedDates = async () => {
      try {
        const response = await bookingAPI.getReservedDates(
          venue._id || venue.id,
        );
        if (response.data.success) {
          setReservedDates(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reserved dates:", error);
      }
    };

    if (venue) fetchReservedDates();
  }, [venue]);

  const onSubmit = async (data) => {
    if (!selectedDate) return toast.error("Please select an event date");
    if (!selectedMenu) return toast.error("Please select a menu");

    // ✅ Guest Capacity Check
    if (Number(data.guestCount) > venue.capacity) {
      return toast.error(
        `Guest count cannot exceed venue capacity of ${venue.capacity} people`,
      );
    }

    try {
      const bookingData = {
        venue: venue._id || venue.id,
        eventDate: selectedDate.toISOString(),
        eventType: data.eventType,
        guestCount: Number(data.guestCount),
        phone: data.phone,
        name: data.name,
        email: data.email,
        message: data.message || "",
        menuId: selectedMenu._id,
      };

      const response = await bookingAPI.create(bookingData);
      if (response.data.success) {
        toast.success("Booking submitted!");
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Book Your Event
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-4  p-4">
          <div className="p-4 rounded-xl border border-gold-200 bg-gold-50/30 dark:bg-gold-900/10 dark:border-gold-800">
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="h-3.5 w-3.5 text-gold-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                Menu
              </span>
            </div>
            <p className="text-sm font-bold truncate dark:text-white">
              {selectedMenu?.name}
            </p>
            <p className="text-xs text-gray-500">
              ₨{selectedMenu?.pricePerHead}/head
            </p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 dark:bg-emerald-900/10 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Total
              </span>
            </div>
            <p className="text-sm font-bold dark:text-white">
              ₨{" "}
              {(
                Number(guestCount || 0) * (selectedMenu?.pricePerHead || 0)
              ).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Estimated cost</p>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  Full Name
                </label>
                <input
                  {...register("name")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none"
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  Email
                </label>
                <input
                  {...register("email")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none"
                />
                {errors.phone && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  Event Type
                </label>
                <select
                  {...register("eventType")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none"
                >
                  <option value="">Select...</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  Event Date
                </label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(true)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm text-left flex justify-between items-center"
                >
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Choose Date"}
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block justify-between">
                  <span>Guests</span>
                  <span className="text-gold-600 font-black">
                    Max: {venue.capacity}
                  </span>
                </label>
                <input
                  type="number"
                  {...register("guestCount")}
                  className={`w-full px-4 py-2.5 rounded-lg border ${Number(guestCount) > venue.capacity ? "border-red-500 bg-red-50" : "border-gray-200 dark:border-gray-700"} dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none`}
                />
                {Number(guestCount) > venue.capacity && (
                  <p className="text-red-500 text-[10px] font-bold mt-1">
                    Exceeds venue capacity!
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                Message (Optional)
              </label>
              <textarea
                {...register("message")}
                rows="2"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !selectedDate ||
                Number(guestCount) > venue.capacity
              }
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 mt-4 shadow-lg shadow-gold-500/20"
            >
              {isSubmitting ? "Confirming..." : "Complete Booking"}
            </button>
          </form>
        </div>

        {/* Internal Calendar Overlay */}
        {showCalendar && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 z-[110] flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h4 className="font-bold dark:text-white">Select Event Date</h4>
              <button
                onClick={() => setShowCalendar(false)}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full transition-colors hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <BookingCalendar
                venueId={venue._id || venue.id}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                reservedDates={reservedDates}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
