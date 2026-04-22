import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
  Building,
  Award,
  Shield,
} from "lucide-react";
import VenueCard from "../components/venue/VenueCard";
import { venueAPI } from "../utils/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import {
  AnimatedSection,
  AnimatedCard,
  AnimatedButton,
  AnimatedIcon,
  FloatAnimation,
  TextReveal,
  staggerContainer,
  staggerItem,
  fadeIn,
  motion,
  AnimatedStatsContainer, // Import the counter animation
} from "../components/animation/Animation";
import PartnerMarquee from "../components/animation/PartnerMarquee";
import heroBg from "../assets/2.png";

const Home = () => {
  const { t } = useTranslation();
  const [searchForm, setSearchForm] = useState({
    location: "",
    date: "",
    guests: "",
  });

  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVenues();
  }, []);

  const fetchFeaturedVenues = async () => {
    try {
      setLoading(true);
      const response = await venueAPI.getAll();
      if (response.data.success) {
        const venues = response.data.data || [];
        const sortedByRating = venues
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);
        setFeaturedVenues(sortedByRating);
      }
    } catch (error) {
      console.error("Error fetching featured venues:", error);
      setFeaturedVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    if (searchForm.location)
      searchParams.append("location", searchForm.location);
    if (searchForm.date) searchParams.append("date", searchForm.date);
    if (searchForm.guests) searchParams.append("guests", searchForm.guests);

    window.location.href = `/venues?${searchParams.toString()}`;
  };

  const stats = [
    { number: "500+", label: t("stats.venues") },
    { number: "2000+", label: t("stats.events") },
    { number: "50000+", label: t("stats.customers") },
    { number: "4.8", label: t("stats.rating") },
  ];

  const features = [
    {
      icon: Search,
      title: t("features.easy_search_title"),
      description: t("features.easy_search_description"),
    },
    {
      icon: CheckCircle,
      title: t("features.verified_venues_title"),
      description: t("features.verified_venues_description"),
    },
    {
      icon: Users,
      title: t("features.expert_support_title"),
      description: t("features.expert_support_description"),
    },
    {
      icon: Star,
      title: t("features.top_rated_title"),
      description: t("features.top_rated_description"),
    },
  ];

  // Partner logos data (you can replace these with actual venue partner logos)
  const partners = [
    { name: "Pearl Continental", logo: Building },
    { name: "Swat Serena", logo: Award },
    { name: "Swat View Hotel", logo: Building },
    { name: "PTDC Motel", logo: Shield },
    { name: "Rock City Hotel", logo: Building },
    { name: "Swat Continental", logo: Award },
  ];

  return (
    <>
      <Helmet>
        <title>SwatVenue - Find Perfect Event Venues in Swat Valley</title>
        <meta
          name="description"
          content="Discover and book the best banquet halls and event venues in Swat valley."
        />
      </Helmet>

      {/* Hero Section - Cinematic Professional Look */}
      <section className="relative min-h-[85vh] lg:min-h-screen flex items-center justify-center bg-primary-900 overflow-hidden">
        {/* Background Image with Cinematic Animation */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 via-primary-900/40 to-primary-900 z-10"></div>
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            className="w-full h-full"
          >
            <img
              src={heroBg}
              alt="Luxury Hall"
              className="w-full h-full object-cover opacity-70"
            />
          </motion.div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              variants={staggerItem}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight"
            >
              {t("hero.title")}{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600">
                {t("hero.highlight")}
              </span>
            </motion.h1>

            <TextReveal
              text={t("hero.description")}
              className="text-xl md:text-2xl text-slate-200/90 mb-12 max-w-3xl mx-auto font-medium"
            />

            {/* Clean, Focused Search Bar */}
            <motion.form
              variants={staggerItem}
              onSubmit={handleSearch}
              className="max-w-5xl mx-auto mb-16 bg-white/10 backdrop-blur-xl p-2 sm:p-3 rounded-3xl border border-white/20 shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Location */}
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gold-400" />
                  <input
                    type="text"
                    placeholder={t("search.location")}
                    value={searchForm.location}
                    onChange={(e) =>
                      setSearchForm({ ...searchForm, location: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border-none rounded-2xl text-white placeholder:text-gray-400 text-sm font-bold focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>

                {/* Date */}
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gold-400" />
                  <input
                    type="date"
                    value={searchForm.date}
                    onChange={(e) =>
                      setSearchForm({ ...searchForm, date: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border-none rounded-2xl text-white placeholder:text-gray-400 text-sm font-bold focus:ring-2 focus:ring-gold-500/50 [color-scheme:dark]"
                  />
                </div>

                {/* Guests */}
                <div className="relative group">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gold-400" />
                  <input
                    type="number"
                    placeholder={t("search.guests")}
                    value={searchForm.guests}
                    onChange={(e) =>
                      setSearchForm({ ...searchForm, guests: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-4 bg-white/5 border-none rounded-2xl text-white placeholder:text-gray-400 text-sm font-bold focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-white/95 py-4 px-8 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg shadow-gold-500/20 active:scale-95"
                >
                  {t("hero.explore")}
                </button>
              </div>
            </motion.form>

            <AnimatedStatsContainer
              stats={stats}
              duration={2}
              className="opacity-90"
              labelClassName="text-slate-300"
              statClassName="text-gold-400"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-20 bg-white dark:bg-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
              {t("featured.title")}
            </h2>
            <p className="text-xl text-text-light dark:text-text-dark max-w-2xl mx-auto mb-12">
              {t("featured.description")}
            </p>
          </AnimatedSection>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : featuredVenues.length === 0 ? (
            <AnimatedSection variants={fadeIn}>
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {t("featured.none")}
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredVenues.map((venue) => (
                <AnimatedCard
                  key={venue._id || venue.id}
                  glowEffect={true}
                  className="transform transition-all duration-300"
                >
                  <VenueCard venue={venue} />
                </AnimatedCard>
              ))}
            </div>
          )}

          <AnimatedSection>
            <motion.div {...FloatAnimation}>
              <Link
                to="/venues"
                className="inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
              >
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                >
                  {t("common.view_all")}
                </motion.span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Partners Section - NEW SECTION */}
      <section className="py-20 bg-gray-50 dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
                {t("home.partners_title")}
              </h2>
              <p className="text-xl text-text-light dark:text-text-dark max-w-2xl mx-auto">
                {t("home.partners_description")}
              </p>
            </div>
          </AnimatedSection>
          <PartnerMarquee />
        </div>
      </section>

      {/* Why Choose SwatVenue Section */}
      <section className="py-20 bg-white dark:bg-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
              {t("home.why_choose_title")}
            </h2>
            <p className="text-xl text-text-light dark:text-text-dark max-w-2xl mx-auto mb-16">
              {t("home.why_choose_description")}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimatedCard
                key={index}
                className="bg-white dark:bg-surface-800 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                glowEffect={true}
              >
                <AnimatedIcon>
                  <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-gold-600" />
                  </div>
                </AnimatedIcon>
                <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-4">
                  {feature.title}
                </h3>
                <p className="text-text-light dark:text-text-dark">
                  {feature.description}
                </p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t("home.cta_title")}
          </h2>
          <TextReveal
            text={t("home.cta_description")}
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div {...FloatAnimation}>
              <AnimatedButton
                className="inline-flex items-center justify-center space-x-2 bg-gold-500 text-white px-8 py-4 rounded-lg font-semibold"
                glow={true}
              >
                <Link
                  to="/auth/register?role=owner"
                  className="flex items-center space-x-2"
                >
                  <span>{t("home.cta_button")}</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </Link>
              </AnimatedButton>
            </motion.div>

            <AnimatedButton className="flex items-center justify-center  border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-900">
              <Link to="/contact" className="">
                <span>{t("common.learn_more")}</span>
              </Link>
            </AnimatedButton>
          </div>
        </AnimatedSection>
      </section>

      {/* Blob animation styling */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </>
  );
};

export default Home;
