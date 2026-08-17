import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

// Importing icons from lucide-react (lightweight, modern React icon set)
import {
  Menu,
  X,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  Calendar,
  ChevronDown,
  Globe,
} from "lucide-react";

const Navbar = () => {
  // Local component states
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [userMenuOpen, setUserMenuOpen] = useState(false); // User dropdown toggle

  const { user, logout } = useAuth(); // Get user data and logout method from AuthContext
  const { darkMode, toggleDarkMode } = useTheme(); // Get theme state and toggle method from ThemeContext
  const { i18n, t } = useTranslation();
  const navigate = useNavigate(); // Used for programmatic navigation

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home after logout
    setUserMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ur" : "en";
    i18n.changeLanguage(newLang);
  };

  // Navigation links for desktop & mobile
  const navItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.venues"), href: "/venues" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  return (
    <nav className="bg-white dark:bg-gradient-to-r from-primary-800 to-primary-900 shadow-lg sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/duu5ede4m/image/upload/v1786954435/logo_vni9fr.svg"
              alt="logo"
              className="h-30 w-36"
            />
          </Link>

          {/* --- DESKTOP NAVIGATION LINKS --- */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* --- RIGHT SIDE BUTTONS (THEME + USER MENU / AUTH BUTTONS) --- */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Minimalist Professional Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-200 text-text-light dark:text-text-dark"
              title={
                i18n.language === "en" ? "اردو میں بدلیں" : "Switch to English"
              }
            >
              <Globe className="h-4 w-4 text-gold-500" />
              <span
                className={`text-sm font-bold tracking-wide ${i18n.language === "en" ? "pt-1" : ""}`}
                style={{
                  fontFamily:
                    i18n.language === "en"
                      ? "Jameel Noori Nastaleeq"
                      : "inherit",
                }}
              >
                {i18n.language === "en" ? "اردو" : "English"}
              </span>
            </button>

            {/* Toggle dark/light mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gold-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {/* If user is logged in */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1.5 text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gold-500/20 flex items-center justify-center">
                    {user.profilePicture?.url ? (
                      <img
                        src={user.profilePicture.url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gold-500/10 dark:bg-gold-500/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                      </div>
                    )}
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      userMenuOpen
                        ? "rotate-180 text-gold-600"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                    {/* For customer/users */}
                    {(user.role === "user" || user.role === "customer") && (
                      <Link
                        to="/my-bookings"
                        className="flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {t("nav.my_bookings")}
                      </Link>
                    )}

                    {/* For venue owners */}
                    {user.role === "owner" && (
                      <Link
                        to="/owner/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t("nav.dashboard")}
                      </Link>
                    )}

                    {/* For admins */}
                    {user.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t("nav.admin_panel")}
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // If no user is logged in
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth/login"
                  className="text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Language Toggle (mobile) */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors duration-200 font-bold text-xs uppercase"
              aria-label="Change Language"
            >
              {i18n.language === "en" ? "اردو" : "EN"}
            </button>

            {/* Theme toggle (mobile) */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Hamburger (Menu/X) toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE NAVIGATION MENU --- */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-surface-900 border-t border-gray-200 dark:border-surface-700">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile user section */}
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-surface-700">
                <div className="flex items-center px-3 mb-3 gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500/20">
                    {user.profilePicture?.url ? (
                      <img
                        src={user.profilePicture.url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gold-500/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-gold-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-base font-bold text-primary-900 dark:text-text-dark leading-none mb-1">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Profile Settings
                </Link>

                {/* For customer/users */}
                {user.role === "customer" && (
                  <Link
                    to="/my-bookings"
                    className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.my_bookings")}
                  </Link>
                )}

                {/* For venue owners */}
                {user.role === "owner" && (
                  <Link
                    to="/owner/dashboard"
                    className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.dashboard")}
                  </Link>
                )}

                {/* For admins */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav.admin_panel")}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                >
                  {t("nav.logout")}
                </button>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-surface-700 space-y-1">
                <Link
                  to="/auth/login"
                  className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/auth/register"
                  className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
