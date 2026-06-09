// src/pages/user/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Clock,
  CheckCircle,
  XCircle,
  CalendarCheck,
  Calendar,
  User,
} from "lucide-react";
import { bookingAPI } from "../../utils/api";
import BookingCard from "./BookingCard";
import DeleteBookingModal from "../../components/booking/DeleteBookingModal";
import { toast } from "../../components/common/Toast";
import StatsCard from "../../components/common/StatsCard"; // Import the reusable component
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const MyBookings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingAPI.getUserBookings();
      if (res.data.success) {
        setBookings(res.data.data || []);
      }
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <>
      <Helmet>
        <title>{t("my_bookings.title")} - SwatVenue</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-surface-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("my_bookings.title")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                {t("my_bookings.subtitle")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                    {user?.name}
                  </p>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-full border border-blue-100 dark:border-blue-500/30">
                    <CheckCircle size={10} className="text-blue-600 dark:text-blue-400 fill-current" />
                    <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.1em]">
                  {user?.email}
                </p>
              </div>
              
              <div className="w-14 h-14 rounded-full p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden flex-shrink-0">
                {user?.profilePicture?.url ? (
                  <img src={user.profilePicture.url} alt="" className="w-full h-full rounded-full object-cover shadow-sm" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950">
                    <User size={24} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats / Filters using reusable StatsCard */}
          <div className="mb-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* All Bookings */}
              <StatsCard
                title={t("my_bookings.all_bookings")}
                value={bookings.length}
                icon={Calendar}
                color="gold"
                isActive={filter === "all"}
                onClick={() => setFilter("all")}
              />

              {/* Pending Bookings */}
              <StatsCard
                title={t("my_bookings.pending")}
                value={bookings.filter((b) => b.status === "pending").length}
                icon={Clock}
                color="amber"
                isActive={filter === "pending"}
                onClick={() => setFilter("pending")}
              />

              {/* Confirmed Bookings */}
              <StatsCard
                title={t("my_bookings.confirmed")}
                value={bookings.filter((b) => b.status === "confirmed").length}
                icon={CheckCircle}
                color="green"
                isActive={filter === "confirmed"}
                onClick={() => setFilter("confirmed")}
              />

              {/* Completed Bookings */}
              <StatsCard
                title={t("my_bookings.completed")}
                value={bookings.filter((b) => b.status === "completed").length}
                icon={CalendarCheck}
                color="blue"
                isActive={filter === "completed"}
                onClick={() => setFilter("completed")}
              />

              {/* Cancelled Bookings */}
              <StatsCard
                title={t("my_bookings.cancelled")}
                value={bookings.filter((b) => b.status === "cancelled").length}
                icon={XCircle}
                color="red"
                isActive={filter === "cancelled"}
                onClick={() => setFilter("cancelled")}
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-3">
                {t("my_bookings.loading")}
              </p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-surface-800 p-12 rounded-xl text-center border border-gray-200 dark:border-surface-700">
              <Calendar className="mx-auto h-12 w-12 text-gold-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("my_bookings.no_bookings")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "all"
                  ? t("my_bookings.no_bookings_desc")
                  : t("my_bookings.no_filter_bookings", { status: t(`my_bookings.${filter}`) })}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  onDeleteClick={setDeleteModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteModal && (
        <DeleteBookingModal
          booking={deleteModal}
          onClose={() => setDeleteModal(null)}
          onBookingDeleted={(id) =>
            setBookings((prev) => prev.filter((b) => b._id !== id))
          }
        />
      )}
    </>
  );
};

export default MyBookings;

