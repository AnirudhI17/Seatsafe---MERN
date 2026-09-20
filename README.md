# SeatSafe — Node.js + Express Backend Version

> **Note**: This repository is the **Node.js/Express (JavaScript) version** of the original SeatSafe Go backend project. The original Go codebase has been preserved untouched in its original repository.

---

## Project Overview

**SeatSafe** is a high-concurrency event ticketing and reservation platform. This project provides a full-stack MERN-style implementation consisting of:

- **Frontend**: React + Vite + TypeScript + Tailwind CSS (Preserved from original project)
- **Backend**: Node.js + Express.js (JavaScript) — Complete migration from Golang
- **Database**: PostgreSQL with row-level locking (`SELECT ... FOR UPDATE`) to prevent seat overbooking

---

## Tech Stack & Architecture

### Backend Architecture (Node.js + Express)

```
seatsafe-node/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js            # Environment variable loading & validation
│   │   ├── database/
│   │   │   └── db.js             # PostgreSQL connection pool (pg)
│   │   ├── dto/
│   │   │   └── dto.js            # API Response helper utilities
│   │   ├── repository/
│   │   │   ├── errors.js         # Domain sentinel errors
│   │   │   ├── user.repository.js
│   │   │   ├── event.repository.js
│   │   │   ├── registration.repository.js  # Concurrency-safe SELECT FOR UPDATE
│   │   │   └── ticket.repository.js
│   │   ├── services/
│   │   │   ├── user.service.js       # bcrypt password hashing & JWT generation
│   │   │   ├── event.service.js      # Event management & listing
│   │   │   ├── registration.service.js # Concurrency retry loop & ticket issuance
│   │   │   └── ticket_code.js        # Ticket code generation (TKT-XXXX-XXXX)
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── event.controller.js
│   │   │   └── registration.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT Bearer authentication
│   │   │   ├── rbac.middleware.js    # Role-based access control
│   │   │   ├── cors.middleware.js    # CORS policy configuration
│   │   │   ├── logger.middleware.js  # Request logging
│   │   │   └── error.middleware.js   # Centralized error handler
│   │   ├── routes/
│   │   │   └── index.js          # API Router configuration
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # HTTP server entry point & graceful shutdown
│   ├── migrations/               # PostgreSQL schema migrations
│   ├── tests/                    # Integration test suite
│   ├── package.json
│   └── .env.example
├── frontend/                     # React + Vite frontend
└── README.md
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher

---

## Environment Variables

Copy `.env.example` to `.env` inside `backend/`:

```bash
cp backend/.env.example backend/.env
```

Set appropriate values:

```env
APP_ENV=development
SERVER_HOST=0.0.0.0
SERVER_PORT=8080
DATABASE_URL=postgres://postgres:postgres@localhost:5432/seatsafe?sslmode=disable
DB_MAX_CONNS=20
DB_MIN_CONNS=2
JWT_SECRET=super_secret_jwt_key_that_is_at_least_32_chars_long
JWT_EXPIRY_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173
```

---

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The Express server will start on `http://localhost:8080`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React frontend will launch on `http://localhost:5173`.

### 3. Run Backend Tests

```bash
cd backend
npm test
```

---

## API Endpoints Overview

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | None | Health check endpoint |
| `POST` | `/api/v1/auth/register` | None | Register a new user |
| `POST` | `/api/v1/auth/login` | None | Authenticate user & issue JWT |
| `GET` | `/api/v1/auth/me` | Bearer Token | Fetch current user profile |
| `GET` | `/api/v1/events` | None | List published events |
| `GET` | `/api/v1/events/:id` | None | Get event details by ID |
| `POST` | `/api/v1/events` | Organizer / Admin | Create a new event |
| `PATCH` | `/api/v1/events/:id/publish` | Organizer / Admin | Publish a draft event |
| `POST` | `/api/v1/events/:id/register` | Bearer Token | Book seat(s) for an event |
| `GET` | `/api/v1/registrations/me` | Bearer Token | View my event registrations |
| `DELETE` | `/api/v1/registrations/:id` | Bearer Token | Cancel an active registration |
| `GET` | `/api/v1/tickets/me` | Bearer Token | View my issued tickets |

---

## Concurrency & Data Integrity Strategy

1. **Row-Level Locking**: `SELECT FOR UPDATE` locks the specific event row during seat booking, preventing concurrent overbooking.
2. **Deadlock Recovery**: Automatic retry loop (up to 3 attempts) for PostgreSQL deadlock code `40P01`.
3. **Database Constraint**: DB-level `CHECK (registered_count <= capacity)` acts as a final safety net against overbooking.