# Hotel Booking Application

A full-stack hotel booking platform for **Grand Plaza Hotel, Bengaluru** — built with **Java Spring Boot**, **MongoDB**, and **React**.

Book rooms, check availability, and manage reservations through a modern single-hotel website with **email/password** and **Google Sign-In**.

**Repository:** [github.com/prat-975/Hotel-Booking-App](https://github.com/prat-975/Hotel-Booking-App)

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 21, Spring Boot 3.2, Spring Security, JWT |
| Database | MongoDB |
| Frontend | React 19, Vite, React Router, Axios, Google OAuth |

## Project Structure

```
Hotel-Booking-App/
├── backend/          # Spring Boot REST API
└── frontend/         # React SPA
```

## Features

- **Single-hotel landing page** — full-screen hero, highlights, amenities, and photo gallery
- **Room browsing & availability** — check dates and book Standard, Deluxe, or Suite rooms
- **Email/password registration & login**
- **Google Sign-In** with account linking (same email merges accounts)
- **JWT-based sessions** — secure, stateless auth
- **Protected bookings** — only you can view or cancel your reservations
- **Welcome emails** on signup (optional SMTP configuration)
- **Seed data** — Grand Plaza Hotel, Bengaluru with 3 room types

## Prerequisites

- Java 21+
- Maven 3.9+
- MongoDB (running on `localhost:27017`)
- Node.js 18+
- Google Cloud OAuth Client ID (for Google Sign-In)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/prat-975/Hotel-Booking-App.git
cd Hotel-Booking-App
```

### 2. Start MongoDB

Make sure MongoDB is running locally:

```bash
mongod
```

Or use MongoDB Atlas and update `backend/src/main/resources/application.properties`.

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → **APIs & Services** → **Credentials**
3. Create an **OAuth 2.0 Client ID** (Web application)
4. Add authorized JavaScript origin: `http://localhost:5173`
5. Copy the Client ID into both config files:

**backend/src/main/resources/application.properties**

```properties
app.google.client-id=YOUR_CLIENT_ID.apps.googleusercontent.com
```

**frontend/.env**

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

Or set the backend value via environment variable: `GOOGLE_CLIENT_ID=...`

### 4. Configure Email (optional)

Welcome emails are sent after email/password signup and new Google account creation.

**Using Gmail (recommended for development):**

1. Enable 2-Step Verification on your Google account
2. Create an [App Password](https://myaccount.google.com/apppasswords) for "Mail"
3. Add to `backend/src/main/resources/application.properties` or environment variables:

```properties
app.mail.enabled=true
app.mail.from=StayEase <your@gmail.com>
spring.mail.username=your@gmail.com
spring.mail.password=your-16-char-app-password
```

Signup still works if mail is not configured — emails are skipped until you enable SMTP.

### 5. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at **http://localhost:8080**. Sample hotel and rooms are seeded automatically on first run.

> **Note:** If port 8080 is already in use, stop the existing process or change `server.port` in `application.properties`.

### 6. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account (email + password) |
| POST | `/api/auth/login` | Sign in with email + password |
| POST | `/api/auth/google` | Sign in with Google ID token |
| GET | `/api/auth/me` | Get current user (requires JWT) |

Protected routes require a `Bearer` token in the `Authorization` header.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/hotels` | No | List hotels |
| GET | `/api/hotels/{id}` | No | Get hotel details |
| GET | `/api/rooms/hotel/{hotelId}` | No | List rooms for a hotel |
| GET | `/api/rooms/available?hotelId=&checkIn=&checkOut=` | No | Available rooms by date |
| POST | `/api/bookings` | Yes | Create a booking |
| GET | `/api/bookings` | Yes | Get your bookings |
| DELETE | `/api/bookings/{id}` | Yes | Cancel your booking |

### Sample Register Request

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "phone": "+91 9876543210"
}
```

### Sample Booking Request (authenticated)

```json
{
  "roomId": "<room-id>",
  "guestName": "Jane Doe",
  "guestPhone": "+91 9876543210",
  "checkInDate": "2026-07-01",
  "checkOutDate": "2026-07-03",
  "guests": 2
}
```

## Seed Data

| Field | Value |
|-------|-------|
| Hotel | Grand Plaza Hotel |
| City | Bengaluru |
| Address | 45 MG Road, Bengaluru |
| Rooms | Standard (₹3,500), Deluxe (₹5,500), Suite (₹9,000) |

## Build for Production

```bash
# Backend
cd backend
mvn clean package

# Frontend
cd frontend
npm run build
```

## License

MIT
