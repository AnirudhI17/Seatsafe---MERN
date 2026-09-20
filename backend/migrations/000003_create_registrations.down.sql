-- Rollback: 000003_create_registrations
DROP TRIGGER IF EXISTS trg_registrations_updated_at ON registrations;
DROP TABLE   IF EXISTS registrations;
DROP TYPE    IF EXISTS registration_status;
