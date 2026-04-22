// src/components/venue/VenuePricingCard.jsx
import React from "react";
import { Phone, Mail, ShieldCheck, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const VenuePricingCard = ({ venue, onBookNow }) => {
  const { t, i18n } = useTranslation();
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-surface-700 sticky top-24 max-w-sm mx-auto">
      {/* Price Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{i18n.language === "ur" ? "قیمت" : "Pricing"}</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[9px] font-bold border border-green-100/50">
            <Zap className="h-2.5 w-2.5 mr-1" />
            {i18n.language === "ur" ? "بہترین قیمت" : "Best Price"}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-primary-900 dark:text-text-dark">
            ₨{venue.price.toLocaleString()}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
            /{venue.priceType.replace('per ', '')}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-5">
        <button
          onClick={onBookNow}
          className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-gold-500/20 hover:-translate-y-0.5"
        >
          {i18n.language === "ur" ? "دستیابی چیک کریں" : "Check Availability"}
        </button>
      </div>

      {/* Trust Badges - Slimmer */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
          <ShieldCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <span>{i18n.language === "ur" ? "محفوظ بکنگ" : "Secure Booking"}</span>
        </div>
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
          <ShieldCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <span>{i18n.language === "ur" ? "تصدیق شدہ مالک" : "Verified Owner"}</span>
        </div>
      </div>

      {/* Owner Info - More compact */}
      <div className="pt-4 border-t border-gray-100 dark:border-surface-700">
        <div className="grid grid-cols-2 gap-3">
          <div className="group">
            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{i18n.language === "ur" ? "مالک" : "Owner"}</p>
            <div className="flex items-center">
              <Mail className="h-3 w-3 text-gold-600 mr-1.5 flex-shrink-0" />
              <p className="text-xs font-bold text-primary-900 dark:text-text-dark truncate">
                {venue.ownerName}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">{i18n.language === "ur" ? "رابطہ" : "Contact"}</p>
            <div className="flex items-center">
              <Phone className="h-3 w-3 text-gold-600 mr-1.5 flex-shrink-0" />
              <p className="text-xs font-bold text-primary-900 dark:text-text-dark">
                {venue.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenuePricingCard;

