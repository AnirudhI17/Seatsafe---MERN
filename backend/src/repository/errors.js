class RepositoryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RepositoryError';
  }
}

class NotFoundError extends RepositoryError {
  constructor(message = 'record not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

class EventFullError extends RepositoryError {
  constructor(message = 'event is fully booked') {
    super(message);
    this.name = 'EventFullError';
  }
}

class AlreadyRegisteredError extends RepositoryError {
  constructor(message = 'already registered for this event') {
    super(message);
    this.name = 'AlreadyRegisteredError';
  }
}

class EventNotPublishedError extends RepositoryError {
  constructor(message = 'event is not available for registration') {
    super(message);
    this.name = 'EventNotPublishedError';
  }
}

class EventCancelledError extends RepositoryError {
  constructor(message = 'event has been cancelled') {
    super(message);
    this.name = 'EventCancelledError';
  }
}

class UnauthorisedError extends RepositoryError {
  constructor(message = 'not authorised to perform this action') {
    super(message);
    this.name = 'UnauthorisedError';
  }
}

class DuplicateEmailError extends RepositoryError {
  constructor(message = 'email address is already registered') {
    super(message);
    this.name = 'DuplicateEmailError';
  }
}

module.exports = {
  RepositoryError,
  NotFoundError,
  EventFullError,
  AlreadyRegisteredError,
  EventNotPublishedError,
  EventCancelledError,
  UnauthorisedError,
  DuplicateEmailError,
};