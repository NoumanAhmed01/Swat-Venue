// src/components/venue/EditVenue.jsx (Refactored Main)
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "../../components/common/Toast";
import { venueAPI, menuAPI } from "../../utils/api";
import VenueMediaManager from "./form/VenueMediaManager";
import { X, Loader2, Plus, Trash2, Utensils, CheckCircle } from "lucide-react";

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
  const [menus, setMenus] = useState([]);
  const [deletedMenuIds, setDeletedMenuIds] = useState([]);

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
    fetchMenus();
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

  const fetchMenus = async () => {
    try {
      const response = await menuAPI.getByVenue(venueId);
      setMenus(response.data.data || []);
    } catch (error) {
      console.error("Error fetching menus:", error);
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
      amenitiesList.filter((amenity) => amenity !== amenityToRemove),
    );
  };

  const removeExistingImage = (imageUrl) => {
    setDeletedImages((prev) => [...prev, imageUrl]);
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const removeExistingVideo = (videoUrl) => {
    setDeletedVideos((prev) => [...prev, videoUrl]);
    setExistingVideos((prev) => prev.filter((vid) => vid !== videoUrl));
  };

  const handleAddNewImages = (files) => {
    setNewImageFiles((prev) => [...prev, ...files]);
  };

  const handleAddNewVideos = (files) => {
    setNewVideoFiles((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewVideo = (index) => {
    setNewVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addMenu = () => {
    setMenus([...menus, { name: "", pricePerHead: "", items: [""] }]);
  };

  const removeMenu = (index) => {
    const menuToRemove = menus[index];
    if (menuToRemove._id) {
      setDeletedMenuIds([...deletedMenuIds, menuToRemove._id]);
    }
    setMenus(menus.filter((_, i) => i !== index));
  };

  const updateMenuState = (index, field, value) => {
    const updatedMenus = [...menus];
    updatedMenus[index][field] = value;
    setMenus(updatedMenus);
  };

  const addMenuItem = (menuIndex) => {
    const updatedMenus = [...menus];
    updatedMenus[menuIndex].items.push("");
    setMenus(updatedMenus);
  };

  const updateMenuItem = (menuIndex, itemIndex, value) => {
    const updatedMenus = [...menus];
    updatedMenus[menuIndex].items[itemIndex] = value;
    setMenus(updatedMenus);
  };

  const removeMenuItem = (menuIndex, itemIndex) => {
    const updatedMenus = [...menus];
    updatedMenus[menuIndex].items = updatedMenus[menuIndex].items.filter(
      (_, i) => i !== itemIndex,
    );
    setMenus(updatedMenus);
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

      const response = await venueAPI.update(venueId, formData);
      const result = response.data;

      // ✅ HANDLE MENUS
      // 1. Delete removed menus
      for (const id of deletedMenuIds) {
        await menuAPI.delete(id);
      }

      // 2. Create or Update menus
      for (const menu of menus) {
        const menuData = {
          name: menu.name,
          pricePerHead: menu.pricePerHead,
          items: menu.items,
          venue: venueId,
        };

        if (menu._id) {
          await menuAPI.update(menu._id, menuData);
        } else {
          await menuAPI.create(menuData);
        }
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
          {/* Basic Info Grid */}
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
                <option value="Kabal">Kabal</option>
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

          {/* Media Manager Component */}
          <VenueMediaManager
            existingImages={existingImages}
            existingVideos={existingVideos}
            newImageFiles={newImageFiles}
            newVideoFiles={newVideoFiles}
            deletedImages={deletedImages}
            deletedVideos={deletedVideos}
            onRemoveExistingImage={removeExistingImage}
            onRemoveExistingVideo={removeExistingVideo}
            onRemoveNewImage={removeNewImage}
            onRemoveNewVideo={removeNewVideo}
            onAddNewImages={handleAddNewImages}
            onAddNewVideos={handleAddNewVideos}
          />

          {/* Amenities Section */}
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

          {/* Menu Packages Section */}
          <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-surface-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary-900 dark:text-text-dark flex items-center gap-2">
                <Utensils className="h-5 w-5 text-gold-600" />
                Menu Packages
              </h3>
              <button
                type="button"
                onClick={addMenu}
                className="flex items-center gap-2 text-sm font-bold text-gold-600 hover:text-gold-700 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Another Menu
              </button>
            </div>

            <div className="space-y-6">
              {menus.map((menu, menuIndex) => (
                <div
                  key={menuIndex}
                  className="p-6 bg-gray-50 dark:bg-surface-900/50 rounded-2xl border border-gray-200 dark:border-surface-700 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeMenu(menuIndex)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Menu Name
                      </label>
                      <input
                        value={menu.name}
                        onChange={(e) =>
                          updateMenuState(menuIndex, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-surface-700 dark:bg-surface-800 text-primary-900 dark:text-text-dark text-sm font-bold focus:border-gold-500 outline-none"
                        placeholder="e.g., Gold Wedding Menu"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2 block">
                        Price Per Head (₨)
                      </label>
                      <input
                        type="number"
                        value={menu.pricePerHead}
                        onChange={(e) =>
                          updateMenuState(
                            menuIndex,
                            "pricePerHead",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-surface-700 dark:bg-surface-800 text-primary-900 dark:text-text-dark text-sm font-bold focus:border-gold-500 outline-none"
                        placeholder="e.g., 1500"
                        required
                      />
                    </div>
                  </div>

                  {/* Items in this menu */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 block">
                      Food Items / Dishes
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {menu.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <div className="flex-grow relative">
                            <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gold-500" />
                            <input
                              value={item}
                              onChange={(e) =>
                                updateMenuItem(
                                  menuIndex,
                                  itemIndex,
                                  e.target.value,
                                )
                              }
                              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-surface-700 dark:bg-surface-800 text-primary-900 dark:text-text-dark text-xs font-medium focus:border-gold-500 outline-none"
                              placeholder="e.g., Chicken Biryani"
                              required
                            />
                          </div>
                          {menu.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeMenuItem(menuIndex, itemIndex)
                              }
                              className="p-2 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => addMenuItem(menuIndex)}
                      className="mt-2 text-xs font-bold text-gray-500 hover:text-gold-600 flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Item
                    </button>
                  </div>
                </div>
              ))}
              {menus.length === 0 && (
                <div className="text-center py-6 bg-gray-50 dark:bg-surface-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-surface-700">
                  <p className="text-gray-500 text-sm">No menus added yet.</p>
                  <button
                    type="button"
                    onClick={addMenu}
                    className="mt-2 text-gold-600 font-bold text-sm hover:underline"
                  >
                    Add your first menu
                  </button>
                </div>
              )}
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
