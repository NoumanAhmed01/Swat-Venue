import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, KeyRound, MapPin } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { authAPI } from "../../utils/api";

const verifySchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
});

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(verifySchema),
  });

  const onSubmit = async (data) => {
    try {
      await authAPI.verifyOtp(email, data.otp);
      toast.success("OTP verified successfully!");
      navigate("/auth/reset-password", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP.");
    }
  };

  const handleResendOtp = async () => {
    try {
      await authAPI.forgotPassword(email);
      toast.success("New OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to resend OTP. Try again later.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify OTP - SwatVenue</title>
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
              Verify Your OTP
            </h2>
            <p className="mt-2 text-sm text-text-light dark:text-text-dark">
              We’ve sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-white dark:bg-surface-800 py-8 px-6 shadow-lg rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register("otp")}
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
                    placeholder="6-digit code"
                  />
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Verify OTP"}
              </button>
            </form>

            <div className="mt-4 flex justify-between items-center text-sm text-gold-600">
              <button
                onClick={handleResendOtp}
                className="hover:text-gold-500 transition-colors"
              >
                Resend OTP
              </button>
              <Link to="/auth/login" className="flex items-center space-x-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;
