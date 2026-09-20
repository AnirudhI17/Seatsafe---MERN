-- Migration: 000004_create_tickets
-- Description: Tickets represent proof of registration — one row per seat

CREATE TABLE tickets (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID        NOT NULL REFERENCES registrations(id) ON DELETE RESTRICT,
    event_id        UUID        NOT NULL REFERENCES events(id)        ON DELETE RESTRICT,
    user_id         UUID        NOT NULL REFERENCES users(id)         ON DELETE RESTRICT,
    ticket_code     VARCHAR(32) NOT NULL,   -- human-readable, unique reference (e.g. TKT-A3F9-2KXP)
    seat_number     VARCHAR(20),            -- NULL for general admission
    is_checked_in   BOOLEAN     NOT NULL DEFAULT FALSE,
    checked_in_at   TIMESTAMPTZ,
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,            -- NULL = no expiry (standard events)

    CONSTRAINT tickets_ticket_code_unique UNIQUE (ticket_code),
    CONSTRAINT tickets_checkin_ts CHECK (
        (is_checked_in = FALSE AND checked_in_at IS NULL)
        OR
        (is_checked_in = TRUE  AND checked_in_at IS NOT NULL)
    )
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

-- QR code / check-in lookup (hot path at event entrance)
CREATE UNIQUE INDEX idx_tickets_ticket_code ON tickets (ticket_code);

-- User wallet: all my tickets
CREATE INDEX idx_tickets_user_id ON tickets (user_id, issued_at DESC);

-- Organizer check-in dashboard for a specific event
CREATE INDEX idx_tickets_event_id ON tickets (event_id, is_checked_in);

COMMENT ON TABLE  tickets             IS 'Individual ticket records; one per seat in a registration';
COMMENT ON COLUMN tickets.ticket_code IS 'User-facing short code, e.g. TKT-A3F9-2KXP. Used for QR codes and manual check-in.';
