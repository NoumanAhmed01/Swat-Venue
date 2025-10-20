import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Users,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  Clock,
  CheckCircle,
} from "lucide-react";

const AdminDashboard = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12% from last month",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Venues",
      value: "456",
      change: "+8% from last month",
      icon: Building,
      color: "bg-green-500",
    },
    {
      title: "Total Bookings",
      value: "2,890",
      change: "+23% from last month",
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Platform Revenue",
      value: "₨12,45,000",
      change: "+18% from last month",
      icon: DollarSign,
      color: "bg-emerald-500",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "venue_approval",
      message: 'New venue "Mountain View Resort" approved',
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "user_registration",
      message: "New venue owner registered: Ahmad Hassan",
      time: "4 hours ago",
      icon: UserCheck,
      color: "text-blue-600",
    },
    {
      id: 3,
      type: "venue_pending",
      message: 'Venue "Garden Palace" pending approval',
      time: "6 hours ago",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      id: 4,
      type: "booking",
      message: "New booking at Royal Banquet Hall",
      time: "8 hours ago",
      icon: Calendar,
      color: "text-purple-600",
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      venueName: "Crystal Palace",
      ownerName: "Malik Hassan",
      location: "Mingora, Swat",
      submittedAt: "2025-01-20",
    },
    {
      id: 2,
      venueName: "Green Valley Resort",
      ownerName: "Rahman Shah",
      location: "Kalam, Swat",
      submittedAt: "2025-01-19",
    },
    {
      id: 3,
      venueName: "Riverside Banquet Hall",
      ownerName: "Imran Ali",
      location: "Bahrain, Swat",
      submittedAt: "2025-01-18",
    },
  ];

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
      description: "Review and approve venue listings",
      icon: Building,
      link: "/admin/approvals",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Analytics",
      description: "View platform analytics and reports",
      icon: TrendingUp,
      link: "/admin/analytics",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

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

              {/* Recent Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Recent Activities
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <activity.icon
                        className={`h-5 w-5 mt-0.5 ${activity.color}`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
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
                      {pendingApprovals.map((venue) => (
                        <tr
                          key={venue.id}
                          className="border-b border-gray-100 dark:border-gray-700"
                        >
                          <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                            {venue.venueName}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {venue.ownerName}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {venue.location}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                            {new Date(venue.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200">
                                Approve
                              </button>
                              <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200">
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Overview Chart Placeholder */}
          <div className="mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Platform Overview
              </h2>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Platform analytics chart would appear here
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

export default AdminDashboard;
