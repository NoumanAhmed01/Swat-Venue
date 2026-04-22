import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  Building,
  Users,
  Calendar,
  MapPin,
  TrendingUp,
  BarChart,
} from "lucide-react";

const RoleSelectionScreen = ({ onSelectRole }) => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t("auth.join_platform")} - SwatVenue</title>
        <meta
          name="description"
          content="Join SwatVenue as a customer or venue owner."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              {t("auth.join_platform")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("auth.choose_started")}
            </p>
          </div>

          {/* Selection Cards - Responsive Grid */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            {/* Customer Card */}
            <div
              onClick={() => onSelectRole("customer")}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 hover:border-gold-500 dark:hover:border-gold-500 transition-colors cursor-pointer group"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-white">
                    {t("auth.join_as_customer")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t("auth.book_venues_desc")}
                  </p>
                </div>
                <div className="text-gray-400 group-hover:text-gold-600 transition-colors text-xl">
                  →
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t("auth.easy_booking_mgmt")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {t("auth.easy_booking_desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t("auth.premium_venue_selection")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {t("auth.premium_venue_desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                  {t("auth.continue_as_customer")}
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>

            {/* Owner Card */}
            <div
              onClick={() => onSelectRole("owner")}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 hover:border-gold-500 dark:hover:border-gold-500 transition-colors cursor-pointer group"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gold-100 dark:bg-gold-900/30 rounded-xl flex items-center justify-center">
                  <Building className="w-7 h-7 text-gold-600 dark:text-gold-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-white">
                    {t("auth.join_as_owner")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t("auth.list_manage_desc")}
                  </p>
                </div>
                <div className="text-gray-400 group-hover:text-gold-600 transition-colors text-xl">
                  →
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-50 dark:bg-gold-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t("auth.business_growth_tools")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {t("auth.business_growth_desc")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold-50 dark:bg-gold-900/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t("auth.analytics_dashboard")}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {t("auth.analytics_desc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <button className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                  {t("auth.continue_as_owner")}
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 md:my-12">
            {/* Divider with text */}
            <div className="relative max-w-2xl mx-auto mb-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm">
                  {t("auth.already_have_account")}
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <a
                href="/auth/login"
                className="inline-block  text-gold-600 hover:text-gold-700 dark:text-gold-400 dark:hover:text-gold-300 font-medium"
              >
                {t("auth.sign_in_account")}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                {t("auth.trusted_by_full")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleSelectionScreen;
