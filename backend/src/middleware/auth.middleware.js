const jwt = require('jsonwebtoken');
const { config } = require('../config/env');
const { Err } = require('../dto/dto');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(Err('missing or invalid authorization header'));
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    if (!payload || !payload.sub) {
      return res.status(401).json(Err('invalid token subject'));
    }

    req.user = {
      userID: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (err) {
    return res.status(401).json(Err('invalid or expired token'));
  }
}

module.exports = { authMiddleware };