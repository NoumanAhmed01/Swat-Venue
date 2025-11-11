import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Phone,
  Trash2,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import { bookingAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import DeleteBookingModal from "../../components/DeleteBookingModal";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      if (response.data.success) {
        setBookings(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuccess = (deletedBookingId) => {
    setBookings((prev) => prev.filter((b) => b._id !== deletedBookingId));
  };

  const filteredBookings = bookings.filter(
    (booking) => filter === "all" || booking.status === filter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "completed":
        return <CalendarCheck className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const canDeleteBooking = (booking) => {
    return booking.status !== "completed" && booking.status !== "cancelled";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Bookings - SwatVenue</title>
        <meta
          name="description"
          content="View and manage your venue bookings"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-3">
              My Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Track and manage all your venue bookings in one place
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "confirmed", label: "Confirmed" },
                { key: "completed", label: "Completed" },
                { key: "cancelled", label: "Cancelled" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                    filter === tab.key
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/50"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      filter === tab.key
                        ? "bg-white/20"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {tab.key === "all"
                      ? bookings.length
                      : bookings.filter((b) => b.status === tab.key).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Grid */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
                <Calendar className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No bookings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                {filter === "all"
                  ? "You haven't made any venue bookings yet. Start exploring and book your perfect venue!"
                  : `You don't have any ${filter} bookings.`}
              </p>
              <Link
                to="/venues"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Explore Venues
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Header with Venue Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                    {booking.venue?.images?.[0] && (
                      <img
                        src={booking.venue.images[0]}
                        alt={booking.venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/20">
                      {getStatusIcon(booking.status)}
                      <span
                        className={`text-xs font-bold capitalize ${
                          booking.status === "confirmed"
                            ? "text-green-300"
                            : booking.status === "pending"
                            ? "text-yellow-300"
                            : booking.status === "completed"
                            ? "text-blue-300"
                            : "text-red-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Venue Name */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {booking.venue?.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm">{booking.venue?.location}</span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-5 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Event Date
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {new Date(booking.eventDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Guests
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {booking.guestCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact and Amount */}
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                          Contact
                        </p>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {booking.phone}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                          Amount
                        </p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ₨{booking.amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Event Type */}
                    <div className="mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        Event Type
                      </p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {booking.eventType}
                      </p>
                    </div>

                    {/* Message if exists */}
                    {booking.message && (
                      <div className="mb-5 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                          Your Note
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {booking.message}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        to={`/venue/${booking.venue?._id || booking.venue?.id}`}
                        className="flex-1 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg font-medium text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-center border border-emerald-200 dark:border-emerald-800"
                      >
                        View Venue
                      </Link>
                      {canDeleteBooking(booking) && (
                        <button
                          onClick={() => setDeleteModal(booking)}
                          className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg font-medium text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-200 dark:border-red-800 inline-flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          {bookings.length > 0 && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { status: "pending", label: "Pending", color: "yellow" },
                { status: "confirmed", label: "Confirmed", color: "green" },
                { status: "completed", label: "Completed", color: "blue" },
                { status: "cancelled", label: "Cancelled", color: "red" },
              ].map((stat) => (
                <div
                  key={stat.status}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {
                          bookings.filter((b) => b.status === stat.status)
                            .length
                        }
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        stat.color === "green"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : stat.color === "yellow"
                          ? "bg-yellow-100 dark:bg-yellow-900/30"
                          : stat.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-red-100 dark:bg-red-900/30"
                      }`}
                    >
                      {getStatusIcon(stat.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteBookingModal
          booking={deleteModal}
          onClose={() => setDeleteModal(null)}
          onBookingDeleted={handleDeleteSuccess}
        />
      )}
    </>
  );
};

export default MyBookings;
