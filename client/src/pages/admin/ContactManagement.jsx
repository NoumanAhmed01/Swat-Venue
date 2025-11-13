import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Mail,
  Search,
  Filter,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { contactAPI } from "../../utils/api";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAll();
      setContacts(response.data.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch contacts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setResponseText(contact.response || "");
    setShowDetailModal(true);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedContact) return;

    try {
      setUpdatingId(selectedContact._id);
      await contactAPI.updateStatus(selectedContact._id, {
        status,
        response: responseText,
      });

      setContacts(
        contacts.map((c) =>
          c._id === selectedContact._id
            ? { ...c, status, response: responseText }
            : c
        )
      );

      setSuccessMessage(`Contact status updated to ${status}`);
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowDetailModal(false);
      setSelectedContact(null);
    } catch (err) {
      setError("Failed to update contact status");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactAPI.updateStatus(contactId, {
          status: "deleted",
        });

        setContacts(contacts.filter((c) => c._id !== contactId));
        setSuccessMessage("Contact deleted successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setError("Failed to delete contact");
        console.error(err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "reviewed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "responded":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return AlertCircle;
      case "reviewed":
        return Clock;
      case "responded":
        return CheckCircle;
      case "closed":
        return CheckCircle;
      default:
        return Mail;
    }
  };

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
        <title>Contact Management - SwatVenue Admin</title>
        <meta
          name="description"
          content="Manage platform contacts and inquiries."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contact Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and respond to user contact inquiries
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200">
                {successMessage}
              </p>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>

              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">
                  {filteredContacts.length} contacts found
                </span>
              </div>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Name
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Email
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Subject
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Date
                    </th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900 dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredContacts.map((contact) => {
                    const StatusIcon = getStatusIcon(contact.status);
                    return (
                      <tr
                        key={contact._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
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
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                contact.status
                              )}`}
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
                              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 rounded-lg transition-colors duration-200"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact._id)}
                              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 rounded-lg transition-colors duration-200"
                              title="Delete contact"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredContacts.length === 0 && (
              <div className="text-center py-16">
                <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No contacts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Contacts
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contacts.length}
                  </p>
                </div>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    New
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contacts.filter((c) => c.status === "new").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Reviewed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contacts.filter((c) => c.status === "reviewed").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Responded
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {contacts.filter((c) => c.status === "responded").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Contact Details
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Info */}
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
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  Your Response
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows="4"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 block mb-2">
                  Current Status
                </label>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedContact.status
                  )}`}
                >
                  {selectedContact.status}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => handleStatusUpdate("reviewed")}
                disabled={updatingId === selectedContact._id}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {updatingId === selectedContact._id
                  ? "Updating..."
                  : "Mark Reviewed"}
              </button>
              <button
                onClick={() => handleStatusUpdate("responded")}
                disabled={updatingId === selectedContact._id}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                {updatingId === selectedContact._id
                  ? "Updating..."
                  : "Mark Responded"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactManagement;
