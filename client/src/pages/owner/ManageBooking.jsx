import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
  MoreVertical,
  MapPin,
  Users,
  Calendar,
  Phone,
  Mail,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { bookingAPI, venueAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import DeleteBookingModal from "../../components/DeleteBookingModal";

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchBookingsForOwner();
  }, []);

  const fetchBookingsForOwner = async () => {
    try {
      setLoading(true);
      const venuesResponse = await venueAPI.getOwnerVenues();
      const ownerVenues = venuesResponse.data.data || [];

      const allBookings = [];
      for (const venue of ownerVenues) {
        try {
          const bookingsResponse = await bookingAPI.getVenueBookings(
            venue._id || venue.id
          );
          if (bookingsResponse.data.success) {
            const venueBookings = bookingsResponse.data.data.map((booking) => ({
              ...booking,
              venueName: venue.name,
            }));
            allBookings.push(...venueBookings);
          }
        } catch (error) {
          console.error(
            `Error fetching bookings for venue ${venue.name}:`,
            error
          );
        }
      }

      allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(allBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    return statusFilter === "all" || booking.status === statusFilter;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingAPI.updateStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
      setExpandedBooking(null);
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error("Error updating booking status:", error);
    }
  };

  const handleDeleteSuccess = (deletedBookingId) => {
    setBookings((prev) => prev.filter((b) => b._id !== deletedBookingId));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "pending":
        return <Clock size={16} className="text-yellow-500" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-500" />;
      case "completed":
        return <CalendarCheck size={16} className="text-blue-500" />;
      default:
        return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 dark:bg-green-950/20";
      case "pending":
        return "bg-yellow-50 dark:bg-yellow-950/20";
      case "cancelled":
        return "bg-red-50 dark:bg-red-950/20";
      case "completed":
        return "bg-blue-50 dark:bg-blue-950/20";
      default:
        return "bg-gray-50 dark:bg-gray-950/20";
    }
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
        <title>Manage Bookings - SwatVenue</title>
        <meta name="description" content="View and manage venue bookings." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Manage Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              View, filter, and manage all your venue bookings
            </p>
          </div>

          {/* Filter Section */}
          <div className="mb-8 flex flex-wrap gap-2 sm:gap-3">
            {[
              { value: "all", label: "All", count: bookings.length },
              {
                value: "pending",
                label: "Pending",
                count: bookings.filter((b) => b.status === "pending").length,
              },
              {
                value: "confirmed",
                label: "Confirmed",
                count: bookings.filter((b) => b.status === "confirmed").length,
              },
              {
                value: "completed",
                label: "Completed",
                count: bookings.filter((b) => b.status === "completed").length,
              },
              {
                value: "cancelled",
                label: "Cancelled",
                count: bookings.filter((b) => b.status === "cancelled").length,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  statusFilter === filter.value
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/50"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500"
                }`}
              >
                {filter.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    statusFilter === filter.value
                      ? "bg-white/20"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6">
                <CalendarCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No bookings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                {statusFilter !== "all"
                  ? `No ${statusFilter} bookings found. Try selecting a different status filter.`
                  : "No bookings have been made yet. They will appear here once customers start booking your venues."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className={`rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${getStatusBgColor(
                    booking.status
                  )}`}
                >
                  {/* Main Row */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                              {booking.customerName || booking.customer?.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.venueName || booking.venue?.name}
                            </p>
                          </div>
                        </div>

                        {/* Key Info */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Event Date
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {new Date(
                                  booking.eventDate || booking.date
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Guests
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {booking.guestCount || booking.guests}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Type
                              </p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                                {booking.eventType}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              Amount
                            </p>
                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                              ₨
                              {(typeof booking.amount === "number"
                                ? booking.amount
                                : parseInt(
                                    booking.amount?.replace(/[^0-9]/g, "") || 0
                                  )
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-medium text-sm ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </div>
                        <button
                          onClick={() =>
                            setExpandedBooking(
                              expandedBooking === booking._id
                                ? null
                                : booking._id
                            )
                          }
                          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <ChevronDown
                            size={20}
                            className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                              expandedBooking === booking._id
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Section */}
                    {expandedBooking === booking._id && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                        {/* Contact Info */}
                        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Contact Information
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  Phone
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {booking.phone}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                  Email
                                </p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                  {booking.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Message if exists */}
                        {booking.message && (
                          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              Customer Message
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/50 p-3 rounded-lg">
                              {booking.message}
                            </p>
                          </div>
                        )}

                        {/* Status Actions */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                            Update Status
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              {
                                status: "confirmed",
                                label: "Confirm",
                                icon: CheckCircle,
                                color: "green",
                              },
                              {
                                status: "completed",
                                label: "Complete",
                                icon: CalendarCheck,
                                color: "blue",
                              },
                              {
                                status: "pending",
                                label: "Pending",
                                icon: Clock,
                                color: "yellow",
                              },
                              {
                                status: "cancelled",
                                label: "Cancel",
                                icon: XCircle,
                                color: "red",
                              },
                            ].map((option) => {
                              const Icon = option.icon;
                              const isActive = booking.status === option.status;
                              return (
                                <button
                                  key={option.status}
                                  onClick={() =>
                                    handleStatusChange(
                                      booking._id,
                                      option.status
                                    )
                                  }
                                  className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                                    isActive
                                      ? option.color === "green"
                                        ? "bg-green-600 text-white"
                                        : option.color === "blue"
                                        ? "bg-blue-600 text-white"
                                        : option.color === "yellow"
                                        ? "bg-yellow-600 text-white"
                                        : "bg-red-600 text-white"
                                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                  }`}
                                >
                                  <Icon size={16} />
                                  <span className="hidden sm:inline">
                                    {option.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div>
                          <button
                            onClick={() => setDeleteModal(booking)}
                            className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800"
                          >
                            <Trash2 size={18} />
                            Delete Booking
                          </button>
                        </div>
                      </div>
                    )}
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

export default ManageBooking;
