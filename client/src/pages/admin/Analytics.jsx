import React from "react";
import { Helmet } from "react-helmet-async";
import {
  TrendingUp,
  Users,
  Building,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

const Analytics = () => {
  // Mock analytics data
  const stats = [
    {
      title: "Total Revenue",
      value: "₨12,45,000",
      change: "+18%",
      changeType: "increase",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Bookings",
      value: "2,890",
      change: "+23%",
      changeType: "increase",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+12%",
      changeType: "increase",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Listed Venues",
      value: "456",
      change: "+8%",
      changeType: "increase",
      icon: Building,
      color: "bg-emerald-500",
    },
  ];

  const topVenues = [
    { name: "Royal Banquet Hall", bookings: 45, revenue: "₨3,37,500" },
    { name: "Grand Palace Hall", bookings: 38, revenue: "₨4,56,000" },
    { name: "Mountain View Resort", bookings: 32, revenue: "₨1,44,000" },
    { name: "Garden Pavilion", bookings: 28, revenue: "₨98,000" },
    { name: "Crystal Palace", bookings: 22, revenue: "₨2,09,000" },
  ];

  const monthlyData = [
    { month: "Jan", bookings: 120, revenue: 850000 },
    { month: "Feb", bookings: 150, revenue: 1050000 },
    { month: "Mar", bookings: 180, revenue: 1260000 },
    { month: "Apr", bookings: 220, revenue: 1540000 },
    { month: "May", bookings: 280, revenue: 1960000 },
    { month: "Jun", bookings: 320, revenue: 2240000 },
  ];

  const userGrowth = [
    { month: "Jan", customers: 450, owners: 45 },
    { month: "Feb", customers: 520, owners: 52 },
    { month: "Mar", customers: 610, owners: 61 },
    { month: "Apr", customers: 720, owners: 72 },
    { month: "May", customers: 850, owners: 85 },
    { month: "Jun", customers: 1000, owners: 100 },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics - SwatVenue Admin</title>
        <meta
          name="description"
          content="View platform analytics and performance metrics."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Platform Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Monitor platform performance and user engagement
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
                    <p
                      className={`text-sm mt-1 ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Monthly Revenue
                </h2>
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
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

            {/* Bookings Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Monthly Bookings
                </h2>
                <Activity className="h-6 w-6 text-gray-400" />
              </div>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Bookings chart would appear here
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Integration with charting library needed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performing Venues */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Top Performing Venues
              </h2>
              <div className="space-y-4">
                {topVenues.map((venue, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <span className="text-emerald-600 font-semibold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {venue.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {venue.bookings} bookings
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {venue.revenue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Growth */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  User Growth
                </h2>
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    User growth chart would appear here
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Integration with charting library needed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Tables */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Revenue Data */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Monthly Performance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Month
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Bookings
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((data, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-700"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {data.month}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {data.bookings}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          ₨{data.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Growth Data */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                User Registration Trends
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Month
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Customers
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        Owners
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userGrowth.map((data, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 dark:border-gray-700"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {data.month}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {data.customers}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                          {data.owners}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
