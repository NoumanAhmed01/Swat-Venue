import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../utils/validation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Shield,
  Building,
  Users,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const RegistrationForm = ({ role, onSubmit, isSubmitting, onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const passwordValue = watch("password", "");

  const passwordRequirements = [
    { label: "At least 8 characters", met: passwordValue.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", met: /[a-z]/.test(passwordValue) },
    { label: "One number", met: /[0-9]/.test(passwordValue) },
    { label: "One special character (@$!%*?&#)", met: /[@$!%*?&#]/.test(passwordValue) },
  ];

  // Helper to restrict name to alphabets and spaces only during typing
  const handleNameKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, space
    if ([8, 46, 9, 27, 13, 32].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.ctrlKey === true && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
    }
    // Ensure that it is a letter and stop the keypress
    if ((e.keyCode < 65 || e.keyCode > 90) && (e.keyCode < 97 || e.keyCode > 122)) {
        e.preventDefault();
    }
  };

  // Helper to restrict phone to numbers and + only during typing
  const handlePhoneKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, + (Shift + =)
    if ([8, 46, 9, 27, 13, 187, 107].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.ctrlKey === true && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
  };

  const isCustomer = role === "customer";
  const roleTitle = isCustomer ? "Customer" : "Owner";

  return (
    <>
      <Helmet>
        <title>Register as {roleTitle} - SwatVenue</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950/20 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-none md:shadow-xl lg:shadow-2xl">
          {/* Left Brand Section - Same as Login */}
          <div className="hidden md:flex md:w-1/2 lg:flex lg:w-2/5 bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-700 p-8 md:p-12 flex-col justify-between relative overflow-hidden">
            {/* Back Button for Desktop */}
            <button
              onClick={onBack}
              className="hidden lg:flex items-center gap-2 text-amber-100 hover:text-white mb-8 transition-colors group self-start"
            >
              <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to selection</span>
            </button>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Join Our Platform as{" "}
                <span className="text-amber-300">{roleTitle}</span>
              </h2>

              <p className="text-amber-100 text-lg mb-10 max-w-md">
                {isCustomer
                  ? "Create your account to discover amazing venues, book events, and manage all your reservations in one place."
                  : "Register your venue business to reach thousands of customers, manage bookings, and grow with powerful tools."}
              </p>
            </div>

            {/* Features List - Same as Login */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {isCustomer
                ? // Customer features
                  [
                    { icon: Shield, text: "Enterprise Security" },
                    { icon: Building, text: "Venue Management" },
                    { icon: Users, text: "Customer Portal" },
                    { icon: Shield, text: "Secure Access" },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-amber-300" />
                      </div>
                      <span className="text-white font-medium">
                        {feature.text}
                      </span>
                    </div>
                  ))
                : // Owner features
                  [
                    { icon: Shield, text: "Business Security" },
                    { icon: Building, text: "Venue Dashboard" },
                    { icon: Users, text: "Owner Portal" },
                    { icon: Shield, text: "Secure Management" },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-amber-300" />
                      </div>
                      <span className="text-white font-medium">
                        {feature.text}
                      </span>
                    </div>
                  ))}
            </div>

            <p className="relative z-10 text-amber-200 text-sm font-medium">
              Trusted by 500+ venue owners worldwide
            </p>
          </div>

          {/* Right Form Section */}
          <div className="lg:w-3/5 bg-white dark:bg-gray-900 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Mobile Back Button */}
              <button
                onClick={onBack}
                className="lg:hidden flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mb-6 transition-colors group"
              >
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to selection</span>
              </button>

              {/* Form Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl mb-6 shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Create Your Account
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fill in your details to get started as a{" "}
                  {roleTitle.toLowerCase()}
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 text-text-light dark:text-text-dark"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-white">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      {...register("name")}
                      onKeyDown={handleNameKeyDown}
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border ${
                        errors.name ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                      } rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-white">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border ${
                        errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                      } rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-white">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      {...register("phone")}
                      onKeyDown={handlePhoneKeyDown}
                      placeholder="Enter your phone number"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border ${
                        errors.phone ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                      } rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-white">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Create a password (min. 8 characters)"
                      className={`w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border ${
                        errors.password ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                      } rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  
                  {/* Real-time Password Requirements */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          req.met ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                        }`}>
                          {req.met ? (
                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-1 h-1 bg-current rounded-full" />
                          )}
                        </div>
                        <span className={`text-[11px] font-medium transition-colors ${
                          req.met ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
                        }`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {errors.password && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-white">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      placeholder="Confirm your password"
                      className={`w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                      } rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-colors`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-2">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      {...register("terms")}
                      className="w-4 h-4 text-amber-600 dark:text-amber-500 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 underline"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.terms.message}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create {roleTitle} Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <div className="mt-10 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link to="/auth/login" className="font-bold text-amber-600">
                    Sign in now
                  </Link>
                </p>
              </div>

              {/* Security Note */}
              <p className="text-center text-xs text-gray-500 mt-8 pt-6 border-t">
                <Shield className="w-3 h-3 inline mr-1" />
                All data is encrypted • GDPR compliant • No spam ever
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
