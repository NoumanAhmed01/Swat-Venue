# Database Entity-Relationship Diagram (ERD)

This document visualizes the relationships between the database models in the **Swat-Venue** platform.

## 1. ERD Visualization

```mermaid
erDiagram
    USER ||--o{ VENUE : "owns (Owner Role)"
    USER ||--o{ BOOKING : "makes (Customer Role)"
    USER ||--o{ REVIEW : "writes (Customer Role)"
    
    VENUE ||--o{ BOOKING : "has"
    VENUE ||--o{ REVIEW : "receives"
    VENUE ||--o{ INQUIRY : "receives"
    
    USER |o--|| OTP : "verifies via email"

    USER {
        ObjectId _id
        string name
        string email
        string password
        string phone
        string role
        ObjectIdArray venues
        boolean isActive
    }

    VENUE {
        ObjectId _id
        string name
        string location
        string address
        object geoLocation
        number capacity
        number price
        string status
        ObjectId owner
    }

    BOOKING {
        ObjectId _id
        ObjectId venue
        ObjectId customer
        date eventDate
        string status
        number amount
    }

    REVIEW {
        ObjectId _id
        ObjectId venue
        ObjectId customer
        number rating
        string comment
    }

    INQUIRY {
        ObjectId _id
        ObjectId venue
        string name
        string email
        date eventDate
    }

    OTP {
        string email
        string otp
        date createdAt
    }

    CONTACT {
        ObjectId _id
        string name
        string email
        string subject
        string message
    }
```

## 2. Relationship Explanations

### 2.1 User & Venue (One-to-Many)
*   **Relationship:** A **User** with the role `owner` can own multiple **Venues**.
*   **Implementation:** The `Venue` model stores the `owner` ID, and the `User` model stores an array of `venue` IDs.

### 2.2 User & Booking (One-to-Many)
*   **Relationship:** A **User** with the role `customer` can create multiple **Bookings**.
*   **Implementation:** The `Booking` model stores the `customer` ID.

### 2.3 Venue & Booking (One-to-Many)
*   **Relationship:** A **Venue** can have many **Bookings** scheduled on different dates.
*   **Implementation:** The `Booking` model references the `venue` ID.

### 2.4 Venue & Review (One-to-Many)
*   **Relationship:** A **Venue** accumulates many **Reviews** over time.
*   **Implementation:** The `Review` model references the `venue` ID. When a review is created, the average rating is recalculated on the `Venue` document.

### 2.5 User & OTP (One-to-One / Transient)
*   **Relationship:** An **OTP** is linked to a **User** via their `email`.
*   **Implementation:** Used during the "Forgot Password" flow. It is a transient relationship as the OTP document auto-expires after 10 minutes.

### 2.6 Inquiry & Contact (Standalone/External)
*   **Inquiry:** Linked to a **Venue** so owners can respond to specific event questions.
*   **Contact:** Standalone messages sent to platform **Administrators** for general support.
