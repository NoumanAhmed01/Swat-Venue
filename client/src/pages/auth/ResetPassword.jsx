import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "../../components/common/Toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Lock, ArrowLeft, Building, Shield, ArrowRight } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
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

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950/20 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Brand Section - Desktop Only */}
          <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-700 p-8 md:p-12 flex-col justify-between relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 25% 25%, rgba(255,255,255,.2) 2px, transparent 2px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Building className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  SWAT<span className="text-amber-300">VENUE</span>
                </h1>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Secure Your <span className="text-amber-300">Account</span>
              </h2>

              <p className="text-amber-100 text-lg mb-10 max-w-md">
                Set a strong new password to protect your account and continue
                managing your venues safely.
              </p>
            </div>

            {/* Security Tips */}
            <div className="relative z-10 space-y-6 mb-8">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-6 h-6 text-amber-300" />
                  <span className="text-white font-bold text-lg">
                    Strong Password Tips
                  </span>
                </div>
                <ul className="text-amber-100 text-sm space-y-1 pl-9">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    Use at least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    Mix letters, numbers & symbols
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    Avoid common words & patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    Don't reuse old passwords
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-amber-200 text-sm font-medium">
                Your security is our top priority
              </p>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden w-full bg-gradient-to-r from-amber-700 to-yellow-700 px-6 py-8">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                SWAT<span className="text-amber-300">VENUE</span>
              </h1>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="lg:w-3/5 w-full bg-white dark:bg-gray-900 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Form Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl mb-6 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Reset Your Password
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a strong new password for your account
                </p>
                {email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Resetting password for:{" "}
                    <span className="font-semibold">{email}</span>
                  </p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type="password"
                      {...register("password")}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="Enter your new password"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type="password"
                      {...register("confirmPassword")}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="Confirm your new password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Strength Tips */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                    Password Requirements:
                  </p>
                  <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      Minimum 6 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      Use uppercase & lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      Include numbers for extra security
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Resetting Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="mt-10 text-center">
                <Link
                  to="/auth/login"
                  className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to login</span>
                </Link>
              </div>

              {/* Security Note */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Shield className="w-3 h-3 inline mr-1" />
                All passwords are encrypted with industry-standard security
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
