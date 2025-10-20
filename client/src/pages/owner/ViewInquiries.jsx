import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  MessageSquare,
  Calendar,
  Users,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

const ViewInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Mock inquiries data
  const mockInquiries = [
    {
      id: 1,
      customerName: "Ahmad Hassan",
      customerEmail: "ahmad@example.com",
      customerPhone: "+92-300-1234567",
      venueName: "Royal Banquet Hall",
      eventType: "wedding",
      eventDate: "2025-03-15",
      guestCount: 300,
      message:
        "I am interested in booking your venue for my wedding. Please provide more details about catering options and decoration services.",
      status: "pending",
      createdAt: "2025-01-20T10:30:00Z",
    },
    {
      id: 2,
      customerName: "Fatima Khan",
      customerEmail: "fatima@example.com",
      customerPhone: "+92-300-2345678",
      venueName: "Garden Pavilion",
      eventType: "birthday",
      eventDate: "2025-02-28",
      guestCount: 80,
      message:
        "Looking for a venue for my daughter's birthday party. Do you provide sound system and decoration?",
      status: "responded",
      createdAt: "2025-01-18T14:20:00Z",
    },
    {
      id: 3,
      customerName: "Ali Rahman",
      customerEmail: "ali@example.com",
      customerPhone: "+92-300-3456789",
      venueName: "Royal Banquet Hall",
      eventType: "corporate",
      eventDate: "2025-04-10",
      guestCount: 150,
      message:
        "We need a venue for our annual company meeting. Please share your corporate packages.",
      status: "pending",
      createdAt: "2025-01-19T09:15:00Z",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInquiries(mockInquiries);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (filter === "all") return true;
    return inquiry.status === filter;
  });

  const handleStatusChange = (inquiryId, newStatus) => {
    setInquiries(
      inquiries.map((inquiry) =>
        inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "responded":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <title>View Inquiries - SwatVenue</title>
        <meta
          name="description"
          content="View and manage customer inquiries for your venues."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Customer Inquiries
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {filteredInquiries.length} inquiries found
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {[
                  {
                    key: "all",
                    label: "All Inquiries",
                    count: inquiries.length,
                  },
                  {
                    key: "pending",
                    label: "Pending",
                    count: inquiries.filter((i) => i.status === "pending")
                      .length,
                  },
                  {
                    key: "responded",
                    label: "Responded",
                    count: inquiries.filter((i) => i.status === "responded")
                      .length,
                  },
                  {
                    key: "rejected",
                    label: "Rejected",
                    count: inquiries.filter((i) => i.status === "rejected")
                      .length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      filter === tab.key
                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No inquiries found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "all"
                  ? "You haven't received any inquiries yet."
                  : `No ${filter} inquiries at the moment.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {inquiry.customerName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Inquiry for {inquiry.venueName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          inquiry.status
                        )}`}
                      >
                        {inquiry.status}
                      </span>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <p>{formatDate(inquiry.createdAt)}</p>
                        <p>{formatTime(inquiry.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {formatDate(inquiry.eventDate)} - {inquiry.eventType}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">
                        {inquiry.guestCount} guests
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Message:
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {inquiry.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <a
                        href={`tel:${inquiry.customerPhone}`}
                        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{inquiry.customerPhone}</span>
                      </a>
                      <a
                        href={`mailto:${inquiry.customerEmail}`}
                        className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-sm"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{inquiry.customerEmail}</span>
                      </a>
                    </div>

                    {inquiry.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleStatusChange(inquiry.id, "responded")
                          }
                          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Mark as Responded</span>
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(inquiry.id, "rejected")
                          }
                          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewInquiries;
