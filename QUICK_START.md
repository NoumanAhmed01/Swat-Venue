# SwatVenue - Quick Start Guide

Get your SwatVenue application running in under 5 minutes!

## Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

## Installation Steps

### 1. Backend Setup (2 minutes)

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` file - update `MONGODB_URI` with your MongoDB connection string.

**For local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/swatvenue
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swatvenue
```

Seed the database:
```bash
npm run seed
```

Start the server:
```bash
npm run dev
```

✅ Backend running on `http://localhost:5000`

---

### 2. Frontend Setup (2 minutes)

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

✅ Frontend running on `http://localhost:5173`

---

## Test Accounts

After seeding, use these credentials:

### Admin
- **Email:** admin@swatvenue.com
- **Password:** password
- **Access:** Full platform control

### Venue Owner
- **Email:** owner@swatvenue.com
- **Password:** password
- **Access:** Manage venues, bookings, inquiries

### Customer
- **Email:** customer@swatvenue.com
- **Password:** password
- **Access:** Browse and book venues

---

## Quick Test

1. Open `http://localhost:5173`
2. Click "Login" → Use admin@swatvenue.com / password
3. Browse venues at `/venues`
4. Test owner dashboard at `/owner/dashboard`

---

## Common Issues

### MongoDB Connection Failed

**Solution:** Ensure MongoDB is running
```bash
# macOS
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Port Already in Use

**Solution:** Change port in `.env` file or kill existing process
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Project Structure

```
project/
├── client/          # React frontend (Port 5173)
├── server/          # Express backend (Port 5000)
├── SETUP_GUIDE.md   # Detailed setup instructions
├── API_DOCUMENTATION.md  # Complete API reference
└── PROJECT_OVERVIEW.md   # Project documentation
```

---

## Essential Commands

### Backend
```bash
cd server
npm install          # Install dependencies
npm run dev          # Start development server
npm run seed         # Seed database with sample data
npm start            # Start production server
```

### Frontend
```bash
cd client
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## Next Steps

1. ✅ Both servers running
2. ✅ Test login with provided accounts
3. 📚 Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
4. 📖 Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
5. 📋 Review [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for architecture

---

## Development Workflow

### Adding New Features

1. **Backend:**
   - Create model in `server/models/`
   - Add controller in `server/controllers/`
   - Define routes in `server/routes/`
   - Update `server/server.js` to use new routes

2. **Frontend:**
   - Add API calls in `client/src/utils/api.js`
   - Create components in `client/src/components/`
   - Add pages in `client/src/pages/`
   - Update routes in `client/src/App.jsx`

### Testing Changes

1. Make changes to code
2. Server auto-restarts (nodemon)
3. Frontend auto-reloads (Vite HMR)
4. Test in browser
5. Check console for errors

---

## Production Deployment

### Backend (Heroku)
```bash
cd server
heroku create your-app-name
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-secret"
heroku config:set NODE_ENV="production"
git push heroku main
```

### Frontend (Vercel)
```bash
cd client
npm run build
vercel deploy
```

Update `client/.env` with production API URL.

---

## API Endpoints Overview

### Public
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/venues` - Browse venues
- `GET /api/venues/:id` - Venue details
- `POST /api/inquiries` - Send inquiry
- `POST /api/contacts` - Contact form

### Protected (Authentication Required)
- `GET /api/bookings/my-bookings` - My bookings
- `POST /api/bookings` - Create booking
- `POST /api/reviews/venue/:id` - Leave review

### Owner Only
- `POST /api/venues` - Add venue
- `GET /api/venues/owner/my-venues` - My venues
- `GET /api/inquiries/owner/my-inquiries` - My inquiries

### Admin Only
- `GET /api/users` - All users
- `PATCH /api/venues/:id/approve` - Approve venue
- `GET /api/contacts` - All contact messages

---

## Support

Having issues? Check these resources:

1. **Documentation:**
   - [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
   - [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Architecture

2. **Common Problems:**
   - MongoDB not connecting → Check connection string
   - Port in use → Change port or kill process
   - Module not found → Delete node_modules and reinstall
   - CORS errors → Check server CORS configuration

3. **Contact:**
   - Email: info@swatvenue.com
   - Create an issue on GitHub

---

## Tips

1. **Development:**
   - Keep both terminals open (backend + frontend)
   - Use browser DevTools for debugging
   - Check Network tab for API calls
   - Monitor server console for errors

2. **Database:**
   - Use MongoDB Compass for GUI
   - Run seed script to reset data
   - Backup data before major changes

3. **Code Quality:**
   - Follow existing code patterns
   - Keep files organized and modular
   - Add comments for complex logic
   - Test thoroughly before committing

---

## License

MIT License

## Credits

Built with MERN Stack (MongoDB, Express.js, React, Node.js)
