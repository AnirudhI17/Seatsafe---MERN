const { NotFoundError } = require('./errors');

class EventRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(event) {
    const query = `
      INSERT INTO events
        (id, organizer_id, title, description, location, is_online, online_url,
         starts_at, ends_at, capacity, price_cents, currency, banner_url, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING registered_count, created_at, updated_at`;

    const res = await this.pool.query(query, [
      event.id,
      event.organizer_id,
      event.title,
      event.description,
      event.location,
      event.is_online,
      event.online_url || null,
      event.starts_at,
      event.ends_at,
      event.capacity,
      event.price_cents,
      event.currency,
      event.banner_url || null,
      event.status,
    ]);

    event.registered_count = res.rows[0].registered_count;
    event.created_at = res.rows[0].created_at;
    event.updated_at = res.rows[0].updated_at;
    return event;
  }

  async getById(id) {
    const query = `
      SELECT id, organizer_id, title, COALESCE(description, '') as description, location, is_online, COALESCE(online_url, '') as online_url,
             starts_at, ends_at, capacity, registered_count, price_cents, currency,
             COALESCE(banner_url, '') as banner_url, status, created_at, updated_at
      FROM events WHERE id = $1`;

    const res = await this.pool.query(query, [id]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }
    return res.rows[0];
  }

  async list(filter = {}) {
    const clauses = ['1=1'];
    const args = [];
    let argIdx = 1;

    if (filter.status) {
      clauses.push(`status = $${argIdx}`);
      args.push(filter.status);
      argIdx++;
    }

    if (filter.search) {
      clauses.push(
        `to_tsvector('english', title || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', $${argIdx})`
      );
      args.push(filter.search);
      argIdx++;
    }

    const pageSize = filter.pageSize || 20;
    const page = filter.page || 0;
    const offset = page * pageSize;

    args.push(pageSize, offset);

    const query = `
      SELECT id, organizer_id, title, COALESCE(description, '') as description, location, is_online, COALESCE(online_url, '') as online_url,
             starts_at, ends_at, capacity, registered_count, price_cents, currency,
             COALESCE(banner_url, '') as banner_url, status, created_at, updated_at
      FROM events
      WHERE ${clauses.join(' AND ')}
      ORDER BY starts_at ASC
      LIMIT $${argIdx} OFFSET $${argIdx + 1}`;

    const res = await this.pool.query(query, args);
    return res.rows;
  }

  async update(event) {
    const query = `
      UPDATE events
      SET title=$2, description=$3, location=$4, is_online=$5, online_url=$6,
          starts_at=$7, ends_at=$8, capacity=$9, banner_url=$10, status=$11
      WHERE id=$1
      RETURNING updated_at`;

    const res = await this.pool.query(query, [
      event.id,
      event.title,
      event.description,
      event.location,
      event.is_online,
      event.online_url || null,
      event.starts_at,
      event.ends_at,
      event.capacity,
      event.banner_url || null,
      event.status,
    ]);

    if (res.rowCount === 0) {
      throw new NotFoundError();
    }
    event.updated_at = res.rows[0].updated_at;
    return event;
  }

  async delete(id) {
    const res = await this.pool.query('DELETE FROM events WHERE id = $1', [id]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }
  }
}

module.exports = { EventRepository };