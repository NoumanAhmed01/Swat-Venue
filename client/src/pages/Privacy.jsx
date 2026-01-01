import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  Cookie,
  Database,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "../components/animation/Animation";

const Privacy = () => {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      title: "1. Introduction",
      icon: Shield,
      content:
        "SwatVenue ('we,' 'our,' or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.",
    },
    {
      title: "2. Information We Collect",
      icon: Database,
      content:
        "We collect information to provide and improve our venue booking services.",
      points: [
        "Personal details (name, email, phone)",
        "Booking preferences and history",
        "Payment information via secure processors",
        "Device and usage data for analytics",
      ],
    },
    {
      title: "3. How We Use Information",
      icon: Eye,
      content: "Your information helps us deliver better services.",
      points: [
        "Facilitate venue bookings and reservations",
        "Send booking confirmations and updates",
        "Improve platform functionality",
        "Provide customer support",
      ],
    },
    {
      title: "4. Data Sharing",
      icon: UserCheck,
      content: "We respect your privacy and only share data when necessary.",
      points: [
        "With venue owners for booking coordination",
        "With trusted service providers",
        "For legal compliance",
        "Never sold to third parties",
      ],
    },
    {
      title: "5. Data Security",
      icon: Lock,
      content: "We implement strong security measures to protect your data.",
      points: [
        "SSL encryption for all data transmission",
        "Secure servers with regular updates",
        "Access controls and authentication",
        "Regular security audits",
      ],
    },
    {
      title: "6. Cookies & Tracking",
      icon: Cookie,
      content: "We use cookies to enhance user experience.",
      points: [
        "Essential cookies for site functionality",
        "Analytics for service improvement",
        "Preference cookies for personalization",
        "Option to disable non-essential cookies",
      ],
    },
    {
      title: "7. Your Rights",
      icon: Shield,
      content: "You have control over your personal information.",
      points: [
        "Access your personal data",
        "Request corrections or deletions",
        "Download your data",
        "Opt-out of marketing communications",
      ],
    },
    {
      title: "8. Data Retention",
      icon: Database,
      content:
        "We retain data only as long as necessary for business purposes or legal requirements.",
    },
    {
      title: "9. Policy Updates",
      icon: Shield,
      content:
        "We may update this policy occasionally. Changes will be posted here with updated dates.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - SwatVenue</title>
        <meta
          name="description"
          content="SwatVenue's privacy policy explains how we protect your data while providing premium venue booking services."
        />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Simple Header */}
        <div className="border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AnimatedSection>
              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl mb-6">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  Privacy Policy
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Last updated: {lastUpdated}
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300">
                This Privacy Policy describes how SwatVenue collects, uses, and
                protects your information when you use our venue booking
                platform.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Policy Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6 hover:border-amber-200 dark:hover:border-amber-800 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 mt-1">
                    <section.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {section.content}
                    </p>

                    {section.points && (
                      <ul className="space-y-2">
                        {section.points.map((point, pointIndex) => (
                          <li
                            key={pointIndex}
                            className="flex items-start gap-3 text-gray-600 dark:text-gray-400"
                          >
                            <ChevronRight className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Simple Contact Section */}
          <AnimatedSection className="mt-16 pt-12 border-t border-gray-100 dark:border-gray-800">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Us
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-8">
                If you have questions about this Privacy Policy or how we handle
                your data, please contact our privacy team.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      privacy@swatvenue.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      +92-300-792883
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Address
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Green Chowk, Mingora
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Simple Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Protected by SSL encryption
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  GDPR compliant • No data sharing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
