// routes/protected.js — routes demonstrating authentication-only vs
// authentication + role-based authorization.

const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/requireAuth');
const db = require('../db');

// any authenticated user can view their own profile
router.get('/me', requireAuth, (req, res) => {
  const user = db.findById(req.user.id);
  res.json({ data: { id: user.id, email: user.email, role: user.role } });
});

// only 'admin' role can list all users
router.get('/admin/users', requireAuth, requireRole('admin'), (req, res) => {
  const all = db.list().map((u) => ({ id: u.id, email: u.email, role: u.role })); // never expose passwordHash
  res.json({ data: all });
});

module.exports = router;
