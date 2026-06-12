import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "../../components/common/Toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  ArrowLeft,
  KeyRound,
  Building,
  Mail,
  Shield,
  ArrowRight,
  Clock,
} from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { authAPI } from "../../utils/api";
import { useTranslation } from "react-i18next";

const verifySchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
});

const VerifyOtp = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const type = location.state?.type || "reset"; // 'reset' or 'verify'

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(verifySchema),
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const onSubmit = async (data) => {
    try {
      if (type === "verify") {
        await authAPI.verifyEmail({ email, otp: data.otp });
        toast.success(t("auth.verify_otp.success_verify"));
        navigate("/auth/login");
      } else {
        const response = await authAPI.verifyOtp(email, data.otp);
        if (response.data.resetToken) {
          sessionStorage.setItem("resetToken", response.data.resetToken);
        }
        toast.success(t("auth.verify_otp.success_otp"));
        navigate("/auth/reset-password", { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("auth.verify_otp.error_invalid"));
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await authAPI.forgotPassword(email);
      toast.success(t("auth.verify_otp.resend_success"));
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      toast.error(t("auth.verify_otp.error_resend"));
    }
  };

  return (
    <>
      <Helmet>
        <title>{t("auth.verify_otp.title")} - SwatVenue</title>
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
                {t("auth.verify_otp.security_title")} <span className="text-amber-300">{t("auth.verify_otp.verification_title")}</span>
              </h2>

              <p className="text-amber-100 text-lg mb-10 max-w-md">
                {t("auth.verify_otp.subtitle")}
              </p>
            </div>

            {/* Security Tips */}
            <div className="relative z-10 space-y-6 mb-8">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-amber-300" />
                  <span className="text-white font-bold text-lg">
                    {t("auth.verify_otp.secure_recovery_title")}
                  </span>
                </div>
                <ul className="text-amber-100 text-sm space-y-1 pl-9">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    {t("auth.verify_otp.tip1")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    {t("auth.verify_otp.tip2")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    {t("auth.verify_otp.tip3")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                    {t("auth.verify_otp.tip4")}
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-6 h-6 text-amber-300" />
                  <span className="text-white font-bold">{t("auth.verify_otp.email_sent_to")}</span>
                </div>
                <p className="text-amber-100 text-sm break-all">
                  {email || "your registered email"}
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-amber-200 text-sm font-medium">
                {t("auth.verify_otp.two_factor_note")}
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
                  <KeyRound className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {t("auth.verify_otp.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("auth.verify_otp.subtitle")}
                </p>
                {email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t("auth.verify_otp.code_sent")}: <span className="font-semibold">{email}</span>
                  </p>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    {t("auth.verify_otp.label")}
                  </label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-500 transition-colors duration-300" />
                    <input
                      type="text"
                      {...register("otp")}
                      maxLength={6}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-center text-2xl tracking-widest font-mono transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600"
                      placeholder="000000"
                      autoComplete="one-time-code"
                    />
                  </div>
                  {errors.otp && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2 text-center">
                      {errors.otp.message}
                    </p>
                  )}
                </div>

                {/* Timer Display */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{t("auth.verify_otp.expires")}: </span>
                    <span
                      className={`font-semibold ${
                        resendTimer < 30 ? "text-red-500" : "text-amber-600"
                      }`}
                    >
                      {Math.floor(resendTimer / 60)}:
                      {String(resendTimer % 60).padStart(2, "0")}
                    </span>
                  </div>
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
                      <span>{t("auth.verify_otp.verifying")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("auth.verify_otp.verify_button")}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Resend OTP & Back Links */}
              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    className={`font-medium transition-all duration-300 inline-flex items-center gap-2 ${
                      canResend
                        ? "text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                        : "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    {canResend
                      ? t("auth.verify_otp.resend_otp")
                      : t("auth.verify_otp.resend_available", { seconds: resendTimer })}
                  </button>

                  <Link
                    to="/auth/login"
                    className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors inline-flex items-center gap-2 group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>{t("auth.verify_otp.back_to_login")}</span>
                  </Link>
                </div>
              </div>

              {/* Security Note */}
              <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Shield className="w-3 h-3 inline mr-1" />
                {t("auth.verify_otp.security_note")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;

