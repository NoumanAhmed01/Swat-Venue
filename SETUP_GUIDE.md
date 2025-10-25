# SwatVenue - Complete Setup Guide

This guide will help you set up both the frontend (React + Vite) and backend (Node.js + Express + MongoDB) for the SwatVenue project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) OR use MongoDB Atlas (cloud)
- **npm** or **yarn** package manager

## Project Structure

```
project/
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── server/                 # Express Backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── SETUP_GUIDE.md         # This file
```

## Backend Setup

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/swatvenue
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173
```

**For MongoDB Atlas (Cloud):**

Replace the `MONGODB_URI` with your Atlas connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swatvenue?retryWrites=true&w=majority
```

### Step 3: Start MongoDB (Local Installation Only)

If using local MongoDB:

```bash
# On macOS (with Homebrew)
brew services start mongodb-community

# On Ubuntu/Linux
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### Step 4: Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- Admin user: `admin@swatvenue.com` / `password`
- Owner user: `owner@swatvenue.com` / `password`
- Customer user: `customer@swatvenue.com` / `password`
- Sample venues and reviews

### Step 5: Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

### Verify Backend

Test the API by visiting: `http://localhost:5000`

You should see:
```json
{
  "message": "SwatVenue API",
  "version": "1.0.0",
  "status": "running"
}
```

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd client
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the client directory:

```bash
cp .env.example .env
```

The default configuration should work:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start the Frontend

```bash
npm run dev
```

The client will start on `http://localhost:5173`

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Testing the Application

### 1. Open the Application

Visit `http://localhost:5173` in your browser

### 2. Test User Login

Try logging in with one of these test accounts:

**Admin Account:**
- Email: `admin@swatvenue.com`
- Password: `password`
- Access: Full admin panel

**Venue Owner Account:**
- Email: `owner@swatvenue.com`
- Password: `password`
- Access: Owner dashboard, venue management

**Customer Account:**
- Email: `customer@swatvenue.com`
- Password: `password`
- Access: Browse venues, make bookings

### 3. Test Features

- **Browse Venues**: Visit `/venues` to see all venues
- **View Details**: Click on a venue to see details
- **Register**: Create a new account at `/auth/register`
- **Owner Dashboard**: Login as owner to manage venues
- **Admin Dashboard**: Login as admin for full control

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password

### Venues
- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get single venue
- `POST /api/venues` - Create venue (Owner/Admin)
- `PUT /api/venues/:id` - Update venue (Owner/Admin)
- `DELETE /api/venues/:id` - Delete venue (Owner/Admin)

### Reviews
- `GET /api/reviews/venue/:venueId` - Get venue reviews
- `POST /api/reviews/venue/:venueId` - Create review

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/venue/:venueId/reserved-dates` - Get reserved dates

### Inquiries
- `POST /api/inquiries` - Send inquiry
- `GET /api/inquiries/owner/my-inquiries` - Get owner inquiries

### Contact
- `POST /api/contacts` - Send contact message

## Troubleshooting

### MongoDB Connection Issues

**Problem:** "MongoNetworkError: failed to connect to server"

**Solutions:**
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. For Atlas, ensure IP is whitelisted

### Port Already in Use

**Problem:** "Port 5000 is already in use"

**Solutions:**
1. Change PORT in server `.env` file
2. Kill the process using the port:
   ```bash
   # On macOS/Linux
   lsof -ti:5000 | xargs kill -9

   # On Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### CORS Errors

**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solutions:**
1. Ensure server is running
2. Verify `CLIENT_URL` in server `.env` matches frontend URL
3. Check CORS configuration in `server/server.js`

### Module Not Found

**Problem:** "Cannot find module 'xyz'"

**Solutions:**
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

## Production Deployment

### Backend Deployment (Heroku Example)

```bash
cd server
heroku create your-app-name
heroku config:set MONGODB_URI="your-atlas-uri"
heroku config:set JWT_SECRET="your-secret"
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
cd client
vercel
```

Update the `.env` file with production API URL.

## Additional Resources

- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

## Support

For issues or questions:
- Check existing issues in the repository
- Create a new issue with detailed information
- Contact: info@swatvenue.com

## License

MIT License - See LICENSE file for details
