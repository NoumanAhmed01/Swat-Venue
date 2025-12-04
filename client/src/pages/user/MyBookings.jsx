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
  Building,
  User,
  DollarSign,
  MessageSquare,
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
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <CalendarCheck className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
    }
  };

  const canDeleteBooking = (booking) => {
    return booking.status !== "completed" && booking.status !== "cancelled";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-gold-50 dark:from-surface-900 dark:to-surface-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gold-100 to-burgundy-100 dark:from-gold-900/20 dark:to-burgundy-900/20 mb-4">
            <Calendar className="h-8 w-8 text-gold-600 dark:text-gold-400" />
          </div>
          <p className="text-primary-700 dark:text-text-dark font-medium">
            Loading your bookings...
          </p>
        </div>
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

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-gold-100 to-burgundy-100 dark:from-gold-900/20 dark:to-burgundy-900/20">
                    <Calendar className="h-6 w-6 text-gold-600 dark:text-gold-400" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-900 via-gold-600 to-burgundy-600 dark:from-text-dark dark:via-gold-400 dark:to-burgundy-400 bg-clip-text text-transparent">
                    My Bookings
                  </h1>
                </div>
                <p className="text-primary-600 dark:text-text-dark/80 text-sm sm:text-base max-w-2xl">
                  Track and manage all your venue bookings in one place
                </p>
              </div>

              {bookings.length > 0 && (
                <div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm border border-primary-200 dark:border-surface-700">
                  <p className="text-sm text-primary-600 dark:text-text-dark/80 mb-1">
                    Total Bookings
                  </p>
                  <p className="text-2xl font-bold text-primary-900 dark:text-text-dark">
                    {bookings.length}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Summary */}
          {bookings.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { status: "pending", label: "Pending", icon: Clock },
                  {
                    status: "confirmed",
                    label: "Confirmed",
                    icon: CheckCircle,
                  },
                  {
                    status: "completed",
                    label: "Completed",
                    icon: CalendarCheck,
                  },
                  { status: "cancelled", label: "Cancelled", icon: XCircle },
                ].map((stat) => {
                  const Icon = stat.icon;
                  const count = bookings.filter(
                    (b) => b.status === stat.status
                  ).length;
                  return (
                    <div
                      key={stat.status}
                      className="group bg-white dark:bg-surface-800 rounded-xl p-4 border border-primary-100 dark:border-surface-700 hover:border-gold-300 dark:hover:border-gold-700 transition-all duration-200 cursor-pointer hover:shadow-md"
                      onClick={() => setFilter(stat.status)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-primary-500 dark:text-text-dark/60 uppercase tracking-wide">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold text-primary-900 dark:text-text-dark mt-1">
                            {count}
                          </p>
                        </div>
                        <div
                          className={`p-2.5 rounded-lg ${getStatusColor(
                            stat.status
                          )}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div
                        className={`mt-3 h-1 rounded-full transition-all duration-300 ${
                          filter === stat.status
                            ? "bg-gold-500"
                            : "bg-primary-100 dark:bg-surface-700 group-hover:bg-gold-200 dark:group-hover:bg-gold-900/30"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Filter Tabs */}
          {bookings.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-medium text-primary-600 dark:text-text-dark/80 mb-3">
                Filter by status:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All Bookings" },
                  { key: "pending", label: "Pending" },
                  { key: "confirmed", label: "Confirmed" },
                  { key: "completed", label: "Completed" },
                  { key: "cancelled", label: "Cancelled" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      filter === tab.key
                        ? "bg-gradient-to-r from-gold-500 to-burgundy-600 text-white shadow-lg shadow-gold-500/30"
                        : "bg-white dark:bg-surface-800 text-primary-700 dark:text-text-dark/80 border border-primary-200 dark:border-surface-700 hover:border-gold-400 dark:hover:border-gold-600"
                    }`}
                  >
                    {getStatusIcon(tab.key === "all" ? "all" : tab.key)}
                    <span>{tab.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        filter === tab.key
                          ? "bg-white/20"
                          : "bg-primary-50 dark:bg-surface-700 text-primary-600 dark:text-text-dark/80"
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
          )}

          {/* Bookings Grid */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-primary-200 dark:border-surface-700 p-8 sm:p-12 lg:p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-gold-100 to-burgundy-100 dark:from-gold-900/20 dark:to-burgundy-900/20 mb-6">
                <Calendar className="h-10 w-10 text-gold-600 dark:text-gold-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary-900 dark:text-text-dark mb-3">
                No bookings found
              </h3>
              <p className="text-primary-600 dark:text-text-dark/80 mb-8 max-w-sm mx-auto">
                {filter === "all"
                  ? "You haven't made any venue bookings yet. Start exploring and book your perfect venue!"
                  : `You don't have any ${filter} bookings.`}
              </p>
              <Link
                to="/venues"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-burgundy-600 hover:from-gold-600 hover:to-burgundy-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-gold-500/30"
              >
                Explore Venues
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="group bg-white dark:bg-surface-800 rounded-2xl shadow-sm hover:shadow-xl border border-primary-100 dark:border-surface-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Status Header */}
                  <div
                    className={`px-4 py-3 border-b ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span className="text-sm font-semibold capitalize">
                          {booking.status}
                        </span>
                      </div>
                      <span className="text-xs font-medium">
                        Booking ID: {booking._id?.slice(-6) || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Venue Image */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary-100 to-gold-100 dark:from-surface-700 dark:to-surface-600">
                    {booking.venue?.images?.[0] && (
                      <img
                        src={booking.venue.images[0]}
                        alt={booking.venue.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-1">
                        {booking.venue?.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-primary-600 dark:text-text-dark/80 mb-4">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-gold-600 dark:text-gold-400" />
                      <span className="text-sm">{booking.venue?.location}</span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary-50 dark:bg-surface-700">
                            <Calendar className="h-4 w-4 text-primary-600 dark:text-text-dark" />
                          </div>
                          <div>
                            <p className="text-xs text-primary-500 dark:text-text-dark/60 font-medium">
                              Event Date
                            </p>
                            <p className="text-sm font-bold text-primary-900 dark:text-text-dark">
                              {new Date(booking.eventDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary-50 dark:bg-surface-700">
                            <Users className="h-4 w-4 text-primary-600 dark:text-text-dark" />
                          </div>
                          <div>
                            <p className="text-xs text-primary-500 dark:text-text-dark/60 font-medium">
                              Guests
                            </p>
                            <p className="text-sm font-bold text-primary-900 dark:text-text-dark">
                              {booking.guestCount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Type and Contact */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-xs text-primary-500 dark:text-text-dark/60 font-medium mb-1">
                          Event Type
                        </p>
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                          <p className="text-sm font-medium text-primary-900 dark:text-text-dark capitalize">
                            {booking.eventType}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-primary-500 dark:text-text-dark/60 font-medium mb-1">
                          Contact
                        </p>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4 text-primary-600 dark:text-text-dark/80" />
                          <p className="text-sm font-medium text-primary-900 dark:text-text-dark">
                            {booking.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="mb-5 p-3 bg-gradient-to-r from-gold-50 to-burgundy-50 dark:from-gold-900/10 dark:to-burgundy-900/10 rounded-lg border border-gold-200 dark:border-gold-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-primary-600 dark:text-text-dark/80">
                            Total Amount
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gold-700 dark:text-gold-400">
                          ₨. {booking.amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Message if exists */}
                    {booking.message && (
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-primary-600 dark:text-text-dark/80" />
                          <p className="text-xs font-medium text-primary-500 dark:text-text-dark/60">
                            Your Note
                          </p>
                        </div>
                        <div className="bg-primary-50 dark:bg-surface-700 rounded-lg p-3">
                          <p className="text-sm text-primary-700 dark:text-text-dark/80 italic line-clamp-2">
                            "{booking.message}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-primary-100 dark:border-surface-700">
                      <Link
                        to={`/venue/${booking.venue?._id || booking.venue?.id}`}
                        className="flex-1 px-4 py-2.5 bg-primary-50 hover:bg-primary-100 dark:bg-surface-700 dark:hover:bg-surface-600 text-primary-700 dark:text-text-dark rounded-lg font-medium text-sm transition-colors text-center border border-primary-200 dark:border-surface-600 hover:border-primary-300 dark:hover:border-surface-500"
                      >
                        View Venue
                      </Link>
                      {canDeleteBooking(booking) && (
                        <button
                          onClick={() => setDeleteModal(booking)}
                          className="px-4 py-2.5 bg-gradient-to-r from-red-50 to-burgundy-50 dark:from-red-900/10 dark:to-burgundy-900/10 hover:from-red-100 hover:to-burgundy-100 dark:hover:from-red-900/20 dark:hover:to-burgundy-900/20 text-red-700 dark:text-red-400 rounded-lg font-medium text-sm transition-colors border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 inline-flex items-center justify-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Message */}
          {filter !== "all" && filteredBookings.length > 0 && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setFilter("all")}
                className="inline-flex items-center gap-2 text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 font-medium transition-colors"
              >
                View all {bookings.length} bookings
                <ChevronRight className="h-4 w-4" />
              </button>
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
