import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND SECTION - Simplified for SVG logo */}
          <div className="space-y-4">
            <div className="mb-2">
              <img src={logo} alt="SwatVenue" className="h-16 w-auto" />
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Discover and book trusted venues for weddings, birthdays,
              corporate events, and special occasions across Swat.
            </p>

            <div className="flex space-x-3 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-yellow-500 transition-colors duration-200 p-2 hover:bg-gray-800 rounded-lg"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* EXPLORE */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-sm uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-200 block py-1"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/venues"
                  className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-200 block py-1"
                >
                  Browse Venues
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-200 block py-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-200 block py-1"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* ACCOUNT */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-sm uppercase tracking-wider">
              Account
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/auth/login"
                  className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-200 block py-1"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-200 block py-1"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  className="text-gray-400 hover:text-yellow-500 text-sm transition-colors duration-200 block py-1"
                >
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="space-y-4">
            <h3 className="text-white font-medium text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">+92-300-SWATVENUE</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">info@swatvenue.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Mingora, Swat, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-8 border-t border-gray-800"></div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center md:text-left mb-4 md:mb-0">
            © {new Date().getFullYear()} SwatVenue. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
