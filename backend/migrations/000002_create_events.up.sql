-- Migration: 000002_create_events
-- Description: Events table — core entity with strict capacity enforcement

CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');

CREATE TABLE events (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id      UUID         NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title             VARCHAR(255) NOT NULL,
    description       TEXT,
    location          VARCHAR(500),
    is_online         BOOLEAN      NOT NULL DEFAULT FALSE,
    online_url        VARCHAR(1000),
    starts_at         TIMESTAMPTZ  NOT NULL,
    ends_at           TIMESTAMPTZ  NOT NULL,
    capacity          INTEGER      NOT NULL,
    registered_count  INTEGER      NOT NULL DEFAULT 0,
    price_cents       INTEGER      NOT NULL DEFAULT 0,   -- 0 = free; stored in cents to avoid float precision
    currency          CHAR(3)      NOT NULL DEFAULT 'USD',
    banner_url        VARCHAR(1000),
    status            event_status NOT NULL DEFAULT 'draft',
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    -- ─── Integrity Constraints ─────────────────────────────────────────────
    CONSTRAINT events_capacity_positive       CHECK (capacity > 0),
    CONSTRAINT events_registered_non_negative CHECK (registered_count >= 0),

    -- CRITICAL: Database-level safety net against overbooking.
    -- Primary prevention is at the application layer via SELECT FOR UPDATE,
    -- but this constraint acts as the final hard stop.
    CONSTRAINT events_no_overbooking          CHECK (registered_count <= capacity),

    CONSTRAINT events_dates_valid             CHECK (ends_at > starts_at),
    CONSTRAINT events_price_non_negative      CHECK (price_cents >= 0),
    CONSTRAINT events_online_url_required     CHECK (
        (is_online = FALSE) OR (is_online = TRUE AND online_url IS NOT NULL)
    )
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

-- Browsing published events (homepage listing — most frequent query)
CREATE INDEX idx_events_status_starts_at
    ON events (status, starts_at)
    WHERE status = 'published';

-- Organizer dashboard — fetch events by owner
CREATE INDEX idx_events_organizer_id ON events (organizer_id);

-- Availability filter: events that still have seats
CREATE INDEX idx_events_available
    ON events (starts_at)
    WHERE status = 'published' AND registered_count < capacity;

-- Full-text search on title + description
CREATE INDEX idx_events_fts
    ON events USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ─── Triggers ─────────────────────────────────────────────────────────────────
CREATE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE  events                      IS 'Events created by organizers';
COMMENT ON COLUMN events.registered_count     IS 'Denormalized count — kept in sync by registration transactions using SELECT FOR UPDATE';
COMMENT ON COLUMN events.price_cents          IS 'Ticket price in smallest currency unit (cents). 0 = free event.';
COMMENT ON CONSTRAINT events_no_overbooking
    ON events                                 IS 'Hard DB-level cap — application layer uses SELECT FOR UPDATE as primary guard';
