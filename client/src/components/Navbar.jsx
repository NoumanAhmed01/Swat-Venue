import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import logo3 from "../assets/logo3.png";

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
} from "lucide-react";

const Navbar = () => {
  // Local component states
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const [userMenuOpen, setUserMenuOpen] = useState(false); // User dropdown toggle

  const { user, logout } = useAuth(); // Get user data and logout method from AuthContext
  const { darkMode, toggleDarkMode } = useTheme(); // Get theme state and toggle method from ThemeContext
  const navigate = useNavigate(); // Used for programmatic navigation

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home after logout
    setUserMenuOpen(false);
  };

  // Navigation links for desktop & mobile
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Venues", href: "/venues" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-white dark:bg-gradient-to-r from-primary-800 to-primary-900 shadow-lg sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo3} alt="logo" className="h-30 w-36" />
          </Link>

          {/* --- DESKTOP NAVIGATION LINKS --- */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* --- RIGHT SIDE BUTTONS (THEME + USER MENU / AUTH BUTTONS) --- */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Toggle dark/light mode */}
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

            {/* If user is logged in */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-md shadow-lg py-1 z-50">
                    {/* For customer/users */}
                    {(user.role === "user" || user.role === "customer") && (
                      <Link
                        to="/my-bookings"
                        className="flex items-center px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        My Bookings
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
                        Dashboard
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
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-surface-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
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
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center space-x-2">
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
                <div className="px-3 mb-3">
                  <p className="text-base font-medium text-primary-900 dark:text-text-dark">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>

                {/* For customer/users */}
                {user.role === "customer" && (
                  <Link
                    to="/my-bookings"
                    className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}

                {/* For venue owners */}
                {user.role === "owner" && (
                  <Link
                    to="/owner/dashboard"
                    className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                {/* For admins */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-surface-700 space-y-1">
                <Link
                  to="/auth/login"
                  className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block px-3 py-2 text-base font-medium text-text-light dark:text-text-dark hover:text-gold-600 dark:hover:text-gold-400 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Register
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
