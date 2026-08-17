import React from "react";
import { Helmet } from "react-helmet-async";
import { Users, Heart, Award, CheckCircle } from "lucide-react"; // Lucide icons for UI visuals
import { useTranslation } from "react-i18next";

// ✅ About Page Component
// Displays information about SwatVenue: mission, values, team, and stats
const About = () => {
  const { t } = useTranslation();

  // Team members data (can later be fetched from an API)
  const team = [
    {
      name: "Nouman Ahmed",
      role: "Founder & Lead Developer",
      image:
        "https://res.cloudinary.com/duu5ede4m/image/upload/v1786812521/profile2_pnh5ib.png",
      description:
        "Designed and developed the full-stack MERN application end-to-end.",
    },
    {
      name: "Prof. Naveed Ahmad",
      role: "Project Supervisor & Mentor",
      image:
        "https://res.cloudinary.com/duu5ede4m/image/upload/v1786812488/WhatsApp_Image_2026-08-15_at_7.59.48_PM_qrm2ha.jpg",
      description:
        "Guided project architecture, domain strategy, and technical execution.",
    },
  ];

  // Core company values (each value has an icon, title, and description)
  const values = [
    {
      icon: Heart,
      title: t("about.value_customer_title"),
      description: t("about.value_customer_desc"),
    },
    {
      icon: CheckCircle,
      title: t("about.value_quality_title"),
      description: t("about.value_quality_desc"),
    },
    {
      icon: Users,
      title: t("about.value_community_title"),
      description: t("about.value_community_desc"),
    },
    {
      icon: Award,
      title: t("about.value_excellence_title"),
      description: t("about.value_excellence_desc"),
    },
  ];

  // Platform performance stats
  const stats = [
    { number: "500+", label: t("stats.venues") },
    { number: "2000+", label: t("stats.events") },
    { number: "50,000+", label: t("stats.customers") },
    { number: "4.8/5", label: t("stats.rating") },
  ];

  return (
    <>
      {/* Helmet dynamically sets the page title and meta description */}
      <Helmet>
        <title>{t("about.title")} - SwatVenue</title>
        <meta name="description" content={t("about.subtitle")} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 🎯 Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary-900 to-primary-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t("about.title")}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {t("about.subtitle")}
            </p>
          </div>
        </section>

        {/* 🏔 Our Story Section */}
        <section className="py-20 bg-white dark:bg-surface-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-6">
                {t("about.story_title")}
              </h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-text-light dark:text-text-dark mb-6">
                  {t("about.story_p1")}
                </p>
                <p className="text-text-light dark:text-text-dark mb-6">
                  {t("about.story_p2")}
                </p>
                <p className="text-text-light dark:text-text-dark">
                  {t("about.story_p3")}
                </p>
              </div>
            </div>

            {/* Story images (static visuals for brand feel) */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg"
                alt="Elegant venue interior"
                className="rounded-lg shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg"
                alt="Beautiful event setup"
                className="rounded-lg shadow-lg mt-8"
              />
            </div>
          </div>
        </section>

        {/* 📊 Stats Section */}
        <section className="py-20 bg-gray-50 dark:bg-surface-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
              {t("about.impact_title")}
            </h2>
            <p className="text-xl text-text-light dark:text-text-dark mb-16">
              {t("about.impact_subtitle")}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-text-light dark:text-text-dark font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 💡 Values Section */}
        <section className="py-20 bg-white dark:bg-surface-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
              {t("about.values_title")}
            </h2>
            <p className="text-xl text-text-light dark:text-text-dark max-w-2xl mx-auto mb-16">
              {t("about.values_subtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-gold-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-4">
                    {value.title}
                  </h3>
                  <p className="text-text-light dark:text-text-dark">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 👥 Team Section */}
        <section className="flex flex-col items-center justify-center  py-10 px-6 md:px-16 lg:px-24 xl:px-32 w-full min-h-screen">
          {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> */}
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
            {t("about.team_title")}
          </h2>
          <p className="text-xl text-text-light dark:text-text-dark max-w-2xl mx-auto mb-16 text-center">
            {t("about.team_subtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-10 mt-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="relative w-full max-w-[270px] rounded-3xl overflow-hidden transform transition duration-300 hover:-translate-y-1 group cursor-default"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-96 object-cover"
                />

                {/* Original Gradient Background (fades out on hover) */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#951a20]/50 to-[#03005E] pointer-events-none opacity-80 group-hover:opacity-0 transition-opacity duration-300"></div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000000]/70 to-[#03005E] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute bottom-4 left-6 right-6 flex flex-col ">
                  <h3 className="text-xl text-white">{member.name}</h3>
                  <p className="text-sm text-white/75">{member.role}</p>

                  {/* Hover Expandable Details */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ">
                    <div className="overflow-hidden">
                      <p className="text-sm text-white/90 pt-3">
                        {member.description}
                      </p>
                      <button className="mt-4 px-5 py-2 rounded-full border border-white/90 text-sm text-white w-max hover:bg-white hover:text-black transition-colors cursor-pointer">
                        See profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* </div> */}
        </section>

        {/* 🎯 Mission Section */}
        <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t("about.mission_title")}
            </h2>
            <p className="text-xl text-gray-200 max-w-4xl mx-auto mb-8">
              {t("about.mission_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a
                href="/venues"
                className="bg-white text-primary-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                {t("footer.browse")}
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                {t("nav.contact")}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
