const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { config } = require('../config/env');
const { NotFoundError } = require('../repository/errors');

class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async register(req) {
    const role = req.role;
    if (role !== 'attendee' && role !== 'organizer' && role !== 'admin') {
      throw new Error(`invalid role: ${req.role}`);
    }

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(req.password, saltRounds);

    const user = {
      id: uuidv4(),
      email: req.email,
      password_hash: passwordHash,
      full_name: req.full_name,
      role,
      email_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await this.userRepo.create(user);
    return this.buildLoginResponse(user);
  }

  async login(req) {
    let user;
    try {
      user = await this.userRepo.getByEmail(req.email);
    } catch (err) {
      if (err instanceof NotFoundError) {
        throw new NotFoundError('invalid email or password');
      }
      throw err;
    }

    const matches = await bcrypt.compare(req.password, user.password_hash);
    if (!matches) {
      throw new NotFoundError('invalid email or password');
    }

    return this.buildLoginResponse(user);
  }

  async getProfile(userID) {
    return this.userRepo.getById(userID);
  }

  buildLoginResponse(user) {
    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    };
  }

  generateToken(user) {
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = nowSec + config.jwt.expiryMinutes * 60;

    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        iat: nowSec,
        exp: expSec,
      },
      config.jwt.secret
    );
  }
}

module.exports = { UserService };