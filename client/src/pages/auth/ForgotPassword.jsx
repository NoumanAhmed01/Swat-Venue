import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, MapPin } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - SwatVenue</title>
        <meta
          name="description"
          content="Reset your SwatVenue account password."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-surface-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 mb-8"
            >
              <MapPin className="h-10 w-10 text-gold-500" />
              <span className="text-3xl font-bold text-primary-900 dark:text-text-dark">
                SwatVenue
              </span>
            </Link>
            <h2 className="text-3xl font-bold text-primary-900 dark:text-text-dark">
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-text-light dark:text-text-dark">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <div className="bg-white dark:bg-surface-800 py-8 px-6 shadow-lg rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/auth/login"
                className="inline-flex items-center space-x-2 text-sm text-gold-600 hover:text-gold-500"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
