const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = process.env.APP_ENV || 'development';
const databaseUrl = process.env.DATABASE_URL || '';
const jwtSecret = process.env.JWT_SECRET || '';
const jwtExpiryMinutes = parseInt(process.env.JWT_EXPIRY_MINUTES || '60', 10);
const allowedOriginsStr = process.env.ALLOWED_ORIGINS || 'http://localhost:5173';

function validateConfig() {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is required');
  }
  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
  if (jwtExpiryMinutes < 15 || jwtExpiryMinutes > 60) {
    throw new Error('JWT_EXPIRY_MINUTES must be between 15 and 60');
  }
}

validateConfig();

const config = {
  app: {
    env,
  },
  server: {
    host: process.env.SERVER_HOST || '0.0.0.0',
    port: parseInt(process.env.SERVER_PORT || '8080', 10),
  },
  database: {
    url: databaseUrl,
    maxConns: parseInt(process.env.DB_MAX_CONNS || '20', 10),
    minConns: parseInt(process.env.DB_MIN_CONNS || '2', 10),
  },
  jwt: {
    secret: jwtSecret,
    expiryMinutes: jwtExpiryMinutes,
  },
  cors: {
    allowedOrigins: allowedOriginsStr.split(',').map((o) => o.trim()),
  },
  isProd: () => env === 'production',
};

module.exports = { config };