// src/pages/owner/ManageBooking/BookingCard.jsx
import React, { useState } from "react";
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
  Building,
  User,
  MessageSquare,
} from "lucide-react";

const BookingCard = ({
  booking,
  expandedBooking,
  setExpandedBooking,
  handleStatusChange,
  setDeleteModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(expandedBooking === booking._id);

  const getStatusConfig = (status) => {
    const config = {
      confirmed: {
        color: "bg-emerald-500",
        text: "text-emerald-700 dark:text-emerald-300",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        icon: <CheckCircle className="h-3.5 w-3.5" />,
        label: "Confirmed",
      },
      pending: {
        color: "bg-amber-500",
        text: "text-amber-700 dark:text-amber-300",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        icon: <Clock className="h-3.5 w-3.5" />,
        label: "Pending",
      },
      cancelled: {
        color: "bg-rose-500",
        text: "text-rose-700 dark:text-rose-300",
        bg: "bg-rose-50 dark:bg-rose-900/20",
        icon: <XCircle className="h-3.5 w-3.5" />,
        label: "Cancelled",
      },
      completed: {
        color: "bg-blue-500",
        text: "text-blue-700 dark:text-blue-300",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        icon: <CalendarCheck className="h-3.5 w-3.5" />,
        label: "Completed",
      },
    };
    return config[status] || config.pending;
  };

  const statusConfig = getStatusConfig(booking.status);

  const toggleExpand = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    setExpandedBooking(newState ? booking._id : null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Booking Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`px-3 py-1.5 rounded-full flex items-center gap-2 ${statusConfig.bg}`}
              >
                {statusConfig.icon}
                <span className={`text-xs font-semibold ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
              <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                ID: {booking._id?.slice(-8).toUpperCase()}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {booking.customerName || booking.customer?.name || "N/A"}
                </h3>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {booking.venueName}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-bold text-gold-600 dark:text-gold-400">
                Rs.{" "}
                {typeof booking.amount === "number"
                  ? booking.amount.toLocaleString()
                  : "0"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total amount
              </p>
            </div>

            <button
              onClick={toggleExpand}
              className={`p-2 rounded-lg transition-all ${
                isExpanded
                  ? "bg-gray-100 dark:bg-gray-700 rotate-180"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Details Grid */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Event Date
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(booking.eventDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Guests</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {booking.guestCount || booking.guests} people
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Event Type
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {booking.eventType}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Contact
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {booking.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <Phone className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Phone Number
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <Mail className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Email Address
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Venue Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                        <Building className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Venue
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {booking.venueName}
                        </p>
                      </div>
                    </div>
                    {booking.venueLocation && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                          <MapPin className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Location
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {booking.venueLocation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Message */}
              {booking.message && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Customer Message
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                      "{booking.message}"
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Manage Booking
                </h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Status Update Buttons */}
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        status: "confirmed",
                        label: "Confirm",
                        icon: CheckCircle,
                        color: "bg-emerald-500 hover:bg-emerald-600",
                      },
                      {
                        status: "completed",
                        label: "Complete",
                        icon: CalendarCheck,
                        color: "bg-blue-500 hover:bg-blue-600",
                      },
                      {
                        status: "pending",
                        label: "Pending",
                        icon: Clock,
                        color: "bg-amber-500 hover:bg-amber-600",
                      },
                      {
                        status: "cancelled",
                        label: "Cancel",
                        icon: XCircle,
                        color: "bg-rose-500 hover:bg-rose-600",
                      },
                    ].map((action) => {
                      const Icon = action.icon;
                      const isCurrentStatus = booking.status === action.status;

                      return (
                        <button
                          key={action.status}
                          onClick={() =>
                            handleStatusChange(booking._id, action.status)
                          }
                          disabled={isCurrentStatus}
                          className={`px-4 py-2.5 rounded-lg text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                            isCurrentStatus
                              ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                              : action.color
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{action.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteModal(booking)}
                    className="px-4 py-2.5 bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/10 text-rose-700 dark:text-rose-400 rounded-lg font-medium text-sm transition-colors border border-rose-200 dark:border-rose-800 hover:border-rose-300 dark:hover:border-rose-700 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
