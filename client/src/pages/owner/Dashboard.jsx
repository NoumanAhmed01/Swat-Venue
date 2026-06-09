import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Building,
  Calendar,
  DollarSign,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { bookingAPI, venueAPI } from "../../utils/api";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const OwnerDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVenues: 0,
    pendingBookings: 0,
    bookings: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [venuesResponse] = await Promise.all([venueAPI.getOwnerVenues()]);
      const venues = venuesResponse.data.data || [];

      let allBookings = [];
      let totalRevenue = 0;
      let pendingBookingsCount = 0;

      for (const venue of venues) {
        const venueId = venue._id || venue.id;
        if (!venueId) continue;

        try {
          const bookingsResponse = await bookingAPI.getVenueBookings(venueId);
          if (bookingsResponse.data.success) {
            const venueBookings = bookingsResponse.data.data.map((booking) => ({
              ...booking,
              venueName: venue.name,
            }));
            allBookings.push(...venueBookings);

            // Calculate revenue using totalAmount (fallback to amount)
            totalRevenue += venueBookings
              .filter(
                (b) => b.status === "confirmed" || b.status === "completed",
              )
              .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);

            pendingBookingsCount += venueBookings.filter(
              (b) => b.status === "pending" || b.status === "under_review",
            ).length;
          }
        } catch (error) {
          console.error(`Error fetching bookings for ${venue.name}:`, error);
        }
      }

      allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setStats({
        totalVenues: venues.length,
        pendingBookings: pendingBookingsCount,
        bookings: allBookings.length,
        revenue: totalRevenue,
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
      title: t("owner_dashboard.stats.total_venues"),
      value: stats.totalVenues.toString(),
      change: t("owner_dashboard.stats.venues_count", {
        count: stats.totalVenues,
      }),
      icon: Building,
      color: "bg-blue-500",
    },
    {
      title: t("owner_dashboard.stats.total_bookings"),
      value: stats.bookings.toString(),
      change: t("owner_dashboard.stats.all_time"),
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: t("owner_dashboard.stats.pending_bookings"),
      value: stats.pendingBookings.toString(),
      change: t("owner_dashboard.stats.awaiting"),
      icon: AlertCircle,
      color: "bg-amber-500",
    },
    {
      title: t("owner_dashboard.stats.revenue"),
      value: `₨ ${stats.revenue.toLocaleString()}`,
      change: t("owner_dashboard.stats.from_confirmed"),
      icon: DollarSign,
      color: "bg-gold-500",
    },
  ];

  const quickActions = [
    {
      title: t("owner_dashboard.quick_actions.add_venue"),
      description: t("owner_dashboard.quick_actions.add_venue_desc"),
      icon: Plus,
      link: "/owner/add-venue",
      color: "bg-gold-600 hover:bg-gold-700",
    },
    {
      title: t("owner_dashboard.quick_actions.manage_venues"),
      description: t("owner_dashboard.quick_actions.manage_venues_desc"),
      icon: Building,
      link: "/owner/manage-venues",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: t("owner_dashboard.quick_actions.manage_bookings"),
      description: t("owner_dashboard.quick_actions.manage_bookings_desc"),
      icon: Eye,
      link: "/owner/booking",
      color: "bg-green-600 hover:bg-green-700",
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
        <title>{t("owner_dashboard.title")} - SwatVenue</title>
        <meta
          name="description"
          content="Manage your venues and bookings on SwatVenue."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header - Professional Design */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("owner_dashboard.title")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                {t("owner_dashboard.welcome")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                    {user?.name}
                  </p>
                  {/* Professional Role Badge - Fixed Version */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full border border-blue-200/60 dark:border-blue-500/20 shadow-sm">
                    <CheckCircle
                      size={10}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.1em]">
                  {user?.email}
                </p>
              </div>

              <div className="w-14 h-14 rounded-full p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden flex-shrink-0">
                {user?.profilePicture?.url ? (
                  <img
                    src={user.profilePicture.url}
                    alt=""
                    className="w-full h-full rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950">
                    <User size={24} />
                  </div>
                )}
              </div>
            </div>
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
                  {t("owner_dashboard.quick_actions.title")}
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
                    {t("owner_dashboard.recent_bookings.title")}
                  </h2>
                  <Link
                    to="/owner/booking"
                    className="text-gold-600 hover:text-gold-700 text-sm font-medium"
                  >
                    {t("owner_dashboard.recent_bookings.view_all")}
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          {t("owner_dashboard.recent_bookings.venue")}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          {t("owner_dashboard.recent_bookings.customer")}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          {t("owner_dashboard.recent_bookings.date")}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          {t("owner_dashboard.recent_bookings.status")}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          {t("owner_dashboard.recent_bookings.amount")}
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
                            {t("owner_dashboard.recent_bookings.no_bookings")}
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
                              {new Date(booking.eventDate).toLocaleDateString(
                                i18n.language === "ur" ? "ur-PK" : "en-US",
                              )}
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
                                {booking.status === "confirmed"
                                  ? t("my_bookings.confirmed")
                                  : booking.status === "pending"
                                    ? t("my_bookings.pending")
                                    : booking.status === "completed"
                                      ? t("my_bookings.completed")
                                      : booking.status === "cancelled"
                                        ? t("my_bookings.cancelled")
                                        : booking.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gold-600 dark:text-gold-400 font-semibold">
                              ₨
                              {(
                                booking.totalAmount ||
                                booking.amount ||
                                0
                              ).toLocaleString()}
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
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
