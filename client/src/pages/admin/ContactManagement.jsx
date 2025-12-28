import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Search,
  AlertCircle,
  Clock,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatsCard from "../../components/common/StatsCard";
import ContactTable from "./ContactTable";
import { contactAPI } from "../../utils/api";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
      setFilteredContacts(response.data.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch contacts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever search or filters change
  useEffect(() => {
    let filtered = [...contacts];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((contact) => contact.status === statusFilter);
    }

    setFilteredContacts(filtered);
  }, [searchTerm, statusFilter, contacts]);

  const handleStatusUpdate = async (contactId, status, responseText) => {
    try {
      await contactAPI.updateStatus(contactId, {
        status,
        response: responseText,
      });

      setContacts(
        contacts.map((c) =>
          c._id === contactId ? { ...c, status, response: responseText } : c
        )
      );

      setSuccessMessage(`Contact status updated to ${status}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to update contact status");
      console.error(err);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await contactAPI.delete(contactId);
      setContacts(contacts.filter((c) => c._id !== contactId));
      setSuccessMessage("Contact deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to delete contact");
      console.error(err);
    }
  };

  // Interactive Stats Cards Data
  const statsData = [
    {
      title: "All Contacts",
      value: contacts.length,
      icon: MessageSquare,
      color: "gold",
      onClick: () => setStatusFilter("all"),
      isActive: statusFilter === "all",
    },
    {
      title: "New",
      value: contacts.filter((c) => c.status === "new").length,
      icon: AlertCircle,
      color: "blue",
      onClick: () => setStatusFilter("new"),
      isActive: statusFilter === "new",
    },
    {
      title: "Reviewed",
      value: contacts.filter((c) => c.status === "reviewed").length,
      icon: Clock,
      color: "amber",
      onClick: () => setStatusFilter("reviewed"),
      isActive: statusFilter === "reviewed",
    },
    {
      title: "Responded",
      value: contacts.filter((c) => c.status === "responded").length,
      icon: CheckCircle,
      color: "green",
      onClick: () => setStatusFilter("responded"),
      isActive: statusFilter === "responded",
    },
    {
      title: "Closed",
      value: contacts.filter((c) => c.status === "closed").length,
      icon: CheckCircle,
      color: "red",
      onClick: () => setStatusFilter("closed"),
      isActive: statusFilter === "closed",
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
        <title>Contact Management - SwatVenue Admin</title>
        <meta
          name="description"
          content="Manage platform contacts and inquiries."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Header with Search */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Contact Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage and respond to user contact inquiries
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  onClick={fetchContacts}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 whitespace-nowrap"
                  title="Refresh contacts"
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Refresh</span>
                </button>
              </div>
            </div>
            {/* Interactive Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {statsData.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  isActive={stat.isActive}
                  onClick={stat.onClick}
                />
              ))}
            </div>
          </div>

          {/* Contact Table Component */}
          <ContactTable
            contacts={filteredContacts}
            allContacts={contacts}
            onStatusUpdate={handleStatusUpdate}
            onDeleteContact={handleDeleteContact}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </>
  );
};

export default ContactManagement;
