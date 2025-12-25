// src/pages/user/BookingCard.jsx
import React from "react";
import {
  Calendar,
  Users,
  Building,
  Phone,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

const BookingCard = ({ booking, onDeleteClick }) => {
  if (!booking) return null;

  const statusConfig = {
    confirmed: {
      label: "CONFIRMED",
      banner: "bg-emerald-600 text-white dark:bg-emerald-500",
      sub: "Your booking has been approved",
    },
    pending: {
      label: "PENDING",
      banner: "bg-amber-500 text-white dark:bg-amber-400",
      sub: "Waiting for venue owner approval",
    },
    cancelled: {
      label: "CANCELLED",
      banner: "bg-rose-600 text-white dark:bg-rose-500",
      sub: "This booking was cancelled",
    },
    completed: {
      label: "COMPLETED",
      banner: "bg-slate-600 text-white dark:bg-slate-500",
      sub: "This event has already taken place",
    },
  };

  const status = statusConfig[booking.status];
  const canDelete =
    booking.status !== "completed" && booking.status !== "cancelled";

  const formattedDate = new Date(booking.eventDate).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition hover:shadow-lg flex flex-col">
      {/* STATUS BANNER (HIGH PRIORITY) */}
      <div className={`px-5 py-4 text-center ${status.banner}`}>
        <h3 className="text-sm font-extrabold tracking-widest">
          {status.label}
        </h3>
        <p className="text-xs opacity-90 mt-1">{status.sub}</p>
      </div>

      {/* IMAGE */}
      <div className="relative h-36">
        <img
          src={
            booking.venue?.images?.[0] ||
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3"
          }
          alt={booking.venue?.name}
          className="h-full w-full object-cover"
        />

        {/* AMOUNT */}
        <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-lg text-xs font-semibold">
          ₨ {booking.amount?.toLocaleString()}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow">
        {/* VENUE NAME */}
        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {booking.venue?.name}
        </h4>

        {/* DATE + GUESTS */}
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mt-2">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            {booking.guestCount} Guests
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-4 border-t border-slate-200 dark:border-slate-700" />

        {/* META */}
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <Building size={14} />
            {booking.eventType}
          </div>
          <div className="flex items-center gap-1">
            <Phone size={14} />
            {booking.phone}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto pt-5 flex gap-3">
          <Link
            to={`/venue/${booking.venue?._id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:opacity-90"
          >
            View Details
            <ExternalLink size={14} />
          </Link>

          {canDelete && (
            <button
              onClick={() => onDeleteClick(booking)}
              className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-500 hover:border-red-500 transition"
              title="Cancel Booking"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
