-- Migration: 000001_create_users
-- Description: Core users table with role-based access control

CREATE TYPE user_role AS ENUM ('attendee', 'organizer', 'admin');

CREATE TABLE users (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email          VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,           -- bcrypt hash
    full_name      VARCHAR(255) NOT NULL,
    role           user_role    NOT NULL DEFAULT 'attendee',
    email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Partial index: only unverified users — keeps verification lookups fast
CREATE INDEX idx_users_email_unverified ON users (email) WHERE email_verified = FALSE;

-- Trigger: auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE  users                  IS 'Platform users — attendees, organizers, and admins';
COMMENT ON COLUMN users.password_hash    IS 'bcrypt hash; cost factor >= 12 enforced at application layer';
COMMENT ON COLUMN users.role             IS 'RBAC role: attendee (default), organizer, admin';
