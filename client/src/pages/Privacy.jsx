import React from "react";
import { Helmet } from "react-helmet-async";

// 🧠 Privacy Policy page for SwatVenue
// This page explains how user data is collected, used, and protected.

const Privacy = () => {
  const lastUpdated = "January 15, 2025";

  return (
    <>
      {/* SEO Metadata for better visibility */}
      <Helmet>
        <title>Privacy Policy - SwatVenue</title>
        <meta
          name="description"
          content="SwatVenue's privacy policy explains how we collect, use, and protect your personal information when you use our event venue booking platform."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-surface-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Policy Container */}
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
                Privacy Policy
              </h1>
              <p className="text-text-light dark:text-text-dark">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Policy Sections */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/* 1️⃣ Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-text-dark mb-4">
                  1. Introduction
                </h2>
                <p className="text-text-light dark:text-text-dark mb-4">
                  SwatVenue ("we," "our," or "us") is committed to protecting
                  your privacy. This Privacy Policy explains how we collect,
                  use, disclose, and safeguard your information when you visit
                  our website or use our services.
                </p>
                <p className="text-text-light dark:text-text-dark">
                  Please read this privacy policy carefully. If you do not agree
                  with it, please do not access the site.
                </p>
              </section>

              {/* 2️⃣ Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  2. Information We Collect
                </h2>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Personal Information
                </h3>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>
                    Name and contact information (email, phone number, address)
                  </li>
                  <li>Account credentials (username, password)</li>
                  <li>Event details and preferences</li>
                  <li>Payment information (via third-party providers)</li>
                  <li>Communications between you and venue owners</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Usage Information
                </h3>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent</li>
                  <li>Search queries and filters used</li>
                  <li>Referral sources</li>
                </ul>
              </section>

              {/* 3️⃣ How We Use Your Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  3. How We Use Your Information
                </h2>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>Provide and maintain our services</li>
                  <li>
                    Facilitate connections between customers and venue owners
                  </li>
                  <li>Process inquiries and bookings</li>
                  <li>Send notifications and updates</li>
                  <li>Improve user experience</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              {/* 4️⃣ Information Sharing */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  4. Information Sharing and Disclosure
                </h2>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>
                    <strong>With Venue Owners:</strong> To facilitate your
                    booking
                  </li>
                  <li>
                    <strong>With Service Providers:</strong> For operational
                    support
                  </li>
                  <li>
                    <strong>For Legal Reasons:</strong> When required by law
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> During mergers or
                    acquisitions
                  </li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  We never sell or rent your data to marketers.
                </p>
              </section>

              {/* 5️⃣ Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  5. Data Security
                </h2>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>SSL encryption</li>
                  <li>Secure databases</li>
                  <li>Access control</li>
                  <li>Regular audits</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  No system is 100% secure, but we take strong measures to
                  protect your data.
                </p>
              </section>

              {/* 6️⃣ Cookies and Tracking */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  6. Cookies and Tracking Technologies
                </h2>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>
                    <strong>Essential Cookies:</strong> Site functionality
                  </li>
                  <li>
                    <strong>Analytics:</strong> Usage insights
                  </li>
                  <li>
                    <strong>Preferences:</strong> Remember settings
                  </li>
                  <li>
                    <strong>Marketing:</strong> Personalized ads
                  </li>
                </ul>
              </section>

              {/* 7️⃣ Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  7. Your Rights and Choices
                </h2>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>Access and correct data</li>
                  <li>Request deletion</li>
                  <li>Download data (portability)</li>
                  <li>Opt-out from marketing</li>
                </ul>
              </section>

              {/* 8️⃣ Data Retention */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  8. Data Retention
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We retain data only as long as necessary to provide services
                  or meet legal requirements.
                </p>
              </section>

              {/* 9️⃣ Contact Section */}
              <section>
                <h2 className="text-2xl font-bold text-primary-900 dark:text-text-dark mb-4">
                  9. Contact Us
                </h2>
                <div className="bg-gray-50 dark:bg-surface-700 p-4 rounded-lg">
                  <p className="text-text-light dark:text-text-dark">
                    <strong>Email:</strong> privacy@swatvenue.com <br />
                    <strong>Phone:</strong> +92-300-SWATVENUE <br />
                    <strong>Address:</strong> Green Chowk, Mingora, Swat, KPK,
                    Pakistan
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
