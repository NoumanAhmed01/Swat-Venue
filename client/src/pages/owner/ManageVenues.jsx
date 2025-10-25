import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Building,
  Edit,
  Trash2,
  Eye,
  Plus,
  MapPin,
  Users,
  DollarSign,
  Star,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import EditVenue from "../../components/EditVenue";
import DeleteConfirmation from "../../components/DeleteConfirmation";
import { venueAPI } from "../../utils/api";
import venuesData from "../../data/venues.json";

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVenue, setEditingVenue] = useState(null);
  const [deletingVenue, setDeletingVenue] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await venueAPI.getOwnerVenues({ status: "" });
      setVenues(response.data.data || []);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setVenues(venuesData);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
  };

  const handleDelete = (venue) => {
    setDeletingVenue(venue);
  };

  const handleCloseEdit = () => {
    setEditingVenue(null);
  };

  const handleCloseDelete = () => {
    setDeletingVenue(null);
  };

  const handleVenueUpdated = () => {
    fetchVenues();
  };

  const handleVenueDeleted = () => {
    fetchVenues();
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
        <title>Manage Venues - SwatVenue</title>
        <meta
          name="description"
          content="Manage your venues on SwatVenue platform."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Manage Venues
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {venues.length} venues listed
              </p>
            </div>
            <Link
              to="/owner/add-venue"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Venue</span>
            </Link>
          </div>

          {venues.length === 0 ? (
            <div className="text-center py-16">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No venues listed yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by adding your first venue to the platform
              </p>
              <Link
                to="/owner/add-venue"
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span>Add Your First Venue</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue) => (
                <div
                  key={venue._id || venue.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img
                      src={venue.images[0]}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          venue.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : venue.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {venue.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
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
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">
                          {venue.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">
                          ₨{venue.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {venue.priceType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {venue.reviews} reviews
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        to={`/venue/${venue._id || venue.id}`}
                        className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                      <button
                        onClick={() => handleEdit(venue)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(venue)}
                        className="flex-1 flex items-center justify-center space-x-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editingVenue && (
          <EditVenue
            venueId={editingVenue._id || editingVenue.id}
            onClose={handleCloseEdit}
            onVenueUpdated={handleVenueUpdated}
          />
        )}

        {deletingVenue && (
          <DeleteConfirmation
            venue={deletingVenue}
            onClose={handleCloseDelete}
            onVenueDeleted={handleVenueDeleted}
          />
        )}
      </div>
    </>
  );
};

export default ManageVenues;
