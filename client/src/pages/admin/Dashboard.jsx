import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Users,
  Building,
  Calendar,
  DollarSign,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { userAPI, venueAPI, bookingAPI } from "../../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Users", value: "0", icon: Users, color: "bg-blue-500" },
    {
      title: "Total Venues",
      value: "0",
      icon: Building,
      color: "bg-green-500",
    },
    {
      title: "Total Bookings",
      value: "0",
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Platform Revenue",
      value: "₨0",
      icon: DollarSign,
      color: "bg-amber-500",
    },
  ]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [usersRes, venuesRes, bookingsRes] = await Promise.allSettled([
          userAPI.getAll(),
          venueAPI.getAll(),
          bookingAPI.getAllBookings(),
        ]);

        // Extract data from responses
        const extractData = (response) => {
          if (
            response.status === "fulfilled" &&
            response.value?.data?.success
          ) {
            return {
              count: response.value.data.count || 0,
              data: response.value.data.data || [],
            };
          }
          return { count: 0, data: [] };
        };

        const users = extractData(usersRes);
        const venues = extractData(venuesRes);
        const bookings = extractData(bookingsRes);

        // Get pending venues
        const pendingVenues = venues.data.filter(
          (venue) =>
            venue.status === "pending" ||
            venue.approvalStatus === "pending" ||
            venue.isApproved === false
        );

        // Calculate revenue
        const revenue = bookings.data.reduce(
          (sum, booking) =>
            sum +
            (booking.amount ||
              booking.totalPrice ||
              booking.total ||
              booking.price ||
              booking.bookingAmount ||
              0),
          0
        );

        // Set stats
        setStats([
          {
            title: "Total Users",
            value: users.count.toLocaleString(),
            icon: Users,
            color: "bg-blue-500",
          },
          {
            title: "Total Venues",
            value: venues.count.toLocaleString(),
            icon: Building,
            color: "bg-green-500",
          },
          {
            title: "Total Bookings",
            value: bookings.count.toLocaleString(),
            icon: Calendar,
            color: "bg-purple-500",
          },
          {
            title: "Platform Revenue",
            value: `₨${revenue.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-amber-500",
          },
        ]);

        // Set pending approvals
        setPendingApprovals(pendingVenues);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: "User Management",
      description: "Manage platform users and permissions",
      icon: Users,
      link: "/admin/users",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Venue Approvals",
      description: `Review and approve ${pendingApprovals.length} venue listings`,
      icon: Building,
      link: "/admin/approvals",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Contact Management",
      description: "Manage user contacts and inquiries",
      icon: Mail,
      link: "/admin/contacts",
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - SwatVenue</title>
        <meta
          name="description"
          content="SwatVenue admin dashboard for platform management."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome to SwatVenue admin panel. Here's your platform overview.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
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
                      Real-time data
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
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

            {/* Pending Approvals */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Pending Venue Approvals
                  </h2>
                  <Link
                    to="/admin/approvals"
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    View all ({pendingApprovals.length})
                  </Link>
                </div>

                {pendingApprovals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                            Venue Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                            Owner
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                            Location
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                            Submitted
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingApprovals.map((venue, index) => {
                          const venueName =
                            venue.name ||
                            venue.venueName ||
                            venue.title ||
                            `Venue ${index + 1}`;

                          const ownerName =
                            venue.owner?.name ||
                            venue.ownerName ||
                            venue.user?.name ||
                            "Unknown Owner";

                          const location =
                            venue.location?.city ||
                            venue.location ||
                            venue.address ||
                            "Unknown Location";

                          const submittedAt =
                            venue.createdAt ||
                            venue.submittedAt ||
                            venue.updatedAt ||
                            new Date();

                          return (
                            <tr
                              key={venue._id || venue.id || index}
                              className="border-b border-gray-100 dark:border-gray-700"
                            >
                              <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                                {venueName}
                              </td>
                              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                                {ownerName}
                              </td>
                              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                                {location}
                              </td>
                              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                                {new Date(submittedAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                                    onClick={() =>
                                      console.log(
                                        "Approve venue:",
                                        venue._id || venue.id
                                      )
                                    }
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                                    onClick={() =>
                                      console.log(
                                        "Reject venue:",
                                        venue._id || venue.id
                                      )
                                    }
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      All Caught Up!
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No pending venue approvals at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
