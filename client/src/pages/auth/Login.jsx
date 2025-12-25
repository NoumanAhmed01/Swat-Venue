import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  ArrowRight,
  CheckCircle,
  Shield,
  Building,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

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

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success("Login successful!");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      } else {
        toast.error(result.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - SwatVenue</title>
        <meta
          name="description"
          content="Login to your SwatVenue account to manage bookings and venues."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950/20 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Brand Section */}
          <div className="lg:w-2/5 bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-700 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
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
                Welcome Back to{" "}
                <span className="text-amber-300">Smart Venue Management</span>
              </h2>

              <p className="text-amber-100 text-lg mb-10 max-w-md">
                Access your dashboard to manage bookings, venues, and connect
                with customers seamlessly.
              </p>
            </div>

            {/* Features List */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { icon: Shield, text: "Enterprise Security" },
                { icon: Building, text: "Venue Management" },
                { icon: Users, text: "Customer Portal" },
                { icon: CheckCircle, text: "Real-time Analytics" },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="text-white font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10">
              <p className="text-amber-200 text-sm font-medium">
                Trusted by 500+ venue owners worldwide
              </p>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="lg:w-3/5 bg-white dark:bg-gray-900 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Form Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl mb-6 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Sign In to Your Account
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your credentials to access the platform
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
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Password
                    </label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="Enter your password"
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
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-amber-600 dark:text-amber-500 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:focus:ring-amber-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Remember me for 30 days
                  </label>
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
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Dashboard</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
                  Try with demo credentials
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      role: "Admin",
                      email: "admin@swatvenue.com",
                      color: "bg-red-50 dark:bg-red-900/20",
                      text: "text-red-700 dark:text-red-400",
                    },
                    {
                      role: "Owner",
                      email: "owner@swatvenue.com",
                      color: "bg-blue-50 dark:bg-blue-900/20",
                      text: "text-blue-700 dark:text-blue-400",
                    },
                    {
                      role: "Customer",
                      email: "customer@swatvenue.com",
                      color: "bg-amber-50 dark:bg-amber-900/20",
                      text: "text-amber-700 dark:text-amber-400",
                    },
                  ].map((demo, idx) => (
                    <div
                      key={idx}
                      className={`${demo.color} p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer group`}
                      onClick={() => {
                        document.querySelector('input[type="email"]').value =
                          demo.email;
                        document.querySelector('input[type="password"]').value =
                          "password";
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-amber-600" />
                        <span className={`font-bold ${demo.text}`}>
                          {demo.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate group-hover:text-gray-900 dark:group-hover:text-gray-300">
                        {demo.email}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-10 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/auth/register"
                    className="font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    Create account now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </p>
              </div>

              {/* Security Note */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Shield className="w-3 h-3 inline mr-1" />
                Protected by end-to-end encryption • GDPR compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
