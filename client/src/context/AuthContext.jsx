import React, { createContext, useContext, useState, useEffect } from "react";

// Create Auth Context
const AuthContext = createContext();

// Custom hook for accessing auth state easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Main AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores logged-in user info
  const [loading, setLoading] = useState(true); // Tracks auth state initialization

  // Check user data when app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Mock login (simulate API)
  const login = async (email, password, role) => {
    try {
      const mockUsers = [
        {
          id: "admin1",
          name: "Admin User",
          email: "admin@swatvenue.com",
          role: "admin",
          phone: "+92-300-0000000",
        },
        {
          id: "owner1",
          name: "Ahmad Khan",
          email: "owner@swatvenue.com",
          role: "owner",
          phone: "+92-300-1234567",
        },
        {
          id: "customer1",
          name: "Customer User",
          email: "customer@swatvenue.com",
          role: "customer",
          phone: "+92-300-9876543",
        },
      ];

      const foundUser = mockUsers.find((u) => u.email === email);
      if (foundUser && password === "password") {
        const token = "mock-jwt-token";
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(foundUser));
        setUser(foundUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Mock register (simulate API)
  const register = async (userData) => {
    try {
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role || "customer",
        phone: userData.phone,
      };

      const token = "mock-jwt-token";
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  // Logout clears local storage
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Value shared to all components using this context
  const value = {
    user,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
