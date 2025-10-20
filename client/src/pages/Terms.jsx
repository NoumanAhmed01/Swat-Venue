import React from "react";
import { Helmet } from "react-helmet-async";

const Terms = () => {
  const lastUpdated = "January 15, 2025";

  return (
    <>
      {/* Helmet controls page metadata for SEO */}
      <Helmet>
        <title>Terms of Service - SwatVenue</title>
        <meta
          name="description"
          content="Read SwatVenue's terms of service and user agreement. Understand your rights and responsibilities when using our event venue booking platform."
        />
      </Helmet>

      {/* Page Wrapper */}
      <div className="min-h-screen bg-gray-50 dark:bg-surface-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-8 md:p-12">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
                Terms of Service
              </h1>
              <p className="text-text-light dark:text-text-dark">
                Last updated: {lastUpdated}
              </p>
            </div>

            {/* Terms Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/* Section 1 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-text-dark mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-text-light dark:text-text-dark mb-4">
                  By accessing and using SwatVenue ("we," "our," or "us"), you
                  accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
                <p className="text-text-light dark:text-text-dark">
                  These Terms of Service apply to all users of the site,
                  including without limitation users who are browsers, vendors,
                  customers, merchants, and/or contributors of content.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-900 dark:text-text-dark mb-4">
                  2. Use License
                </h2>
                <p className="text-text-light dark:text-text-dark mb-4">
                  Permission is granted to temporarily download one copy of
                  SwatVenue's materials for personal, non-commercial transitory
                  viewing only. This is the grant of a license, not a transfer
                  of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 text-text-light dark:text-text-dark mb-4">
                  <li>Modify or copy the materials</li>
                  <li>
                    Use the materials for any commercial purpose or for any
                    public display
                  </li>
                  <li>
                    Attempt to reverse engineer any software contained on the
                    website
                  </li>
                  <li>
                    Remove any copyright or other proprietary notations from the
                    materials
                  </li>
                </ul>
                <p className="text-text-light dark:text-text-dark">
                  This license shall automatically terminate if you violate any
                  of these restrictions and may be terminated by us at any time.
                </p>
              </section>

              {/* Section 3 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  3. User Accounts
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  When you create an account with us, you must provide
                  information that is accurate, complete, and current at all
                  times. You are responsible for safeguarding the password and
                  for keeping your account information up to date.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  You agree not to disclose your password to any third party and
                  to take sole responsibility for activities that occur under
                  your account.
                </p>
              </section>

              {/* Section 4 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  4. Venue Listings and Bookings
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  SwatVenue serves as a platform to connect venue seekers with
                  venue owners. We facilitate the discovery and initial contact
                  but are not responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>The accuracy of venue information provided by owners</li>
                  <li>The quality or condition of venues</li>
                  <li>Disputes between customers and venue owners</li>
                  <li>Cancellations or changes to bookings</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  All bookings and payments are made directly between customers
                  and venue owners.
                </p>
              </section>

              {/* Section 5 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  5. Content and Conduct
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Users are responsible for their own content and must not post
                  content that is:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4">
                  <li>Illegal, harmful, or offensive</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Misleading or fraudulent</li>
                  <li>Spam or unsolicited promotional material</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-300">
                  We reserve the right to remove any content that violates these
                  terms or is otherwise objectionable.
                </p>
              </section>

              {/* Section 6–10 */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  6. Privacy Policy
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Your privacy is important to us. Please review our Privacy
                  Policy, which also governs your use of the service, to
                  understand our practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  7. Limitation of Liability
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  In no event shall SwatVenue or its suppliers be liable for any
                  damages arising out of the use or inability to use SwatVenue's
                  materials.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  8. Termination
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason including a breach
                  of the Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  9. Changes to Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  SwatVenue reserves the right to revise these Terms of Service
                  at any time without notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  10. Governing Law
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Any claim relating to SwatVenue's website shall be governed by
                  the laws of Pakistan.
                </p>
              </section>

              {/* Contact Section */}
              <section>
                <h2 className="text-2xl font-bold text-primary-900 dark:text-text-dark mb-4">
                  11. Contact Information
                </h2>
                <p className="text-text-light dark:text-text-dark mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us at:
                </p>
                <div className="bg-gray-50 dark:bg-surface-700 p-4 rounded-lg">
                  <p className="text-text-light dark:text-text-dark">
                    <strong>Email:</strong> legal@swatvenue.com
                    <br />
                    <strong>Phone:</strong> +92-300-SWATVENUE
                    <br />
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

export default Terms;
