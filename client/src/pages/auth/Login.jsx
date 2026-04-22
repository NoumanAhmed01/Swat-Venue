import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/validation";
import { toast } from "../../components/common/Toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Building,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Login = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
        toast("Login successful!", { type: "success" });
        const from =
          location.state?.from?.pathname || location.state?.from || "/";
        navigate(from, { replace: true });
      } else {
        if (result.isVerified === false) {
          toast.error("Email not verified. Redirecting to verification page...");
          setTimeout(() => {
            navigate("/auth/verify-otp", { 
              state: { 
                email: data.email, 
                type: "verify" 
              } 
            });
          }, 2000);
        } else {
          toast.error(result.message || "Invalid email or password");
        }
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("nav.login")} - SwatVenue</title>
        <meta
          name="description"
          content="Login to your SwatVenue account to manage bookings and venues."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950/20 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-none md:shadow-xl lg:shadow-2xl">
          {/* Left Brand Section */}
          <div className="hidden md:flex md:w-1/2  lg:flex lg:w-2/5 bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-700 p-8 md:p-12 flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {t("auth.welcome_back")}{" "}
                <span className="text-amber-300">Swat Venue</span>
              </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { icon: Shield, text: t("auth.enterprise_security") },
                { icon: Building, text: t("auth.venue_management") },
                { icon: Users, text: t("auth.customer_portal") },
                { icon: Shield, text: t("auth.secure_access") },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <span className="text-white font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <p className="relative z-10 text-amber-200 text-sm font-medium">
              {t("auth.trusted_by")}
            </p>
          </div>

          {/* Right Form Section */}
          <div className="lg:w-3/5 bg-white dark:bg-gray-900 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl mb-6 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {t("auth.login_title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("auth.login_subtitle")}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2 dark:text-white">
                    {t("auth.email_label")}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-4 text-text-light dark:text-text-dark bg-gray-50 dark:bg-gray-800 border ${
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

                {/* Password */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-semibold dark:text-white">
                      {t("auth.password_label")}
                    </label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm text-amber-600 font-medium"
                    >
                      {t("auth.forgot_password")}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-4 text-text-light dark:text-text-dark bg-gray-50 dark:bg-gray-800 border ${
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
                  {errors.password && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      {t("auth.signing_in")}
                    </>
                  ) : (
                    <>
                      {t("auth.continue_dashboard")}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up */}
              <div className="mt-10 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {t("auth.no_account")}{" "}
                  <Link
                    to="/auth/register"
                    className="font-bold text-amber-600"
                  >
                    {t("auth.create_account_now")}
                  </Link>
                </p>
              </div>

              {/* Security Note */}
              <p className="text-center text-xs text-gray-500 mt-8 pt-6 border-t ">
                <Shield className="w-3 h-3 inline mr-1" />
                {t("auth.security_note")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
