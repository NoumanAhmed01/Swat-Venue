import React, { useState } from "react";
import {
  Building,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Users,
  DollarSign,
  Trash2,
  X,
  Video,
} from "lucide-react";
import DeleteConfirmation from "../../components/common/DeleteConfirmation";

const VenueApprovalsTable = ({
  venues,
  statusFilter,
  onApprove,
  onReject,
  onDelete,
}) => {
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);

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

  const openVenueModal = (venue) => {
    setSelectedVenue(venue);
    setModalOpen(true);
  };

  const handleDeleteClick = (venue) => {
    setVenueToDelete(venue);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (venueId) => {
    try {
      await onDelete(venueId);
      setShowDeleteModal(false);
      setVenueToDelete(null);
      if (selectedVenue?._id === venueId) {
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete venue");
      throw error;
    }
  };

  // Venue Detail Modal
  const VenueDetailModal = () => {
    if (!modalOpen || !selectedVenue) return null;

    return (
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
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedVenue.images && selectedVenue.images[0]}
                  alt={selectedVenue.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />

                {selectedVenue.images && selectedVenue.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedVenue.images.slice(1, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${selectedVenue.name} ${idx + 2}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                {selectedVenue.videos && selectedVenue.videos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Videos
                    </h4>
                    {selectedVenue.videos.map((video, idx) => (
                      <video
                        key={idx}
                        src={video}
                        controls
                        className="w-full rounded-lg mb-2"
                      />
                    ))}
                  </div>
                )}
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
                      <strong>Capacity:</strong> {selectedVenue.capacity} guests
                    </p>
                    <p>
                      <strong>Price:</strong> ₨
                      {selectedVenue.price?.toLocaleString()}{" "}
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
                    {selectedVenue.amenities &&
                      selectedVenue.amenities.map((amenity, index) => (
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
                    onApprove(selectedVenue._id);
                    setModalOpen(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Approve Venue
                </button>
                <button
                  onClick={() => {
                    onReject(selectedVenue._id);
                    setModalOpen(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Reject Venue
                </button>
                <button
                  onClick={() => handleDeleteClick(selectedVenue)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Delete Venue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Venue Card Component
  const VenueCard = ({ venue }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-48">
          <img
            src={venue.images && venue.images[0]}
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
              <span className="text-sm">Up to {venue.capacity} guests</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-sm">₨{venue.price?.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Owner:</strong> {venue.ownerName}
            </p>
            {venue.createdAt && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Submitted:</strong>{" "}
                {new Date(venue.createdAt).toLocaleDateString()}
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
                  onClick={() => onApprove(venue._id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => onReject(venue._id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </>
            )}
            <button
              onClick={() => handleDeleteClick(venue)}
              className="flex-1 flex items-center justify-center space-x-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Modals */}
      <VenueDetailModal />
      {showDeleteModal && venueToDelete && (
        <DeleteConfirmation
          item={{
            id: venueToDelete._id,
            name: venueToDelete.name,
          }}
          itemType="venue"
          onClose={() => {
            setShowDeleteModal(false);
            setVenueToDelete(null);
          }}
          onDelete={handleConfirmDelete}
        />
      )}

      <div className="space-y-6">
        {/* Venues Grid */}
        {venues.length === 0 ? (
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
            {venues.map((venue) => (
              <VenueCard key={venue._id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VenueApprovalsTable;
