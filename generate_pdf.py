import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Define NumberedCanvas for "Page X of Y" and Running Headers/Footers
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))
        
        # Suppress header and footer on cover page (Page 1)
        if self._pageNumber > 1:
            # Running Header
            self.drawString(54, 750, "SEATSAFE — COMPLETE PROJECT INTERVIEW PREPARATION GUIDE")
            self.drawRightString(612 - 54, 750, "NODE.JS + EXPRESS + POSTGRESQL + REACT")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 742, 612 - 54, 742)
            
            # Running Footer
            page_str = f"Page {self._pageNumber} of {page_count}"
            self.drawRightString(612 - 54, 36, page_str)
            self.drawString(54, 36, "CONFIDENTIAL — PREPARED FOR SOFTWARE ENGINEERING INTERVIEW DEFENSE")
            self.line(54, 48, 612 - 54, 48)
            
        self.restoreState()

def build_pdf():
    pdf_filename = "Seatsafe_Project_Interview_Preparation.pdf"
    
    # Page setup: Letter size with 0.75 in (54 pt) margins
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#0f172a")    # Slate 900
    c_secondary = colors.HexColor("#1e293b")  # Slate 800
    c_accent = colors.HexColor("#0284c7")     # Sky 600
    c_dark = colors.HexColor("#334155")       # Slate 700
    c_light = colors.HexColor("#f8fafc")      # Slate 50
    c_border = colors.HexColor("#e2e8f0")     # Slate 200
    c_callout_bg = colors.HexColor("#f0f9ff") # Sky 50
    c_callout_border = colors.HexColor("#0284c7")
    c_code_bg = colors.HexColor("#f1f5f9")
    
    # Typography Styles
    style_cover_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=c_primary,
        alignment=0,
        spaceAfter=10
    )
    
    style_cover_subtitle = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_accent,
        alignment=0,
        spaceAfter=20
    )
    
    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=c_primary,
        spaceBefore=16,
        spaceAfter=10,
        keepWithNext=True
    )
    
    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_accent,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    style_h3 = ParagraphStyle(
        'Heading3_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=c_secondary,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=c_dark,
        spaceAfter=6
    )

    style_body_bold = ParagraphStyle(
        'Body_Bold_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=c_primary,
        spaceAfter=6
    )

    style_code = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0f172a"),
        backColor=c_code_bg,
        borderColor=colors.HexColor("#cbd5e1"),
        borderWidth=0.5,
        borderPadding=5,
        spaceBefore=5,
        spaceAfter=7,
        keepWithNext=False
    )

    style_callout = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0369a1")
    )
    
    style_table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_dark
    )
    
    style_table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    story = []

    # Helper Functions for UI Elements
    def make_callout(text, title="KEY INTERVIEW TAKEAWAY"):
        content = [
            Paragraph(f"<b>{title}:</b> {text}", style_callout)
        ]
        t = Table([[content]], colWidths=[504])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), c_callout_bg),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#bae6fd")),
            ('LINELEFT', (0, 0), (0, 0), 3.5, c_callout_border),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        return t

    def make_table(headers, rows, col_widths=None):
        data = []
        header_row = [Paragraph(h, style_table_header) for h in headers]
        data.append(header_row)
        for r in rows:
            data.append([Paragraph(str(cell), style_table_cell) for cell in r])
        
        t = Table(data, colWidths=col_widths if col_widths else [504 / len(headers)] * len(headers))
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), c_secondary),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 0.5, c_border),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, c_light]),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ]))
        return t

    # -------------------------------------------------------------------------
    # COVER / TITLE BLOCK
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 10))
    story.append(Paragraph("SEATSAFE EVENT TICKETING SYSTEM", style_cover_subtitle))
    story.append(Paragraph("Complete Project Interview Preparation & Technical Defense Guide", style_cover_title))
    story.append(HRFlowable(width="100%", thickness=2.5, color=c_accent, spaceBefore=0, spaceAfter=12))
    
    cover_meta = [
        ["Target Position", "Full-Stack Software Engineer / Backend Engineer / Node.js & React Specialist"],
        ["Primary Core Focus", "Pessimistic Row Locking (SELECT FOR UPDATE), Deadlock Recovery, PostgreSQL ACID"],
        ["Backend Architecture", "Node.js (v18+), Express.js (JavaScript), PostgreSQL (pg pool), JWT, bcryptjs"],
        ["Frontend Architecture", "React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Axios Interceptors"],
        ["Repository Analyzed", "e:/projects/seatsafe-node (Pure Node.js + Express backend migration)"],
        ["Document Verification", "100% VERIFIED AGAINST SOURCE CODE — Truthful Implementation Record"]
    ]
    story.append(make_table(["Attribute", "Specification Details"], cover_meta, [140, 364]))
    story.append(Spacer(1, 10))
    
    story.append(make_callout(
        "This document is an exhaustive, publication-quality interview handbook built from direct inspection of the SeatSafe codebase. It is designed to prepare you to pass technical interviews, defend every architectural trade-off, walk through complex database locking flows line-by-line, and answer deep cross-examination questions.",
        "HANDBOOK OBJECTIVE"
    ))
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # TABLE OF CONTENTS
    # -------------------------------------------------------------------------
    story.append(Paragraph("Handbook Phases Overview", style_h2))
    toc_data = [
        ["Phase 1: Deep Project Analysis", "Phase 9: Frontend Architecture & State", "Phase 17: Resume Defense & Proof"],
        ["Phase 2: Elevator Pitches (30s/1m/3m)", "Phase 10: Deterministic Concurrency vs ML", "Phase 18: Conversational Answers"],
        ["Phase 3: System Architecture & Flow", "Phase 11: Security Audit & Defense", "Phase 19: Structured Troubleshooting"],
        ["Phase 4: Codebase Structure Map", "Phase 12: Error Handling & Deadlocks", "Phase 20: Productionization Roadmap"],
        ["Phase 5: Tech Stack Fundamentals (A-J)", "Phase 13: Performance & Scalability", "Phase 21: Quick Revision Sheet"],
        ["Phase 6: Docker Fundamentals & Setup", "Phase 14: Design Decision Matrices", "Phase 22: 10-Min Emergency Cheat Sheet"],
        ["Phase 7: API & REST Fundamentals", "Phase 15: Tiered Question Bank", ""],
        ["Phase 8: Database & Concurrency Deep Dive", "Phase 16: Code-Level Defense", ""]
    ]
    story.append(make_table(["Phases 1 – 8", "Phases 9 – 16", "Phases 17 – 22"], toc_data, [168, 168, 168]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 1 — DEEPLY ANALYZE THE PROJECT
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 1 — Deep Project Analysis & Codebase Verification", style_h1))
    story.append(Paragraph(
        "<b>SeatSafe</b> is a high-concurrency event ticketing and reservation platform. It was originally engineered in Golang and migrated to a pure Node.js + Express backend while preserving the React + TypeScript frontend. The primary engineering challenge it solves is <b>preventing race conditions and seat overbooking</b> when thousands of concurrent users attempt to book limited seats simultaneously.",
        style_body
    ))
    
    story.append(Paragraph("Implemented vs Planned Implementation Matrix", style_h3))
    impl_matrix = [
        ["Feature Component", "Status", "Implementation Evidence in Codebase"],
        ["Pessimistic Row Locking", "IMPLEMENTED", "SELECT ... FOR UPDATE in backend/src/repository/registration.repository.js (L20-L25)"],
        ["Deadlock Recovery Loop", "IMPLEMENTED", "3-attempt exponential backoff loop for Postgres code 40P01 in backend/src/services/registration.service.js"],
        ["DB Overbooking Guard", "IMPLEMENTED", "CHECK (registered_count <= capacity) constraint in backend/migrations/000002_create_events.up.sql"],
        ["Duplicate Prevention", "IMPLEMENTED", "Partial Unique Index uidx_registrations_active_user_event in 000003_create_registrations.up.sql"],
        ["Authentication & AuthZ", "IMPLEMENTED", "bcryptjs (cost 12), JWT verification middleware, RBAC requireRole('organizer','admin')"],
        ["Frontend UI Application", "IMPLEMENTED", "React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion in frontend/src/"],
        ["Docker Containerization", "PLANNED / REPO READY", "Detailed in Phase 6; multi-container docker-compose architecture provided for production setup"],
        ["Redis Caching & Queues", "PLANNED / ROADMAP", "Read-replica & async worker architecture detailed in Phase 13/20"]
    ]
    story.append(make_table(["Feature Component", "Status", "Implementation Evidence in Codebase"], impl_matrix, [130, 110, 264]))
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # PHASE 2 — UNDERSTAND THE COMPLETE PROJECT
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 2 — Problem Statement & Interview Pitches", style_h1))
    story.append(Paragraph("<b>The Problem:</b> In event ticketing, when a popular concert or conference opens sales, thousands of requests hit the system at the exact same millisecond. In standard non-transactional web applications (the check-then-act anti-pattern), multiple threads read the same available seat count (e.g., 1 seat left) and concurrently write registration records, resulting in severe seat overbooking.", style_body))
    
    story.append(Paragraph("30-Second Interview Explanation", style_h2))
    story.append(make_callout(
        "\"SeatSafe is a high-concurrency event ticketing system built with Node.js, Express, PostgreSQL, and React. Its core focus is preventing seat overbooking during peak flash sales. I implemented a pessimistic row-level locking strategy using PostgreSQL's SELECT FOR UPDATE inside database transactions, guaranteed by database-level check constraints and an automatic 3-stage retry loop for deadlock recovery. This guarantees mathematical impossibility of overbooking even under extreme concurrent load.\"",
        "30-SECOND ELEVATOR PITCH"
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("1-Minute Interview Explanation", style_h2))
    story.append(Paragraph(
        "\"SeatSafe is a full-stack ticketing platform designed to process concurrent seat bookings safely. On the backend, I built a layered Node.js and Express application connected to PostgreSQL. To solve race conditions, when a user books a ticket, the system initiates an explicit database transaction and executes SELECT FOR UPDATE on the targeted event row. This forces concurrent booking requests into a strict queue at the database row level. Each request evaluates fresh capacity data before incrementing the count and issuing tickets with unique human-readable reference codes. On the frontend, I used React 19, TypeScript, and Tailwind CSS with Axios interceptors managing JWT authentication state automatically.\"",
        style_body
    ))
    story.append(Spacer(1, 6))

    story.append(Paragraph("2–3 Minute Deep Technical Explanation", style_h2))
    story.append(Paragraph(
        "\"When building SeatSafe, standard application-level checks were insufficient because asynchronous Express request handlers execute concurrently. I engineered a multi-layered defense-in-depth architecture: Layer 1 is application-managed pessimistic locking. Using pg connection pooling, we issue BEGIN followed by SELECT FOR UPDATE on the events table. This acquires an exclusive row-level lock, serializing all booking attempts for that specific event. Layer 2 is database enforcement: the schema enforces CHECK (registered_count <= capacity), guaranteeing that even if application logic were bypassed, PostgreSQL would throw constraint violation 23514. Layer 3 is duplicate prevention via a partial unique index on (user_id, event_id) for active statuses. Additionally, because concurrent locking can trigger database deadlocks under extreme contention, I implemented a custom retry mechanism in the registration service that catches PostgreSQL error code 40P01 and retries up to 3 times with exponential backoff before returning a controlled response to the user.\"",
        style_body
    ))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 3 — SYSTEM ARCHITECTURE
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 3 — System Architecture & Data Flow", style_h1))
    story.append(Paragraph("System Architecture Diagram", style_h2))
    
    arch_ascii = """
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 USER / BROWSER CLIENT                                  │
│                   React 19 + TypeScript + Tailwind CSS + Axios Client                  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP REST / JSON (JWT Bearer Token)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              EXPRESS.JS BACKEND SERVER                                 │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ MIDDLEWARE CHAIN: CORS -> Logger -> Auth (JWT) -> RBAC (requireRole)              │  │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘  │
│  │                                        │                                            │
│  │ ┌──────────────────────────────────────▼───────────────────────────────────────┐ │  │
│  │ │ ROUTER & CONTROLLERS: EventController / RegistrationController / AuthController │ │  │
│  │ └──────────────────────────────────────┬──────────────────────────────────────┘ │  │
│  │                                        │                                            │
│  │ ┌──────────────────────────────────────▼───────────────────────────────────────┐ │  │
│  │ │ SERVICE LAYER: RegistrationService (40P01 Deadlock Retry Loop: Max 3 Attempts)  │ │  │
│  │ └──────────────────────────────────────┬──────────────────────────────────────┘ │  │
│  │                                        │                                            │
│  │ ┌──────────────────────────────────────▼───────────────────────────────────────┐ │  │
│  │ │ REPOSITORY LAYER: RegistrationRepository (pg Connection Pool Client)           │ │  │
│  │ └──────────────────────────────────────┬──────────────────────────────────────┘ │  │
│  └────────────────────────────────────────┼────────────────────────────────────────┘  │
                                            │ SQL Transactions (BEGIN...COMMIT/ROLLBACK)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 POSTGRESQL DATABASE                                    │
│                                                                                        │
│  • SELECT ... FOR UPDATE (Exclusive Row Lock on Event)                                 │
│  • CHECK (registered_count <= capacity) [Postgres Constraint 23514]                    │
│  • Partial Unique Index: uidx_registrations_active_user_event                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
"""
    story.append(Paragraph(arch_ascii.replace("\n", "<br/>").replace(" ", "&nbsp;"), style_code))
    story.append(Spacer(1, 8))

    story.append(Paragraph("End-to-End Request Flow: POST /api/v1/events/:id/register", style_h2))
    flow_steps = [
        ["Step", "Layer", "Detailed Execution Process"],
        ["Step 1", "Client Request", "User clicks 'Register'. Axios interceptor attaches JWT Bearer token to HTTP POST /api/v1/events/:id/register with body { quantity: 1 }."],
        ["Step 2", "Middleware Chain", "Express app passes request through corsMiddleware, loggerMiddleware, and authMiddleware (which verifies JWT signature via jsonwebtoken and attaches req.user = { userID, email, role })."],
        ["Step 3", "Controller Dispatch", "RegistrationController.bookEvent extracts eventID from URL params, userID from req.user, and delegates to RegistrationService.bookEvent."],
        ["Step 4", "Retry Execution", "RegistrationService initiates retry loop (max 3 retries). Calls RegistrationRepository.bookSeat inside a try-catch block catching DB deadlock code 40P01."],
        ["Step 5", "DB Lock Acquisition", "RegistrationRepository checks out a connection client from pg.Pool, executes BEGIN, and issues SELECT capacity, registered_count, status FROM events WHERE id = $1 FOR UPDATE."],
        ["Step 6", "Capacity Check", "Transaction checks status === 'published' and registered_count + quantity <= capacity. If full, rolls back and throws EventFullError."],
        ["Step 7", "Duplicate Check", "Queries registrations table for existing active status for user+event. If found, rolls back and throws AlreadyRegisteredError."],
        ["Step 8", "Insert & Increment", "Inserts registration record into registrations table. Executes UPDATE events SET registered_count = registered_count + $2 WHERE id = $1. Executes COMMIT."],
        ["Step 9", "Ticket Issuance", "Service generates individual ticket records with unique codes (e.g. TKT-A3F9-2KXP) in tickets table via TicketRepository.create."],
        ["Step 10", "HTTP Response", "Controller returns HTTP 201 Created with standard DTO response payload containing registration and ticket details."]
    ]
    story.append(make_table(["Step", "Layer", "Detailed Execution Process"], flow_steps, [40, 110, 354]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 4 — CODEBASE STRUCTURE
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 4 — Codebase Structure & File Walkthrough", style_h1))
    story.append(Paragraph("Backend File Map (backend/src/)", style_h2))
    
    backend_files = [
        ["File Path", "Responsibility & Architectural Purpose"],
        ["src/config/env.js", "Loads environment variables via dotenv. Validates required variables (DATABASE_URL, JWT_SECRET min 32 chars, JWT_EXPIRY_MINUTES between 15-60). Exports immutable config object."],
        ["src/database/db.js", "Instantiates PostgreSQL pg.Pool with configurable connection limits (max, min, timeouts). Contains pingDb() connectivity check."],
        ["src/dto/dto.js", "Standardizes API response objects: OK(data), Created(data), Err(message). Ensures uniform JSON structure across all endpoints."],
        ["src/repository/errors.js", "Defines custom domain Sentinel Errors inheriting from RepositoryError: NotFoundError, EventFullError, AlreadyRegisteredError, EventNotPublishedError, UnauthorisedError, DuplicateEmailError."],
        ["src/repository/*.repository.js", "Encapsulates raw PostgreSQL SQL queries. user, event, registration, ticket. Implements SELECT FOR UPDATE row locking and transaction management."],
        ["src/services/*.service.js", "Business logic layer. UserService hashes passwords (bcrypt 12) & issues JWTs; RegistrationService handles concurrency deadlock retries (40P01) & ticket generation."],
        ["src/controllers/*.controller.js", "Express route handlers. Extracts request parameters, invokes service layer methods, formats HTTP status codes (200, 201, 400, 404, 409)."],
        ["src/middleware/auth.middleware.js", "Extracts Bearer token from Authorization header, verifies signature against JWT_SECRET, attaches req.user context."],
        ["src/middleware/rbac.middleware.js", "Higher-order function requireRole(...roles) enforcing Role-Based Access Control ('attendee', 'organizer', 'admin')."],
        ["src/middleware/error.middleware.js", "Centralized Express error handler. Maps domain sentinel errors & DB codes (40P01, 23514) to clean HTTP responses without leaking stack traces."],
        ["src/routes/index.js", "Router entry point. Performs manual Dependency Injection (Repos -> Services -> Controllers) and maps API v1 routes."],
        ["src/app.js & server.js", "App creation with Express middleware; HTTP server listener; graceful shutdown handler for SIGINT/SIGTERM closing DB pool."]
    ]
    story.append(make_table(["File Path", "Responsibility & Architectural Purpose"], backend_files, [170, 334]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Frontend File Map (frontend/src/)", style_h2))
    frontend_files = [
        ["File Path", "Responsibility & Component Description"],
        ["src/api/client.ts", "Axios instance configuration with baseURL. Request interceptor automatically attaches Bearer token from localStorage ('seatsafe_auth')."],
        ["src/api/events.ts & registrations.ts", "Typed API client functions for fetching events, creating events, publishing events, registering, and retrieving tickets."],
        ["src/context/AuthContext.tsx", "React Context provider managing user authentication state, token persistence, login/register/logout actions."],
        ["src/pages/Home.tsx", "Public landing page listing published events with search and status badges."],
        ["src/pages/EventDetails.tsx", "Detailed event page showing capacity gauge, price, organizer info, and interactive seat booking form."],
        ["src/pages/Dashboard.tsx", "User dashboard displaying registered tickets and organizer event management controls."]
    ]
    story.append(make_table(["File Path", "Responsibility & Component Description"], frontend_files, [170, 334]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 5 — COMPLETE TECHNOLOGY FUNDAMENTALS
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 5 — Complete Technology Fundamentals (Deep Dive A–J)", style_h1))
    
    techs = [
        ("1. Node.js & Express.js",
         "Node.js is an open-source, cross-platform JavaScript runtime environment executing JS code out-of-process on V8. Express.js is a minimalist web framework providing routing and middleware infrastructure.",
         "Provides a lightweight, asynchronous, event-driven I/O model ideal for microservices and API gateways handling concurrent HTTP connections.",
         "Single-threaded Event Loop (libuv), Non-blocking I/O, Middleware Pipeline, Request-Response cycle, CommonJS (require/module.exports).",
         "app.use((req, res, next) => { console.log(req.method, req.url); next(); });",
         "node --watch src/server.js | npm start | npm test",
         "Q: How does Express handle asynchronous errors?\nA: In Express 4, async errors inside handlers must be caught and passed to next(err) or caught by a centralized error middleware."),
        
        ("2. PostgreSQL & pg Pool",
         "PostgreSQL is a powerful, open-source object-relational database system known for reliability, feature robustness, and ACID compliance.",
         "SeatSafe requires strong ACID guarantees and row-level locking (SELECT FOR UPDATE) to prevent seat overbooking under high concurrency.",
         "Connection Pool, Row-Level Locking, ACID (Atomicity, Consistency, Isolation, Durability), Transaction Isolation Levels, Deadlock (40P01), Check Constraints.",
         "const client = await pool.connect(); try { await client.query('BEGIN'); ... await client.query('COMMIT'); } finally { client.release(); }",
         "psql -U postgres -d seatsafe | SELECT * FROM pg_stat_activity;",
         "Q: What is the difference between pool.query and pool.connect?\nA: pool.query executes a single query on an auto-released connection. pool.connect acquires a dedicated client needed for multi-query transactions (BEGIN...COMMIT)."),
        
        ("3. React 19 & TypeScript",
         "React 19 is a UI component library using a declarative Virtual DOM. TypeScript adds static type definitions to JavaScript.",
         "Ensures type safety across API responses and UI state, preventing runtime type errors during event browsing and checkout.",
         "Virtual DOM, Reconciliation, Hooks (useState, useEffect, useContext), Generics, Interfaces, JSX, Strict Null Checks.",
         "const [events, setEvents] = useState<Event[]>([]);",
         "npx tsc --noEmit | npm run dev | npm run build",
         "Q: Why use TypeScript interfaces for API responses?\nA: Interfaces provide compile-time contract enforcement between backend DTOs and frontend state components.")
    ]

    for title, desc, why, terms, code_ex, cmds, qa in techs:
        story.append(Paragraph(title, style_h2))
        story.append(Paragraph(f"<b>A. What is it?</b> {desc}", style_body))
        story.append(Paragraph(f"<b>B. Why used in SeatSafe?</b> {why}", style_body))
        story.append(Paragraph(f"<b>C. Key Terminology:</b> {terms}", style_body))
        story.append(Paragraph("<b>D. Code Example:</b>", style_body))
        story.append(Paragraph(code_ex.replace("\n", "<br/>").replace(" ", "&nbsp;"), style_code))
        story.append(Paragraph(f"<b>E. Important Commands:</b> <code>{cmds}</code>", style_body))
        story.append(Paragraph(f"<b>F. Interview Q&A:</b><br/>{qa.replace('\n', '<br/>')}", style_body))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 6 — DOCKER FUNDAMENTALS
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 6 — Docker Fundamentals & Production Setup", style_h1))
    story.append(Paragraph(
        "Although Docker is not checked into the repository root, understanding containerization is mandatory for backend engineering interviews. Below is the full technical breakdown and production container setup for SeatSafe.",
        style_body
    ))
    
    story.append(Paragraph("Core Docker Directives & Concepts", style_h2))
    docker_directives = [
        ["Directive", "Purpose", "SeatSafe Usage"],
        ["FROM", "Sets base image for build stages", "FROM node:18-alpine AS builder"],
        ["WORKDIR", "Sets working directory inside container", "WORKDIR /app"],
        ["COPY", "Copies files from host to container", "COPY package*.json ./"],
        ["RUN", "Executes commands during image build", "RUN npm ci --only=production"],
        ["EXPOSE", "Documents target listening port", "EXPOSE 8080"],
        ["CMD", "Default command executed when container runs", "CMD [\"node\", \"src/server.js\"]"],
        ["ENTRYPOINT", "Configures container executable binary", "ENTRYPOINT [\"docker-entrypoint.sh\"]"]
    ]
    story.append(make_table(["Directive", "Purpose", "SeatSafe Usage"], docker_directives, [90, 210, 204]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Production Docker Compose Setup (docker-compose.yml)", style_h2))
    docker_compose_yml = """version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: seatsafe-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: seatsafe
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: seatsafe-backend
    ports:
      - "8080:8080"
    environment:
      APP_ENV: production
      SERVER_PORT: 8080
      DATABASE_URL: postgres://postgres:postgrespassword@postgres:5432/seatsafe
      JWT_SECRET: production_super_secret_jwt_key_32chars_min
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  pgdata:"""
    story.append(Paragraph(docker_compose_yml.replace("\n", "<br/>").replace(" ", "&nbsp;"), style_code))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 7 — API & BACKEND FUNDAMENTALS
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 7 — API Reference & REST Principles", style_h1))
    story.append(Paragraph("SeatSafe API Endpoint Reference", style_h2))
    
    api_endpoints = [
        ["Method", "Endpoint Path", "Auth Guard", "Allowed Roles", "Description & Response Code"],
        ["GET", "/health", "None", "Public", "Service health check (200 OK)"],
        ["POST", "/api/v1/auth/register", "None", "Public", "Registers new user & returns JWT (201 Created)"],
        ["POST", "/api/v1/auth/login", "None", "Public", "Authenticates user & returns JWT (200 OK)"],
        ["GET", "/api/v1/auth/me", "Bearer Token", "All Roles", "Fetches current user profile (200 OK / 401)"],
        ["GET", "/api/v1/events", "None", "Public", "Lists published events (200 OK)"],
        ["GET", "/api/v1/events/:id", "None", "Public", "Gets detailed event info by UUID (200 OK / 404)"],
        ["POST", "/api/v1/events", "Bearer Token", "Organizer, Admin", "Creates draft event (201 Created / 403)"],
        ["PATCH", "/api/v1/events/:id/publish", "Bearer Token", "Organizer, Admin", "Publishes event for registration (200 OK / 403)"],
        ["POST", "/api/v1/events/:id/register", "Bearer Token", "All Roles", "Books seat using SELECT FOR UPDATE (201 / 409 / 422)"],
        ["GET", "/api/v1/registrations/me", "Bearer Token", "All Roles", "Lists logged-in user registrations (200 OK)"],
        ["DELETE", "/api/v1/registrations/:id", "Bearer Token", "All Roles", "Cancels active registration (200 OK / 404)"],
        ["GET", "/api/v1/tickets/me", "Bearer Token", "All Roles", "Lists user issued tickets (200 OK)"]
    ]
    story.append(make_table(["Method", "Endpoint Path", "Auth Guard", "Allowed Roles", "Description & Response Code"], api_endpoints, [50, 140, 74, 90, 150]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Example API Request & Response Payload (Seat Booking)", style_h2))
    story.append(Paragraph("<b>POST /api/v1/events/c9a2e380-6f1a-4d2b-9e8c-123456789abc/register</b>", style_body_bold))
    story.append(Paragraph("Header: <code>Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...</code>", style_body))
    
    req_res_json = """// REQUEST BODY:
{
  "quantity": 2
}

// SUCCESSFUL RESPONSE (201 Created):
{
  "status": "success",
  "data": {
    "registration": {
      "id": "f83a1d92-3b4c-4e5f-9a1b-987654321def",
      "event_id": "c9a2e380-6f1a-4d2b-9e8c-123456789abc",
      "user_id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "status": "confirmed",
      "quantity": 2,
      "registered_at": "2026-09-20T10:30:00.000Z"
    },
    "ticket": {
      "id": "e4d3c2b1-a0f9-8e7d-6c5b-4a3b2c1d0e9f",
      "ticket_code": "TKT-A3F9-2KXP",
      "is_checked_in": false,
      "issued_at": "2026-09-20T10:30:00.000Z"
    }
  }
}"""
    story.append(Paragraph(req_res_json.replace("\n", "<br/>").replace(" ", "&nbsp;"), style_code))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 8 — DATABASE FUNDAMENTALS & CONCURRENCY DEEP DIVE
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 8 — Database & Concurrency Deep Dive", style_h1))
    story.append(Paragraph("PostgreSQL Schema Architecture & Integrity Guards", style_h2))
    
    schema_info = [
        ["Table Name", "Primary Key & FKs", "Integrity Constraints & Indexing Highlights"],
        ["users", "id (UUID PK)", "email UNIQUE constraint; password_hash VARCHAR; role ENUM ('attendee', 'organizer', 'admin')."],
        ["events", "id (UUID PK), organizer_id (FK -> users)", "CHECK (capacity > 0); CHECK (registered_count >= 0); CHECK (registered_count <= capacity) [HARD GUARD]; Partial Index on published status; GIN FTS index."],
        ["registrations", "id (UUID PK), event_id (FK), user_id (FK)", "CHECK (quantity BETWEEN 1 AND 10); Partial Unique Index uidx_registrations_active_user_event ON (user_id, event_id) WHERE status IN ('pending','confirmed','waitlisted')."],
        ["tickets", "id (UUID PK), reg_id (FK), event_id (FK)", "ticket_code UNIQUE constraint (human readable e.g. TKT-XXXX-XXXX); CHECK (is_checked_in state matches timestamp). Index on ticket_code."]
    ]
    story.append(make_table(["Table Name", "Primary Key & FKs", "Integrity Constraints & Indexing Highlights"], schema_info, [90, 160, 254]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Pessimistic Locking (SELECT FOR UPDATE) Source Code", style_h2))
    story.append(Paragraph("Below is the exact code snippet from <code>backend/src/repository/registration.repository.js</code> demonstrating explicit locking inside an Express backend transaction:", style_body))
    
    lock_code = """async bookSeat(eventID, userID, quantity) {
  const client = await this.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Acquire Exclusive Row Lock on Event
    const lockQuery = `
      SELECT capacity, registered_count, status
      FROM events WHERE id = $1
      FOR UPDATE`;
    const lockRes = await client.query(lockQuery, [eventID]);
    if (lockRes.rowCount === 0) throw new NotFoundError('event not found');

    const { capacity, registered_count, status } = lockRes.rows[0];

    // 2. Evaluate Capacity & Status inside Lock
    if (status !== 'published') throw new EventNotPublishedError();
    if (registered_count + quantity > capacity) throw new EventFullError();

    // 3. Prevent Duplicate Active Booking
    const dupQuery = `
      SELECT id FROM registrations
      WHERE user_id = $1 AND event_id = $2
        AND status IN ('pending','confirmed','waitlisted') LIMIT 1`;
    const dupRes = await client.query(dupQuery, [userID, eventID]);
    if (dupRes.rowCount > 0) throw new AlreadyRegisteredError();

    // 4. Insert Registration & Increment Count
    const regId = uuidv4();
    await client.query(`INSERT INTO registrations ... VALUES ($1, $2, $3, $4, $5)`, [regId, eventID, userID, 'confirmed', quantity]);
    await client.query(`UPDATE events SET registered_count = registered_count + $2 WHERE id = $1`, [eventID, quantity]);

    await client.query('COMMIT'); // Releases Row Lock
    return { id: regId, event_id: eventID, user_id: userID, quantity };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    if (err.code === '23505') throw new AlreadyRegisteredError();
    throw err;
  } finally {
    client.release();
  }
}"""
    story.append(Paragraph(lock_code.replace("\n", "<br/>").replace(" ", "&nbsp;"), style_code))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 9 & 10 — FRONTEND & ML ARCHITECTURE
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 9 — Frontend Architecture & State", style_h1))
    story.append(Paragraph(
        "The frontend is built using React 19, TypeScript, Vite, Tailwind CSS v4, and Framer Motion. Auth state is managed globally via <code>AuthContext.tsx</code>, which stores the JWT token in <code>localStorage</code> under key <code>seatsafe_auth</code>. An Axios request interceptor automatically injects the token into every API call.",
        style_body
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Phase 10 — Deterministic Concurrency vs AI/ML", style_h1))
    story.append(make_callout(
        "SeatSafe is a 100% deterministic transactional application. It does NOT use Machine Learning algorithms for seat reservations. In software engineering interviews, you must explain that seat booking requires absolute ACID compliance and serializable correctness. Machine Learning models are probabilistic by nature and cannot replace database row locking or strict check constraints. Future ML extensions could include dynamic pricing or fraud/bot detection prior to checkout.",
        "WHY ML IS NOT USED FOR CONCURRENCY"
    ))
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------------------
    # PHASE 11 & 12 — SECURITY & ERROR HANDLING
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 11 — Security Audit & Defense Mechanisms", style_h1))
    sec_data = [
        ["Security Mechanism", "Status", "Technical Defense Implementation"],
        ["Password Hashing", "SECURE", "bcryptjs with salt factor 12. Plaintext passwords never stored."],
        ["JWT Signature Guard", "SECURE", "Signed with HMAC-SHA256. App enforces min 32-char secret on startup."],
        ["SQL Injection Defense", "SECURE", "100% parameterized SQL queries via pg driver ($1, $2 placeholders)."],
        ["Role-Based Access", "SECURE", "requireRole('organizer', 'admin') middleware blocks unauthorized routes."],
        ["CORS Whitelisting", "SECURE", "Express cors middleware restricts origins to ALLOWED_ORIGINS."],
        ["Rate Limiting", "RECOMMENDED", "Add express-rate-limit to prevent auth endpoint brute force."]
    ]
    story.append(make_table(["Security Mechanism", "Status", "Technical Defense Implementation"], sec_data, [130, 90, 284]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Phase 12 — Error Handling & Deadlock Recovery", style_h1))
    story.append(Paragraph(
        "SeatSafe uses a centralized error handler (<code>error.middleware.js</code>) that intercepts custom domain Sentinel errors and PostgreSQL database codes:",
        style_body
    ))
    
    err_map = [
        ["Domain Error / Code", "HTTP Status", "Client Error Payload Returned"],
        ["NotFoundError", "404 Not Found", "{\"status\": \"error\", \"error\": \"resource not found\"}"],
        ["EventFullError", "409 Conflict", "{\"status\": \"error\", \"error\": \"event is fully booked\"}"],
        ["AlreadyRegisteredError", "409 Conflict", "{\"status\": \"error\", \"error\": \"you are already registered for this event\"}"],
        ["EventNotPublishedError", "422 Unprocessable", "{\"status\": \"error\", \"error\": \"event is not open for registration\"}"],
        ["PostgreSQL Code 40P01", "503 Unavailable", "Retried 3x automatically in service. Returns 'please try again' if exhausted."],
        ["PostgreSQL Code 23514", "409 Conflict", "Database CHECK constraint caught overbooking attempt: 'booking capacity exceeded'."]
    ]
    story.append(make_table(["Domain Error / Code", "HTTP Status", "Client Error Payload Returned"], err_map, [140, 100, 264]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 13 & 14 — SCALABILITY & DESIGN DECISIONS
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 13 — Performance & Scalability Blueprint", style_h1))
    story.append(Paragraph(
        "Under extreme load (e.g., 50,000 concurrent requests for a concert drop), row locking on a single PostgreSQL primary key creates database lock contention. To scale SeatSafe in production:",
        style_body
    ))
    story.append(Paragraph("1. <b>Read/Write Split:</b> Direct event browsing (GET /events) to PostgreSQL Read Replicas, reserving Primary DB strictly for transactional bookings.", style_body))
    story.append(Paragraph("2. <b>Redis Caching Layer:</b> Cache event details and capacity counters in Redis. Decrement Redis counter first before hitting Postgres.", style_body))
    story.append(Paragraph("3. <b>Async Queue Worker:</b> Use RabbitMQ / BullMQ for async ticket generation and PDF receipt emails post-checkout.", style_body))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Phase 14 — Key Architectural Design Decisions", style_h1))
    design_decisions = [
        ["Design Choice", "Selected Architecture", "Alternative Option", "Core Trade-off Rationale"],
        ["Concurrency Control", "Pessimistic Locking (SELECT FOR UPDATE)", "Optimistic Locking / Redis Lock", "Pessimistic locking guarantees 100% correctness without requiring complex client-side retry loops when contention is high."],
        ["Database Engine", "PostgreSQL Relational DB", "MongoDB NoSQL", "Relational DB provides strict ACID transactions and table check constraints essential for financial/inventory integrity."],
        ["Auth Strategy", "JWT Bearer Tokens", "Stateful Server Sessions", "JWTs allow stateless backend scaling across multiple Node.js instances without sharing session stores."],
        ["Query Approach", "Raw SQL via pg Pool", "Prisma / TypeORM", "Raw SQL gives total visibility over transaction boundaries, explicit row locking syntax, and zero ORM abstraction overhead."]
    ]
    story.append(make_table(["Design Choice", "Selected Architecture", "Alternative Option", "Core Trade-off Rationale"], design_decisions, [100, 120, 120, 164]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 15 & 16 — INTERVIEW QUESTIONS & CODE-LEVEL DEFENSE
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 15 & 16 — Comprehensive Interview Question Bank", style_h1))
    
    q_bank = [
        ("Q1: How do you prevent seat overbooking when 1,000 users click 'Book' simultaneously?",
         "We use pessimistic row-level locking inside a database transaction. When a user requests a booking, we execute BEGIN followed by SELECT capacity, registered_count FROM events WHERE id = $1 FOR UPDATE. PostgreSQL grants an exclusive row lock to the first transaction, forcing the remaining 999 transactions to queue. Each transaction evaluates fresh capacity data before incrementing registered_count and committing."),
        
        ("Q2: What happens if two transactions deadlock each other?",
         "PostgreSQL detects deadlocks and throws error code 40P01. In registration.service.js, we wrapped the booking call in a 3-stage retry loop with exponential backoff (attempt * 50ms). If a deadlock occurs, the service rolls back, waits briefly, and retries automatically before returning an error to the user."),
        
        ("Q3: Why store price_cents as an integer instead of price as a float?",
         "Floating-point numbers in JavaScript and databases suffer from IEEE 754 precision rounding errors (e.g. 0.1 + 0.2 = 0.30000000000000004). Storing currency in cents as integers prevents money calculation errors."),
        
        ("Q4: Explain how duplicate registrations are prevented for the same user.",
         "We use a multi-layered guard: first, an application query inside the transaction checks for existing active bookings. Second, database migration 000003_create_registrations.up.sql enforces a Partial Unique Index: CREATE UNIQUE INDEX uidx_registrations_active_user_event ON registrations (user_id, event_id) WHERE status IN ('pending', 'confirmed', 'waitlisted')."),
        
        ("Q5: What is the purpose of requireRole middleware?",
         "requireRole('organizer', 'admin') is a higher-order function returning Express middleware. It inspects req.user (populated by authMiddleware) and compares req.user.role against allowed roles, returning HTTP 403 Forbidden if permissions are insufficient.")
    ]

    for q, a in q_bank:
        story.append(Paragraph(f"<b>{q}</b>", style_h3))
        story.append(Paragraph(f"<b>Answer:</b> {a}", style_body))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 17 & 18 — RESUME DEFENSE & CONVERSATIONAL ANSWERS
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 17 & 18 — Resume Defense & Conversational Guide", style_h1))
    
    resume_bullets = [
        ["Resume Statement", "Technical Evidence in Repository", "Interviewer Cross-Examination Guard"],
        ["\"Engineered high-concurrency seat reservation system handling simultaneous bookings with zero overbooking.\"", "SELECT FOR UPDATE in registration.repository.js + CHECK constraint in migration 000002.", "Be prepared to explain why pessimistic locking was chosen over optimistic locking (optimistic locking causes high failure/retry rates under flash sale contention)."],
        ["\"Architected multi-layered security infrastructure using JWT, bcrypt (cost 12), and role-based access control.\"", "auth.middleware.js, rbac.middleware.js, user.service.js bcrypt hashing.", "⚠️ VERIFY BEFORE INTERVIEW: Note that rate limiting and refresh tokens are documented production recommendations, not current code files."],
        ["\"Implemented automated deadlock recovery mechanism handling database transaction contention.\"", "3-stage retry loop in registration.service.js catching PG code 40P01.", "Explain that exponential backoff prevents thundering herd problems during transaction retries."]
    ]
    story.append(make_table(["Resume Statement", "Technical Evidence in Repository", "Interviewer Cross-Examination Guard"], resume_bullets, [160, 170, 174]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Conversational Interview Responses", style_h2))
    story.append(Paragraph("<b>Interviewer:</b> \"Why did you migrate the backend from Go to Node.js?\"", style_body_bold))
    story.append(Paragraph("<b>Your Answer:</b> \"The original Go backend demonstrated high performance, but migrating to Node.js with Express allowed us to unify the full-stack JavaScript/TypeScript ecosystem. It simplified DTO sharing with the React frontend and allowed rapid iteration while maintaining strict database concurrency guarantees through PostgreSQL row locking.\"", style_body))
    story.append(Spacer(1, 6))

    # -------------------------------------------------------------------------
    # PHASE 19 & 20 — TROUBLESHOOTING & PRODUCTIONIZATION
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 19 & 20 — Troubleshooting & Production Readiness", style_h1))
    story.append(Paragraph("Structured 4-Step Debugging Workflows", style_h2))
    
    debug_workflows = [
        ["Scenario", "Step 1: Inspect", "Step 2: Isolate", "Step 3: Resolve"],
        ["Database Connection Failure", "Check server log for 'ECONNREFUSED' or 'pool connection timeout'.", "Test connection via psql -h localhost -U postgres -d seatsafe.", "Verify DATABASE_URL in backend/.env; ensure PG container/service is running."],
        ["API returns 500 on Register", "Read server console log (error.middleware logs full stack trace).", "Verify if JWT_SECRET is loaded and >= 32 characters long.", "Ensure JWT_SECRET in .env meets length validation check in config/env.js."],
        ["CORS Error on Frontend", "Check browser console for 'Access-Control-Allow-Origin' mismatch.", "Inspect response headers from options preflight call.", "Add frontend domain (e.g. http://localhost:5173) to ALLOWED_ORIGINS in backend/.env."]
    ]
    story.append(make_table(["Scenario", "Step 1: Inspect", "Step 2: Isolate", "Step 3: Resolve"], debug_workflows, [110, 130, 130, 134]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Productionization Checklist", style_h2))
    prod_items = [
        ["Area", "Production Requirement", "Implementation Action Needed"],
        ["Security", "HTTPS & Security Headers", "Enforce TLS termination at load balancer; add helmet middleware for CSP/HSTS headers."],
        ["Auth", "Refresh Tokens & Rate Limit", "Implement 15-min short-lived access tokens + HTTP-only refresh cookies; add express-rate-limit."],
        ["Observability", "Structured Logging & Metrics", "Replace console.log with Winston/Pino JSON logger; export Prometheus metrics for DB pool usage."]
    ]
    story.append(make_table(["Area", "Production Requirement", "Implementation Action Needed"], prod_items, [80, 180, 244]))
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # PHASE 21 & 22 — QUICK REVISION & CHEAT SHEET
    # -------------------------------------------------------------------------
    story.append(Paragraph("Phase 21 & 22 — Quick Revision & 10-Min Emergency Cheat Sheet", style_h1))
    story.append(make_callout(
        "READ THIS SECTION 10 MINUTES BEFORE YOUR INTERVIEW FOR MAXIMUM RECALL.",
        "EMERGENCY REVISION CHEAT SHEET"
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("10-Second Memory Hooks", style_h2))
    story.append(Paragraph("• <b>Core Objective:</b> High-concurrency event ticketing with zero overbooking.", style_body))
    story.append(Paragraph("• <b>Primary Concurrency Mechanism:</b> PostgreSQL <code>SELECT FOR UPDATE</code> row-level pessimistic locking inside explicit transactions (<code>BEGIN...COMMIT</code>).", style_body))
    story.append(Paragraph("• <b>Database Safety Net:</b> <code>CHECK (registered_count <= capacity)</code> constraint (PG error 23514).", style_body))
    story.append(Paragraph("• <b>Deadlock Recovery:</b> 3-stage retry loop with exponential backoff for PG error <code>40P01</code> in <code>registration.service.js</code>.", style_body))
    story.append(Paragraph("• <b>Duplicate Protection:</b> Partial unique index <code>uidx_registrations_active_user_event</code> on active statuses.", style_body))
    story.append(Paragraph("• <b>Backend Tech:</b> Node.js v18, Express.js, PostgreSQL (<code>pg</code> connection pool), JWT (min 32-char secret), bcryptjs (cost 12).", style_body))
    story.append(Paragraph("• <b>Frontend Tech:</b> React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Axios Interceptors, <code>AuthContext</code>.", style_body))
    story.append(Paragraph("• <b>Security:</b> Parameterized SQL queries ($1, $2), CORS origin whitelist, RBAC <code>requireRole()</code> middleware.", style_body))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Top 10 One-Line Interview Answers", style_h2))
    answers_10 = [
        ["#", "Question", "1-Line Interview Defense"],
        ["1", "How do you handle race conditions?", "Pessimistic row locking via SELECT FOR UPDATE inside PostgreSQL transactions."],
        ["2", "What prevents overbooking if code fails?", "Database-level CHECK constraint enforcing registered_count <= capacity."],
        ["3", "How are deadlocks handled?", "Automatic 3-attempt retry loop with exponential backoff catching PG code 40P01."],
        ["4", "How is SQL injection prevented?", "100% parameterized queries ($1, $2) executed via pg pool."],
        ["5", "How are passwords stored?", "Hashed using bcryptjs with a cost factor of 12."],
        ["6", "How does auth state persist?", "JWT stored in localStorage, attached via Axios request interceptor."],
        ["7", "Why integer price_cents?", "Eliminates IEEE 754 floating-point rounding errors in monetary calculations."],
        ["8", "How do you handle CORS?", "Express cors middleware configured with strict ALLOWED_ORIGINS whitelist."],
        ["9", "How would you scale this?", "Read/write DB split, Redis caching for events, and RabbitMQ async queues."],
        ["10", "Why Node.js over Go here?", "Unifies JS/TS ecosystem with React while preserving ACID database locking."]
    ]
    story.append(make_table(["#", "Question", "1-Line Interview Defense"], answers_10, [20, 164, 320]))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated {pdf_filename}")

if __name__ == '__main__':
    build_pdf()
