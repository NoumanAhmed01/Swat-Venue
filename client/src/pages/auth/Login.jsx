import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";

// Validation schema using Yup
const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // React Hook Form setup with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // Handles login logic
  const onSubmit = async (data) => {
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success("Login successful!");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <>
      {/* SEO setup */}
      <Helmet>
        <title>Login - SwatVenue</title>
        <meta
          name="description"
          content="Login to your SwatVenue account to manage bookings and venues."
        />
      </Helmet>

      {/* Page container */}
      <div className="min-h-screen bg-gray-50 dark:bg-surface-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo + heading */}
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
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-text-light dark:text-text-dark">
              Sign in to your account
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white dark:bg-surface-800 py-8 px-6 shadow-lg rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email input */}
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

              {/* Password input */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
                    placeholder="Enter your password"
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

              {/* Remember me + forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-primary-900 dark:text-text-dark"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-gold-600 hover:text-gold-500"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-400 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? <LoadingSpinner size="sm" /> : "Sign In"}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-surface-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-surface-800 text-gray-500">
                    Demo Credentials
                  </span>
                </div>
              </div>

              <div className="mt-4 text-sm text-text-light dark:text-text-dark space-y-1">
                <p>
                  <strong>Admin:</strong> admin@swatvenue.com / password
                </p>
                <p>
                  <strong>Owner:</strong> owner@swatvenue.com / password
                </p>
                <p>
                  <strong>Customer:</strong> customer@swatvenue.com / password
                </p>
              </div>
            </div>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-text-light dark:text-text-dark">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="text-gold-600 hover:text-gold-500 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
