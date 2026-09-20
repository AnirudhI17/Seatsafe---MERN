const { v4: uuidv4 } = require('uuid');
const {
  AlreadyRegisteredError,
  EventFullError,
  EventNotPublishedError,
  NotFoundError,
} = require('./errors');

class RegistrationRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async bookSeat(eventID, userID, quantity) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Step 1: Lock the event row with SELECT FOR UPDATE
      const lockQuery = `
        SELECT capacity, registered_count, status
        FROM events
        WHERE id = $1
        FOR UPDATE`;

      const lockRes = await client.query(lockQuery, [eventID]);
      if (lockRes.rowCount === 0) {
        await client.query('ROLLBACK');
        throw new NotFoundError('event not found');
      }

      const { capacity, registered_count, status } = lockRes.rows[0];

      // Step 2: Check status & capacity
      if (status !== 'published') {
        await client.query('ROLLBACK');
        throw new EventNotPublishedError();
      }

      if (registered_count + quantity > capacity) {
        await client.query('ROLLBACK');
        throw new EventFullError();
      }

      // Step 3: Check duplicate active registration
      const dupQuery = `
        SELECT id FROM registrations
        WHERE user_id = $1 AND event_id = $2
          AND status IN ('pending','confirmed','waitlisted')
        LIMIT 1`;

      const dupRes = await client.query(dupQuery, [userID, eventID]);
      if (dupRes.rowCount > 0) {
        await client.query('ROLLBACK');
        throw new AlreadyRegisteredError();
      }

      // Step 4: Insert registration
      const regId = uuidv4();
      const insertQuery = `
        INSERT INTO registrations (id, event_id, user_id, status, quantity)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING registered_at, updated_at`;

      const insertRes = await client.query(insertQuery, [regId, eventID, userID, 'confirmed', quantity]);

      // Step 5: Increment registered_count
      const updateQuery = `
        UPDATE events
        SET registered_count = registered_count + $2
        WHERE id = $1`;

      await client.query(updateQuery, [eventID, quantity]);

      await client.query('COMMIT');

      return {
        id: regId,
        event_id: eventID,
        user_id: userID,
        status: 'confirmed',
        quantity,
        registered_at: insertRes.rows[0].registered_at,
        updated_at: insertRes.rows[0].updated_at,
      };
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      if (err.code === '23505') {
        throw new AlreadyRegisteredError();
      }
      throw err;
    } finally {
      client.release();
    }
  }

  async getById(id) {
    const query = `
      SELECT id, event_id, user_id, status, quantity, COALESCE(notes, '') as notes, registered_at, updated_at
      FROM registrations WHERE id = $1`;

    const res = await this.pool.query(query, [id]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }
    return res.rows[0];
  }

  async listByUser(userID) {
    const query = `
      SELECT id, event_id, user_id, status, quantity, COALESCE(notes, '') as notes, registered_at, updated_at
      FROM registrations WHERE user_id = $1 ORDER BY registered_at DESC`;

    const res = await this.pool.query(query, [userID]);
    return res.rows;
  }

  async listByEvent(eventID) {
    const query = `
      SELECT id, event_id, user_id, status, quantity, COALESCE(notes, '') as notes, registered_at, updated_at
      FROM registrations WHERE event_id = $1 ORDER BY registered_at DESC`;

    const res = await this.pool.query(query, [eventID]);
    return res.rows;
  }

  async cancel(id, userID) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const checkQuery = `SELECT event_id, quantity, status FROM registrations WHERE id = $1 AND user_id = $2 FOR UPDATE`;
      const res = await client.query(checkQuery, [id, userID]);
      if (res.rowCount === 0) {
        await client.query('ROLLBACK');
        throw new NotFoundError();
      }

      const { event_id, quantity, status } = res.rows[0];
      if (status === 'cancelled') {
        await client.query('COMMIT');
        return;
      }

      await client.query(`UPDATE registrations SET status = 'cancelled' WHERE id = $1`, [id]);
      await client.query(`UPDATE events SET registered_count = registered_count - $2 WHERE id = $1`, [event_id, quantity]);

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = { RegistrationRepository };