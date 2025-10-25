import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

export const venueAPI = {
  getAll: (params) => api.get('/venues', { params }),
  getById: (id) => api.get(`/venues/${id}`),
  create: (data) => api.post('/venues', data),
  update: (id, data) => api.put(`/venues/${id}`, data),
  delete: (id) => api.delete(`/venues/${id}`),
  getOwnerVenues: () => api.get('/venues/owner/my-venues'),
  approve: (id) => api.patch(`/venues/${id}/approve`),
  reject: (id) => api.patch(`/venues/${id}/reject`),
};

export const reviewAPI = {
  getVenueReviews: (venueId) => api.get(`/reviews/venue/${venueId}`),
  create: (venueId, data) => api.post(`/reviews/venue/${venueId}`, data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings/my-bookings'),
  getVenueBookings: (venueId) => api.get(`/bookings/venue/${venueId}`),
  getAllBookings: () => api.get('/bookings/all'),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  getReservedDates: (venueId) => api.get(`/bookings/venue/${venueId}/reserved-dates`),
};

export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),
  getVenueInquiries: (venueId) => api.get(`/inquiries/venue/${venueId}`),
  getOwnerInquiries: () => api.get('/inquiries/owner/my-inquiries'),
  updateStatus: (id, data) => api.patch(`/inquiries/${id}/status`, data),
};

export const contactAPI = {
  create: (data) => api.post('/contacts', data),
  getAll: () => api.get('/contacts'),
  updateStatus: (id, data) => api.patch(`/contacts/${id}`, data),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  getStats: () => api.get('/users/stats'),
};

export default api;
