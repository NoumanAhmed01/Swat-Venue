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
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t, i18n } = useTranslation();
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      title: i18n.language === "ur" ? "1. تعارف" : "1. Introduction",
      icon: Shield,
      content:
        i18n.language === "ur"
          ? "سوات وینیو ('ہم' یا 'ہمارا') آپ کی رازداری کے تحفظ کے لیے پرعزم ہے۔ یہ رازداری کی پالیسی بتاتی ہے کہ جب آپ ہماری ویب سائٹ دیکھتے ہیں یا ہماری خدمات استعمال کرتے ہیں تو ہم آپ کی معلومات کو کیسے اکٹھا، استعمال اور محفوظ کرتے ہیں۔"
          : "SwatVenue ('we,' 'our,' or 'us') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.",
    },
    {
      title: i18n.language === "ur" ? "2. معلومات جو ہم اکٹھا کرتے ہیں" : "2. Information We Collect",
      icon: Database,
      content:
        i18n.language === "ur"
          ? "ہم اپنی وینیو بکنگ کی خدمات فراہم کرنے اور ان کو بہتر بنانے کے لیے معلومات اکٹھا کرتے ہیں۔"
          : "We collect information to provide and improve our venue booking services.",
      points: [
        i18n.language === "ur" ? "ذاتی تفصیلات (نام، ای میل، فون)" : "Personal details (name, email, phone)",
        i18n.language === "ur" ? "بکنگ کی ترجیحات اور تاریخ" : "Booking preferences and history",
        i18n.language === "ur" ? "محفوظ پروسیسرز کے ذریعے ادائیگی کی معلومات" : "Payment information via secure processors",
        i18n.language === "ur" ? "تجزیات کے لیے ڈیوائس اور استعمال کا ڈیٹا" : "Device and usage data for analytics",
      ],
    },
    {
      title: i18n.language === "ur" ? "3. ہم معلومات کا استعمال کیسے کرتے ہیں" : "3. How We Use Information",
      icon: Eye,
      content: i18n.language === "ur" ? "آپ کی معلومات ہمیں بہتر خدمات فراہم کرنے میں مدد دیتی ہیں۔" : "Your information helps us deliver better services.",
      points: [
        i18n.language === "ur" ? "وینیو بکنگ اور ریزرویشن میں سہولت فراہم کرنا" : "Facilitate venue bookings and reservations",
        i18n.language === "ur" ? "بکنگ کی تصدیق اور اپ ڈیٹس بھیجنا" : "Send booking confirmations and updates",
        i18n.language === "ur" ? "پلیٹ فارم کی فعالیت کو بہتر بنانا" : "Improve platform functionality",
        i18n.language === "ur" ? "کسٹمر سپورٹ فراہم کرنا" : "Provide customer support",
      ],
    },
    {
      title: i18n.language === "ur" ? "4. ڈیٹا شیئرنگ" : "4. Data Sharing",
      icon: UserCheck,
      content: i18n.language === "ur" ? "ہم آپ کی رازداری کا احترام کرتے ہیں اور صرف ضرورت پڑنے پر ڈیٹا شیئر کرتے ہیں۔" : "We respect your privacy and only share data when necessary.",
      points: [
        i18n.language === "ur" ? "بکنگ کی ہم آہنگی کے لیے وینیو مالکان کے ساتھ" : "With venue owners for booking coordination",
        i18n.language === "ur" ? "قابل اعتماد سروس فراہم کنندگان کے ساتھ" : "With trusted service providers",
        i18n.language === "ur" ? "قانونی تعمیل کے لیے" : "For legal compliance",
        i18n.language === "ur" ? "کبھی بھی تیسرے فریق کو فروخت نہیں کیا جاتا" : "Never sold to third parties",
      ],
    },
    {
      title: i18n.language === "ur" ? "5. ڈیٹا سیکیورٹی" : "5. Data Security",
      icon: Lock,
      content: i18n.language === "ur" ? "ہم آپ کے ڈیٹا کی حفاظت کے لیے سخت حفاظتی اقدامات نافذ کرتے ہیں۔" : "We implement strong security measures to protect your data.",
      points: [
        i18n.language === "ur" ? "تمام ڈیٹا ٹرانسمیشن کے لیے SSL انکرپشن" : "SSL encryption for all data transmission",
        i18n.language === "ur" ? "باقاعدہ اپ ڈیٹس کے ساتھ محفوظ سرورز" : "Secure servers with regular updates",
        i18n.language === "ur" ? "رسائی کنٹرول اور تصدیق" : "Access controls and authentication",
        i18n.language === "ur" ? "باقاعدہ سیکیورٹی آڈٹ" : "Regular security audits",
      ],
    },
    {
      title: i18n.language === "ur" ? "6. کوکیز اور ٹریکنگ" : "6. Cookies & Tracking",
      icon: Cookie,
      content: i18n.language === "ur" ? "ہم صارف کے تجربے کو بہتر بنانے کے لیے کوکیز کا استعمال کرتے ہیں۔" : "We use cookies to enhance user experience.",
      points: [
        i18n.language === "ur" ? "سائٹ کی فعالیت کے لیے ضروری کوکیز" : "Essential cookies for site functionality",
        i18n.language === "ur" ? "سروس کی بہتری کے لیے تجزیات" : "Analytics for service improvement",
        i18n.language === "ur" ? "ذاتی نوعیت کے لیے ترجیحی کوکیز" : "Preference cookies for personalization",
        i18n.language === "ur" ? "غیر ضروری کوکیز کو غیر فعال کرنے کا اختیار" : "Option to disable non-essential cookies",
      ],
    },
    {
      title: i18n.language === "ur" ? "7. آپ کے حقوق" : "7. Your Rights",
      icon: Shield,
      content: i18n.language === "ur" ? "آپ کو اپنی ذاتی معلومات پر کنٹرول حاصل ہے۔" : "You have control over your personal information.",
      points: [
        i18n.language === "ur" ? "اپنے ذاتی ڈیٹا تک رسائی حاصل کریں" : "Access your personal data",
        i18n.language === "ur" ? "درستگی یا حذف کرنے کی درخواست کریں" : "Request corrections or deletions",
        i18n.language === "ur" ? "اپنا ڈیٹا ڈاؤن لوڈ کریں" : "Download your data",
        i18n.language === "ur" ? "مارکیٹنگ مواصلات سے آپٹ آؤٹ کریں" : "Opt-out of marketing communications",
      ],
    },
    {
      title: i18n.language === "ur" ? "8. ڈیٹا برقرار رکھنا" : "8. Data Retention",
      icon: Database,
      content:
        i18n.language === "ur"
          ? "ہم ڈیٹا کو صرف اس وقت تک برقرار رکھتے ہیں جب تک کاروباری مقاصد یا قانونی تقاضوں کے لیے ضروری ہو۔"
          : "We retain data only as long as necessary for business purposes or legal requirements.",
    },
    {
      title: i18n.language === "ur" ? "9. پالیسی اپ ڈیٹس" : "9. Policy Updates",
      icon: Shield,
      content:
        i18n.language === "ur"
          ? "ہم وقتاً فوقتاً اس پالیسی کو اپ ڈیٹ کر سکتے ہیں۔ تبدیلیاں اپ ڈیٹ شدہ تاریخوں کے ساتھ یہاں پوسٹ کی جائیں گی۔"
          : "We may update this policy occasionally. Changes will be posted here with updated dates.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("privacy.title")} - SwatVenue</title>
        <meta
          name="description"
          content={t("privacy.intro")}
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
                  {t("privacy.title")}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {t("privacy.last_updated")}: {lastUpdated}
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-center">
                {t("privacy.intro")}
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
                {t("privacy.contact_title")}
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-8">
                {t("privacy.contact_desc")}
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
                  {t("privacy.compliance1")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("privacy.compliance2")}
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

