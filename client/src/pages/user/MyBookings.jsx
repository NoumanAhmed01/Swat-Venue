import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  CalendarCheck,
  AlertCircle,
} from "lucide-react";
import { bookingAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "confirmed":
        return "Your booking has been confirmed by the venue owner.";
      case "pending":
        return "Your booking is awaiting confirmation from the venue owner.";
      case "cancelled":
        return "This booking has been cancelled.";
      case "completed":
        return "This event has been completed.";
      default:
        return "";
    }
  };

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
        <title>My Bookings - SwatVenue</title>
        <meta
          name="description"
          content="View and manage your venue bookings"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and track the status of your venue bookings
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
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
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      filter === tab.key
                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800">
                      {tab.key === "all"
                        ? bookings.length
                        : bookings.filter((b) => b.status === tab.key).length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
              <div className="text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {filter === "all"
                    ? "You haven't made any venue bookings yet."
                    : `You don't have any ${filter} bookings.`}
                </p>
                <Link
                  to="/venues"
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Browse Venues
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {booking.venue?.name}
                          </h3>
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">
                            {booking.venue?.location}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{getStatusMessage(booking.status)}</span>
                        </div>
                      </div>
                      {booking.venue?.images?.[0] && (
                        <img
                          src={booking.venue.images[0]}
                          alt={booking.venue.name}
                          className="w-24 h-24 rounded-lg object-cover ml-4"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                          <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Event Date
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(booking.eventDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {booking.eventType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Guests
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.guestCount} people
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Contact
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                          <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Amount
                          </p>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            ₨{booking.amount?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {booking.message && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Your Message:
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {booking.message}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Booked on{" "}
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <Link
                        to={`/venue/${booking.venue?._id || booking.venue?.id}`}
                        className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        View Venue →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Summary */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { status: "pending", label: "Pending", color: "yellow" },
              { status: "confirmed", label: "Confirmed", color: "green" },
              { status: "completed", label: "Completed", color: "blue" },
              { status: "cancelled", label: "Cancelled", color: "red" },
            ].map((stat) => (
              <div
                key={stat.status}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {bookings.filter((b) => b.status === stat.status).length}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      stat.color === "green"
                        ? "bg-green-100 dark:bg-green-900"
                        : stat.color === "yellow"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : stat.color === "blue"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-red-100 dark:bg-red-900"
                    }`}
                  >
                    {getStatusIcon(stat.status)}
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

export default MyBookings;
