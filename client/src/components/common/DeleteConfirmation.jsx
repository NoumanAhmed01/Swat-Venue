import React, { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const DeleteConfirmation = ({
  item,
  itemType = "venue",
  onClose,
  onDelete,
  deleteAPI,
  customMessages = {},
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  // Default messages for different item types
  const defaultMessages = {
    venue: {
      title: "Delete Venue",
      confirmMessage: "Are you sure you want to delete",
      warning:
        "Warning: This action cannot be undone. All associated bookings, reviews, and inquiries will be affected.",
      placeholder: 'Type "delete" to confirm',
      success: "Venue deleted successfully!",
      error: "Failed to delete venue",
    },
    user: {
      title: "Delete User",
      confirmMessage: "Are you sure you want to delete user",
      warning:
        "Warning: This action cannot be undone. All user data, bookings, and reviews will be permanently removed.",
      placeholder: 'Type "delete" to confirm',
      success: "User deleted successfully!",
      error: "Failed to delete user",
    },
    booking: {
      title: "Delete Booking",
      confirmMessage: "Are you sure you want to delete booking",
      warning:
        "Warning: This action cannot be undone. The booking record will be permanently removed.",
      placeholder: 'Type "delete" to confirm',
      success: "Booking deleted successfully!",
      error: "Failed to delete booking",
    },
    contact: {
      title: "Delete Contact",
      confirmMessage: "Are you sure you want to delete contact from",
      warning:
        "Warning: This action cannot be undone. The contact message will be permanently removed.",
      placeholder: 'Type "delete" to confirm',
      success: "Contact deleted successfully!",
      error: "Failed to delete contact",
    },
    // Add more types as needed
  };

  // Merge custom messages with defaults
  const messages = { ...defaultMessages[itemType], ...customMessages };

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "delete") {
      toast.error('Please type "delete" to confirm');
      return;
    }

    try {
      setIsDeleting(true);

      // If deleteAPI function is provided, use it
      if (deleteAPI) {
        await deleteAPI(item._id || item.id);
      }
      // Otherwise, use the onDelete callback
      else if (onDelete) {
        await onDelete(item._id || item.id);
      } else {
        throw new Error("No delete method provided");
      }

      toast.success(messages.success);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || messages.error;
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {messages.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {messages.confirmMessage}{" "}
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {item.name || item.title || "this item"}
            </span>
            ?
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Warning:</strong> {messages.warning}
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
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
            placeholder={messages.placeholder}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
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
              <span>
                Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
