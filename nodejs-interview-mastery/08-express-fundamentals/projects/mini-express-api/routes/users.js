'use strict';

const express = require('express');
const { HttpError, catchAsync } = require('../middleware/errorHandler');

const router = express.Router();

// In-memory "database" for demonstration purposes only.
const users = new Map([
  ['1', { id: '1', name: 'Ada Lovelace' }],
  ['2', { id: '2', name: 'Grace Hopper' }],
]);

// Simulates an async data-layer call (e.g. a real DB query), including a
// deliberately flaky path used to demonstrate catchAsync below.
function findUserById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 'boom') {
        return reject(new Error('Simulated database failure'));
      }
      resolve(users.get(id) || null);
    }, 10);
  });
}

// GET /users — list all users.
router.get('/', (req, res) => {
  res.json({ users: [...users.values()] });
});

// GET /users/:id — fetch one user via an async data-layer call.
// Wrapped in catchAsync so a rejected findUserById() promise reaches the
// centralized error handler instead of hanging the request (see
// ../../problems/02-catch-async-wrapper.md for why this wrapper is needed
// on Express 4).
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const user = await findUserById(req.params.id);
    if (!user) {
      throw new HttpError(404, `User ${req.params.id} not found`);
    }
    res.json(user);
  })
);

// POST /users — create a user, with basic validation producing a 422 on
// bad input via the same centralized error-handling middleware.
router.post('/', (req, res, next) => {
  const { name } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new HttpError(422, 'name is required and must be a non-empty string'));
  }

  const id = String(users.size + 1);
  const user = { id, name: name.trim() };
  users.set(id, user);
  res.status(201).json(user);
});

// DELETE /users/:id — remove a user, 404 if it doesn't exist.
router.delete('/:id', (req, res) => {
  if (!users.has(req.params.id)) {
    return res.status(404).json({ error: `User ${req.params.id} not found` });
  }
  users.delete(req.params.id);
  res.status(204).end();
});

module.exports = router;
