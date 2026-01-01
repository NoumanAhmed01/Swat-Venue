import React from "react";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  Shield,
  UserCheck,
  Calendar,
  AlertTriangle,
  Scale,
  XCircle,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection } from "../components/animation/Animation";

const Terms = () => {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: FileText,
      content:
        "By accessing and using SwatVenue, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not use our services.",
      points: [],
    },
    {
      title: "2. Account Responsibilities",
      icon: UserCheck,
      content:
        "You are responsible for maintaining the security of your account and for all activities that occur under your account.",
      points: [
        "Provide accurate and current information",
        "Maintain password security",
        "Notify us of unauthorized access",
        "Accept responsibility for account activities",
      ],
    },
    {
      title: "3. Venue Booking Platform",
      icon: Calendar,
      content:
        "SwatVenue connects customers with venue owners. We facilitate discovery but are not party to transactions.",
      points: [
        "We verify venue information but don't guarantee accuracy",
        "Bookings are made directly between parties",
        "We're not responsible for venue conditions",
        "Disputes should be resolved directly with venue owners",
      ],
    },
    {
      title: "4. User Conduct",
      icon: Shield,
      content:
        "Users must not engage in prohibited activities on our platform.",
      points: [
        "Post illegal or offensive content",
        "Infringe on intellectual property rights",
        "Use the platform for fraudulent purposes",
        "Share misleading or false information",
      ],
    },
    {
      title: "5. Content Guidelines",
      icon: AlertTriangle,
      content:
        "All content posted on SwatVenue must comply with our community standards.",
      points: [
        "Accurate venue descriptions",
        "Professional communication",
        "Respectful reviews and ratings",
        "No spam or promotional content",
      ],
    },
    {
      title: "6. Liability Limitations",
      icon: Scale,
      content: "SwatVenue's liability is limited as outlined below.",
      points: [
        "Not responsible for venue quality or availability",
        "Not liable for booking disputes",
        "No guarantee of service availability",
        "Use the platform at your own risk",
      ],
    },
    {
      title: "7. Account Termination",
      icon: XCircle,
      content:
        "We reserve the right to terminate accounts that violate our terms.",
      points: [
        "Immediate termination for serious violations",
        "No liability for terminated accounts",
        "Right to refuse service to anyone",
        "User content may be removed",
      ],
    },
    {
      title: "8. Policy Updates",
      icon: RefreshCw,
      content:
        "We may update these terms as needed to reflect changes in our services.",
      points: [
        "Changes posted on this page",
        "Continued use means acceptance",
        "Check back for updates",
        "Significant changes will be notified",
      ],
    },
    {
      title: "9. Governing Law",
      icon: Globe,
      content:
        "These terms are governed by the laws of Pakistan. Any disputes shall be resolved in Pakistani courts.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Terms of Service - SwatVenue</title>
        <meta
          name="description"
          content="Terms of Service for SwatVenue's venue booking platform. Understand your rights and responsibilities."
        />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Simple Header */}
        <div className="border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AnimatedSection>
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl mb-6">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  Terms of Service
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Last updated: {lastUpdated}
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto">
                These Terms of Service govern your use of SwatVenue's venue
                booking platform. Please read them carefully.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Terms Sections */}
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
                    <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
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

          {/* Contact Section */}
          <AnimatedSection className="mt-16 pt-12 border-t border-gray-100 dark:border-gray-800">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Legal Contact
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-8">
                For questions about these Terms of Service or legal matters,
                please contact our legal department.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Legal Email
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      legal@swatvenue.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Legal Phone
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

          {/* Important Notice */}
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  These terms are legally binding
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Use constitutes acceptance of terms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
