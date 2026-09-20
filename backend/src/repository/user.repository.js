const { DuplicateEmailError, NotFoundError } = require('./errors');

class UserRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(user) {
    const query = `
      INSERT INTO users (id, email, password_hash, full_name, role, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING created_at, updated_at`;

    try {
      const res = await this.pool.query(query, [
        user.id,
        user.email,
        user.password_hash,
        user.full_name,
        user.role,
        user.email_verified,
      ]);
      user.created_at = res.rows[0].created_at;
      user.updated_at = res.rows[0].updated_at;
      return user;
    } catch (err) {
      if (err.code === '23505') {
        throw new DuplicateEmailError();
      }
      throw err;
    }
  }

  async getById(id) {
    const query = `
      SELECT id, email, password_hash, full_name, role, email_verified, created_at, updated_at
      FROM users WHERE id = $1`;

    const res = await this.pool.query(query, [id]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }
    return res.rows[0];
  }

  async getByEmail(email) {
    const query = `
      SELECT id, email, password_hash, full_name, role, email_verified, created_at, updated_at
      FROM users WHERE email = $1`;

    const res = await this.pool.query(query, [email]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }
    return res.rows[0];
  }

  async update(user) {
    const query = `
      UPDATE users SET full_name = $2, email_verified = $3
      WHERE id = $1
      RETURNING updated_at`;

    const res = await this.pool.query(query, [user.id, user.full_name, user.email_verified]);
    if (res.rowCount === 0) {
      throw new NotFoundError();
    }
    user.updated_at = res.rows[0].updated_at;
    return user;
  }
}

module.exports = { UserRepository };