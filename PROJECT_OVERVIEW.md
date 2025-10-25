# SwatVenue - Event Venue Booking Platform

A full-stack web application for discovering, booking, and managing event venues in Swat Valley, Pakistan. Built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### For Customers
- Browse and search venues by location, capacity, price, and amenities
- View detailed venue information with image galleries
- Check real-time availability with calendar integration
- Submit inquiries directly to venue owners
- Make and manage bookings
- Leave reviews and ratings for venues
- Responsive design for mobile and desktop

### For Venue Owners
- Owner dashboard with analytics
- Add and manage multiple venues
- Handle booking requests and inquiries
- View booking calendar and reserved dates
- Track revenue and statistics
- Update venue information and images

### For Administrators
- Complete platform management
- User management (customers, owners, admins)
- Venue approval system
- Platform analytics and reporting
- Manage contact messages
- Monitor bookings across all venues

## Technology Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Yup** - Form validation
- **React Hot Toast** - Notifications
- **Lucide React** - Icon library
- **React Helmet Async** - SEO management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management

## Project Architecture

### Frontend Structure
```
client/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # Reusable components
│   │   ├── BookingCalendar.jsx
│   │   ├── FilterSidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── SkeletonLoader.jsx
│   │   ├── Toast.jsx
│   │   └── VenueCard.jsx
│   ├── context/         # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Venues.jsx
│   │   ├── VenueDetail.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Terms.jsx
│   │   ├── Privacy.jsx
│   │   ├── auth/        # Authentication pages
│   │   ├── owner/       # Owner dashboard pages
│   │   └── admin/       # Admin dashboard pages
│   ├── utils/           # Utility functions
│   │   └── api.js       # API integration
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Public assets
├── .env.example         # Environment variables template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

### Backend Structure
```
server/
├── config/              # Configuration files
│   └── db.js           # Database connection
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── venueController.js
│   ├── reviewController.js
│   ├── bookingController.js
│   ├── inquiryController.js
│   ├── contactController.js
│   └── userController.js
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication & authorization
│   └── errorHandler.js # Error handling
├── models/             # MongoDB schemas
│   ├── User.js
│   ├── Venue.js
│   ├── Review.js
│   ├── Booking.js
│   ├── Inquiry.js
│   └── Contact.js
├── routes/             # API routes
│   ├── authRoutes.js
│   ├── venueRoutes.js
│   ├── reviewRoutes.js
│   ├── bookingRoutes.js
│   ├── inquiryRoutes.js
│   ├── contactRoutes.js
│   └── userRoutes.js
├── utils/              # Utility functions
│   ├── jwt.js         # JWT token management
│   └── seed.js        # Database seeder
├── .env.example        # Environment variables template
├── package.json        # Dependencies
└── server.js           # Entry point
```

## Database Schema

### User Model
- name, email, password (hashed)
- phone, role (customer/owner/admin)
- venues (array of venue IDs for owners)
- timestamps

### Venue Model
- name, location, address
- capacity, price, priceType
- rating, reviews count
- images (array), amenities (array)
- description, owner (ref to User)
- status (pending/approved/rejected)
- timestamps

### Review Model
- venue (ref to Venue)
- customer (ref to User)
- rating (1-5), comment
- eventType, date
- timestamps

### Booking Model
- venue (ref to Venue)
- customer (ref to User)
- eventDate, eventType, guestCount
- status (pending/confirmed/cancelled)
- amount, phone, email, message
- timestamps

### Inquiry Model
- venue (ref to Venue)
- name, email, phone
- eventDate, eventType, guestCount
- message, status, response
- timestamps

### Contact Model
- name, email, subject, message
- status (new/read/responded)
- response
- timestamps

## API Design

All endpoints return JSON responses with the following structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // Optional, for list endpoints
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Authentication & Authorization

- JWT-based authentication
- Tokens stored in localStorage
- Protected routes require valid token
- Role-based access control (RBAC)
- Password hashing with bcrypt

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API endpoints
- Role-based authorization
- CORS configuration
- Input validation
- Error handling middleware
- Secure HTTP headers

## Performance Optimizations

- MongoDB indexing for faster queries
- Lazy loading for images
- Skeleton loaders for better UX
- Debounced search inputs
- Optimized API calls
- React.memo for component optimization
- Vite for fast builds and HMR

## Future Enhancements

- [ ] Email notifications (booking confirmations, inquiries)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Advanced search with filters
- [ ] Image upload functionality
- [ ] SMS notifications
- [ ] Google Maps integration
- [ ] Social media login (Google, Facebook)
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time chat between customers and owners
- [ ] Calendar synchronization
- [ ] Automated reminders
- [ ] Venue comparison feature
- [ ] Advanced analytics dashboard

## Getting Started

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed installation and setup instructions.

Quick start:

```bash
# Backend
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run seed
npm run dev

# Frontend (in new terminal)
cd client
npm install
npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user (customer, owner)
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Protected routes redirect to login

**Venues:**
- [ ] Browse all venues
- [ ] Search venues
- [ ] Filter by location, capacity, price
- [ ] View venue details
- [ ] Owner can create venue
- [ ] Owner can edit own venue
- [ ] Owner can delete own venue
- [ ] Admin can approve/reject venues

**Bookings:**
- [ ] Customer can create booking
- [ ] View booking calendar
- [ ] Check reserved dates
- [ ] Owner can view venue bookings
- [ ] Owner can update booking status

**Reviews:**
- [ ] Customer can leave review
- [ ] View all venue reviews
- [ ] Rating system works
- [ ] Customer can edit own review

**Inquiries:**
- [ ] Customer can send inquiry
- [ ] Owner receives inquiries
- [ ] Owner can respond to inquiries

## License

MIT License - See LICENSE file for details

## Contact

For questions or support:
- Email: info@swatvenue.com
- Website: https://swatvenue.com

## Acknowledgments

- Pexels for stock images
- React and Vite communities
- MongoDB and Express.js documentation
- Tailwind CSS for the amazing CSS framework
