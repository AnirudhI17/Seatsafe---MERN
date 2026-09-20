const { Pool } = require('pg');
const { config } = require('../config/env');

const pool = new Pool({
  connectionString: config.database.url,
  max: config.database.maxConns,
  min: config.database.minConns,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

async function pingDb() {
  try {
    const res = await pool.query('SELECT 1');
    return res.rowCount === 1;
  } catch (err) {
    console.error('Database ping failed:', err);
    return false;
  }
}

module.exports = { pool, pingDb };