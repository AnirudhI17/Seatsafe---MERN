const { Err } = require('../dto/dto');
const {
  AlreadyRegisteredError,
  DuplicateEmailError,
  EventCancelledError,
  EventFullError,
  EventNotPublishedError,
  NotFoundError,
  UnauthorisedError,
} = require('../repository/errors');

function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // Domain Sentinel Errors
  if (err instanceof NotFoundError) {
    return res.status(404).json(Err(err.message || 'resource not found'));
  }
  if (err instanceof EventFullError) {
    return res.status(409).json(Err('event is fully booked'));
  }
  if (err instanceof AlreadyRegisteredError) {
    return res.status(409).json(Err('you are already registered for this event'));
  }
  if (err instanceof EventNotPublishedError) {
    return res.status(422).json(Err('event is not open for registration'));
  }
  if (err instanceof UnauthorisedError) {
    return res.status(403).json(Err(err.message || 'not authorised to perform this action'));
  }
  if (err instanceof DuplicateEmailError) {
    return res.status(409).json(Err('email address is already registered'));
  }
  if (err instanceof EventCancelledError) {
    return res.status(422).json(Err('event has been cancelled'));
  }

  // PostgreSQL Error Codes
  if (err && err.code) {
    if (err.code === '40P01') {
      return res.status(503).json(Err('please try again'));
    }
    if (err.code === '23514') {
      return res.status(409).json(Err('booking capacity exceeded'));
    }
  }

  console.error('Unhandled Server Error:', err);
  return res.status(500).json(Err(err.message || 'an internal error occurred'));
}

module.exports = { errorMiddleware };