# Frontend-Backend Integration Guide

This document explains how the React frontend connects to the Express backend.

## Overview

- **Frontend:** React (client folder) - Runs on port 5173
- **Backend:** Express (server folder) - Runs on port 5000
- **Connection:** Axios HTTP client
- **Authentication:** JWT tokens

## Integration Architecture

```
┌─────────────────┐         HTTP Requests        ┌─────────────────┐
│                 │  ────────────────────────>   │                 │
│  React Frontend │                              │ Express Backend │
│  (Port 5173)    │  <────────────────────────   │  (Port 5000)    │
│                 │      JSON Responses          │                 │
└─────────────────┘                              └─────────────────┘
         │                                                │
         │                                                │
         ▼                                                ▼
  localStorage                                     MongoDB Database
  (JWT Token)                                      (Data Storage)
```

## API Configuration

### Frontend API Setup

**File:** `client/src/utils/api.js`

```javascript
import axios from 'axios';

// Base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (logout on auth failure)
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
```

### Backend CORS Configuration

**File:** `server/server.js`

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

## Authentication Flow

### 1. User Registration

**Frontend (Register.jsx):**
```javascript
import { authAPI } from '../utils/api';

const result = await authAPI.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  phone: "+92-300-1234567",
  role: "customer"
});

// Store token and user
localStorage.setItem('token', result.data.token);
localStorage.setItem('user', JSON.stringify(result.data.user));
```

**Backend (authController.js):**
```javascript
exports.register = async (req, res) => {
  const user = await User.create(req.body);
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
```

### 2. User Login

**Frontend (Login.jsx):**
```javascript
const result = await authAPI.login({
  email: "john@example.com",
  password: "password123"
});

localStorage.setItem('token', result.data.token);
localStorage.setItem('user', JSON.stringify(result.data.user));
```

**Backend (authController.js):**
```javascript
exports.login = async (req, res) => {
  const user = await User.findOne({ email }).select('+password');
  const isMatch = await user.comparePassword(password);

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: { ... }
  });
};
```

### 3. Protected Requests

**Frontend (Any authenticated request):**
```javascript
// Token is automatically added by interceptor
const venues = await venueAPI.getOwnerVenues();
```

**Backend (Protected route):**
```javascript
const { protect, authorize } = require('../middleware/auth');

router.get('/owner/my-venues', protect, authorize('owner'), getOwnerVenues);
```

**Middleware (auth.js):**
```javascript
const protect = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = verifyToken(token);
  req.user = await User.findById(decoded.id);
  next();
};
```

## Data Flow Examples

### Example 1: Browse Venues

**Frontend (Venues.jsx):**
```javascript
import { venueAPI } from '../utils/api';

useEffect(() => {
  const fetchVenues = async () => {
    const response = await venueAPI.getAll({
      location: 'Mingora',
      minCapacity: 100
    });
    setVenues(response.data.data);
  };
  fetchVenues();
}, []);
```

**Backend Route:**
```javascript
router.get('/', getAllVenues);
```

**Backend Controller:**
```javascript
exports.getAllVenues = async (req, res) => {
  const { location, minCapacity } = req.query;

  let query = { status: 'approved' };
  if (location) query.location = new RegExp(location, 'i');
  if (minCapacity) query.capacity = { $gte: parseInt(minCapacity) };

  const venues = await Venue.find(query);

  res.json({
    success: true,
    count: venues.length,
    data: venues
  });
};
```

### Example 2: Create Booking

**Frontend (VenueDetail.jsx):**
```javascript
const handleBooking = async (data) => {
  const response = await bookingAPI.create({
    venue: venueId,
    eventDate: data.eventDate,
    eventType: data.eventType,
    guestCount: data.guestCount,
    message: data.message
  });

  toast.success('Booking created successfully!');
};
```

**Backend Route:**
```javascript
router.post('/', protect, createBooking);
```

**Backend Controller:**
```javascript
exports.createBooking = async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    customer: req.user.id,
    customerName: req.user.name
  });

  res.status(201).json({
    success: true,
    data: booking
  });
};
```

### Example 3: Leave Review

**Frontend:**
```javascript
const submitReview = async (data) => {
  await reviewAPI.create(venueId, {
    rating: data.rating,
    comment: data.comment,
    eventType: data.eventType
  });
};
```

**Backend:**
```javascript
exports.createReview = async (req, res) => {
  const review = await Review.create({
    venue: req.params.venueId,
    customer: req.user.id,
    customerName: req.user.name,
    ...req.body
  });

  // Update venue rating
  const reviews = await Review.find({ venue: req.params.venueId });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Venue.findByIdAndUpdate(req.params.venueId, {
    rating: avgRating.toFixed(1),
    reviews: reviews.length
  });

  res.status(201).json({ success: true, data: review });
};
```

## State Management

### Authentication State (AuthContext)

**File:** `client/src/context/AuthContext.jsx`

```javascript
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Error Handling

### Frontend Error Handling

```javascript
try {
  const response = await venueAPI.create(venueData);
  toast.success('Venue created successfully!');
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
  console.error('Error:', error);
}
```

### Backend Error Handling

**Middleware (errorHandler.js):**
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swatvenue
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // Optional, for list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Testing Integration

### 1. Test Backend Independently

```bash
# Using cURL
curl http://localhost:5000/api/venues

# Using Postman
GET http://localhost:5000/api/venues
```

### 2. Test Frontend API Calls

Open browser console and check Network tab:
```javascript
// In browser console
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

### 3. Test Full Flow

1. Start both servers
2. Register a new user
3. Check MongoDB for new user
4. Login with user
5. Check localStorage for token
6. Make authenticated request
7. Verify in backend logs

## Debugging Tips

### Frontend Debugging

1. **Check Network Tab:**
   - Inspect request headers (Authorization token)
   - Check request payload
   - View response data
   - Look for 401/403 errors

2. **Console Logging:**
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Token:', localStorage.getItem('token'));
console.log('Request data:', data);
```

### Backend Debugging

1. **Use Morgan Logger:**
```javascript
// Logs all HTTP requests
app.use(morgan('dev'));
```

2. **Console Logging:**
```javascript
console.log('Request body:', req.body);
console.log('User:', req.user);
console.log('Query params:', req.query);
```

## Common Integration Issues

### 1. CORS Errors

**Problem:** "Access blocked by CORS policy"

**Solution:**
```javascript
// server/server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 2. Token Not Sent

**Problem:** 401 Unauthorized on protected routes

**Solution:** Check axios interceptor:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. Data Not Displaying

**Problem:** Data fetched but not showing

**Solution:** Check state update:
```javascript
const [venues, setVenues] = useState([]);

useEffect(() => {
  venueAPI.getAll().then(res => {
    console.log('Data received:', res.data);
    setVenues(res.data.data);  // Correct path
  });
}, []);
```

## Production Considerations

1. **Environment Variables:**
   - Update API URL to production backend
   - Use secure JWT secrets
   - Enable HTTPS

2. **Security:**
   - Implement rate limiting
   - Add request validation
   - Sanitize user input
   - Use helmet.js for security headers

3. **Performance:**
   - Enable compression
   - Implement caching
   - Optimize database queries
   - Use CDN for static assets

## Summary

The integration between frontend and backend is achieved through:

1. **Axios API client** with interceptors for tokens
2. **JWT authentication** stored in localStorage
3. **RESTful API** endpoints for all operations
4. **CORS configuration** to allow cross-origin requests
5. **Consistent response format** for easy handling
6. **Error handling** on both sides
7. **Environment variables** for configuration

This architecture ensures a clean separation between frontend and backend while maintaining seamless communication.
