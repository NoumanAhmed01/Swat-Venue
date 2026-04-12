import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "../../components/common/Toast";
import {
  Mail,
  ArrowLeft,
  Building,
  Shield,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { authAPI } from "../../utils/api";

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email address is required")
    .email("Please enter a valid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email format"
    ),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await authAPI.forgotPassword(data.email);
      toast.success("OTP has been sent to your email!");
      navigate("/auth/verify-otp", { state: { email: data.email } });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Try again."
      );
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
                Reset Your <span className="text-amber-300">Password</span>
              </h2>

              <p className="text-amber-100 text-lg mb-10 max-w-md">
                Enter your email address and we'll send you a secure
                verification code to reset your password.
              </p>
            </div>

            {/* Recovery Process */}
            <div className="relative z-10 space-y-6 mb-8">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-amber-300" />
                  <span className="text-white font-bold text-lg">
                    Secure Recovery Process
                  </span>
                </div>
                <ul className="text-amber-100 text-sm space-y-1 pl-9">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    Enter your registered email address
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    Receive a 6-digit verification code
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    Verify your identity with the OTP
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    Set a new strong password
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <HelpCircle className="w-6 h-6 text-amber-300" />
                  <span className="text-white font-bold">
                    Can't find the email?
                  </span>
                </div>
                <p className="text-amber-100 text-sm">
                  Check your spam folder or verify that you entered the correct
                  email address associated with your account.
                </p>
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
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Forgot Your Password?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Don't worry! Enter your email to reset your password
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type="email"
                      {...register("email")}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border ${
                        errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                      } rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                    What happens next?
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    We'll send a 6-digit verification code to your email. Use
                    that code in the next step to reset your password securely.
                  </p>
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
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
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
                Your email is secure and will only be used for password recovery
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
