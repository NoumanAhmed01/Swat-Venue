// src/pages/owner/ManageBooking/ManageBooking.jsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { CalendarCheck, Clock, Building } from "lucide-react";
import { bookingAPI, venueAPI } from "../../../utils/api";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import DeleteConfirmation from "../../../components/common/DeleteConfirmation";
import BookingStats from "./BookingStats";
import BookingCard from "./BookingCard";

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchBookingsForOwner();
  }, []);

  const fetchBookingsForOwner = async () => {
    try {
      setLoading(true);
      const venuesResponse = await venueAPI.getOwnerVenues();
      const ownerVenues = venuesResponse.data.data || [];

      const allBookings = [];
      for (const venue of ownerVenues) {
        try {
          const bookingsResponse = await bookingAPI.getVenueBookings(
            venue._id || venue.id
          );
          if (bookingsResponse.data.success) {
            const venueBookings = bookingsResponse.data.data.map((booking) => ({
              ...booking,
              venueName: venue.name,
              venueLocation: venue.location,
            }));
            allBookings.push(...venueBookings);
          }
        } catch (error) {
          console.error(
            `Error fetching bookings for venue ${venue.name}:`,
            error
          );
        }
      }

      allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(allBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingAPI.updateStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
      setExpandedBooking(null);
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error("Error updating booking status:", error);
    }
  };

  const handleDeleteSuccess = () => {
    fetchBookingsForOwner(); // Refresh bookings after deletion
  };

  const filteredBookings = bookings.filter((booking) => {
    return statusFilter === "all" || booking.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Bookings - SwatVenue</title>
        <meta name="description" content="Manage venue bookings" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-gold-500">
                    <CalendarCheck className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Manage Bookings
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  View and manage all bookings across your venues
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchBookingsForOwner}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
                  title="Refresh bookings"
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats and Filters */}
          <BookingStats
            bookings={bookings}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-6">
                <CalendarCheck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                {statusFilter !== "all"
                  ? `You don't have any ${statusFilter} bookings.`
                  : "No bookings have been made yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                  expandedBooking={expandedBooking}
                  setExpandedBooking={setExpandedBooking}
                  handleStatusChange={handleStatusChange}
                  setDeleteModal={setDeleteModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal - Now using reusable DeleteConfirmation */}
      {deleteModal && (
        <DeleteConfirmation
          item={{
            id: deleteModal._id,
            name: deleteModal.venueName || deleteModal.venue?.name,
          }}
          itemType="booking"
          deleteAPI={bookingAPI.delete}
          onDelete={() => {
            handleDeleteSuccess();
            setDeleteModal(null);
          }}
        />
      )}
    </>
  );
};

export default ManageBooking;
