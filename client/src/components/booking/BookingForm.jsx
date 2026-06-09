import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bookingSchema } from "../../utils/validation";
import { toast } from "../common/Toast";
import {
  X,
  Calendar as CalendarIcon,
  Users,
  CreditCard,
  Utensils,
  Phone,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { bookingAPI } from "../../utils/api";
import BookingCalendar from "./BookingCalendar";
import { useTranslation } from "react-i18next";

const BookingForm = ({ venue, selectedMenu, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
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
      eventDate: null,
    },
  });

  // Register hidden fields
  useEffect(() => {
    register("eventDate");
  }, [register]);

  // Helper to restrict name to alphabets and spaces only during typing
  const handleNameKeyDown = (e) => {
    if (
      [8, 46, 9, 27, 13, 32].indexOf(e.keyCode) !== -1 ||
      (e.ctrlKey === true && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) ||
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    if (
      (e.keyCode < 65 || e.keyCode > 90) &&
      (e.keyCode < 97 || e.keyCode > 122)
    ) {
      e.preventDefault();
    }
  };

  // Helper to restrict phone to numbers and + only during typing
  const handlePhoneKeyDown = (e) => {
    if (
      [8, 46, 9, 27, 13, 187, 107].indexOf(e.keyCode) !== -1 ||
      (e.ctrlKey === true && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) ||
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

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
    if (!selectedDate) return toast.error(t("booking_form.errors.select_date"));
    if (!selectedMenu) return toast.error(t("booking_form.errors.select_menu"));

    // ✅ Guest Capacity Check
    if (Number(data.guestCount) > venue.capacity) {
      return toast.error(
        t("booking_form.errors.capacity_error", { capacity: venue.capacity }),
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
        toast.success(
          i18n.language === "ur"
            ? "بکنگ جمع کر دی گئی ہے!"
            : "Booking submitted!",
        );
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (i18n.language === "ur" ? "بکنگ ناکام رہی" : "Booking failed"),
      );
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setValue("eventDate", date, { shouldValidate: true });
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
            {t("booking_form.title")}
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
                {t("booking_form.menu_label")}
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
                {t("booking_form.total_label")}
              </span>
            </div>
            <p className="text-sm font-bold dark:text-white">
              ₨{" "}
              {(
                Number(guestCount || 0) * (selectedMenu?.pricePerHead || 0)
              ).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {t("booking_form.estimated_cost")}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  {t("booking_form.full_name")}
                </label>
                <input
                  {...register("name")}
                  onKeyDown={handleNameKeyDown}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  } dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none transition-colors`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  {t("booking_form.email")}
                </label>
                <input
                  {...register("email")}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  } dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none transition-colors`}
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
                  {t("booking_form.phone")}
                </label>
                <input
                  {...register("phone")}
                  onKeyDown={handlePhoneKeyDown}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  } dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none transition-colors`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  {t("booking_form.event_type")}
                </label>
                <select
                  {...register("eventType")}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.eventType
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  } dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none transition-colors`}
                >
                  <option value="">Select...</option>
                  <option value="Wedding">
                    {i18n.language === "ur" ? "شادی" : "Wedding"}
                  </option>
                  <option value="Birthday">
                    {i18n.language === "ur" ? "سالگرہ" : "Birthday"}
                  </option>
                  <option value="Corporate">
                    {i18n.language === "ur" ? "کارپوریٹ" : "Corporate"}
                  </option>
                  <option value="Other">
                    {i18n.language === "ur" ? "دیگر" : "Other"}
                  </option>
                </select>
                {errors.eventType && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.eventType.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">
                  {t("booking_form.event_date")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(true)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    !selectedDate && (errors.eventDate || errors.eventDate)
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-700"
                  } dark:bg-gray-900 dark:text-white text-sm text-left flex justify-between items-center transition-colors`}
                >
                  {selectedDate
                    ? selectedDate.toLocaleDateString(
                        i18n.language === "ur" ? "ur-PK" : "en-US",
                      )
                    : t("booking_form.choose_date")}
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </button>
                {errors.eventDate && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.eventDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block justify-between">
                  <span>{t("booking_form.guests")}</span>
                  <span className="text-gold-600 font-black">
                    {t("booking_form.max_capacity")}: {venue.capacity}
                  </span>
                </label>
                <input
                  type="number"
                  {...register("guestCount", { valueAsNumber: true })}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.guestCount || Number(guestCount) > venue.capacity
                      ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                      : "border-gray-200 dark:border-gray-700"
                  } dark:bg-gray-900 dark:text-white text-sm focus:border-gold-500 outline-none transition-colors`}
                />
                {errors.guestCount && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.guestCount.message}
                  </p>
                )}
                {Number(guestCount) > venue.capacity && !errors.guestCount && (
                  <p className="text-red-500 text-[10px] font-bold mt-1">
                    {t("booking_form.exceeds_capacity")}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">
                {t("booking_form.message")}
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
              {isSubmitting
                ? t("booking_form.confirming")
                : t("booking_form.complete_booking")}
            </button>
          </form>
        </div>

        {/* Internal Calendar Overlay */}
        {showCalendar && (
          <div className="absolute inset-0 bg-white dark:bg-gray-800 z-[110] flex flex-col p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h4 className="font-bold dark:text-white">
                {t("booking_form.select_date_title")}
              </h4>
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
