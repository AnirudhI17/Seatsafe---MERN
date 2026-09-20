const { Router } = require('express');
const { pool } = require('../database/db');
const { UserRepository } = require('../repository/user.repository');
const { EventRepository } = require('../repository/event.repository');
const { RegistrationRepository } = require('../repository/registration.repository');
const { TicketRepository } = require('../repository/ticket.repository');
const { UserService } = require('../services/user.service');
const { EventService } = require('../services/event.service');
const { RegistrationService } = require('../services/registration.service');
const { AuthController } = require('../controllers/auth.controller');
const { EventController } = require('../controllers/event.controller');
const { RegistrationController } = require('../controllers/registration.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/rbac.middleware');

// Dependency Injection
const userRepo = new UserRepository(pool);
const eventRepo = new EventRepository(pool);
const regRepo = new RegistrationRepository(pool);
const ticketRepo = new TicketRepository(pool);

const userService = new UserService(userRepo);
const eventService = new EventService(eventRepo);
const regService = new RegistrationService(regRepo, ticketRepo);

const authCtrl = new AuthController(userService);
const eventCtrl = new EventController(eventService);
const regCtrl = new RegistrationController(regService);

function createRouter() {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'ticketing-api',
      version: '1.0.0',
    });
  });

  // API v1 router group
  const v1 = Router();

  // Public Auth
  v1.post('/auth/register', authCtrl.register);
  v1.post('/auth/login', authCtrl.login);

  // Public Events
  v1.get('/events', eventCtrl.listEvents);
  v1.get('/events/:id', eventCtrl.getEvent);

  // Protected Routes
  v1.get('/auth/me', authMiddleware, authCtrl.profile);

  // Protected Organizer / Admin Routes
  const organizerRoles = requireRole('organizer', 'admin');
  v1.post('/events', authMiddleware, organizerRoles, eventCtrl.createEvent);
  v1.patch('/events/:id/publish', authMiddleware, organizerRoles, eventCtrl.publishEvent);
  v1.get('/events/:id/registrations', authMiddleware, organizerRoles, regCtrl.listEventRegistrations);

  // Protected User Routes (Attendee / Organizer / Admin)
  v1.post('/events/:id/register', authMiddleware, regCtrl.bookEvent);
  v1.get('/registrations/me', authMiddleware, regCtrl.myRegistrations);
  v1.delete('/registrations/:id', authMiddleware, regCtrl.cancelRegistration);
  v1.get('/tickets/me', authMiddleware, regCtrl.myTickets);

  router.use('/api/v1', v1);

  return router;
}

module.exports = { createRouter };