// routes/todos.js — the actual REST endpoints for the todo resource.
// Every response uses the same { data, meta } / { error } envelope, every
// error is a typed ApiError forwarded via next(), and every async handler
// is wrapped so rejections reach the centralized error middleware.

const express = require('express');
const router = express.Router();

const db = require('../db');
const asyncHandler = require('../middleware/asyncHandler');
const { validateBody } = require('../middleware/validate');
const { NotFoundError } = require('../errors');
const { createTodoSchema, replaceTodoSchema, patchTodoSchema } = require('../schemas/todoSchemas');

function ok(res, data, meta) {
  return res.json(meta ? { data, meta } : { data });
}

// GET /todos?done=true&after=<cursor>&limit=20 — cursor-paginated list, optional done filter
router.get('/todos', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const after = req.query.after ? Number(req.query.after) : 0;
  const done = req.query.done === undefined ? undefined : req.query.done === 'true';

  const { items, nextCursor, total } = db.list({ done, after, limit });
  ok(res, items, { nextCursor, limit, total });
});

// GET /todos/:id
router.get('/todos/:id', (req, res) => {
  const todo = db.findById(Number(req.params.id));
  if (!todo) throw new NotFoundError('Todo');
  ok(res, todo);
});

// POST /todos
router.post('/todos', validateBody(createTodoSchema), (req, res) => {
  const todo = db.create(req.body);
  res.status(201).json({ data: todo });
});

// PUT /todos/:id — full replace; client must send the entire resource
router.put('/todos/:id', validateBody(replaceTodoSchema), (req, res) => {
  const updated = db.replace(Number(req.params.id), req.body);
  if (!updated) throw new NotFoundError('Todo');
  ok(res, updated);
});

// PATCH /todos/:id — partial update; only sent fields change
router.patch('/todos/:id', validateBody(patchTodoSchema), (req, res) => {
  const updated = db.patch(Number(req.params.id), req.body);
  if (!updated) throw new NotFoundError('Todo');
  ok(res, updated);
});

// DELETE /todos/:id
router.delete('/todos/:id', (req, res) => {
  const existed = db.remove(Number(req.params.id));
  if (!existed) throw new NotFoundError('Todo');
  res.status(204).end();
});

// asyncHandler is exported/used here for illustration even though this
// route module happens to be fully synchronous — real handlers hitting an
// actual database would wrap their bodies the same way, e.g.:
//
// router.get('/todos/:id', asyncHandler(async (req, res) => {
//   const todo = await db.findById(req.params.id);
//   if (!todo) throw new NotFoundError('Todo');
//   ok(res, todo);
// }));
void asyncHandler;

module.exports = router;
