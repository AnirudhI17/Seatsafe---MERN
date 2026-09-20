-- Rollback: 000002_create_events
DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
DROP TABLE   IF EXISTS events;
DROP TYPE    IF EXISTS event_status;
