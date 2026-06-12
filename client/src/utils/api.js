import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const requestUrl = error.config ? error.config.url : "";

    if (status === 401 && !requestUrl.includes("/auth/login")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  verifyEmail: (data) => api.post("/auth/verify-email", data), // verify email after registration
  login: (credentials) => api.post("/auth/login", credentials),
  getMe: () => api.get("/auth/me"),

  // Forgot password flow
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }), // sends OTP to email
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }), // verify OTP
  resetPassword: (email, newPassword, resetToken) =>
    api.post("/auth/reset-password", { email, newPassword, resetToken }), // set new password after OTP verification
};

export const venueAPI = {
  getAll: (params) => api.get("/venues", { params }),
  getById: (id) => api.get(`/venues/${id}`),
  create: (data) => api.post("/venues", data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  update: (id, data) => api.put(`/venues/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  delete: (id) => api.delete(`/venues/${id}`),
  getOwnerVenues: () => api.get("/venues/owner/my-venues"),
  approve: (id) => api.patch(`/venues/${id}/approve`),
  reject: (id) => api.patch(`/venues/${id}/reject`),
};

export const reviewAPI = {
  getVenueReviews: (venueId) => api.get(`/reviews/venue/${venueId}`),
  create: (venueId, data) => api.post(`/reviews/venue/${venueId}`, data),
  reply: (reviewId, comment) => api.post(`/reviews/${reviewId}/reply`, { comment }),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post("/bookings", data),
  getUserBookings: () => api.get("/bookings/my-bookings"),
  getVenueBookings: (venueId) => api.get(`/bookings/venue/${venueId}`),
  getAllBookings: () => api.get("/bookings/all"),
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data),
  getReservedDates: (venueId) =>
    api.get(`/bookings/venue/${venueId}/reserved-dates`),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const contactAPI = {
  create: (data) => api.post("/contacts", data),
  getAll: () => api.get("/contacts"),
  updateStatus: (id, data) => api.patch(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
};

export const userAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  getStats: () => api.get("/users/stats"),
  updateStatus: (id, data) => api.patch(`/users/${id}/status`, data),
  updateProfilePicture: (formData) =>
    api.post("/users/profile-picture", formData),
  deleteProfilePicture: () => api.delete("/users/profile-picture"),
};

export const menuAPI = {
  getByVenue: (venueId) => api.get(`/menus/venue/${venueId}`),
  create: (data) => api.post("/menus", data),
  update: (id, data) => api.put(`/menus/${id}`, data),
  delete: (id) => api.delete(`/menus/${id}`),
};

export default api;
