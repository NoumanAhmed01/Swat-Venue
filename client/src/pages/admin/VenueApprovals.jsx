import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Building,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import venuesData from "../../data/venues.json";

const VenueApprovals = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call - add some pending venues for demo
    setTimeout(() => {
      const venuesWithStatus = [
        ...venuesData,
        {
          id: "5",
          name: "Crystal Palace Hall",
          location: "Mingora, Swat",
          address: "Main Road, Mingora, Swat, KPK",
          capacity: 600,
          price: 95000,
          priceType: "per day",
          rating: 0,
          reviews: 0,
          images: [
            "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg",
            "https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg",
          ],
          amenities: ["AC", "Parking", "Catering", "Sound System", "Stage"],
          description: "Newly constructed banquet hall with modern facilities.",
          ownerId: "owner5",
          ownerName: "Tariq Shah",
          phone: "+92-300-5678901",
          status: "pending",
          submittedAt: "2025-01-20T10:30:00Z",
        },
        {
          id: "6",
          name: "Green Valley Resort",
          location: "Kalam, Swat",
          address: "Upper Kalam, Swat Valley, KPK",
          capacity: 250,
          price: 55000,
          priceType: "per day",
          rating: 0,
          reviews: 0,
          images: [
            "https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg",
          ],
          amenities: ["Garden", "Mountain View", "Parking"],
          description: "Beautiful resort venue with mountain views.",
          ownerId: "owner6",
          ownerName: "Nasir Khan",
          phone: "+92-300-6789012",
          status: "pending",
          submittedAt: "2025-01-19T14:20:00Z",
        },
        {
          id: "7",
          name: "Riverside Banquet",
          location: "Bahrain, Swat",
          address: "River Road, Bahrain, Swat, KPK",
          capacity: 400,
          price: 65000,
          priceType: "per day",
          rating: 0,
          reviews: 0,
          images: [
            "https://images.pexels.com/photos/1024248/pexels-photo-1024248.jpeg",
          ],
          amenities: ["Riverside View", "Garden", "Parking", "Sound System"],
          description:
            "Beautiful banquet hall with riverside views and garden setting.",
          ownerId: "owner7",
          ownerName: "Imran Ali",
          phone: "+92-300-7890123",
          status: "pending",
          submittedAt: "2025-01-18T16:45:00Z",
        },
      ];
      setVenues(venuesWithStatus);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVenues = venues.filter((venue) => {
    if (statusFilter === "all") return true;
    return venue.status === statusFilter;
  });

  const handleApprove = (venueId) => {
    setVenues(
      venues.map((venue) =>
        venue.id === venueId
          ? {
              ...venue,
              status: "approved",
              approvedAt: new Date().toISOString(),
            }
          : venue
      )
    );
  };

  const handleReject = (venueId) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (reason) {
      setVenues(
        venues.map((venue) =>
          venue.id === venueId
            ? {
                ...venue,
                status: "rejected",
                rejectedAt: new Date().toISOString(),
                rejectionReason: reason,
              }
            : venue
        )
      );
    }
  };

  const openVenueModal = (venue) => {
    setSelectedVenue(venue);
    setModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
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
        <title>Venue Approvals - SwatVenue Admin</title>
        <meta
          name="description"
          content="Review and approve venue listings on SwatVenue platform."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Venue Approvals
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Review and approve venue listings submitted by owners
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: "all", label: "All Venues", count: venues.length },
                  {
                    key: "pending",
                    label: "Pending",
                    count: venues.filter((v) => v.status === "pending").length,
                  },
                  {
                    key: "approved",
                    label: "Approved",
                    count: venues.filter((v) => v.status === "approved").length,
                  },
                  {
                    key: "rejected",
                    label: "Rejected",
                    count: venues.filter((v) => v.status === "rejected").length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      statusFilter === tab.key
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

          {/* Venues Grid */}
          {filteredVenues.length === 0 ? (
            <div className="text-center py-16">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No venues found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {statusFilter === "all"
                  ? "No venues have been submitted yet."
                  : `No ${statusFilter} venues at the moment.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={venue.images[0]}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          venue.status
                        )}`}
                      >
                        {venue.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {venue.name}
                    </h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{venue.location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          Up to {venue.capacity} guests
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          ₨{venue.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <strong>Owner:</strong> {venue.ownerName}
                      </p>
                      {venue.submittedAt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <strong>Submitted:</strong>{" "}
                          {new Date(venue.submittedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openVenueModal(venue)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>

                      {venue.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(venue.id)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(venue.id)}
                            className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <StatCard
              title="Total Venues"
              value={venues.length}
              icon={<Building className="h-8 w-8 text-blue-500" />}
            />
            <StatCard
              title="Pending"
              value={venues.filter((v) => v.status === "pending").length}
              icon={<Calendar className="h-8 w-8 text-yellow-500" />}
            />
            <StatCard
              title="Approved"
              value={venues.filter((v) => v.status === "approved").length}
              icon={<CheckCircle className="h-8 w-8 text-green-500" />}
            />
            <StatCard
              title="Rejected"
              value={venues.filter((v) => v.status === "rejected").length}
              icon={<XCircle className="h-8 w-8 text-red-500" />}
            />
          </div>
        </div>

        {/* Venue Detail Modal */}
        {modalOpen && selectedVenue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedVenue.name}
                  </h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedVenue.images[0]}
                      alt={selectedVenue.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Venue Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Location:</strong> {selectedVenue.location}
                        </p>
                        <p>
                          <strong>Address:</strong> {selectedVenue.address}
                        </p>
                        <p>
                          <strong>Capacity:</strong> {selectedVenue.capacity}{" "}
                          guests
                        </p>
                        <p>
                          <strong>Price:</strong> ₨
                          {selectedVenue.price.toLocaleString()}{" "}
                          {selectedVenue.priceType}
                        </p>
                        <p>
                          <strong>Owner:</strong> {selectedVenue.ownerName}
                        </p>
                        <p>
                          <strong>Phone:</strong> {selectedVenue.phone}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Amenities
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedVenue.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {selectedVenue.description}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedVenue.status === "pending" && (
                  <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        handleApprove(selectedVenue.id);
                        setModalOpen(false);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Approve Venue
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedVenue.id);
                        setModalOpen(false);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                    >
                      Reject Venue
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
      {icon}
    </div>
  </div>
);

export default VenueApprovals;
