-- Migration: 000003_create_registrations
-- Description: Registration records — one per user per event, status lifecycle

CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'waitlisted');

CREATE TABLE registrations (
    id          UUID                NOT NULL DEFAULT gen_random_uuid(),
    event_id    UUID                NOT NULL REFERENCES events(id) ON DELETE RESTRICT,
    user_id     UUID                NOT NULL REFERENCES users(id)  ON DELETE RESTRICT,
    status      registration_status NOT NULL DEFAULT 'pending',
    quantity    SMALLINT            NOT NULL DEFAULT 1,
    notes       TEXT,
    registered_at TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    -- ─── Integrity Constraints ──────────────────────────────────────────────
    -- One confirmed/pending registration per user per event
    CONSTRAINT registrations_pkey PRIMARY KEY (id),
    CONSTRAINT registrations_quantity_positive CHECK (quantity > 0),
    CONSTRAINT registrations_quantity_max      CHECK (quantity <= 10)  -- max tickets per booking
);

-- ─── Unique Constraint ────────────────────────────────────────────────────────
-- A user can only have ONE active (non-cancelled) registration per event.
-- Cancelled registrations are kept for audit trail.
CREATE UNIQUE INDEX uidx_registrations_active_user_event
    ON registrations (user_id, event_id)
    WHERE status IN ('pending', 'confirmed', 'waitlisted');

-- ─── Indexes ──────────────────────────────────────────────────────────────────

-- User's "My Tickets" page
CREATE INDEX idx_registrations_user_id ON registrations (user_id, registered_at DESC);

-- Organizer attendee list per event
CREATE INDEX idx_registrations_event_id ON registrations (event_id, status);

-- ─── Triggers ─────────────────────────────────────────────────────────────────
CREATE TRIGGER trg_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE  registrations IS 'Booking records linking users to events';
COMMENT ON COLUMN registrations.status IS 'Lifecycle: pending → confirmed (on payment/free), cancelled, or waitlisted';
COMMENT ON INDEX  uidx_registrations_active_user_event IS 'Prevents duplicate active bookings. Cancelled records are retained for history.';
