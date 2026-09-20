const { v4: uuidv4 } = require('uuid');
const { generateTicketCode } = require('./ticket_code');

class RegistrationService {
  constructor(regRepo, ticketRepo) {
    this.regRepo = regRepo;
    this.ticketRepo = ticketRepo;
  }

  async bookEvent(eventID, userID, req) {
    const quantity = req && req.quantity && req.quantity > 0 ? req.quantity : 1;

    const maxRetries = 3;
    let reg = null;
    let lastErr = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        reg = await this.regRepo.bookSeat(eventID, userID, quantity);
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        // Postgres deadlock error code 40P01
        if (err.code === '40P01') {
          const backoff = attempt * 50;
          await new Promise((resolve) => setTimeout(resolve, backoff));
          continue;
        }
        throw err;
      }
    }

    if (lastErr || !reg) {
      throw lastErr || new Error(`booking failed after ${maxRetries} attempts`);
    }

    const tickets = [];
    for (let i = 0; i < quantity; i++) {
      const ticket = {
        id: uuidv4(),
        registration_id: reg.id,
        event_id: reg.event_id,
        user_id: reg.user_id,
        ticket_code: generateTicketCode(),
        is_checked_in: false,
        issued_at: new Date(),
      };
      try {
        const createdTicket = await this.ticketRepo.create(ticket);
        tickets.push(createdTicket);
      } catch (err) {
        console.warn(`WARNING: ticket generation failed for registration ${reg.id}:`, err);
      }
    }

    return {
      registration: reg,
      ticket: tickets.length > 0 ? tickets[0] : null,
    };
  }

  async getMyRegistrations(userID) {
    return this.regRepo.listByUser(userID);
  }

  async cancelRegistration(regID, userID) {
    return this.regRepo.cancel(regID, userID);
  }

  async getMyTickets(userID) {
    return this.ticketRepo.listByUser(userID);
  }

  async listRegistrationsForEvent(eventID) {
    return this.regRepo.listByEvent(eventID);
  }
}

module.exports = { RegistrationService };