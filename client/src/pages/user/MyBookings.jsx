// src/pages/user/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Clock,
  CheckCircle,
  XCircle,
  CalendarCheck,
  Calendar,
} from "lucide-react";
import { bookingAPI } from "../../utils/api";
import BookingCard from "./BookingCard";
import DeleteBookingModal from "../../components/booking/DeleteBookingModal";
import { toast } from "../../components/common/Toast";
import StatsCard from "../../components/common/StatsCard"; // Import the reusable component

const MyBookings = () => {
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
        <title>My Bookings - SwatVenue</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-surface-900 py-10">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track the status of your venue bookings
            </p>
          </div>

          {/* Stats / Filters using reusable StatsCard */}
          <div className="mb-10">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* All Bookings */}
              <StatsCard
                title="All Bookings"
                value={bookings.length}
                icon={Calendar}
                color="gold"
                isActive={filter === "all"}
                onClick={() => setFilter("all")}
              />

              {/* Pending Bookings */}
              <StatsCard
                title="Pending"
                value={bookings.filter((b) => b.status === "pending").length}
                icon={Clock}
                color="amber"
                isActive={filter === "pending"}
                onClick={() => setFilter("pending")}
              />

              {/* Confirmed Bookings */}
              <StatsCard
                title="Confirmed"
                value={bookings.filter((b) => b.status === "confirmed").length}
                icon={CheckCircle}
                color="green"
                isActive={filter === "confirmed"}
                onClick={() => setFilter("confirmed")}
              />

              {/* Completed Bookings */}
              <StatsCard
                title="Completed"
                value={bookings.filter((b) => b.status === "completed").length}
                icon={CalendarCheck}
                color="blue"
                isActive={filter === "completed"}
                onClick={() => setFilter("completed")}
              />

              {/* Cancelled Bookings */}
              <StatsCard
                title="Cancelled"
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
                Loading your bookings...
              </p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-surface-800 p-12 rounded-xl text-center border border-gray-200 dark:border-surface-700">
              <Calendar className="mx-auto h-12 w-12 text-gold-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "all"
                  ? "You haven't made any bookings yet."
                  : `You don't have any ${filter} bookings.`}
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
