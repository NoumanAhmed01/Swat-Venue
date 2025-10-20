import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react";
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
      const success = await registerUser(data);
      if (success) {
        toast.success("Registration successful! Welcome to SwatVenue.");
        navigate(data.role === "owner" ? "/owner/dashboard" : "/");
      } else {
        toast.error("Registration failed. Please try again.");
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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-text-light dark:text-text-dark">
              Join SwatVenue and start your journey
            </p>
          </div>

          <div className="bg-white dark:bg-surface-800 py-8 px-6 shadow-lg rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                      selectedRole === "customer"
                        ? "border-gold-600 bg-gold-50 dark:bg-gold-900/20"
                        : "border-gray-300 dark:border-surface-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value="customer"
                      {...register("role")}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-primary-900 dark:text-text-dark">
                        Customer
                      </span>
                      <span className="block text-sm text-gray-500 dark:text-text-dark">
                        Book venues
                      </span>
                    </div>
                  </label>

                  <label
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                      selectedRole === "owner"
                        ? "border-gold-600 bg-gold-50 dark:bg-gold-900/20"
                        : "border-gray-300 dark:border-surface-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value="owner"
                      {...register("role")}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-primary-900 dark:text-text-dark">
                        Owner
                      </span>
                      <span className="block text-sm text-gray-500 dark:text-text-dark">
                        List venues
                      </span>
                    </div>
                  </label>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  {...register("terms")}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-emerald-600 hover:text-emerald-500"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-emerald-600 hover:text-emerald-500"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.terms.message}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-light dark:text-text-dark">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-gold-600 hover:text-gold-500 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
