# SwatVenue API Documentation

Base URL: `http://localhost:5000/api`

## Response Format

All responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "count": 10  // Optional, for list endpoints
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+92-300-1234567",
  "role": "customer"  // Optional: customer, owner
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+92-300-1234567",
    "role": "customer"
  }
}
```

#### Login
```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Current User
```
GET /api/auth/me
```
*Requires: Authentication*

**Response:**
```json
{
  "success": true,
  "user": { ... }
}
```

#### Forgot Password
```
POST /api/auth/forgot-password
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

---

### Venues

#### Get All Venues
```
GET /api/venues
```

**Query Parameters:**
- `location` - Filter by location (e.g., "Mingora")
- `minCapacity` - Minimum capacity
- `maxCapacity` - Maximum capacity
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `amenities` - Comma-separated amenities (e.g., "AC,WiFi")
- `search` - Text search in name, location, description
- `status` - Filter by status (approved, pending, rejected)

**Example:**
```
GET /api/venues?location=Mingora&minCapacity=100&maxCapacity=500
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "venue_id",
      "name": "Royal Banquet Hall",
      "location": "Mingora, Swat",
      "capacity": 500,
      "price": 75000,
      "rating": 4.8,
      "images": ["url1", "url2"],
      "amenities": ["AC", "Parking"],
      ...
    }
  ]
}
```

#### Get Single Venue
```
GET /api/venues/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "venue_id",
    "name": "Royal Banquet Hall",
    "owner": {
      "_id": "owner_id",
      "name": "Ahmad Khan",
      "phone": "+92-300-1234567"
    },
    ...
  }
}
```

#### Create Venue
```
POST /api/venues
```
*Requires: Authentication (Owner/Admin)*

**Body:**
```json
{
  "name": "My Venue",
  "location": "Mingora, Swat",
  "address": "Full address here",
  "capacity": 300,
  "price": 50000,
  "priceType": "per day",
  "images": ["url1", "url2"],
  "amenities": ["AC", "Parking"],
  "description": "Venue description"
}
```

#### Update Venue
```
PUT /api/venues/:id
```
*Requires: Authentication (Owner/Admin)*

**Body:** Same as Create Venue (partial updates allowed)

#### Delete Venue
```
DELETE /api/venues/:id
```
*Requires: Authentication (Owner/Admin)*

#### Get Owner's Venues
```
GET /api/venues/owner/my-venues
```
*Requires: Authentication (Owner/Admin)*

#### Approve Venue
```
PATCH /api/venues/:id/approve
```
*Requires: Authentication (Admin)*

#### Reject Venue
```
PATCH /api/venues/:id/reject
```
*Requires: Authentication (Admin)*

---

### Reviews

#### Get Venue Reviews
```
GET /api/reviews/venue/:venueId
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "review_id",
      "venue": "venue_id",
      "customer": {
        "_id": "customer_id",
        "name": "John Doe"
      },
      "customerName": "John Doe",
      "rating": 5,
      "comment": "Excellent venue!",
      "eventType": "Wedding",
      "date": "2024-01-20",
      "createdAt": "2024-01-21"
    }
  ]
}
```

#### Create Review
```
POST /api/reviews/venue/:venueId
```
*Requires: Authentication*

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent venue!",
  "eventType": "Wedding"
}
```

#### Update Review
```
PUT /api/reviews/:id
```
*Requires: Authentication (Own review)*

#### Delete Review
```
DELETE /api/reviews/:id
```
*Requires: Authentication (Own review or Admin)*

---

### Bookings

#### Create Booking
```
POST /api/bookings
```
*Requires: Authentication*

**Body:**
```json
{
  "venue": "venue_id",
  "eventDate": "2024-03-15",
  "eventType": "Wedding",
  "guestCount": 300,
  "phone": "+92-300-1234567",
  "email": "john@example.com",
  "message": "Additional requirements..."
}
```

