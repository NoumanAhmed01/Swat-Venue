import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search,
  MapPin,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import VenueCard from "../components/VenueCard";
import { venueAPI } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
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
    { number: "500+", label: "Venues Listed" },
    { number: "2000+", label: "Events Hosted" },
    { number: "50000+", label: "Happy Customers" },
    { number: "4.8", label: "Average Rating" },
  ];

  const features = [
    {
      icon: Search,
      title: "Easy Search",
      description:
        "Find the perfect venue with our advanced search and filtering options",
    },
    {
      icon: CheckCircle,
      title: "Verified Venues",
      description:
        "All venues are verified and approved by our quality assurance team",
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "24/7 customer support to help you plan your perfect event",
    },
    {
      icon: Star,
      title: "Top Rated",
      description:
        "Access to highest-rated venues with authentic customer reviews",
    },
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

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gold-50/30 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 overflow-hidden">
        {/* Background Animated Blobs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-burgundy-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-32 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-900 dark:text-text-dark mb-6 leading-tight">
            Find Your Perfect{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-burgundy-600">
              Event Venue
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-text-light dark:text-text-dark mb-12 max-w-3xl mx-auto">
            Discover stunning banquet halls and event venues in the beautiful
            Swat valley. From intimate gatherings to grand celebrations, we have
            the perfect space for your special day.
          </p>

          {/* Clean Search Bar */}
          <form
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto mb-16 bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={searchForm.location}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, location: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
                />
              </div>

              {/* Date */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={searchForm.date}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, date: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
                />
              </div>

              {/* Guests */}
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  placeholder="Guests"
                  value={searchForm.guests}
                  onChange={(e) =>
                    setSearchForm({ ...searchForm, guests: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent dark:bg-surface-700 dark:text-text-dark"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gold-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-20 bg-white dark:bg-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
            Featured Venues
          </h2>
          <p className="text-xl text-text-light dark:text-text-dark max-w-2xl mx-auto mb-12">
            Discover our handpicked selection of the finest venues in Swat
            valley
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : featuredVenues.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No featured venues available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredVenues.map((venue) => (
                <VenueCard key={venue._id || venue.id} venue={venue} />
              ))}
            </div>
          )}

          <Link
            to="/venues"
            className="inline-flex items-center space-x-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
          >
            <span>View All Venues</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Why Choose SwatVenue Section */}
      <section className="py-20 bg-gray-50 dark:bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
            Why Choose SwatVenue?
          </h2>
          <p className="text-xl text-text-light dark:text-text-dark max-w-2xl mx-auto mb-16">
            We make finding and booking your dream venue simple and stress-free
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-surface-800 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-gold-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-4">
                  {feature.title}
                </h3>
                <p className="text-text-light dark:text-text-dark">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Own a Venue? List it on SwatVenue
        </h2>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Join hundreds of venue owners who are growing their business with our
          platform. It's free to list and easy to manage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/auth/register?role=owner"
            className="inline-flex items-center justify-center space-x-2 bg-gold-500 text-white hover:bg-gold-600 px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
          >
            <span>List Your Venue</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center space-x-2 border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
          >
            <span>Learn More</span>
          </Link>
        </div>
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
