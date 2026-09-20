const crypto = require('crypto');

function generateTicketCode() {
  const bytes = crypto.randomBytes(4);
  const part1 = bytes.subarray(0, 2).toString('hex').toUpperCase();
  const part2 = bytes.subarray(2, 4).toString('hex').toUpperCase();
  return `TKT-${part1}-${part2}`;
}

module.exports = { generateTicketCode };