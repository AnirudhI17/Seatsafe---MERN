const { v4: uuidv4 } = require('uuid');
const { UnauthorisedError } = require('../repository/errors');

class EventService {
  constructor(eventRepo) {
    this.eventRepo = eventRepo;
  }

  async createEvent(organizerID, req) {
    let startsAt = req.starts_at ? new Date(req.starts_at) : undefined;
    let endsAt = req.ends_at ? new Date(req.ends_at) : undefined;
    let priceCents = req.price_cents !== undefined ? req.price_cents : 0;

    if (req.start_time && !startsAt) {
      startsAt = new Date(req.start_time);
    }
    if (req.end_time && !endsAt) {
      endsAt = new Date(req.end_time);
    }
    if (req.price && req.price > 0 && priceCents === 0) {
      priceCents = Math.round(req.price * 100);
    }

    if (!startsAt || isNaN(startsAt.getTime())) {
      throw new Error('start time is required (use starts_at or start_time)');
    }
    if (!endsAt || isNaN(endsAt.getTime())) {
      throw new Error('end time is required (use ends_at or end_time)');
    }

    const event = {
      id: uuidv4(),
      organizer_id: organizerID,
      title: req.title,
      description: req.description || '',
      location: req.location || '',
      is_online: req.is_online || false,
      online_url: req.online_url || '',
      starts_at: startsAt,
      ends_at: endsAt,
      capacity: req.capacity,
      registered_count: 0,
      price_cents: priceCents,
      currency: 'USD',
      banner_url: req.banner_url || '',
      status: 'published', // Auto-publish events
      created_at: new Date(),
      updated_at: new Date(),
    };

    return this.eventRepo.create(event);
  }

  async getEvent(id) {
    return this.eventRepo.getById(id);
  }

  async listEvents(filter) {
    return this.eventRepo.list(filter);
  }

  async publishEvent(id, organizerID) {
    const event = await this.eventRepo.getById(id);
    if (event.organizer_id !== organizerID) {
      throw new UnauthorisedError('not your event');
    }
    event.status = 'published';
    return this.eventRepo.update(event);
  }

  async updateEvent(id, organizerID, req) {
    const event = await this.eventRepo.getById(id);
    if (event.organizer_id !== organizerID) {
      throw new UnauthorisedError('not your event');
    }
    if (req.title) event.title = req.title;
    if (req.description !== undefined) event.description = req.description;
    if (req.capacity && req.capacity > 0) event.capacity = req.capacity;
    return this.eventRepo.update(event);
  }
}

module.exports = { EventService };