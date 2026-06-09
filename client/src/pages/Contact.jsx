import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactSchema } from "../utils/validation";
import { toast } from "../components/common/Toast";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { contactAPI } from "../utils/api";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  // Helper to restrict name to alphabets and spaces only during typing
  const handleNameKeyDown = (e) => {
    if (
      [8, 46, 9, 27, 13, 32].indexOf(e.keyCode) !== -1 ||
      (e.ctrlKey === true && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) ||
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    if (
      (e.keyCode < 65 || e.keyCode > 90) &&
      (e.keyCode < 97 || e.keyCode > 122)
    ) {
      e.preventDefault();
    }
  };

  // ✅ React Hook Form setup with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
  });

  // ✅ Handles form submission
  const onSubmit = async (data) => {
    try {
      const response = await contactAPI.create(data);
      if (response.data.success) {
        toast.success(response.data.message || t("contact.success_msg"));
        reset();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to send message. Please try again.";
      toast.error(errorMsg);
    }
  };

  // ✅ Static contact info list
  const contactInfo = [
    {
      icon: Phone,
      title: t("contact.subjects.other"), // Using "Other" for general Phone title or could add more keys
      details: ["+92-300-SWATVENUE", "+92-946-123456"],
      action: "tel:+923001234567",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["swatvenue@gmail.com", "support@swatvenue.com"],
      action: "mailto:swatvenue@gmail.com",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Green Chowk, Mingora", "Swat, Khyber Pakhtunkhwa", "Pakistan"],
      action: null,
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: 10:00 AM - 4:00 PM"],
      action: null,
    },
  ];

  // ✅ Frequently Asked Questions
  const faqItems = [
    {
      question: "How do I book a venue?",
      answer:
        "You can browse our venues, view details, and send an inquiry directly to the venue owner. We facilitate the connection and provide support throughout the process.",
    },
    {
      question: "Is there a booking fee?",
      answer:
        "SwatVenue is free to use for customers. We only charge venue owners a small commission on successful bookings.",
    },
    {
      question: "Can I cancel or modify my booking?",
      answer:
        "Cancellation and modification policies vary by venue. Please check with the venue owner directly for their specific terms and conditions.",
    },
    {
      question: "How do I list my venue?",
      answer:
        "Simply register as a venue owner, fill out our detailed venue form with photos and information, and we'll review and approve your listing within 24-48 hours.",
    },
  ];

  return (
    <>
      {/* 🧠 SEO Optimization using Helmet */}
      <Helmet>
        <title>{t("contact.hero_title")} - SwatVenue</title>
        <meta name="description" content={t("contact.hero_subtitle")} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 🌟 Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("contact.hero_title")}
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              {t("contact.hero_subtitle")}
            </p>
          </div>
        </section>

        {/* 📞 Contact Info & Form */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 🧾 Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {t("contact.info_title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  {t("contact.info_subtitle")}
                </p>
              </div>

              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <info.icon className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900 dark:text-text-dark mb-2">
                      {index === 0
                        ? t("contact.subjects.other")
                        : index === 1
                          ? "Email"
                          : index === 2
                            ? "Address"
                            : "Business Hours"}
                    </h3>
                    {info.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-text-light dark:text-text-dark"
                      >
                        {info.action && idx === 0 ? (
                          <a
                            href={info.action}
                            className="hover:text-gold-600 transition-colors duration-200"
                          >
                            {detail}
                          </a>
                        ) : (
                          detail
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 📨 Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-text-dark mb-6">
                  {t("contact.form_title")}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-gray-300">
                        {t("contact.name_label")}
                      </label>
                      <input
                        {...register("name")}
                        onKeyDown={handleNameKeyDown}
                        className={`w-full px-4 py-3 border ${
                          errors.name
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark transition-colors`}
                        placeholder={t("contact.name_placeholder")}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2  text-black dark:text-gray-300">
                        {t("contact.email_label")}
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className={`w-full px-4 py-3 border ${
                          errors.email
                            ? "border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                        } rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark transition-colors`}
                        placeholder={t("contact.email_placeholder")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black dark:text-gray-300">
                      {t("contact.subject_label")}
                    </label>
                    <select
                      {...register("subject")}
                      className={`w-full px-4 py-3 border ${
                        errors.subject
                          ? "border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      } rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark transition-colors`}
                    >
                      <option value="">
                        {t("contact.subject_placeholder")}
                      </option>
                      <option value="general">
                        {t("contact.subjects.general")}
                      </option>
                      <option value="booking">
                        {t("contact.subjects.booking")}
                      </option>
                      <option value="venue-listing">
                        {t("contact.subjects.venue_listing")}
                      </option>
                      <option value="technical">
                        {t("contact.subjects.technical")}
                      </option>
                      <option value="partnership">
                        {t("contact.subjects.partnership")}
                      </option>
                      <option value="other">
                        {t("contact.subjects.other")}
                      </option>
                    </select>
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-black dark:text-gray-300">
                      {t("contact.message_label")}
                    </label>
                    <textarea
                      rows="6"
                      {...register("message")}
                      className={`w-full px-4 py-3 border ${
                        errors.message
                          ? "border-red-500"
                          : "border-gray-200 dark:border-gray-700"
                      } rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark transition-colors`}
                      placeholder={t("contact.message_placeholder")}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>{t("contact.send_button")}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ❓ FAQ Section */}
        <section className="py-20 bg-white dark:bg-surface-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              {t("contact.faq_title")}
            </h2>
            <p className="text-xl mb-12  text-black dark:text-white">
              {t("contact.faq_subtitle")}
            </p>

            <div className="space-y-8 text-left">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b pb-8">
                  <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <p className="mb-4 text-black dark:text-white">
                Still have questions?
              </p>
              <a
                href="tel:+923001234567"
                className="inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                <Phone className="h-5 w-5" />
                <span>{t("contact.call_now")}</span>
              </a>
            </div>
          </div>
        </section>

        {/* 🗺️ Map Section */}
        <section className="py-20 bg-gray-50 dark:bg-surface-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              {t("contact.office_title")}
            </h2>
            <p className="text-xl mb-12 text-black dark:text-white">
              {t("contact.office_subtitle")}
            </p>

            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-surface-700">
              <div className="w-full h-[450px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.556589795626!2d72.28680277555038!3d34.791936372887434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dc179eafdd2ea7%3A0x4dd833268f21905f!2sDr%20Khan%20Shaheed%20Govt%20Degree%20College%20Kabal%20Swat!5e0!3m2!1sen!2s!4v1780982018483!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
