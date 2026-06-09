import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ToastProvider from "./components/common/Toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Page Transition Animation
import { AnimatePresence } from "framer-motion";
import LayoutWrapper from "./components/animation/LayoutWrapper";

// Pages
import Home from "./pages/Home";
import Venues from "./pages/Venues";
import VenueDetail from "./pages/VenueDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Profile from "./pages/Profile";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";

// Owner Pages
import OwnerDashboard from "./pages/owner/Dashboard";
import AddVenue from "./pages/owner/AddVenue";
import ManageVenues from "./pages/owner/ManageVenues";
import ManageBooking from "./pages/owner/ManageBooking/ManageBooking";

// User Pages
import MyBookings from "./pages/user/MyBookings";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import VenueApprovals from "./pages/admin/VenueApprovals";
import AdminBookings from "./pages/admin/AdminBookings";
import ContactManagement from "./pages/admin/ContactManagement";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Function to hide the static HTML loader after React is ready
    const hideStaticLoader = () => {
      const staticLoader = document.getElementById("initial-loader");
      if (staticLoader) {
        staticLoader.classList.add("loader-hidden");
        // Remove from DOM after transition
        setTimeout(() => staticLoader.remove(), 500);
      }
    };

    // Small delay to ensure everything is rendered before fading out
    const timer = setTimeout(hideStaticLoader, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Helmet>
        <title>SwatVenue - Find Perfect Event Venues in Swat</title>
        <meta
          name="description"
          content="Discover and book the best banquet halls and event venues in Swat valley. Perfect for weddings, conferences, and special events."
        />
        <meta
          name="keywords"
          content="venues, banquet halls, events, weddings, Swat, Pakistan"
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={<LayoutWrapper />}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venue/:id" element={<VenueDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/verify-otp" element={<VerifyOtp />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["customer", "owner", "admin"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Owner Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["owner"]}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/add-venue"
                element={
                  <ProtectedRoute allowedRoles={["owner"]}>
                    <AddVenue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/manage-venues"
                element={
                  <ProtectedRoute allowedRoles={["owner"]}>
                    <ManageVenues />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/booking"
                element={
                  <ProtectedRoute allowedRoles={["owner"]}>
                    <ManageBooking />
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute allowedRoles={["customer"]}>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <VenueApprovals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/contacts"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ContactManagement />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <ToastProvider />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
