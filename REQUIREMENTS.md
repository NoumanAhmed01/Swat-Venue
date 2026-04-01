# Project Requirements Document: Swat-Venue

## 1. Project Overview
**Swat-Venue** is a comprehensive MERN-stack web application designed to streamline the discovery, comparison, and booking of event venues (banquet halls, resorts, pavilions) specifically within the Swat Valley region. The platform serves as a three-way marketplace connecting **Customers**, **Venue Owners**, and **Administrators**.

## 2. User Roles & Access Control
The system implements Role-Based Access Control (RBAC) with three distinct levels:

### 2.1 Customer (User)
*   **Discovery:** Search and filter venues without authentication.
*   **Booking:** Authenticated users can request bookings for specific dates.
*   **Engagement:** Leave ratings and reviews based on event types.
*   **Management:** View personal booking history and status (Pending, Confirmed, Completed, Cancelled).

### 2.2 Venue Owner
*   **Listing Management:** Add, edit, and delete venue listings (subject to Admin approval).
*   **Media Management:** Upload up to 10 images and 2 videos via Cloudinary integration.
*   **Booking Oversight:** Approve, reject, or mark bookings as completed.
*   **Dashboard:** Real-time statistics on revenue, venue performance, and active bookings.

### 2.3 Administrator
*   **Quality Control:** Review and Approve/Reject new venue submissions.
*   **User Governance:** Manage user accounts, toggle active status, and modify roles.
*   **Platform Oversight:** Monitor all system-wide bookings and revenue.
*   **Support:** Manage and respond to contact form inquiries.

## 3. Functional Requirements

### 3.1 Authentication & Security
*   **Secure Sign-up/Login:** JWT-based authentication with encrypted passwords (bcryptjs).
*   **Password Recovery:** Multi-step "Forgot Password" flow utilizing 6-digit OTP verification via email (Nodemailer).
*   **Protected Routes:** Frontend route guards and Backend middleware to prevent unauthorized access.

### 3.2 Venue Discovery System
*   **Advanced Filtering:** Filter by Location, Price Range, Guest Capacity, and specific Amenities (AC, WiFi, Catering, etc.).
*   **Dynamic Sorting:** Sort by Rating, Price (High/Low), and Capacity.
*   **Geospatial Integration:** Mapbox GL integration to display precise venue locations using coordinates.
*   **Pagination:** Efficient loading of venue cards to optimize performance.

### 3.3 Booking Logic
*   **Availability Calendar:** Real-time check for reserved dates to prevent double-booking.
*   **Dynamic Pricing:** Automatic calculation based on venue price and price types (per day/event).
*   **Notification System:** Automated email triggers to both Customer (confirmation) and Owner (new request) upon booking.

### 3.4 Review & Rating System
*   **Calculated Ratings:** Average rating updated automatically on the Venue model after each new review.
*   **Initial-based Avatars:** Dynamic profile UI for anonymous or registered reviewers.

## 4. Technical Stack

### 4.1 Frontend (Client)
*   **Framework:** React 19 (Vite)
*   **Styling:** Tailwind CSS (Custom Dark/Light mode support)
*   **Animation:** Framer Motion (Transitions, Marquees, Blobs)
*   **Form Handling:** React Hook Form with Yup Validation
*   **Icons:** Lucide React

### 4.2 Backend (Server)
*   **Environment:** Node.js & Express.js
*   **Database:** MongoDB Atlas (NoSQL)
*   **Media Storage:** Cloudinary API
*   **Maps:** Mapbox SDK
*   **Email:** SMTP/Nodemailer

## 5. Database Schema (Data Models)

### 5.1 User Model
*   **Fields:** `name`, `email`, `password`, `phone`, `role`, `venues[]`, `isActive`.
### 5.2 Venue Model
*   **Fields:** `name`, `location`, `geoLocation` (2dsphere index), `address`, `capacity`, `price`, `amenities[]`, `images[]`, `status` (pending/approved/rejected).
### 5.3 Booking Model
*   **Fields:** `venue`, `customer`, `eventDate`, `guestCount`, `amount`, `status`.
### 5.4 Review Model
*   **Fields:** `venue`, `customer`, `rating` (1-5), `comment`, `eventType`.

## 6. Non-Functional Requirements
*   **Responsiveness:** Mobile-first design ensuring usability across smartphones, tablets, and desktops.
*   **Performance:** Image optimization via Cloudinary transformations and skeleton loaders for UI states.
*   **SEO:** Dynamic metadata management using `react-helmet-async`.
*   **Theming:** Persistent Dark/Light mode preference using LocalStorage.

## 7. Future Enhancements (Phase 2)
*   **Payment Gateway:** Integration of Easypaisa/JazzCash or Stripe for online deposits.
*   **Real-time Chat:** Socket.io implementation for direct Customer-Owner communication.
*   **Virtual Tours:** 360-degree image support for premium venues.
