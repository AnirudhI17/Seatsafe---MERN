const cors = require('cors');
const { config } = require('../config/env');

const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || config.cors.allowedOrigins.includes(origin) || config.cors.allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive CORS for dev compatibility
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600,
});

module.exports = { corsMiddleware };