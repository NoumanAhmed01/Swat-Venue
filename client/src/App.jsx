import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ToastProvider from "./components/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Venues from "./pages/Venues";
import VenueDetail from "./pages/VenueDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

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
import ViewInquiries from "./pages/owner/ViewInquiries";
import ManageBooking from "./pages/owner/ManageBooking";

// User Pages
import MyBookings from "./pages/user/MyBookings";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import VenueApprovals from "./pages/admin/VenueApprovals";
import Analytics from "./pages/admin/Analytics";
import AdminBookings from "./pages/admin/AdminBookings";
import ContactManagement from "./pages/admin/ContactManagement";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
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
                <meta
                  property="og:title"
                  content="SwatVenue - Find Perfect Event Venues in Swat"
                />
                <meta
                  property="og:description"
                  content="Discover and book the best banquet halls and event venues in Swat valley."
                />
                <meta property="og:type" content="website" />
              </Helmet>

              <Navbar />

              <main className="min-h-screen">
                <Routes>
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
                  <Route
                    path="/auth/forgot-password"
                    element={<ForgotPassword />}
                  />
                  <Route
                    path="/auth/reset-password"
                    element={<ResetPassword />}
                  />
                  <Route path="/auth/verify-otp" element={<VerifyOtp />} />

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
                    path="/owner/inquiries"
                    element={
                      <ProtectedRoute allowedRoles={["owner"]}>
                        <ViewInquiries />
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
                    path="/admin/analytics"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <Analytics />
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
                </Routes>
              </main>

              <Footer />
              <ToastProvider />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
