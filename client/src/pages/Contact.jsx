import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

// ✅ Validation schema using Yup
const contactSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required"),
});

const Contact = () => {
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
      // Simulate API call (you can replace with your backend endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  // ✅ Static contact info list
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+92-300-SWATVENUE", "+92-946-123456"],
      action: "tel:+923001234567",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@swatvenue.com", "support@swatvenue.com"],
      action: "mailto:info@swatvenue.com",
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
        <title>Contact SwatVenue - Get in Touch</title>
        <meta
          name="description"
          content="Contact SwatVenue for support, questions, or partnership opportunities. We're here to help you find the perfect event venue in Swat valley."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 🌟 Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
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
                  Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Reach out to us through any of these channels. We're here to
                  help!
                </p>
              </div>

              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <info.icon className="h-6 w-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary-900 dark:text-text-dark mb-2">
                      {info.title}
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
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-black dark:text-gray-300">
                        Your Name *
                      </label>
                      <input
                        {...register("name")}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark"
                        placeholder="Enter your full name"
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
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark"
                        placeholder="Enter your email"
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
                      Subject *
                    </label>
                    <select
                      {...register("subject")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="booking">Booking Support</option>
                      <option value="venue-listing">List My Venue</option>
                      <option value="technical">Technical Issue</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
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
                      Message *
                    </label>
                    <textarea
                      rows="6"
                      {...register("message")}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-surface-700 dark:text-text-dark"
                      placeholder="Tell us how we can help you..."
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
                        <span>Send Message</span>
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl mb-12  text-black dark:text-white">
              Quick answers to common questions
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
                <span>Call Us Now</span>
              </a>
            </div>
          </div>
        </section>

        {/* 🗺️ Map Section */}
        <section className="py-20 bg-gray-50 dark:bg-surface-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              Visit Our Office
            </h2>
            <p className="text-xl mb-12 text-black dark:text-white">
              Located in the heart of Mingora, Swat
            </p>

            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-8">
              <div className="bg-gray-200 dark:bg-surface-700 h-96 rounded-lg flex flex-col items-center justify-center">
                <MapPin className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  Interactive Map
                </h3>
                <p className="text-gray-500">
                  Google Maps integration would appear here
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Green Chowk, Mingora, Swat, KPK, Pakistan
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
