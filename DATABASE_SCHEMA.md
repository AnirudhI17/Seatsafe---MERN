# Database Schema Documentation

## Overview

The SeatSafe ticketing system uses PostgreSQL with a normalized relational schema designed for data integrity, concurrency safety, and performance.

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   users     │         │   events     │         │ registrations   │
├─────────────┤         ├──────────────┤         ├─────────────────┤
│ id (PK)     │         │ id (PK)      │         │ id (PK)         │
│ email       │         │ organizer_id │────┐    │ event_id (FK)   │───┐
│ password    │    ┌────│ title        │    │    │ user_id (FK)    │   │
│ full_name   │    │    │ description  │    │    │ status          │   │
│ role        │◄───┘    │ location     │    │    │ quantity        │   │
│ created_at  │         │ starts_at    │    │    │ registered_at   │   │
└─────────────┘         │ ends_at      │    │    └─────────────────┘   │
                        │ capacity     │◄───┘                          │
                        │ registered   │         ┌─────────────────┐   │
                        │ price_cents  │         │    tickets      │   │
                        │ status       │         ├─────────────────┤   │
                        │ created_at   │         │ id (PK)         │   │
                        └──────────────┘         │ registration_id │───┘
                                                 │ event_id (FK)   │
                                                 │ user_id (FK)    │
                                                 │ ticket_code     │
                                                 │ is_checked_in   │
                                                 │ issued_at       │
                                                 └─────────────────┘
```

## Tables

### 1. users

Stores user accounts with role-based access control.


**Columns:**
- `id` (UUID, PK): Unique user identifier
- `email` (VARCHAR, UNIQUE): User email address
- `password_hash` (VARCHAR): bcrypt hashed password (cost factor 12)
- `full_name` (VARCHAR): User's full name
- `role` (ENUM): User role - 'attendee', 'organizer', or 'admin'
- `email_verified` (BOOLEAN): Email verification status
- `created_at` (TIMESTAMPTZ): Account creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp

**Constraints:**
- `users_email_unique`: Ensures unique email address