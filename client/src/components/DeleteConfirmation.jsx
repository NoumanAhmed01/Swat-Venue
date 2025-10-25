import React, { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { venueAPI } from "../utils/api";

const DeleteConfirmation = ({ venue, onClose, onVenueDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") {
      toast.error('Please type "delete" to confirm');
      return;
    }

    try {
      setIsDeleting(true);
      await venueAPI.delete(venue._id || venue.id);
      toast.success("Venue deleted successfully!");
      onClose();
      if (onVenueDeleted) {
        onVenueDeleted();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete venue";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-primary-900 dark:text-text-dark">
              Delete Venue
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-primary-900 dark:text-text-dark">
              {venue.name}
            </span>
            ?
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Warning:</strong> This action cannot be undone. All
              associated bookings, reviews, and inquiries will be affected.
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Type <span className="font-semibold text-red-600">delete</span> to
            confirm:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isDeleting}
            className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
            placeholder='Type "delete" to confirm'
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-surface-600 dark:hover:bg-surface-500 text-gray-700 dark:text-text-dark rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || confirmText.toLowerCase() !== "delete"}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Venue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
