import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
  MapPin,
  Users,
  Calendar,
  Phone,
  Mail,
  Trash2,
  ChevronDown,
  Eye,
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

  const getStatusColor = (status) => {
    const colors = {
      confirmed:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      completed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    };
    return (
      colors[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: <CheckCircle className="h-4 w-4" />,
      pending: <Clock className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
      completed: <CalendarCheck className="h-4 w-4" />,
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Bookings - SwatVenue</title>
        <meta name="description" content="Manage venue bookings" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-surface-900 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {/* Header - Compact */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Manage Bookings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mt-1">
                  View and manage all venue bookings
                </p>
              </div>
            </div>
          </div>

          {/* Filters - Compact */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All", count: bookings.length },
                {
                  key: "pending",
                  label: "Pending",
                  count: bookings.filter((b) => b.status === "pending").length,
                },
                {
                  key: "confirmed",
                  label: "Confirmed",
                  count: bookings.filter((b) => b.status === "confirmed")
                    .length,
                },
                {
                  key: "completed",
                  label: "Completed",
                  count: bookings.filter((b) => b.status === "completed")
                    .length,
                },
                {
                  key: "cancelled",
                  label: "Cancelled",
                  count: bookings.filter((b) => b.status === "cancelled")
                    .length,
                },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === filter.key
                      ? "bg-gold-500 text-white"
                      : "bg-white dark:bg-surface-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-gold-400"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                      statusFilter === filter.key
                        ? "bg-white/20"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List - Compact */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-surface-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 mb-4">
                <CalendarCheck className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {statusFilter !== "all"
                  ? `No ${statusFilter} bookings found.`
                  : "No bookings have been made yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-surface-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    {/* Main Info - Compact Row */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                          <div
                            className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {booking.customerName || booking.customer?.name}
                          </h3>
                        </div>

                        {/* Compact Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Venue
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {booking.venueName || booking.venue?.name}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Date
                            </p>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {new Date(
                                  booking.eventDate || booking.date
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Guests
                            </p>
                            <div className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.guestCount || booking.guests}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Type
                            </p>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize truncate">
                                {booking.eventType}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Amount
                            </p>
                            <p className="text-sm font-bold text-gold-600 dark:text-gold-400">
                              Rs.{" "}
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

                      {/* Quick Actions */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          onClick={() =>
                            setExpandedBooking(
                              expandedBooking === booking._id
                                ? null
                                : booking._id
                            )
                          }
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-gray-500 dark:text-gray-400"
                          title="View details"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedBooking === booking._id
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details - Compact */}
                    {expandedBooking === booking._id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-4">
                          {/* Contact Info - Compact */}
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Eye className="h-4 w-4 text-gray-400" />
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                Contact Details
                              </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Phone
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {booking.phone}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Email
                                  </p>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {booking.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Message - Compact */}
                          {booking.message && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Customer Message
                              </h4>
                              <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {booking.message}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Status Actions - Compact */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                              Update Status
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                {
                                  status: "confirmed",
                                  label: "Confirm",
                                  icon: CheckCircle,
                                },
                                {
                                  status: "completed",
                                  label: "Complete",
                                  icon: CalendarCheck,
                                },
                                {
                                  status: "pending",
                                  label: "Mark Pending",
                                  icon: Clock,
                                },
                                {
                                  status: "cancelled",
                                  label: "Cancel",
                                  icon: XCircle,
                                },
                              ].map((option) => {
                                const Icon = option.icon;
                                return (
                                  <button
                                    key={option.status}
                                    onClick={() =>
                                      handleStatusChange(
                                        booking._id,
                                        option.status
                                      )
                                    }
                                    className={`px-3 py-2 rounded text-sm font-medium flex items-center justify-center gap-1.5 ${
                                      booking.status === option.status
                                        ? "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-default"
                                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span className="text-xs sm:text-sm">
                                      {option.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Delete Button - Compact */}
                          <div>
                            <button
                              onClick={() => setDeleteModal(booking)}
                              className="w-full px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-200 dark:border-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Booking
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
