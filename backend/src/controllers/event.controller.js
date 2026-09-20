const { validate: isUuid } = require('uuid');
const { Err, OK } = require('../dto/dto');

class EventController {
  constructor(eventService) {
    this.eventService = eventService;
  }

  createEvent = async (req, res, next) => {
    try {
      if (!req.user || !req.user.userID) {
        return res.status(401).json(Err('authentication required'));
      }

      const { title, capacity, starts_at, start_time, ends_at, end_time } = req.body || {};
      if (!title || typeof title !== 'string' || title.length < 3) {
        return res.status(400).json(Err('title must be at least 3 characters'));
      }
      if (!capacity || typeof capacity !== 'number' || capacity < 1) {
        return res.status(400).json(Err('capacity must be at least 1'));
      }
      if (!starts_at && !start_time) {
        return res.status(400).json(Err('start time is required (use starts_at or start_time)'));
      }
      if (!ends_at && !end_time) {
        return res.status(400).json(Err('end time is required (use ends_at or end_time)'));
      }

      const event = await this.eventService.createEvent(req.user.userID, req.body);
      return res.status(201).json(OK(event));
    } catch (err) {
      next(err);
    }
  };

  getEvent = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id || !isUuid(id)) {
        return res.status(400).json(Err('invalid event id'));
      }

      const event = await this.eventService.getEvent(id);
      return res.status(200).json(OK(event));
    } catch (err) {
      next(err);
    }
  };

  listEvents = async (req, res, next) => {
    try {
      const statusStr = req.query.status || 'published';
      const search = req.query.q || '';

      const filter = {
        status: statusStr,
        search,
      };

      const events = await this.eventService.listEvents(filter);
      return res.status(200).json(OK(events));
    } catch (err) {
      next(err);
    }
  };

  publishEvent = async (req, res, next) => {
    try {
      if (!req.user || !req.user.userID) {
        return res.status(401).json(Err('authentication required'));
      }
      const { id } = req.params;
      if (!id || !isUuid(id)) {
        return res.status(400).json(Err('invalid event id'));
      }

      const event = await this.eventService.publishEvent(id, req.user.userID);
      return res.status(200).json(OK(event));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { EventController };