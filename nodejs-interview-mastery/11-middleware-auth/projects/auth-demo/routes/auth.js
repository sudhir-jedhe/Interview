// routes/auth.js — registration and login. Passwords are hashed with bcrypt
// before storage; login issues a short-lived JWT access token.

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const BCRYPT_COST_FACTOR = 12;

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { message: 'email and password are required' } });
    }
    if (db.findByEmail(email)) {
      return res.status(409).json({ error: { message: 'Email already registered' } });
    }

    // bcrypt automatically salts the hash — never store plaintext, never roll your own hashing
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST_FACTOR);
    const user = db.create({ email, passwordHash, role: 'user' });

    res.status(201).json({ data: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = db.findByEmail(email);

    // uniform failure response whether the user doesn't exist or the password
    // is wrong — never reveal which case occurred
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: { message: 'Invalid credentials' } });
    }

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m', algorithm: 'HS256' }
    );

    res.json({ data: { accessToken } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
