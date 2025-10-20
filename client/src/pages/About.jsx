import React from "react";
import { Helmet } from "react-helmet-async";
import { Users, Heart, Award, CheckCircle } from "lucide-react"; // Lucide icons for UI visuals

// ✅ About Page Component
// Displays information about SwatVenue: mission, values, team, and stats
const About = () => {
  // Team members data (can later be fetched from an API)
  const team = [
    {
      name: "Ahmad Hassan",
      role: "Founder & CEO",
      image:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
      description:
        "Passionate about connecting people with perfect venues in Swat valley.",
    },
    {
      name: "Fatima Khan",
      role: "Head of Operations",
      image:
        "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg",
      description:
        "Ensures seamless experiences for both venue owners and customers.",
    },
    {
      name: "Ali Rahman",
      role: "Customer Success",
      image:
        "https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg",
      description: "Dedicated to making every event booking a success story.",
    },
  ];

  // Core company values (each value has an icon, title, and description)
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description:
        "We put our customers at the heart of everything we do, ensuring exceptional service and support.",
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description:
        "Every venue on our platform is personally verified to meet our high standards.",
    },
    {
      icon: Users,
      title: "Community Focus",
      description:
        "We support local venue owners and help strengthen the Swat valley event industry.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for excellence in every interaction and continuously improve our platform.",
    },
  ];

  // Platform performance stats
  const stats = [
    { number: "500+", label: "Verified Venues" },
    { number: "2000+", label: "Successful Events" },
    { number: "50,000+", label: "Happy Customers" },
    { number: "4.8/5", label: "Average Rating" },
  ];

  return (
    <>
      {/* Helmet dynamically sets the page title and meta description */}
      <Helmet>
        <title>About SwatVenue - Your Event Venue Partner</title>
        <meta
          name="description"
          content="Learn about SwatVenue's mission to connect people with perfect event venues in Swat valley. Meet our team and discover our values."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 🎯 Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary-900 to-primary-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About SwatVenue
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              We're on a mission to make finding and booking the perfect event
              venue in Swat valley as simple and stress-free as possible.
            </p>
          </div>
        </section>

        {/* 🏔 Our Story Section */}
        <section className="py-20 bg-white dark:bg-surface-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-6">
                Our Story
              </h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-text-light dark:text-text-dark mb-6">
                  SwatVenue was born from a simple observation: finding the
                  perfect venue for special events in Swat valley was
                  unnecessarily complicated. Families and event planners were
                  spending countless hours calling venues, visiting locations,
                  and trying to compare options.
                </p>
                <p className="text-text-light dark:text-text-dark mb-6">
                  Founded in 2023, we set out to create a platform that would
                  make venue discovery and booking as easy as browsing online.
                  We believe that every celebration deserves the perfect
                  setting, and we're here to make that happen.
                </p>
                <p className="text-text-light dark:text-text-dark">
                  Today, we're proud to be the leading venue booking platform in
                  Swat valley, connecting thousands of customers with hundreds
                  of verified venues.
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
              Our Impact
            </h2>
            <p className="text-xl text-text-light dark:text-text-dark mb-16">
              Numbers that tell our story of growth and success
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
              Our Values
            </h2>
            <p className="text-xl text-text-light dark:text-text-dark max-w-2xl mx-auto mb-16">
              The principles that guide everything we do
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
        <section className="py-20 bg-gray-50 dark:bg-surface-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-900 dark:text-text-dark mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-text-light dark:text-text-dark max-w-2xl mx-auto mb-16">
              The passionate people behind SwatVenue
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary-900 dark:text-text-dark mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gold-600 font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-text-light dark:text-text-dark">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🎯 Mission Section */}
        <section className="py-20 bg-gradient-to-r from-primary-900 to-primary-800 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-200 max-w-4xl mx-auto mb-8">
              To transform the way people discover, compare, and book event
              venues in Swat valley, making every celebration memorable by
              connecting them with the perfect space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a
                href="/venues"
                className="bg-white text-primary-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Browse Venues
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
