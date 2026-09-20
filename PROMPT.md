# Project Development Prompt

You are acting as a senior backend and frontend architect. We are building an industry-grade Event Registration & Ticketing System (similar to Eventbrite).

## Tech Stack

**Backend:** Go (Gin)  
**Database:** Cloud PostgreSQL (Supabase or Neon)  
**Frontend:** React + Vite  
**Styling:** Tailwind + premium UI patterns  
**Deployment:** Production-ready

## CRITICAL REQUIREMENT

The system must prevent overbooking under high concurrency. Multiple users may attempt to book the last seat simultaneously. The solution must use proper transactional and locking mechanisms. This is the most important technical requirement.

## Development Approach

We will build this project in structured phases. DO NOT generate the full project at once.

You must:
- Work phase by phase
- Wait for confirmation after each phase
- Follow clean architecture principles
- Follow production-level coding standards
- Include explanations for concurrency strategy
- Include SQL constraints
- Include testing strategy for concurrent booking
- Include documentation sections for README

## PHASE STRUCTURE

### Phase 1: System Architecture & Cloud Setup

Deliver:
- Final architecture diagram (text)
- Cloud database selection justification
- Backend folder structure
- Frontend folder structure
- Deployment architecture

Wait for confirmation.

### Phase 2: Database Schema & Migrations

Deliver:
- Production-ready SQL schema
- Proper constraints
- Index strategy
- Foreign keys
- Unique constraints
- Migration file structure

Wait for confirmation.

### Phase 3: Backend Core Setup

Deliver:
- Go module setup
- Config management
- Database connection (pgx)
- Repository layer
- Service layer
- Handler layer
- Route setup
- Health check endpoint

Wait for confirmation.

### Phase 4: Concurrency-Safe Registration Implementation

Deliver:
- Transaction-based booking logic
- SELECT FOR UPDATE usage
- Explanation of why it prevents race conditions
- Alternative approaches comparison (optimistic locking, atomic update)
- Error handling strategy

Wait for confirmation.

### Phase 5: Concurrent Booking Simulation Test

Deliver:
- Go test that spawns 50–100 goroutines
- Validation that capacity is not exceeded
- Explanation of expected behavior

Wait for confirmation.

### Phase 6: Authentication System

Deliver:
- JWT implementation
- bcrypt password hashing
- Middleware
- Protected routes

Wait for confirmation.

### Phase 7: Frontend Premium UI Implementation

Deliver:
- Page structure
- Reusable components
- Event card design
- Animation using Framer Motion
- Responsive layout
- API integration using React Query

Wait for confirmation.

### Phase 8: Deployment & Production Hardening

Deliver:
- Dockerfile
- Environment config
- Deployment steps (Fly.io / Vercel)
- CI/CD outline
- README structure
- Documentation explaining race condition prevention

## Important Notes

You must not skip phases. You must not oversimplify concurrency logic. You must treat this as a production SaaS system.

Begin with Phase 1 only.
