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
} from "lucide-react";
import { bookingAPI, venueAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMenu, setActionMenu] = useState(null);

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

  // Filter bookings based on status
  const filteredBookings = bookings.filter((booking) => {
    return statusFilter === "all" || booking.status === statusFilter;
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingAPI.updateStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
      setActionMenu(null);
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error("Error updating booking status:", error);
    }
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
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
      case "completed":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Status", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "confirmed", label: "Confirmed", color: "green" },
    { value: "completed", label: "Completed", color: "blue" },
    { value: "cancelled", label: "Cancelled", color: "red" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Manage Bookings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  View, filter, and manage all venue bookings in one place.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center gap-4">
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full text-sm font-medium">
                  {filteredBookings.length} bookings
                </span>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredBookings.length} of {bookings.length} total
                bookings
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Customer & Venue
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Event Details
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Contact
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Amount
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      {/* Customer & Venue */}
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {booking.customerName || booking.customer?.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {booking.venueName || booking.venue?.name}
                          </div>
                        </div>
                      </td>

                      {/* Event Details */}
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(
                            booking.eventDate || booking.date
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {booking.eventType} •{" "}
                          {booking.guestCount || booking.guests} guests
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {booking.phone}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                          {booking.email}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ₨
                          {(typeof booking.amount === "number"
                            ? booking.amount
                            : parseInt(
                                booking.amount?.replace(/[^0-9]/g, "") || 0
                              )
                          ).toLocaleString()}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span className="text-sm font-medium capitalize">
                            {booking.status}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActionMenu(
                                actionMenu === booking._id ? null : booking._id
                              )
                            }
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <MoreVertical
                              size={18}
                              className="text-gray-500 dark:text-gray-400"
                            />
                          </button>

                          {actionMenu === booking._id && (
                            <div className="absolute right-0 top-12 z-10 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                              <button
                                onClick={() =>
                                  handleStatusChange(booking._id, "confirmed")
                                }
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <CheckCircle
                                  size={16}
                                  className="text-green-500"
                                />
                                Confirm
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(booking._id, "completed")
                                }
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <CalendarCheck
                                  size={16}
                                  className="text-blue-500"
                                />
                                Complete
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(booking._id, "pending")
                                }
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <Clock size={16} className="text-yellow-500" />
                                Set Pending
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(booking._id, "cancelled")
                                }
                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <XCircle size={16} />
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <CalendarCheck
                    size={32}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  {statusFilter !== "all"
                    ? `No ${statusFilter} bookings found. Try selecting a different status filter.`
                    : "No bookings have been made yet. They will appear here once customers start booking your venues."}
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusOptions.slice(1).map((status) => (
              <div
                key={status.value}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                      {status.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {bookings.filter((b) => b.status === status.value).length}
                    </p>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${
                      status.color === "green"
                        ? "bg-green-100 dark:bg-green-900"
                        : status.color === "yellow"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : status.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-red-100 dark:bg-red-900"
                    }`}
                  >
                    {getStatusIcon(status.value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageBooking;
