// src/pages/owner/ManageBooking/BookingStats.jsx
import React from "react";
import {
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";

const BookingStats = ({ bookings, statusFilter, setStatusFilter }) => {
  return (
    <>
      {/* Stats Summary - Now 5 cards */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* All Bookings Card */}
          <StatsCard
            title="All Bookings"
            value={bookings.length}
            icon={Filter}
            color="gold"
            isActive={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />

          {/* Pending Bookings Card */}
          <StatsCard
            title="Pending"
            value={bookings.filter((b) => b.status === "pending").length}
            icon={Clock}
            color="amber"
            isActive={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          />

          {/* Confirmed Bookings Card */}
          <StatsCard
            title="Confirmed"
            value={bookings.filter((b) => b.status === "confirmed").length}
            icon={CheckCircle}
            color="green"
            isActive={statusFilter === "confirmed"}
            onClick={() => setStatusFilter("confirmed")}
          />

          {/* Completed Bookings Card */}
          <StatsCard
            title="Completed"
            value={bookings.filter((b) => b.status === "completed").length}
            icon={CalendarCheck}
            color="blue"
            isActive={statusFilter === "completed"}
            onClick={() => setStatusFilter("completed")}
          />

          {/* Cancelled Bookings Card */}
          <StatsCard
            title="Cancelled"
            value={bookings.filter((b) => b.status === "cancelled").length}
            icon={XCircle}
            color="red"
            isActive={statusFilter === "cancelled"}
            onClick={() => setStatusFilter("cancelled")}
          />
        </div>
      </div>
    </>
  );
};

export default BookingStats;
