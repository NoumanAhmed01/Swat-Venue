import React, { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { bookingAPI } from "../utils/api";

const DeleteBookingModal = ({ booking, onClose, onBookingDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await bookingAPI.delete(booking._id);
      toast.success("Booking deleted successfully!");
      onClose();
      if (onBookingDeleted) {
        onBookingDeleted(booking._id);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete booking";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const venueName = booking.venueName || booking.venue?.name || "This venue";
  const eventDate = new Date(booking.eventDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Delete Booking?
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete this booking for{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {venueName}
            </span>{" "}
            on{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {eventDate}
            </span>
            ?
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>This action cannot be undone.</strong> The booking will be
              permanently removed.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-500 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Booking</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookingModal;
