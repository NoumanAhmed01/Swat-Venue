import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Building,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Eye,
  TrendingUp,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";
import { bookingAPI, venueAPI, inquiryAPI } from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    venues: 0,
    bookings: 0,
    revenue: 0,
    inquiries: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [venuesResponse, inquiriesResponse] = await Promise.all([
        venueAPI.getOwnerVenues(),
        inquiryAPI.getOwnerInquiries().catch(() => ({ data: { data: [] } })),
      ]);

      const venues = venuesResponse.data.data || [];
      const inquiries = inquiriesResponse.data.data || [];

      let allBookings = [];
      let totalRevenue = 0;

      for (const venue of venues) {
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

            totalRevenue += venueBookings
              .filter(
                (b) => b.status === "confirmed" || b.status === "completed"
              )
              .reduce((sum, b) => sum + (b.amount || 0), 0);
          }
        } catch (error) {
          console.error(
            `Error fetching bookings for venue ${venue.name}:`,
            error
          );
        }
      }

      allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setStats({
        venues: venues.length,
        bookings: allBookings.length,
        revenue: totalRevenue,
        inquiries: inquiries.length,
      });

      setRecentBookings(allBookings.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: "Total Venues",
      value: stats.venues.toString(),
      change: `${stats.venues} active`,
      icon: Building,
      color: "bg-blue-500",
    },
    {
      title: "Total Bookings",
      value: stats.bookings.toString(),
      change: `All time bookings`,
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: `₨${stats.revenue.toLocaleString()}`,
      change: "From confirmed bookings",
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      title: "Inquiries",
      value: stats.inquiries.toString(),
      change: "Customer inquiries",
      icon: MessageSquare,
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      title: "Add New Venue",
      description: "List a new venue on the platform",
      icon: Plus,
      link: "/owner/add-venue",
      color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: "Manage Venues",
      description: "Edit or update your existing venues",
      icon: Building,
      link: "/owner/manage-venues",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "View Inquiries",
      description: "Respond to customer inquiries",
      icon: MessageSquare,
      link: "/owner/inquiries",
      color: "bg-orange-600 hover:bg-orange-700",
    },
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
        <title>Owner Dashboard - SwatVenue</title>
        <meta
          name="description"
          content="Manage your venues, bookings, and inquiries on SwatVenue."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Owner Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back! Here's what's happening with your venues.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.link}
                      className={`block p-4 rounded-lg text-white transition-colors duration-200 ${action.color}`}
                    >
                      <div className="flex items-center space-x-3">
                        <action.icon className="h-6 w-6" />
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm opacity-90">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Bookings
                  </h2>
                  <Link
                    to="/owner/booking"
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    View all
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Venue
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-8 text-center text-gray-500 dark:text-gray-400"
                          >
                            No bookings yet
                          </td>
                        </tr>
                      ) : (
                        recentBookings.map((booking) => (
                          <tr
                            key={booking._id}
                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="py-3 px-4 text-gray-900 dark:text-white">
                              {booking.venueName}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                              {booking.customerName}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                              {new Date(booking.eventDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  booking.status === "confirmed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : booking.status === "completed"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }`}
                              >
                                {booking.status === "confirmed" && (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                                {booking.status === "pending" && (
                                  <Clock className="h-3 w-3" />
                                )}
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                              ₨{booking.amount?.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          {/* <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Revenue Overview
              </h2>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Revenue chart would appear here
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Integration with charting library needed
                  </p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