#### Get User Bookings
```
GET /api/bookings/my-bookings
```
*Requires: Authentication*

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "booking_id",
      "venue": {
        "name": "Royal Banquet Hall",
        "location": "Mingora"
      },
      "eventDate": "2024-03-15",
      "status": "pending",
      "amount": 75000
    }
  ]
}
```

#### Get Venue Bookings
```
GET /api/bookings/venue/:venueId
```
*Requires: Authentication (Owner/Admin)*

#### Get All Bookings
```
GET /api/bookings/all
```
*Requires: Authentication (Admin)*

#### Update Booking Status
```
PATCH /api/bookings/:id/status
```
*Requires: Authentication (Owner/Admin)*

**Body:**
```json
{
  "status": "confirmed"  // pending, confirmed, cancelled, completed
}
```

#### Get Reserved Dates
```
GET /api/bookings/venue/:venueId/reserved-dates
```

**Response:**
```json
{
  "success": true,
  "data": [
    "2024-03-15",
    "2024-03-20",
    "2024-04-01"
  ]
}
```

---

### Inquiries

#### Create Inquiry
```
POST /api/inquiries
```

**Body:**
```json
{
  "venue": "venue_id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+92-300-1234567",
  "eventDate": "2024-03-15",
  "eventType": "Wedding",
  "guestCount": 300,
  "message": "I would like to inquire about..."
}
```

#### Get Venue Inquiries
```
GET /api/inquiries/venue/:venueId
```
*Requires: Authentication (Owner/Admin)*

#### Get Owner's Inquiries
```
GET /api/inquiries/owner/my-inquiries
```
*Requires: Authentication (Owner)*

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "inquiry_id",
      "venue": {
        "name": "Royal Banquet Hall",
        "location": "Mingora"
      },
      "name": "John Doe",
      "eventDate": "2024-03-15",
      "status": "pending",
      "message": "..."
    }
  ]
}
```

#### Update Inquiry Status
```
PATCH /api/inquiries/:id/status
```
*Requires: Authentication (Owner/Admin)*

**Body:**
```json
{
  "status": "responded",
  "response": "Thank you for your inquiry..."
}
```

---

### Contacts

#### Create Contact Message
```
POST /api/contacts
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "I have a question about..."
}
```

#### Get All Contacts
```
GET /api/contacts
```
*Requires: Authentication (Admin)*

#### Update Contact Status
```
PATCH /api/contacts/:id
```
*Requires: Authentication (Admin)*

**Body:**
```json
{
  "status": "read",  // new, read, responded
  "response": "Response message..."
}
```

---

### Users

#### Get All Users
```
GET /api/users
```
*Requires: Authentication (Admin)*

**Response:**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2024-01-01"
    }
  ]
}
```

#### Get User Statistics
```
GET /api/users/stats
```
*Requires: Authentication (Admin)*

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "customers": 80,
    "owners": 15,
    "admins": 5
  }
}
```

#### Get User By ID
```
GET /api/users/:id
```
*Requires: Authentication*

#### Update User
```
PUT /api/users/:id
```
*Requires: Authentication*

**Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+92-300-1234567",
  "email": "newemail@example.com"
}
```

#### Delete User
```
DELETE /api/users/:id
```
*Requires: Authentication (Admin)*

#### Update User Role
```
PATCH /api/users/:id/role
```
*Requires: Authentication (Admin)*

**Body:**
```json
{
  "role": "owner"  // customer, owner, admin
}
```

---

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently not implemented. Consider adding rate limiting in production.

## Testing with Postman

1. Import the API endpoints into Postman
2. Set base URL as environment variable
3. For protected endpoints:
   - First login via `/api/auth/login`
   - Copy the token from response
   - Add to Authorization header: `Bearer <token>`

## Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","phone":"+92-300-1234567"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Venues:**
```bash
curl http://localhost:5000/api/venues
```

**Create Venue (with auth):**
```bash
curl -X POST http://localhost:5000/api/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Test Venue","location":"Mingora","address":"Test Address","capacity":200,"price":50000,"description":"Test description"}'
```
