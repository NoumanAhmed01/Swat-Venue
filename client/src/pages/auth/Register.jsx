import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Building,
  Users,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: yup.string().required("Role is required"),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const defaultRole = searchParams.get("role") || "customer";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data);
      if (result.success) {
        toast.success("Registration successful! Welcome to SwatVenue.");
        navigate(data.role === "owner" ? "/owner/dashboard" : "/");
      } else {
        toast.error(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - SwatVenue</title>
        <meta
          name="description"
          content="Create your SwatVenue account to start booking venues or list your own."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950/20 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Brand Section - Desktop Only */}
          <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-700 p-8 md:p-12  flex-col justify-between relative overflow-hidden">
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
                Join Our <span className="text-amber-300">Venue Community</span>
              </h2>

              <p className="text-amber-100 text-lg mb-10 max-w-md">
                Create your account to access premium venue management tools or
                discover amazing venues for your events.
              </p>
            </div>

            {/* Role Benefits */}
            <div className="relative z-10 space-y-6 mb-8">
              <div
                className={`p-4 rounded-xl transition-all duration-300 ${
                  selectedRole === "customer"
                    ? "bg-white/20 backdrop-blur-sm"
                    : "bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-amber-300" />
                  <span className="text-white font-bold text-lg">
                    As a Customer
                  </span>
                </div>
                <p className="text-amber-100 text-sm">
                  Book venues seamlessly, manage reservations, and get exclusive
                  deals for your events.
                </p>
              </div>

              <div
                className={`p-4 rounded-xl transition-all duration-300 ${
                  selectedRole === "owner"
                    ? "bg-white/20 backdrop-blur-sm"
                    : "bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Building className="w-6 h-6 text-amber-300" />
                  <span className="text-white font-bold text-lg">
                    As an Owner
                  </span>
                </div>
                <p className="text-amber-100 text-sm">
                  List your venues, manage bookings, and grow your business with
                  our powerful tools.
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-amber-200 text-sm font-medium">
                Join 500+ successful venue owners and customers
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
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Create Your Account
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose your role and fill in your details
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                {/* Role Selection - Beautiful Toggle */}
                <div className="mb-2">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    Select Your Role
                  </label>
                  <div className="relative bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl flex">
                    <div
                      className={`absolute top-1 bottom-1 w-1/2 rounded-xl transition-all duration-300 transform ${
                        selectedRole === "customer"
                          ? "left-1 bg-gradient-to-r from-amber-500 to-yellow-500"
                          : "left-1/2 bg-gradient-to-r from-amber-500 to-yellow-500"
                      }`}
                    />
                    <label
                      className={`flex-1 text-center relative z-10 cursor-pointer py-4 rounded-xl transition-all duration-300 ${
                        selectedRole === "customer"
                          ? "text-white"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value="customer"
                        {...register("role")}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Users
                          className={`w-6 h-6 transition-colors duration-300 ${
                            selectedRole === "customer"
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        />
                        <span className="font-semibold">Customer</span>
                        <span className="text-xs">Book Venues</span>
                      </div>
                    </label>

                    <label
                      className={`flex-1 text-center relative z-10 cursor-pointer py-4 rounded-xl transition-all duration-300 ${
                        selectedRole === "owner"
                          ? "text-white"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value="owner"
                        {...register("role")}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Building
                          className={`w-6 h-6 transition-colors duration-300 ${
                            selectedRole === "owner"
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        />
                        <span className="font-semibold">Owner</span>
                        <span className="text-xs">List Venues</span>
                      </div>
                    </label>
                  </div>
                  {errors.role && (
                    <p className="text-red-600 text-sm mt-2 text-center">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="Create a password (min. 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
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
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register("terms")}
                    className="mt-1 w-4 h-4 text-amber-600 dark:text-amber-500 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                    {errors.terms.message}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-10 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    Sign in now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
