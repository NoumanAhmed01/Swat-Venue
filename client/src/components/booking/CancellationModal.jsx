import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../common/LoadingSpinner";

const CancellationModal = ({
  isOpen,
  onClose,
  onConfirm,
  booking,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError(t("booking_card.cancellation_reason_required"));
      return;
    }
    onConfirm(booking._id, "cancelled", reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="text-rose-500 h-6 w-6" />
            {t("booking_card.cancel_booking")}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
            {t("booking_card.cancellation_reason_desc")}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {t("booking_card.cancellation_reason_label")}
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                placeholder={t("booking_card.cancellation_reason_placeholder")}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border ${
                  error
                    ? "border-rose-500"
                    : "border-gray-200 dark:border-gray-700"
                } rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all resize-none text-gray-900 dark:text-white`}
              />
              {error && (
                <p className="mt-1.5 text-xs font-medium text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {t("common.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all shadow-lg hover:shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  {t("booking_card.cancelling")}
                </>
              ) : (
                t("booking_card.cancel_booking")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancellationModal;
