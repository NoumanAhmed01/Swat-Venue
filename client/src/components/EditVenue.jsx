import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { X, Loader2, Plus, Trash2, Camera, Video } from "lucide-react";
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
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newVideoFiles, setNewVideoFiles] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [deletedVideos, setDeletedVideos] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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
      setExistingImages(venue.images || []);
      setExistingVideos(venue.videos || []);
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

  const handleNewImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const totalImages =
      existingImages.length -
      deletedImages.length +
      newImageFiles.length +
      files.length;

    if (totalImages > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setNewImageFiles((prev) => [...prev, ...files]);
  };

  const handleNewVideoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const totalVideos =
      existingVideos.length -
      deletedVideos.length +
      newVideoFiles.length +
      files.length;

    if (totalVideos > 2) {
      toast.error("Maximum 2 videos allowed");
      return;
    }
    setNewVideoFiles((prev) => [...prev, ...files]);
  };

  const removeExistingImage = (imageUrl) => {
    setDeletedImages((prev) => [...prev, imageUrl]);
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const removeExistingVideo = (videoUrl) => {
    setDeletedVideos((prev) => [...prev, videoUrl]);
    setExistingVideos((prev) => prev.filter((vid) => vid !== videoUrl));
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewVideo = (index) => {
    setNewVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "amenities") {
          formData.append(key, JSON.stringify(amenitiesList));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (deletedImages.length > 0) {
        formData.append("deletedImages", JSON.stringify(deletedImages));
      }

      if (deletedVideos.length > 0) {
        formData.append("deletedVideos", JSON.stringify(deletedVideos));
      }

      newImageFiles.forEach((file) => {
        formData.append("images", file);
      });

      newVideoFiles.forEach((file) => {
        formData.append("videos", file);
      });

      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/venues/${venueId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update venue");
      }

      toast.success("Venue updated successfully!");
      onClose();
      if (onVenueUpdated) {
        onVenueUpdated();
      }
    } catch (error) {
      console.error("Error updating venue:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update venue";
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
              Venue Images
            </label>

            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(imageUrl)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newImageFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {newImageFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImageUpload}
                  className="hidden"
                  id="new-image-upload"
                />
                <label
                  htmlFor="new-image-upload"
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add More Images</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Venue Videos
            </label>

            {existingVideos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {existingVideos.map((videoUrl, index) => (
                  <div key={index} className="relative">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-32 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingVideo(videoUrl)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newVideoFiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {newVideoFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="w-full h-32 rounded-lg border-2 border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewVideo(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div className="text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleNewVideoUpload}
                  className="hidden"
                  id="new-video-upload"
                />
                <label
                  htmlFor="new-video-upload"
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add More Videos</span>
                </label>
              </div>
            </div>
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
