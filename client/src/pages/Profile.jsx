import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../utils/api";
import { toast } from "../components/common/Toast";
import {
  User,
  Camera,
  Mail,
  Phone,
  Shield,
  Trash2,
  Loader2,
  CheckCircle,
  Calendar,
  LogOut,
  Lock,
  Save,
  ShieldCheck,
  X, // Added X for unmet requirements
} from "lucide-react";
import { AnimatedSection } from "../components/animation/Animation";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [profileData, setProfileData] = useState({ name: "", phone: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for new password and its requirements
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [newPasswordRequirementsMet, setNewPasswordRequirementsMet] = useState(
    [],
  );

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setIsSubmitting(true);
      const response = await userAPI.updateProfilePicture(formData);
      if (response.data.success) {
        updateUser({ profilePicture: response.data.data.profilePicture });
        toast.success("Photo updated");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      const response = await userAPI.update(user.id || user._id, profileData);
      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Profile saved");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Helper function to check password strength
  const checkPasswordStrength = (password) => {
    const requirements = [
      { label: t("auth.pass_req_8"), met: password.length >= 8 },
      { label: t("auth.pass_req_upper"), met: /[A-Z]/.test(password) },
      { label: t("auth.pass_req_lower"), met: /[a-z]/.test(password) },
      { label: t("auth.pass_req_number"), met: /[0-9]/.test(password) },
      { label: t("auth.pass_req_special"), met: /[@$!%*?&#]/.test(password) },
    ];
    return requirements;
  };

  // Effect to update requirements when newPasswordValue changes
  useEffect(() => {
    setNewPasswordRequirementsMet(checkPasswordStrength(newPasswordValue));
  }, [newPasswordValue, t]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validate new password strength
    const strengthCheck = checkPasswordStrength(passwordData.newPassword);
    const allRequirementsMet = strengthCheck.every((req) => req.met);

    if (!allRequirementsMet) {
      toast.error("New password does not meet the required criteria.");
      return;
    }

    // Check if current password is the same as new password
    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password cannot be the same as the current password.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords mismatch");
    }

    try {
      setIsSubmitting(true);
      await userAPI.update(user.id || user._id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password updated");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setNewPasswordValue(""); // Reset for requirements display
      setNewPasswordRequirementsMet([]); // Reset requirements display
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <Helmet>
        <title>Account Settings | SwatVenue</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection>
          {/* Professional Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between  gap-6 mb-10 pb-10 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left"> {/* Adjusted class here */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-900 ring-4 ring-white dark:ring-slate-800 shadow-xl">
                  {user?.profilePicture?.url ? (
                    <img
                      src={user.profilePicture.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-900">
                      <User size={40} />
                    </div>
                  )}
                  {isSubmitting && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm rounded-full">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all border-2 border-white dark:border-slate-800"
                >
                  <Camera size={14} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-1.5 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {user?.name}
                  </h1>

                  {/* Professional Verified Badge - Clean & Modern */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-full border border-blue-200/60 dark:border-blue-500/20 shadow-sm">
                    <CheckCircle
                      size={12}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all uppercase tracking-widest shadow-sm"
            >
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Settings */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                  <User size={18} />
                </div>
                General Details
              </h3>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 rounded-2xl text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-slate-900/10"
                >
                  {isUpdatingProfile ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Information
                </button>
              </form>
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                  <ShieldCheck size={18} />
                </div>
                Security & Password
              </h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      });
                      setNewPasswordValue(e.target.value); // Update state for requirements display
                    }}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                  />

                  {/* Password Requirements Display */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    Password Requirements:
                    {newPasswordRequirementsMet.map((req, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 ${req.met ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
                      >
                        {req.met ? <CheckCircle size={12} /> : <X size={12} />}
                        {req.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-2xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Lock size={16} />
                  )}
                  Update Securely
                </button>
              </form>
            </div>
          </div>
        </AnimatedSection>

        <p className="mt-12 text-center text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          End-to-end Encrypted Dashboard &bull; SwatVenue
        </p>
      </div>
    </div>
  );
};

export default Profile;
