const { validate: isUuid } = require('uuid');
const { Err, OK } = require('../dto/dto');

class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  register = async (req, res, next) => {
    try {
      const { email, password, full_name, role } = req.body || {};
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json(Err('invalid email format'));
      }
      if (!password || typeof password !== 'string' || password.length < 8) {
        return res.status(400).json(Err('password must be at least 8 characters'));
      }
      if (!full_name || typeof full_name !== 'string' || full_name.length < 2) {
        return res.status(400).json(Err('full_name must be at least 2 characters'));
      }
      const userRole = role || 'attendee';
      if (!['attendee', 'organizer', 'admin'].includes(userRole)) {
        return res.status(400).json(Err('role must be one of attendee, organizer, admin'));
      }

      const result = await this.userService.register({ email, password, full_name, role: userRole });
      return res.status(201).json(OK(result));
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json(Err('email and password are required'));
      }

      const result = await this.userService.login({ email, password });
      return res.status(200).json(OK(result));
    } catch (err) {
      next(err);
    }
  };

  profile = async (req, res, next) => {
    try {
      if (!req.user || !req.user.userID) {
        return res.status(401).json(Err('not authenticated'));
      }

      const user = await this.userService.getProfile(req.user.userID);
      return res.status(200).json(
        OK({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        })
      );
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { AuthController };