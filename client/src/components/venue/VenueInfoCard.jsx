// src/components/venue/VenueInfoCard.jsx
import React from "react";
import { MapPin, Users, Star, Award, ShieldCheck, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const VenueInfoCard = ({ venue }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-100 dark:border-surface-700">
      {/* Badge Section - More Compact */}
      <div className="flex flex-wrap gap-2 mb-4">
        {venue.rating >= 4.5 && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 text-[10px] font-bold border border-gold-200/30">
            <Award className="h-3 w-3 mr-1.5" />
            {t("features.top_rated_title")}
          </span>
        )}
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold border border-blue-200/30">
          <ShieldCheck className="h-3 w-3 mr-1.5" />
          {i18n.language === "ur" ? "تصدیق شدہ" : "Verified"}
        </span>
      </div>

      {/* Title and Address - Slimmer */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-primary-900 dark:text-text-dark tracking-tight mb-2">
          {venue.name}
        </h1>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4 text-gold-600 mr-2 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            {venue.address}
          </span>
        </div>
      </div>

      {/* Quick Stats Grid - More Compact */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-gray-50 dark:bg-surface-900/50 p-3 rounded-xl border border-gray-100 dark:border-surface-700">
          <div className="flex items-center text-gray-400 mb-1">
            <Users className="h-3 w-3 mr-1.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">{t("search.guests")}</span>
          </div>
          <p className="text-sm font-bold text-primary-900 dark:text-text-dark">
            {venue.capacity}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-surface-900/50 p-3 rounded-xl border border-gray-100 dark:border-surface-700">
          <div className="flex items-center text-gray-400 mb-1">
            <Star className="h-3 w-3 mr-1.5 text-yellow-400 fill-current" />
            <span className="text-[9px] font-bold uppercase tracking-wider">{i18n.language === "ur" ? "ریٹنگ" : "Rating"}</span>
          </div>
          <p className="text-sm font-bold text-primary-900 dark:text-text-dark">
            {venue.rating}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-surface-900/50 p-3 rounded-xl border border-gray-100 dark:border-surface-700">
          <div className="flex items-center text-gray-400 mb-2">
            <Clock className="h-3 w-3 mr-1.5 text-gold-600" />
            <span className="text-[9px] font-bold uppercase tracking-wider">{i18n.language === "ur" ? "ایونٹ سلاٹس" : "Event Slots"}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2 animate-pulse"></div>
              <p className="text-[10px] font-bold text-primary-900 dark:text-text-dark">
                {i18n.language === "ur" ? "دوپہر" : "Lunch"}: 11am - 4pm
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
              <p className="text-[10px] font-bold text-primary-900 dark:text-text-dark">
                {i18n.language === "ur" ? "رات" : "Dinner"}: 7pm - 11pm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description - Slimmer */}
      <div>
        <div className="flex items-center mb-3">
          <div className="w-1 h-4 bg-gold-500 rounded-full mr-2"></div>
          <h3 className="text-sm font-bold text-primary-900 dark:text-text-dark uppercase tracking-wider">
            {i18n.language === "ur" ? "جائزہ" : "Overview"}
          </h3>
        </div>
        <p className="text-text-light dark:text-text-dark leading-relaxed text-sm opacity-90">
          {venue.description}
        </p>
      </div>
    </div>
  );
};

export default VenueInfoCard;

