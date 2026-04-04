// src/pages/owner/AddVenue.jsx
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Camera,
  DollarSign,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// Import step components from forms folder
import VenueStep1 from "./form/VenueStep1";
import VenueStep2 from "./form/VenueStep2";
import VenueStep3 from "./form/VenueStep3";

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
  const [videoFiles, setVideoFiles] = useState([]);
  const [menus, setMenus] = useState([
    { name: "", pricePerHead: "", items: [""] },
  ]);

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

  const handleAmenityToggle = (amenity) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];

    setSelectedAmenities(newAmenities);
    setValue("amenities", newAmenities);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "amenities") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      // ✅ ADD THIS: Append Menus
      formData.append("menus", JSON.stringify(menus));

      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      videoFiles.forEach((file) => {
        formData.append("videos", file);
      });

      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/venues`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add venue");
      }

      toast.success(
        "Venue added successfully! It will be reviewed within 24-48 hours.",
      );
      navigate("/owner/manage-venues");
    } catch (error) {
      console.error("Error adding venue:", error);
      toast.error(error.message || "Failed to add venue. Please try again.");
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
    { number: 2, title: "Images, Videos & Amenities", icon: Camera },
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
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-400 mb-4"
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

          {/* Progress Steps */}
          <div className="mb-8">
            {/* Mobile View */}
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold-600 text-white border-2 border-gold-600">
                    {currentStep === 1 && <Building className="h-6 w-6" />}
                    {currentStep === 2 && <Camera className="h-6 w-6" />}
                    {currentStep === 3 && <DollarSign className="h-6 w-6" />}
                  </div>
                </div>
                <p className="text-sm font-medium text-gold-600">
                  Step {currentStep} of {steps.length}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {steps[currentStep - 1].title}
                </p>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.number
                        ? "bg-gold-600 border-gold-600 text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-400"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.number
                          ? "text-gold-600"
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
                          ? "bg-gold-600"
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
              {/* Step Components */}
              {currentStep === 1 && (
                <VenueStep1 register={register} errors={errors} />
              )}

              {currentStep === 2 && (
                <VenueStep2
                  register={register}
                  errors={errors}
                  selectedAmenities={selectedAmenities}
                  handleAmenityToggle={handleAmenityToggle}
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                  videoFiles={videoFiles}
                  setVideoFiles={setVideoFiles}
                />
              )}

              {currentStep === 3 && (
                <VenueStep3
                  register={register}
                  errors={errors}
                  menus={menus}
                  setMenus={setMenus}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Previous</span>
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 bg-gold-600 hover:bg-gold-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 bg-gold-600 hover:bg-gold-700 disabled:bg-gold-400 text-white px-6 py-3 rounded-lg transition-colors duration-200"
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
