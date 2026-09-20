const { NotFoundError } = require('./errors');

class TicketRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(t) {
    const query = `
      INSERT INTO tickets (id, registration_id, event_id, user_id, ticket_code, seat_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING issued_at`;

    const res = await this.pool.query(query, [
      t.id,
      t.registration_id,
      t.event_id,
      t.user_id,
      t.ticket_code,
      t.seat_number || null,
    ]);

    t.issued_at = res.rows[0].issued_at;
    return t;
  }

  async getByCode(code) {
    const query = `
      SELECT id, registration_id, event_id, user_id, ticket_code, seat_number,
             is_checked_in, checked_in_at, issued_at, expires_at
      FROM tickets WHERE ticket_code = $1`;

    const res = await this.pool.query(query, [code]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }
    return res.rows[0];
  }

  async listByUser(userID) {
    const query = `
      SELECT id, registration_id, event_id, user_id, ticket_code, seat_number,
             is_checked_in, checked_in_at, issued_at, expires_at
      FROM tickets WHERE user_id = $1 ORDER BY issued_at DESC`;

    const res = await this.pool.query(query, [userID]);
    return res.rows;
  }

  async checkIn(ticketCode) {
    const query = `
      UPDATE tickets
      SET is_checked_in = TRUE, checked_in_at = NOW()
      WHERE ticket_code = $1 AND is_checked_in = FALSE
      RETURNING id, registration_id, event_id, user_id, ticket_code, seat_number,
                is_checked_in, checked_in_at, issued_at, expires_at`;

    const res = await this.pool.query(query, [ticketCode]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }
    return res.rows[0];
  }
}

module.exports = { TicketRepository };