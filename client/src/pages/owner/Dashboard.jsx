import React from "react";
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
} from "lucide-react";

const OwnerDashboard = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Venues",
      value: "3",
      change: "+1 this month",
      icon: Building,
      color: "bg-blue-500",
    },
    {
      title: "Total Bookings",
      value: "24",
      change: "+12% from last month",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "₨2,45,000",
      change: "+18% from last month",
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      title: "Inquiries",
      value: "8",
      change: "3 pending responses",
      icon: MessageSquare,
      color: "bg-orange-500",
    },
  ];

  const recentBookings = [
    {
      id: 1,
      venue: "Royal Banquet Hall",
      customer: "Ahmad Hassan",
      date: "2025-02-15",
      status: "confirmed",
      amount: "₨75,000",
    },
    {
      id: 2,
      venue: "Garden Pavilion",
      customer: "Fatima Khan",
      date: "2025-02-20",
      status: "pending",
      amount: "₨35,000",
    },
    {
      id: 3,
      venue: "Royal Banquet Hall",
      customer: "Ali Rahman",
      date: "2025-02-25",
      status: "confirmed",
      amount: "₨75,000",
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
                    to="/owner/bookings"
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
                      {recentBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-100 dark:border-gray-700"
                        >
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {booking.venue}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {booking.customer}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {new Date(booking.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold">
                            {booking.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="mt-8">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
