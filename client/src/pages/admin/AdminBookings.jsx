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
  DollarSign,
  Building,
} from "lucide-react";
import { bookingAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAllBookings();
      if (response.data.success) {
        setBookings(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "completed":
        return <CalendarCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

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
        <title>All Bookings - SwatVenue Admin</title>
        <meta
          name="description"
          content="View and manage all platform bookings"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              All Bookings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and monitor all venue bookings across the platform
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {bookings.length}
                  </p>
                </div>
                <Building className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {[
              {
                status: "pending",
                label: "Pending",
                color: "yellow",
                icon: Clock,
              },
              {
                status: "confirmed",
                label: "Confirmed",
                color: "green",
                icon: CheckCircle,
              },
              {
                status: "completed",
                label: "Completed",
                color: "blue",
                icon: CalendarCheck,
              },
              {
                status: "cancelled",
                label: "Cancelled",
                color: "red",
                icon: XCircle,
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
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
                        {
                          bookings.filter((b) => b.status === stat.status)
                            .length
                        }
                      </p>
                    </div>
                    <div
                      className={`p-2 rounded-lg ${
                        stat.color === "green"
                          ? "bg-green-100 dark:bg-green-900"
                          : stat.color === "yellow"
                          ? "bg-yellow-100 dark:bg-yellow-900"
                          : stat.color === "blue"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-red-100 dark:bg-red-900"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">
                  Total Revenue (Confirmed + Completed)
                </p>
                <p className="text-4xl font-bold">
                  ₨{totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-16 w-16 text-emerald-200" />
            </div>
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
                <p className="text-gray-500 dark:text-gray-400">
                  {filter === "all"
                    ? "No bookings have been made yet."
                    : `No ${filter} bookings found.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Event Details
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {booking.customerName || booking.customer?.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {booking.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.venue?.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {booking.venue?.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-sm text-gray-900 dark:text-white">
                              {new Date(booking.eventDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {booking.eventType} • {booking.guestCount} guests
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs">
                            <div className="flex items-center gap-1 text-gray-900 dark:text-white mb-1">
                              <Phone className="h-3 w-3" />
                              {booking.phone}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">
                                {booking.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            ₨{booking.amount?.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBookings;
