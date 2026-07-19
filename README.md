# Hotel Management System

A full-stack hotel management application built with the MERN stack (MongoDB, Express, React, Node.js). It lets hotel owners register their property, manage rooms and bookings, track customers and expenses, view analytics, and generate PDF receipts for guests.

## Features

- **Authentication** — Register/login with JWT + HTTP-only cookies, email verification via OTP, and forgot/reset password flow (email sent through Nodemailer / Resend).
- **Room management** — Auto-creates rooms on hotel registration; edit, list, and delete rooms (AC/non-AC, price, max occupancy, occupied status).
- **Booking management** — Search available rooms by date range, create/update/cancel bookings, check-out guests, and view all current or historical bookings.
- **Customers** — View a consolidated list of guests who have stayed at the hotel.
- **Expenses** — Log and delete hotel expenses for accounting purposes.
- **Analytics** — Dashboard with charts (via Chart.js) summarizing bookings, revenue, and expenses.
- **PDF receipts** — Auto-generated booking receipts using PDFKit (see `backend/receipts/`).

## Tech Stack

**Frontend**
- React 18 + React Router v7
- Redux Toolkit + Redux Persist (state management)
- Tailwind CSS
- Chart.js / react-chartjs-2
- Axios, SweetAlert2, React Toastify

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication, bcryptjs (password hashing)
- Nodemailer / Resend (transactional email)
- PDFKit (receipt generation)

## Project Structure

```
Hotel_Management-master/
├── backend/
│   ├── app.js               # Express app, middleware, route mounting
│   ├── server.js            # Entry point — loads env, connects DB, starts server
│   ├── config/
│   │   ├── config.env       # Environment variables
│   │   └── database.js      # MongoDB connection
│   ├── controller/          # Route handlers (user, room, booking)
│   ├── middleware/auth.js   # JWT auth middleware
│   ├── models/               # Mongoose schemas (User, Room, Booking, Expense, EmailVerification)
│   ├── routes/                # Express routers
│   ├── utils/                # Email/OTP helper functions
│   └── receipts/              # Generated PDF receipts
└── frontend/
    ├── src/
    │   ├── pages/            # Login, Signup, Home, BookRoom, ManageRooms, ManageBookings,
    │   │                      #   Customers, AllBookings, Analytics, Expenses, etc.
    │   ├── components/       # Loader, Modal
    │   ├── store/             # Redux store & slices
    │   └── App.js              # Route definitions
    └── public/
```

## API Overview

All routes are prefixed with `/api/v1`.

**User** (`/api/v1`)
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Register a new hotel account |
| POST | `/verify-email` | Verify email via OTP |
| POST | `/login` | Log in |
| POST | `/logout` | Log out |
| POST | `/forgotPass` | Request password reset email |
| POST | `/resetPass/:token` | Reset password |
| GET | `/me` | Get logged-in user (protected) |

**Rooms** (`/api/v1/rooms`)
| Method | Route | Description |
|---|---|---|
| POST | `/edit-room` | Edit a room |
| POST | `/getAllRooms` | List all rooms for a hotel |
| POST | `/delete-room` | Delete a room |

**Bookings** (`/api/v1/bookings`)
| Method | Route | Description |
|---|---|---|
| POST | `/getAvRooms` | Get available rooms for a date range |
| POST | `/create-booking` | Create a booking |
| POST | `/update-booking` | Update a booking |
| POST | `/get-bookings` | Get active bookings |
| POST | `/cancel-booking` | Cancel a booking |
| POST | `/checkout` | Check out a guest |
| POST | `/get-all-bookings` | Get all bookings (history) |
| POST | `/get-all-customers` | Get all customers |
| POST | `/all-expenses` | List expenses |
| POST | `/add-expense` | Add an expense |
| POST | `/delete-expense` | Delete an expense |

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB database (Atlas or local)
- An email provider for Nodemailer/Resend (e.g. Gmail SMTP or a Resend API key)

### 1. Clone and install

```bash
git clone <repo-url>
cd Hotel_Management-master

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/config/config.env` with:

```
JWT_SECRET=your_jwt_secret

FRONTEND_HOST=http://localhost:3000

EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_smtp_user
EMAIL_PASS=your_smtp_password
EMAIL_FROM=your_from_address

RESEND_API_KEY=your_resend_api_key
```

You'll also need a MongoDB connection string — see the **Security note** below, as it's currently hardcoded rather than read from the environment.

### 3. Run the app

```bash
# Backend (from /backend)
npx nodemon server.js
# Server runs on http://localhost:8080

# Frontend (from /frontend)
npm start
# App runs on http://localhost:3000
```

For production, build the frontend (`npm run build` in `/frontend`) — the Express server is already configured to serve the React build folder as static files and handle client-side routing.

## ⚠️ Security Notes

A few things worth fixing before deploying this publicly or sharing the repo:

1. **Hardcoded MongoDB credentials**: `backend/config/database.js` currently has a live MongoDB Atlas connection string (including username/password) hardcoded directly in the source rather than loaded from `config.env`. This should be moved to an environment variable (e.g. `MONGO_URI`) and the exposed credentials should be **rotated immediately**, especially since this file is likely tracked in git.
2. **Committed `.env` / `config.env` files**: Both `backend/.env` and `backend/config/config.env` contain real secrets (JWT secret, email credentials, Resend API key) and appear to be included in the project rather than git-ignored. These should be added to `.gitignore` and rotated if they've ever been pushed to a public repo.
3. **CORS origins**: `app.js` whitelists specific deployed frontend URLs (Render/Vercel) plus localhost — update these if you redeploy elsewhere.

## License

No license file is included in this project. Add one if you intend to open-source it.
