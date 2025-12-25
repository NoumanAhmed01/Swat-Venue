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
import toast from "react-hot-toast";

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

  const stats = [
    { key: "all", label: "All", icon: Calendar },
    { key: "pending", label: "Pending", icon: Clock },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "completed", label: "Completed", icon: CalendarCheck },
    { key: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  return (
    <>
      <Helmet>
        <title>My Bookings</title>
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

          {/* Stats / Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {stats.map((s) => {
              const Icon = s.icon;
              const count =
                s.key === "all"
                  ? bookings.length
                  : bookings.filter((b) => b.status === s.key).length;

              return (
                <button
                  key={s.key}
                  onClick={() => setFilter(s.key)}
                  className={`rounded-xl border p-4 text-left transition ${
                    filter === s.key
                      ? "border-gold-500 bg-white dark:bg-surface-800"
                      : "bg-white dark:bg-surface-800 border-gray-200 dark:border-surface-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{s.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {count}
                      </p>
                    </div>
                    <Icon className="h-6 w-6 text-gold-500" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content */}
          {loading ? (
            <p className="text-center text-gray-500">Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-surface-800 p-12 rounded-xl text-center border">
              <Calendar className="mx-auto h-10 w-10 text-gold-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No bookings found
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
