import React, { useState } from "react";
import {
  Eye,
  Trash2,
  X,
  AlertCircle,
  Clock,
  CheckCircle,
  Mail,
} from "lucide-react";
import DeleteConfirmation from "../../components/common/DeleteConfirmation";

const ContactTable = ({
  contacts,
  allContacts,
  onStatusUpdate,
  onDeleteContact,
  searchTerm,
  statusFilter,
}) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  // Status configuration object
  const statusConfig = {
    new: {
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      icon: AlertCircle,
    },
    reviewed: {
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      icon: Clock,
    },
    responded: {
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      icon: CheckCircle,
    },
    closed: {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      icon: CheckCircle,
    },
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedContact) return;

    try {
      setUpdatingId(selectedContact._id);
      await onStatusUpdate(selectedContact._id, status);
      setShowDetailModal(false);
      setSelectedContact(null);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async (contactId) => {
    try {
      await onDeleteContact(contactId);
      setShowDeleteConfirm(false);
      setContactToDelete(null);
      if (selectedContact?._id === contactId) {
        setShowDetailModal(false);
      }
    } catch (error) {
      console.error("Failed to delete contact");
      throw error;
    }
  };

  // Modal Components
  const DetailModal = () => {
    if (!showDetailModal || !selectedContact) return null;
    const StatusIcon = statusConfig[selectedContact.status]?.icon || Mail;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowDetailModal(false)}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Name
                </label>
                <p className="text-gray-900 dark:text-white mt-1">
                  {selectedContact.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 mt-1 block"
                >
                  {selectedContact.email}
                </a>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Subject
              </label>
              <p className="text-gray-900 dark:text-white mt-1">
                {selectedContact.subject}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Message
              </label>
              <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm">
                  {selectedContact.message}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-2">
                Current Status
              </label>
              <div className="flex items-center space-x-2">
                <StatusIcon className="h-4 w-4" />
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusConfig[selectedContact.status]?.color ||
                    statusConfig.closed.color
                  }`}
                >
                  {selectedContact.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            {["reviewed", "responded", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusUpdate(status)}
                disabled={updatingId === selectedContact._id}
                className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 ${
                  status === "reviewed"
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : status === "responded"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {updatingId === selectedContact._id
                  ? "Updating..."
                  : `Mark ${status.charAt(0).toUpperCase() + status.slice(1)}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const TableRow = ({ contact }) => {
    const StatusIcon = statusConfig[contact.status]?.icon || Mail;

    return (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td className="py-4 px-6">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {contact.name}
          </p>
        </td>
        <td className="py-4 px-6">
          <a
            href={`mailto:${contact.email}`}
            className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {contact.email}
          </a>
        </td>
        <td className="py-4 px-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
            {contact.subject}
          </p>
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center space-x-2">
            <StatusIcon className="h-4 w-4" />
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusConfig[contact.status]?.color || statusConfig.closed.color
              }`}
            >
              {contact.status}
            </span>
          </div>
        </td>
        <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
          {new Date(contact.createdAt).toLocaleDateString()}
        </td>
        <td className="py-4 px-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewDetails(contact)}
              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 rounded-lg transition-colors"
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(contact)}
              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 rounded-lg transition-colors"
              title="Delete contact"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <DetailModal />
      {showDeleteConfirm && contactToDelete && (
        <DeleteConfirmation
          item={{
            id: contactToDelete._id,
            name: contactToDelete.name,
          }}
          itemType="contact"
          onClose={() => {
            setShowDeleteConfirm(false);
            setContactToDelete(null);
          }}
          onDelete={handleConfirmDelete}
        />
      )}

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Subject",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {contacts.map((contact) => (
                  <TableRow key={contact._id} contact={contact} />
                ))}
              </tbody>
            </table>

            {contacts.length === 0 && (
              <div className="text-center py-16">
                <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No contacts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "No contacts available"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactTable;
