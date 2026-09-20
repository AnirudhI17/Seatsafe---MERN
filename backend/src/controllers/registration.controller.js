const { validate: isUuid } = require('uuid');
const { Err, OK } = require('../dto/dto');

class RegistrationController {
  constructor(regService) {
    this.regService = regService;
  }

  bookEvent = async (req, res, next) => {
    try {
      if (!req.user || !req.user.userID) {
        return res.status(401).json(Err('authentication required'));
      }

      const { id } = req.params;
      if (!id || !isUuid(id)) {
        return res.status(400).json(Err('invalid event id'));
      }

      const result = await this.regService.bookEvent(id, req.user.userID, req.body || {});
      return res.status(201).json(OK(result));
    } catch (err) {
      next(err);
    }
  };

  myRegistrations = async (req, res, next) => {
    try {
      if (!req.user || !req.user.userID) {
        return res.status(401).json(Err('authentication required'));
      }

      const regs = await this.regService.getMyRegistrations(req.user.userID);
      return res.status(200).json(OK(regs));
    } catch (err) {
      next(err);
    }
  };

  myTickets = async (req, res, next) => {
    try {
      if (!req.user || !req.user.userID) {
        return res.status(401).json(Err('authentication required'));
      }

      const tickets = await this.regService.getMyTickets(req.user.userID);
      return res.status(200).json(OK(tickets));
    } catch (err) {
      next(err);
    }
  };

  cancelRegistration = async (req, res, next) => {
    try {
      if (!req.user || !req.user.userID) {
        return res.status(401).json(Err('authentication required'));
      }

      const { id } = req.params;
      if (!id || !isUuid(id)) {
        return res.status(400).json(Err('invalid registration id'));
      }

      await this.regService.cancelRegistration(id, req.user.userID);
      return res.status(200).json({ success: true, message: 'registration cancelled' });
    } catch (err) {
      next(err);
    }
  };

  listEventRegistrations = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id || !isUuid(id)) {
        return res.status(400).json(Err('invalid event id'));
      }

      const regs = await this.regService.listRegistrationsForEvent(id);
      return res.status(200).json(OK(regs));
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { RegistrationController };