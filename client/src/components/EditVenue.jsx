import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { venueAPI } from "../utils/api";

const venueSchema = yup.object({
  name: yup.string().required("Venue name is required"),
  location: yup.string().required("Location is required"),
  address: yup.string().required("Address is required"),
  capacity: yup
    .number()
    .positive("Capacity must be positive")
    .required("Capacity is required"),
  price: yup
    .number()
    .positive("Price must be positive")
    .required("Price is required"),
  priceType: yup.string().required("Price type is required"),
  description: yup
    .string()
    .min(50, "Description must be at least 50 characters")
    .required("Description is required"),
  phone: yup.string().required("Phone number is required"),
});

const EditVenue = ({ venueId, onClose, onVenueUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(venueSchema),
  });

  useEffect(() => {
    fetchVenue();
  }, [venueId]);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      const response = await venueAPI.getById(venueId);
      const venue = response.data.data;

      reset({
        name: venue.name,
        location: venue.location,
        address: venue.address,
        capacity: venue.capacity,
        price: venue.price,
        priceType: venue.priceType,
        description: venue.description,
        phone: venue.phone,
      });

      setAmenitiesList(venue.amenities || []);
    } catch (error) {
      console.error("Error fetching venue:", error);
      toast.error("Failed to load venue details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenitiesList.includes(newAmenity.trim())) {
      setAmenitiesList([...amenitiesList, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove) => {
    setAmenitiesList(
      amenitiesList.filter((amenity) => amenity !== amenityToRemove)
    );
  };

  const onSubmit = async (data) => {
    try {
      const updateData = {
        ...data,
        amenities: amenitiesList,
      };

      await venueAPI.update(venueId, updateData);
      toast.success("Venue updated successfully!");
      onClose();
      if (onVenueUpdated) {
        onVenueUpdated();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update venue";
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gold-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary-900 dark:text-text-dark">
            Edit Venue
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Venue Name
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="e.g., Grand Wedding Hall"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <select
                {...register("location")}
                className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="">Select Location</option>
                <option value="Mingora">Mingora</option>
                <option value="Saidu Sharif">Saidu Sharif</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Kalam">Kalam</option>
                <option value="Malam Jabba">Malam Jabba</option>
              </select>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Address
            </label>
            <input
              {...register("address")}
              type="text"
              className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="Complete address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capacity (Guests)
              </label>
              <input
                {...register("capacity")}
                type="number"
                className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="500"
              />
              {errors.capacity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.capacity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (₨)
              </label>
              <input
                {...register("price")}
                type="number"
                className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="150000"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Type
              </label>
              <select
                {...register("priceType")}
                className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="per day">Per Day</option>
                <option value="per event">Per Event</option>
                <option value="per hour">Per Hour</option>
              </select>
              {errors.priceType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priceType.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              placeholder="+92 300 1234567"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                className="flex-1 p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Add an amenity"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-surface-700 text-primary-900 dark:text-text-dark px-3 py-1 rounded-full text-sm"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows="6"
              className="w-full p-3 border border-gray-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-900 text-primary-900 dark:text-text-dark focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
              placeholder="Detailed description of your venue..."
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-surface-600 dark:hover:bg-surface-500 text-gray-700 dark:text-text-dark rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Venue</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVenue;
