import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

// ProtectedRoute component to restrict access to authenticated users only
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth(); // Get user and loading state from AuthContext
  const location = useLocation(); // Used to redirect user back after login

  // Show loading spinner while authentication state is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If route has role restrictions and user's role is not allowed, redirect to home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated and authorized, render the page
  return <>{children}</>;
};

export default ProtectedRoute;
