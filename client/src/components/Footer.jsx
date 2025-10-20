import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react"; // Library for modern SVG icons

// ✅ Footer Component
// This component represents the bottom section of your website
// It contains company info, quick links, owner links, contact info, and newsletter signup
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main grid: splits footer into 4 sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 🏢 Company Info Section */}
          <div className="space-y-4">
            {/* Brand + Logo */}
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-gold-500" />
              <span className="text-2xl font-bold">SwatVenue</span>
            </div>

            {/* Short Description */}
            <p className="text-gray-400">
              Your premier destination for finding and booking the perfect venue
              for your special events in the beautiful Swat valley.
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {/* Each icon links to a platform (currently placeholder) */}
              <a
                href="#"
                className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* ⚡ Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/venues"
                  className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
                >
                  Browse Venues
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 🏠 For Venue Owners Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Venue Owners</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/auth/register?role=owner"
                  className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
                >
                  List Your Venue
                </Link>
              </li>
              <li>
                <Link
                  to="/owner/dashboard"
                  className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
                >
                  Owner Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
                >
                  Marketing Tips
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-gold-500 transition-colors duration-200"
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* 📞 Contact & Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold-500" />
                <span className="text-gray-400">+92-300-SWATVENUE</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold-500" />
                <span className="text-gray-400">info@swatvenue.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gold-500 mt-1" />
                <span className="text-gray-400">
                  Green Chowk, Mingora
                  <br />
                  Swat, Khyber Pakhtunkhwa
                  <br />
                  Pakistan
                </span>
              </div>
            </div>

            {/* Newsletter Signup Form */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">
                Subscribe to our newsletter
              </h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-gray-900 bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-500 hover:bg-gold-600 rounded-r-md transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 SwatVenue. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-gold-500 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-gold-500 text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <a
                href="#"
                className="text-gray-400 hover:text-gold-500 text-sm transition-colors duration-200"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
