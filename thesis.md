# Swat-Venue: A Modern Venue Booking Platform for the Swat Valley

**A Thesis Submitted in Partial Fulfillment of the Requirements for the Degree of Bachelor of Science in Computer Science**

**Author:** [Your Name]
**ID:** [Your Student ID]
**Supervisor:** [Your Supervisor's Name]

**[Your University Name]**
**[Date]**

---

## Declaration

I hereby declare that this thesis, "Swat-Venue: A Modern Venue Booking Platform for the Swat Valley," is my own original work. All sources have been cited and acknowledged. This work has not been submitted for any other degree or professional qualification.

**Signed:** _________________________

**Date:** _________________________

---

## Acknowledgements

I would like to express my deepest gratitude to my supervisor, [Your Supervisor's Name], for their invaluable guidance, patience, and support throughout this project. Their insights were instrumental in navigating the challenges I faced.

I also want to thank my family and friends for their unwavering encouragement and for putting up with my late nights and endless talk about code. This project would not have been possible without them.

Finally, this project is a tribute to the beauty of Swat Valley, a place I hold dear to my heart.

---

## Abstract

The tourism and event industry in Pakistan's Swat Valley, while rich in potential, faces challenges in digital adoption. The process of discovering and booking event venues is often fragmented, relying on traditional, non-centralized methods. This project, "Swat-Venue," presents a comprehensive, modern solution to this problem in the form of a full-stack web application built on the MERN (MongoDB, Express.js, React, Node.js) stack.

The platform is designed to serve three distinct user roles: **Customers**, who can browse, filter, and book venues; **Venue Owners**, who can manage their venue listings and bookings through a dedicated dashboard; and **Administrators**, who oversee the entire platform's integrity.

This thesis provides a detailed account of the project's entire lifecycle. It begins with a literature review of existing systems and a justification for the chosen technology stack. It then delves into a thorough analysis of the system's architecture, including functional and non-functional requirements, use case diagrams, and an in-depth look at the database schema design. The implementation section details the structure of both the backend API and the frontend client application, explaining the logic behind key features like role-based access control (RBAC), JWT-based authentication, and state management. The thesis also covers the testing strategies employed to ensure reliability and concludes with a discussion of the project's outcomes, limitations, and potential avenues for future development.

---

## Table of Contents

1.  **Chapter 1: Introduction**
    1.1. Background and Motivation
    1.2. Problem Statement
    1.3. Proposed Solution: Swat-Venue
    1.4. Project Scope and Limitations
    1.5. Thesis Structure

2.  **Chapter 2: Literature Review & Technology Stack**
    2.1. Analysis of Existing Venue Booking Systems
    2.2. The MERN Stack: A Justification
    2.3. Why Not Other Stacks?
    2.4. Core Technologies Deep Dive

3.  **Chapter 3: System Analysis and Design**
    3.1. Requirements Engineering
    3.2. System Architecture
    3.3. Use Case Modeling
    3.4. Database Design

4.  **Chapter 4: Implementation**
    4.1. Development Environment
    4.2. Backend Implementation
    4.3. Frontend Implementation
    4.4. Key Feature Implementation

5.  **Chapter 5: System Testing**
    5.1. Testing Methodologies
    5.2. Unit Testing
    5.3. Integration Testing
    5.4. Manual Testing Test Cases

6.  **Chapter 6: Results and Discussion**
    6.1. Project Outcome
    6.2. Screenshots of the Application
    6.3. Challenges Faced and Lessons Learned

7.  **Chapter 7: Conclusion and Future Work**
    7.1. Conclusion
    7.2. Future Enhancements

8.  **Bibliography**

9.  **Appendices**
    9.1. Appendix A: API Endpoint Summary
    9.2. Appendix B: Environment Setup Guide

---

## Chapter 1: Introduction

### 1.1. Background and Motivation
The Swat Valley, often called the "Switzerland of Pakistan," is a region of breathtaking natural beauty. Its vibrant culture and stunning landscapes make it a prime location for tourism, weddings, and corporate events. However, the region's digital infrastructure has not kept pace with its potential. While world-class venues exist, their marketing and booking mechanisms are often traditional and inefficient. My personal connection to this region and my passion for technology led me to identify this gap as a compelling challenge for my final year project.

### 1.2. Problem Statement
The core problem is the lack of a centralized, user-friendly digital platform for discovering and booking event venues in Swat. This leads to several issues:
*   **For Customers:** Difficulty in finding suitable venues, comparing prices and amenities, checking availability, and verifying the quality of service through reviews.
*   **For Venue Owners:** Limited market reach, difficulty in managing bookings efficiently, and an inability to showcase their properties to a wider, tech-savvy audience.
*   **For the Region:** A potential loss of tourism and event revenue due to the friction in the booking process.

### 1.3. Proposed Solution: Swat-Venue
Swat-Venue is a web-based platform built to address these problems directly. It is an online marketplace that connects customers with venue owners in an elegant and efficient ecosystem. The platform provides distinct, tailored experiences for each user role, empowering them with the tools they need to manage their events and businesses effectively.

### 1.4. Project Scope and Limitations
**In Scope:**
*   A three-tiered user system (Customer, Owner, Admin).
*   Secure user registration and JWT-based authentication.
*   Full CRUD (Create, Read, Update, Delete) functionality for venue listings by owners.
*   Venue approval system managed by administrators.
*   Advanced search and filtering capabilities for customers.
*   A complete booking and reservation management system.
*   User-submitted reviews and ratings.
*   Separate, functional dashboards for Owners and Admins.

**Out of Scope:**
*   Direct online payment processing.
*   Real-time chat between users.
*   A native mobile application (the web app is, however, mobile-responsive).

### 1.5. Thesis Structure
This document is organized into seven chapters. Chapter 2 reviews existing literature and justifies the technology choices. Chapter 3 details the system design and architecture. Chapter 4 dives deep into the implementation of the backend and frontend. Chapter 5 outlines the testing strategies. Chapter 6 presents the results, and Chapter 7 concludes the thesis with a summary and suggestions for future work.

---

## Chapter 2: Literature Review & Technology Stack

### 2.1. Analysis of Existing Venue Booking Systems
Platforms like Airbnb, Booking.com, and international wedding venue sites have set a high standard for online booking systems. Their success lies in their intuitive UIs, powerful filtering, trusted review systems, and seamless booking flows. In the local Pakistani market, while some platforms exist, they are often limited to major metropolitan areas and lack the specific focus on regions like Swat. Swat-Venue aims to combine the best practices of these international platforms with a dedicated, localized focus.

### 2.2. The MERN Stack: A Justification
The choice of the MERN stack was a strategic one, based on several key advantages:
*   **Unified Language:** Using JavaScript/Node.js for the frontend, backend, and database (with MongoDB's query language) streamlines development, reduces context-switching, and allows for better code reusability.
*   **Performance:** Node.js's non-blocking, event-driven I/O model is highly efficient and well-suited for handling concurrent connections in a real-time application like a booking platform.
*   **Flexibility:** MongoDB's schemaless nature is ideal for a project where requirements might evolve. It easily accommodates complex, nested data structures, such as the detailed amenities and photo galleries of a venue.
*   **Rich Ecosystem:** The Node Package Manager (NPM) provides access to a vast library of open-source packages, which dramatically accelerated development for features like authentication (JWT), image uploads (Multer), and more.
*   **UI/UX:** React's component-based architecture and Virtual DOM allow for the creation of fast, dynamic, and stateful user interfaces, which are essential for providing the smooth experience I envisioned.

### 2.3. Why Not Other Stacks?
*   **LAMP (Linux, Apache, MySQL, PHP):** While a proven stack, the development workflow can feel fragmented compared to MERN. The context switch between PHP on the backend and JavaScript on the frontend is less efficient for a solo developer.
*   **Django/Python:** Python is a fantastic language, but for a highly interactive, real-time UI, the deep integration between a Node.js backend and a React frontend often feels more natural.
*   **.NET/C#:** A powerful, enterprise-grade stack, but can be overly complex and resource-heavy for a project of this scale.

### 2.4. Core Technologies Deep Dive
*   **React:** I utilized hooks (`useState`, `useEffect`, `useContext`) extensively to manage component state and side effects. The Context API was instrumental in managing global state like user authentication.
*   **Node.js/Express:** I built a modular REST API with a clear separation of concerns, using middleware for logging, error handling, and authentication.
*   **MongoDB:** Mongoose was used as an Object Data Modeling (ODM) library to define schemas, enforce validation, and simplify interactions with the database.

---

## Chapter 3: System Analysis and Design

### 3.1. Requirements Engineering
**Functional Requirements:**
*   FR1: Users must be able to register as a 'customer' or 'owner'.
*   FR2: Users must be able to log in to access their accounts.
*   FR3: Customers must be able to search for venues by name, location, and capacity.
*   FR4: Customers must be able to filter venues by price and amenities.
*   FR5: Customers must be able to view detailed information about a venue.
*   FR6: Customers must be able to book a venue for a specified date range.
*   FR7: Owners must be able to create, view, update, and delete their own venue listings.
*   FR8: Venue listings created by owners must be held for admin approval.
*   FR9: Admins must be able to view, approve, or reject new venue submissions.
*   FR10: Admins must be able to manage all users and venues on the platform.

**Non-Functional Requirements:**
*   NFR1: **Security:** All passwords must be hashed. All sensitive routes must be protected.
*   NFR2: **Performance:** API responses should be delivered in under 500ms for typical requests.
*   NFR3: **Usability:** The UI must be intuitive and easy to navigate.
*   NFR4: **Scalability:** The application should be designed to handle a growing number of users and venues.

### 3.2. System Architecture
The application follows a classic **3-Tier Architecture**:
*   **Presentation Tier (Frontend):** The React client application running in the user's browser.
*   **Logic/Application Tier (Backend):** The Express.js server that contains the business logic.
*   **Data Tier (Database):** The MongoDB database that persists the application's data.

### 3.3. Use Case Modeling
*   **Actor: Customer**
    *   Use Cases: Register, Login, Search Venues, Filter Venues, View Venue Details, Book Venue, Write Review, Manage My Bookings.
*   **Actor: Owner**
    *   Use Cases: Register, Login, Manage Venues (CRUD), View Bookings for my Venues, View Dashboard Stats.
*   **Actor: Admin**
    *   Use Cases: Login, Manage All Users, Manage All Venues, Approve Venues, View All Bookings.

### 3.4. Database Design
The database schema is designed using Mongoose. The primary models are:

**1. User Model (`User.js`)**
| Field | Type | Validation / Properties | Description |
|---|---|---|---|
| `name` | String | required | User's full name. |
| `email` | String | required, unique | User's email for login. |
| `password` | String | required | Hashed password. |
| `role` | String | enum: ['customer', 'owner', 'admin'], default: 'customer' | User's role. |

**2. Venue Model (`Venue.js`)**
| Field | Type | Validation / Properties | Description |
|---|---|---|---|
| `name` | String | required | Name of the venue. |
| `description` | String | required | Detailed description. |
| `owner` | ObjectId | ref: 'User' | Reference to the owner. |
| `location` | String | required | Physical address. |
| `capacity` | Number | required | Maximum guest capacity. |
| `price` | Number | required | Price per day/event. |
| `amenities` | [String] | | List of available amenities. |
| `images` | [String] | | URLs of venue images. |
| `isApproved` | Boolean | default: false | Approval status. |

**3. Booking Model (`Booking.js`)**
| Field | Type | Validation / Properties | Description |
|---|---|---|---|
| `user` | ObjectId | ref: 'User', required | The customer who booked. |
| `venue` | ObjectId | ref: 'Venue', required | The venue that was booked. |
| `startDate` | Date | required | Booking start date. |
| `endDate` | Date | required | Booking end date. |
| `status` | String | enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed'| Booking status. |

**4. Review Model (`Review.js`)**
| Field | Type | Validation / Properties | Description |
|---|---|---|---|
| `user` | ObjectId | ref: 'User', required | The customer who wrote the review. |
| `venue` | ObjectId | ref: 'Venue', required | The venue being reviewed. |
| `rating` | Number | required, min:1, max:5 | The star rating. |
| `comment` | String | required | The review text. |

---

## Chapter 4: Implementation

### 4.1. Development Environment
*   **Code Editor:** Visual Studio Code
*   **Version Control:** Git & GitHub
*   **Backend Runtime:** Node.js
*   **Frontend Tooling:** Vite
*   **API Testing:** Postman

### 4.2. Backend Implementation
The backend code is organized into a modular structure for maintainability:
*   `config/`: Database, email, and cloud service configurations.
*   `controllers/`: Contains the business logic for each route (e.g., `venueController.js`).
*   `middleware/`: Custom middleware like `auth.js` for authentication and `errorHandler.js` for centralized error handling.
*   `models/`: Mongoose schema definitions.
*   `routes/`: Express route definitions (e.g., `venueRoutes.js`).
*   `server.js`: The main entry point for the application.

**Authentication Flow (JWT):**
1.  A user submits their credentials to `POST /api/auth/login`.
2.  The `authController` validates the credentials against the hashed password in the `User` model.
3.  Upon success, a JWT is generated, signed with a secret key, containing the user's ID and role.
4.  The token is sent back to the client.
5.  For subsequent requests to protected routes, the client includes the token in the `Authorization: Bearer <token>` header.
6.  The `protect` middleware on the server intercepts the request, verifies the token's signature, and attaches the user's data to the request object (`req.user`), making it available to downstream controllers.

### 4.3. Frontend Implementation
The React client is structured for scalability:
*   `assets/`: Static assets like images and logos.
*   `components/`: Reusable UI components (e.g., `Navbar.jsx`, `VenueCard.jsx`).
*   `context/`: Global state management with React Context (e.g., `AuthContext.jsx`).
*   `pages/`: Top-level page components, corresponding to routes.
*   `utils/`: Utility functions, including the centralized API service.
*   `App.jsx`: The root component that defines the application's routing structure.

**State Management (`AuthContext.jsx`):**
The `AuthProvider` component wraps the entire application. It uses `useState` to store the `user` object and `token`. A `useEffect` hook runs on initial load to check `localStorage` for a saved session, providing persistence. The context provides `login` and `logout` functions that update the state and `localStorage`, ensuring all components re-render with the correct authentication status.

### 4.4. Key Feature Implementation: Venue Approval
1.  A venue owner submits a new venue via a form on the frontend. This hits `POST /api/venues`.
2.  The `venueController` creates the new venue document in MongoDB with `isApproved` set to `false`.
3.  The admin logs in and navigates to the "Venue Approvals" dashboard.
4.  This page fetches data from `GET /api/venues?isApproved=false`.
5.  The admin can click an "Approve" button next to a pending venue.
6.  This action triggers a request to `PATCH /api/venues/:id/approve`. This route is protected by both `protect` and `authorize('admin')` middleware.
7.  The `venueController` finds the venue by its ID and updates the `isApproved` field to `true`.
8.  The venue now appears in the main public listing.

---

## Chapter 5: System Testing

### 5.1. Testing Methodologies
A multi-layered testing approach was adopted to ensure the quality and reliability of the application, focusing on key user flows and business logic.

### 5.2. Unit Testing
While not fully implemented due to time constraints, a unit testing strategy was designed.
*   **Backend:** Using Jest, unit tests would target individual controller functions and middleware. For example, testing the `registerUser` controller would involve mocking the `User.create` function to ensure it is called with the correct, hashed data.
*   **Frontend:** Using React Testing Library, unit tests would focus on individual components. For example, testing the `VenueCard` component by providing it with props and asserting that it renders the name, location, and price correctly.

### 5.3. Integration Testing
Integration tests were performed manually using Postman for the backend. These tests focused on ensuring that different parts of the API worked together as expected. For example:
1.  Register a new 'owner' user.
2.  Log in with that user to get a JWT.
3.  Use the JWT to create a new venue.
4.  Log in as an 'admin' user.
5.  Use the admin JWT to approve the new venue.
6.  Query the public venues endpoint to confirm the venue is now visible.

### 5.4. Manual Testing Test Cases
End-to-end manual testing was the primary method for validation.
| Test Case ID | User Role | Action | Expected Result |
|---|---|---|---|
| TC-01 | Guest | Navigate to the registration page and sign up as a Customer. | User is created, logged in, and redirected to the homepage. |
| TC-02 | Customer | Search for a venue with capacity > 100. | Only venues with a capacity over 100 are displayed. |
| TC-03 | Customer | Attempt to book a venue with an invalid date range (start after end). | An error message is displayed, and the booking is not created. |
| TC-04 | Owner | Create a new venue listing. | The venue is created with `isApproved: false` and is visible on the owner's dashboard but not the public site. |
| TC-05 | Admin | Approve a pending venue. | The venue's `isApproved` status becomes `true` and it appears on the public listings. |

---

## Chapter 6: Results and Discussion

### 6.1. Project Outcome
The project successfully meets all the core objectives defined in Chapter 1. The result is a functional, secure, and user-friendly prototype of the Swat-Venue platform. It effectively demonstrates the viability of the MERN stack for building modern, database-driven marketplaces. The final application provides a solid foundation that can be built upon to create a commercial-grade product.

### 6.2. Screenshots of the Application
*(Placeholder: You can insert your screenshots here)*

**Figure 6.1: The Swat-Venue Homepage**
`[Insert Screenshot of Home Page]`

**Figure 6.2: Venue Search and Filtering**
`[Insert Screenshot of Venues Page with Filters]`

**Figure 6.3: Venue Owner's Dashboard**
`[Insert Screenshot of Owner Dashboard]`

**Figure 6.4: Administrator's Venue Approval Panel**
`[Insert Screenshot of Admin Dashboard]`

### 6.3. Challenges Faced and Lessons Learned
*   **State Management Complexity:** Early in development, passing props through many layers of components became unwieldy. Adopting the React Context API for global state was a critical turning point that greatly simplified the architecture.
*   **Asynchronous JavaScript:** Handling asynchronous operations (API calls, database queries) was a major learning curve. Mastering `async/await` and Promises was essential for writing clean, non-blocking code and for implementing features like loading states in the UI.
*   **Security Implementation:** Implementing role-based access control from scratch was challenging. It required careful planning of both the backend middleware and the frontend route protection to ensure the system was secure from all angles.

---

## Chapter 7: Conclusion and Future Work

### 7.1. Conclusion
This project has been an incredible journey from concept to execution. Building Swat-Venue has not only allowed me to apply the theoretical knowledge gained throughout my degree but has also taught me invaluable practical lessons in software architecture, security, and project management. The final product is a testament to the power of modern web technologies to solve real-world problems. It serves as a robust proof-of-concept for a platform that could genuinely benefit the tourism and event industry in Swat Valley.

### 7.2. Future Enhancements
The current platform is a strong foundation, but there are many exciting possibilities for future development:
*   **Payment Gateway Integration:** Integrating a service like Stripe to handle online deposits and payments would fully automate the booking process.
*   **Real-Time Communication:** Implementing a real-time chat feature using WebSockets would allow customers and venue owners to communicate directly through the platform.
*   **Advanced Analytics Dashboard:** Providing owners with more detailed analytics on their venue's performance, such as page views, booking conversion rates, and revenue trends.
*   **Native Mobile Applications:** Developing dedicated iOS and Android applications using a framework like React Native could provide an even better user experience.

---

## 8. Bibliography
*(Placeholder: Add references to articles, documentation, and books you consulted)*
*   React Documentation. (https://reactjs.org/docs/getting-started.html)
*   Node.js Documentation. (https://nodejs.org/en/docs/)
*   Express.js Documentation. (https://expressjs.com/)
*   MongoDB & Mongoose Documentation. (https://mongoosejs.com/docs/guide.html)

---

## 9. Appendices

### 9.1. Appendix A: API Endpoint Summary
| Method | Endpoint | Description | Auth Required | Roles |
|---|---|---|---|---|
| POST | `/api/auth/register` | Register a new user. | No | |
| POST | `/api/auth/login` | Login a user. | No | |
| GET | `/api/venues` | Get all approved venues. | No | |
| GET | `/api/venues/:id`| Get a single venue. | No | |
| POST | `/api/venues` | Create a new venue. | Yes | Owner, Admin |
| PUT | `/api/venues/:id` | Update a venue. | Yes | Owner, Admin |
| DELETE | `/api/venues/:id` | Delete a venue. | Yes | Owner, Admin |
| PATCH | `/api/venues/:id/approve` | Approve a venue. | Yes | Admin |
| POST | `/api/bookings` | Create a new booking. | Yes | Customer |
| GET | `/api/bookings/my`| Get my bookings. | Yes | Customer |
| GET | `/api/users` | Get all users. | Yes | Admin |
| DELETE| `/api/users/:id` | Delete a user. | Yes | Admin |

### 9.2. Appendix B: Environment Setup Guide
1.  **Prerequisites:** Node.js, npm, and MongoDB must be installed.
2.  **Clone Repository:** `git clone <repository-url>`
3.  **Backend Setup:**
    *   `cd server`
    *   `npm install`
    *   Create a `.env` file with `MONGO_URI`, `JWT_SECRET`, and `CLOUDINARY_*` variables.
    *   `npm start`
4.  **Frontend Setup:**
    *   `cd client`
    *   `npm install`
    *   `npm run dev`
5.  Access the application at `http://localhost:5173`.