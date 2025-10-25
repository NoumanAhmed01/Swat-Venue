# SwatVenue Backend API

MERN Stack backend for SwatVenue - Event Venue Booking Platform

## Features

- User authentication with JWT
- Role-based access control (Customer, Owner, Admin)
- Venue management
- Booking system with date validation
- Review and rating system
- Inquiry management
- Contact form handling
- RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Installation

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret

5. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password

### Venues
- `GET /api/venues` - Get all approved venues
- `GET /api/venues/:id` - Get venue by ID
- `POST /api/venues` - Create venue (Owner/Admin)
- `PUT /api/venues/:id` - Update venue (Owner/Admin)
- `DELETE /api/venues/:id` - Delete venue (Owner/Admin)
- `GET /api/venues/owner/my-venues` - Get owner's venues
- `PATCH /api/venues/:id/approve` - Approve venue (Admin)
- `PATCH /api/venues/:id/reject` - Reject venue (Admin)

### Reviews
- `GET /api/reviews/venue/:venueId` - Get venue reviews
- `POST /api/reviews/venue/:venueId` - Create review (Auth)
- `PUT /api/reviews/:id` - Update review (Auth)
- `DELETE /api/reviews/:id` - Delete review (Auth/Admin)

### Bookings
- `POST /api/bookings` - Create booking (Auth)
- `GET /api/bookings/my-bookings` - Get user bookings (Auth)
- `GET /api/bookings/venue/:venueId` - Get venue bookings (Owner/Admin)
- `GET /api/bookings/venue/:venueId/reserved-dates` - Get reserved dates
- `PATCH /api/bookings/:id/status` - Update booking status (Owner/Admin)

### Inquiries
- `POST /api/inquiries` - Create inquiry
- `GET /api/inquiries/venue/:venueId` - Get venue inquiries (Owner/Admin)
- `GET /api/inquiries/owner/my-inquiries` - Get owner inquiries (Owner)
- `PATCH /api/inquiries/:id/status` - Update inquiry status (Owner/Admin)

### Contacts
- `POST /api/contacts` - Create contact message
- `GET /api/contacts` - Get all contacts (Admin)
- `PATCH /api/contacts/:id` - Update contact status (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/stats` - Get user statistics (Admin)
- `GET /api/users/:id` - Get user by ID (Auth)
- `PUT /api/users/:id` - Update user (Auth)
- `DELETE /api/users/:id` - Delete user (Admin)
- `PATCH /api/users/:id/role` - Update user role (Admin)

## Environment Variables

```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

## Project Structure

```
server/
├── config/
│   └── db.js              # Database configuration
├── controllers/           # Request handlers
├── middleware/            # Custom middleware
├── models/               # MongoDB models
├── routes/               # API routes
├── utils/                # Utility functions
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js             # Entry point
```

## Default Users (After Seeding)

- **Admin**: admin@swatvenue.com / password
- **Owner**: owner@swatvenue.com / password
- **Customer**: customer@swatvenue.com / password

## License

MIT
