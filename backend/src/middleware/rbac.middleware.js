const { Err } = require('../dto/dto');

function requireRole(...roles) {
  const allowedMap = new Set(roles);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(Err('authentication required'));
    }

    if (!allowedMap.has(req.user.role)) {
      return res.status(403).json(Err('insufficient permissions'));
    }

    next();
  };
}

module.exports = { requireRole };