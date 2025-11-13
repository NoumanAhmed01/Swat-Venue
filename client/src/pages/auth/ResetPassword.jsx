import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Lock, ArrowLeft, MapPin } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { authAPI } from "../../utils/api";

const resetSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "At least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm your password"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    try {
      await authAPI.resetPassword(email, data.password);
      toast.success("Password reset successfully!");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password - SwatVenue</title>
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
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-text-light dark:text-text-dark">
              Enter your new password to secure your account.
            </p>
          </div>

          <div className="bg-white dark:bg-surface-800 py-8 px-6 shadow-lg rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
                    placeholder="Enter new password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
                    placeholder="Confirm new password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Reset Password"}
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

export default ResetPassword;
