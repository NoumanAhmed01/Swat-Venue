# SwatVenue - Event Venue Booking Platform

SwatVenue is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed for booking and managing event venues. The platform supports role-based access control, allowing customers to book venues, owners to manage listings, and administrators to oversee approvals and platform statistics.

---

## 🛠️ Prerequisites

Before you begin, make sure you have the following installed on your computer:
1. **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
2. **[MongoDB Community Server](https://www.mongodb.com/try/download/community)** (To run the database locally) or a **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** account

---

## 🚀 Step-by-Step Setup Guide

Follow these steps in order to get the project running on your local machine.

### Step 1: Clone or Open the Project
Open your terminal (PowerShell, Command Prompt, or Git Bash) and navigate to the project's root folder:
```bash
cd "E:\Web Development Codes\Swat-Venue"
```

---

### Step 2: Set Up the Backend Server

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install the required packages:**
   ```bash
   npm install
   ```

3. **Create the environment configuration file:**
   Create a new file named `.env` inside the `server` directory and paste the following content:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/swatVenue
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   CLIENT_URL=http://localhost:5173

   # Cloudinary Configuration (For venue image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Email Configuration (Optional - for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Seed the database (Optional but Recommended):**
   To populate your local database with default test accounts (Admin, Owner, and Customer) and sample venues, run:
   ```bash
   npm run seed
   ```
   *Note: This will create the following default users:*
   * **Admin:** `admin@swatvenue.com` / password: `password`
   * **Owner:** `owner@swatvenue.com` / password: `password`
   * **Customer:** `customer@swatvenue.com` / password: `password`

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   You should see a message indicating the server is running on port `5000` and connected to MongoDB.

---

### Step 3: Set Up the Frontend Client

1. **Open a new terminal window or tab**, navigate to the project's root folder, and then to the `client` directory:
   ```bash
   cd client
   ```

2. **Install the required packages:**
   ```bash
   npm install
   ```

3. **Start the frontend application:**
   ```bash
   npm run dev
   ```
   Once started, the terminal will show a local URL, usually `http://localhost:5173`. Open this URL in your web browser to access the website!

---

## 📂 Project Structure

* **`server/`**: Express API backend, MongoDB models, authentication middleware, and seeding utilities.
* **`client/`**: React application built with Vite, Tailwind CSS, Framer Motion, and React Router.
