# Hotel Booking Application

A full-stack hotel booking platform for **Grand Plaza Hotel, Bengaluru** — built with **Java Spring Boot**, **MongoDB**, and **React**.

Book rooms, check availability, and manage reservations through a modern single-hotel website with **email/password** and **Google Sign-In**.

**Live repo:** [github.com/prat-975/Hotel-Booking-App](https://github.com/prat-975/Hotel-Booking-App)

---

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 21, Spring Boot 3.2, Spring Security, JWT |
| Database | MongoDB |
| Frontend | React 19, Vite, React Router, Axios, Google OAuth |

## Project Structure

```
Hotel-Booking-App/
├── backend/                 # Spring Boot REST API
│   ├── src/main/java/       # Controllers, services, security, models
│   └── src/main/resources/  # application.properties
└── frontend/                # React SPA
    ├── src/pages/           # Home, Rooms, Booking, Login, My Bookings
    ├── src/components/      # Navbar, HotelCard, ProtectedRoute
    └── src/api/             # Axios API client
```

## Features

### Frontend
- **Single-hotel landing page** — full-screen hotel background, welcome hero, highlights, photo gallery, and amenities
- **Glass-style UI cards** — modern overlay design over a fixed background image
- **Room detail page** — check availability by date, view pricing, and book rooms
- **My Bookings** — view and cancel your reservations
- **Responsive layout** — works on desktop and mobile

### Backend
- **REST API** — hotels, rooms, availability, and bookings
- **JWT authentication** — secure, stateless sessions
- **Google Sign-In** — OAuth with account linking (same email merges accounts)
- **Email/password auth** — register and login
- **Welcome emails** — optional SMTP on signup
- **Auto seed data** — Grand Plaza Hotel, Bengaluru with 3 room types

---

## Prerequisites

- Java 21+
- Maven 3.9+
- MongoDB (`localhost:27017` or MongoDB Atlas)
- Node.js 18+
- Google Cloud OAuth Client ID (for Google Sign-In)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/prat-975/Hotel-Booking-App.git
cd Hotel-Booking-App
```

### 2. Start MongoDB

```bash
mongod
```

Or use MongoDB Atlas and set the URI in `backend/src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/hotel_booking_db
```

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → **APIs & Services** → **Credentials**
3. Create an **OAuth 2.0 Client ID** (Web application)
4. Add authorized JavaScript origin: `http://localhost:5173`
5. Copy the Client ID:

**backend/src/main/resources/application.properties**

```properties
app.google.client-id=YOUR_CLIENT_ID.apps.googleusercontent.com
```

**frontend/.env** (create this file — it is gitignored)

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

### 4. Configure Email (optional)

Welcome emails are sent after signup. Using Gmail:

1. Enable 2-Step Verification on your Google account
2. Create an [App Password](https://myaccount.google.com/apppasswords)
3. Add to `application.properties`:

```properties
app.mail.enabled=true
app.mail.from=StayEase <your@gmail.com>
spring.mail.username=your@gmail.com
spring.mail.password=your-16-char-app-password
```

Signup works without mail — emails are skipped until SMTP is enabled.

### 5. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

API: **http://localhost:8080**

> **Port 8080 in use?** Stop the existing Java process or change `server.port` in `application.properties`.

```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### 6. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

---

## User Flow

1. **Home** — Welcome page for Grand Plaza Hotel, Bengaluru
2. **View Rooms & Rates** — Pick check-in/check-out dates and see available rooms
3. **Sign In / Register** — Required before booking
4. **Book Now** — Confirm guest details and create reservation
5. **My Bookings** — View or cancel your bookings

---

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/google` | No | Google Sign-In |
| GET | `/api/auth/me` | Yes | Current user |

### Hotels & Rooms

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/hotels` | No | List hotels |
| GET | `/api/hotels/{id}` | No | Hotel details |
| GET | `/api/rooms/hotel/{hotelId}` | No | Rooms for a hotel |
| GET | `/api/rooms/available?hotelId=&checkIn=&checkOut=` | No | Available rooms |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | Yes | Create booking |
| GET | `/api/bookings` | Yes | Your bookings |
| DELETE | `/api/bookings/{id}` | Yes | Cancel booking |

### Sample Booking Request

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

---

## Seed Data

| Field | Value |
|-------|-------|
| Hotel | Grand Plaza Hotel |
| City | Bengaluru |
| Address | 45 MG Road, Bengaluru |
| Rating | 4.8 / 5.0 |
| Rooms | Standard ₹3,500 · Deluxe ₹5,500 · Suite ₹9,000 |

---

## Build for Production

```bash
# Backend JAR
cd backend
mvn clean package

# Frontend static build
cd frontend
npm run build
```

---

## Author

**Pratiksha Mulgund** — [GitHub @prat-975](https://github.com/prat-975)
