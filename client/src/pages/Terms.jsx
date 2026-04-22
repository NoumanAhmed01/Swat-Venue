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
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t, i18n } = useTranslation();
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      title: i18n.language === "ur" ? "1. شرائط کی قبولیت" : "1. Acceptance of Terms",
      icon: FileText,
      content:
        i18n.language === "ur"
          ? "سوات وینیو تک رسائی اور استعمال کر کے، آپ ان سروس کی شرائط کے پابند ہونے سے اتفاق کرتے ہیں۔ اگر آپ شرائط کے کسی بھی حصے سے متفق نہیں ہیں، تو آپ ہماری خدمات استعمال نہیں کر سکتے۔"
          : "By accessing and using SwatVenue, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not use our services.",
      points: [],
    },
    {
      title: i18n.language === "ur" ? "2. اکاؤنٹ کی ذمہ داریاں" : "2. Account Responsibilities",
      icon: UserCheck,
      content:
        i18n.language === "ur"
          ? "آپ اپنے اکاؤنٹ کی سیکیورٹی کو برقرار رکھنے اور اپنے اکاؤنٹ کے تحت ہونے والی تمام سرگرمیوں کے ذمہ دار ہیں۔"
          : "You are responsible for maintaining the security of your account and for all activities that occur under your account.",
      points: [
        i18n.language === "ur" ? "درست اور موجودہ معلومات فراہم کریں" : "Provide accurate and current information",
        i18n.language === "ur" ? "پاس ورڈ کی سیکیورٹی برقرار رکھیں" : "Maintain password security",
        i18n.language === "ur" ? "غیر مجاز رسائی کے بارے میں ہمیں مطلع کریں" : "Notify us of unauthorized access",
        i18n.language === "ur" ? "اکاؤنٹ کی سرگرمیوں کی ذمہ داری قبول کریں" : "Accept responsibility for account activities",
      ],
    },
    {
      title: i18n.language === "ur" ? "3. وینیو بکنگ پلیٹ فارم" : "3. Venue Booking Platform",
      icon: Calendar,
      content:
        i18n.language === "ur"
          ? "سوات وینیو صارفین کو وینیو مالکان کے ساتھ جوڑتا ہے۔ ہم دریافت میں سہولت فراہم کرتے ہیں لیکن لین دین کا فریق نہیں ہیں۔"
          : "SwatVenue connects customers with venue owners. We facilitate discovery but are not party to transactions.",
      points: [
        i18n.language === "ur" ? "ہم وینیو کی معلومات کی تصدیق کرتے ہیں لیکن درستگی کی ضمانت نہیں دیتے" : "We verify venue information but don't guarantee accuracy",
        i18n.language === "ur" ? "بکنگ براہ راست فریقین کے درمیان کی جاتی ہے" : "Bookings are made directly between parties",
        i18n.language === "ur" ? "ہم وینیو کے حالات کے ذمہ دار نہیں ہیں" : "We're not responsible for venue conditions",
        i18n.language === "ur" ? "تنازعات براہ راست وینیو مالکان کے ساتھ حل کیے جانے چاہئیں" : "Disputes should be resolved directly with venue owners",
      ],
    },
    {
      title: i18n.language === "ur" ? "4. صارف کا طرز عمل" : "4. User Conduct",
      icon: Shield,
      content:
        i18n.language === "ur"
          ? "صارفین کو ہمارے پلیٹ فارم پر ممنوعہ سرگرمیوں میں ملوث نہیں ہونا چاہیے۔"
          : "Users must not engage in prohibited activities on our platform.",
      points: [
        i18n.language === "ur" ? "غیر قانونی یا توہین آمیز مواد پوسٹ کرنا" : "Post illegal or offensive content",
        i18n.language === "ur" ? "دانشورانہ ملکیت کے حقوق کی خلاف ورزی کرنا" : "Infringe on intellectual property rights",
        i18n.language === "ur" ? "فراڈ کے مقاصد کے لیے پلیٹ فارم کا استعمال کرنا" : "Use the platform for fraudulent purposes",
        i18n.language === "ur" ? "گمراہ کن یا غلط معلومات شیئر کرنا" : "Share misleading or false information",
      ],
    },
    {
      title: i18n.language === "ur" ? "5. مواد کے رہنما خطوط" : "5. Content Guidelines",
      icon: AlertTriangle,
      content:
        i18n.language === "ur"
          ? "سوات وینیو پر پوسٹ کیا گیا تمام مواد ہماری کمیونٹی کے معیارات کے مطابق ہونا چاہیے۔"
          : "All content posted on SwatVenue must comply with our community standards.",
      points: [
        i18n.language === "ur" ? "درست وینیو تفصیلات" : "Accurate venue descriptions",
        i18n.language === "ur" ? "پیشہ ورانہ مواصلت" : "Professional communication",
        i18n.language === "ur" ? "احترام کے ساتھ جائزے اور ریٹنگ" : "Respectful reviews and ratings",
        i18n.language === "ur" ? "کوئی سپیم یا پروموشنل مواد نہیں" : "No spam or promotional content",
      ],
    },
    {
      title: i18n.language === "ur" ? "6. ذمہ داری کی حدود" : "6. Liability Limitations",
      icon: Scale,
      content: i18n.language === "ur" ? "سوات وینیو کی ذمہ داری محدود ہے جیسا کہ ذیل میں بیان کیا گیا ہے۔" : "SwatVenue's liability is limited as outlined below.",
      points: [
        i18n.language === "ur" ? "وینیو کے معیار یا دستیابی کے ذمہ دار نہیں" : "Not responsible for venue quality or availability",
        i18n.language === "ur" ? "بکنگ کے تنازعات کے لیے ذمہ دار نہیں" : "Not liable for booking disputes",
        i18n.language === "ur" ? "سروس کی دستیابی کی کوئی ضمانت نہیں" : "No guarantee of service availability",
        i18n.language === "ur" ? "پلیٹ فارم کو اپنے خطرے پر استعمال کریں" : "Use the platform at your own risk",
      ],
    },
    {
      title: i18n.language === "ur" ? "7. اکاؤنٹ کی منسوخی" : "7. Account Termination",
      icon: XCircle,
      content:
        i18n.language === "ur"
          ? "ہم ان اکاؤنٹس کو ختم کرنے کا حق محفوظ رکھتے ہیں جو ہماری شرائط کی خلاف ورزی کرتے ہیں۔"
          : "We reserve the right to terminate accounts that violate our terms.",
      points: [
        i18n.language === "ur" ? "سنگین خلاف ورزیوں پر فوری خاتمہ" : "Immediate termination for serious violations",
        i18n.language === "ur" ? "ختم کیے گئے اکاؤنٹس کے لیے کوئی ذمہ داری نہیں" : "No liability for terminated accounts",
        i18n.language === "ur" ? "کسی کو بھی سروس دینے سے انکار کا حق" : "Right to refuse service to anyone",
        i18n.language === "ur" ? "صارف کا مواد ہٹایا جا سکتا ہے" : "User content may be removed",
      ],
    },
    {
      title: i18n.language === "ur" ? "8. پالیسی اپ ڈیٹس" : "8. Policy Updates",
      icon: RefreshCw,
      content:
        i18n.language === "ur"
          ? "ہم اپنی خدمات میں تبدیلیوں کی عکاسی کرنے کے لیے ضرورت کے مطابق ان شرائط کو اپ ڈیٹ کر سکتے ہیں۔"
          : "We may update these terms as needed to reflect changes in our services.",
      points: [
        i18n.language === "ur" ? "اس صفحے پر پوسٹ کی گئی تبدیلیاں" : "Changes posted on this page",
        i18n.language === "ur" ? "مسلسل استعمال کا مطلب قبولیت ہے" : "Continued use means acceptance",
        i18n.language === "ur" ? "اپ ڈیٹس کے لیے دوبارہ چیک کریں" : "Check back for updates",
        i18n.language === "ur" ? "اہم تبدیلیوں کے بارے میں مطلع کیا جائے گا" : "Significant changes will be notified",
      ],
    },
    {
      title: i18n.language === "ur" ? "9. قابل اطلاق قانون" : "9. Governing Law",
      icon: Globe,
      content:
        i18n.language === "ur"
          ? "ان شرائط کو پاکستان کے قوانین کے تحت کنٹرول کیا جاتا ہے۔ کسی بھی تنازع کو پاکستانی عدالتوں میں حل کیا جائے گا۔"
          : "These terms are governed by the laws of Pakistan. Any disputes shall be resolved in Pakistani courts.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t("terms.title")} - SwatVenue</title>
        <meta
          name="description"
          content={t("terms.intro")}
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
                  {t("terms.title")}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {t("terms.last_updated")}: {lastUpdated}
                </p>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto">
                {t("terms.intro")}
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
                {t("terms.contact_title")}
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-8">
                {t("terms.contact_desc")}
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
                  {t("terms.compliance1")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("terms.compliance2")}
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

