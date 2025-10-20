import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Building,
  MapPin,
  Users,
  DollarSign,
  Camera,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

const venueSchema = yup.object({
  name: yup.string().required("Venue name is required"),
  description: yup.string().required("Description is required"),
  address: yup.string().required("Address is required"),
  location: yup.string().required("Location is required"),
  capacity: yup
    .number()
    .required("Capacity is required")
    .min(1, "Capacity must be at least 1"),
  price: yup
    .number()
    .required("Price is required")
    .min(1, "Price must be at least 1"),
  priceType: yup.string().required("Price type is required"),
  phone: yup.string().required("Contact number is required"),
  amenities: yup.array().min(1, "Select at least one amenity"),
});

const AddVenue = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(venueSchema),
    defaultValues: {
      priceType: "per day",
    },
  });

  const amenitiesList = [
    "AC",
    "Parking",
    "Catering",
    "Sound System",
    "Stage",
    "WiFi",
    "Garden",
    "Pool",
    "Bridal Suite",
    "VIP Lounge",
    "Valet Parking",
    "Photography Area",
    "Dance Floor",
    "Bar",
    "Kitchen",
    "Security",
  ];

  const locations = [
    "Mingora, Swat",
    "Kalam, Swat",
    "Saidu Sharif, Swat",
    "Bahrain, Swat",
    "Malam Jabba, Swat",
    "Dir, Upper Dir",
    "Chitral",
  ];

  const handleAmenityToggle = (amenity) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];

    setSelectedAmenities(newAmenities);
    setValue("amenities", newAmenities);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(
        "Venue added successfully! It will be reviewed within 24-48 hours."
      );
      navigate("/owner/manage-venues");
    } catch (error) {
      toast.error("Failed to add venue. Please try again.");
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: "Basic Information", icon: Building },
    { number: 2, title: "Images & Amenities", icon: Camera },
    { number: 3, title: "Pricing & Contact", icon: DollarSign },
  ];

  return (
    <>
      <Helmet>
        <title>Add New Venue - SwatVenue</title>
        <meta
          name="description"
          content="Add a new venue to SwatVenue platform."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/owner/dashboard")}
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Add New Venue
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              List your venue on SwatVenue and start receiving bookings
            </p>
          </div>

          {/* Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.number
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-400"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.number
                          ? "text-emerald-600"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      Step {step.number}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 ml-6 ${
                        currentStep > step.number
                          ? "bg-emerald-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Venue Name *
                      </label>
                      <input
                        {...register("name")}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter venue name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location *
                      </label>
                      <select
                        {...register("location")}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select location</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
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
                      Full Address *
                    </label>
                    <textarea
                      rows={3}
                      {...register("address")}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter complete address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Previous</span>
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-6 py-3 rounded-lg"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <span>Submit Venue</span>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddVenue;
