// db.js — a tiny in-memory data layer standing in for a real database.
// Swapping this module for one backed by Postgres/Mongo would not require
// changing any route code, since routes only ever call these functions.

const todos = new Map(); // id -> todo
let nextId = 1;

function list({ done, after = 0, limit = 20 } = {}) {
  let results = [...todos.values()].filter((t) => t.id > after);
  if (done !== undefined) results = results.filter((t) => t.done === done);
  results.sort((a, b) => a.id - b.id);
  const page = results.slice(0, limit);
  const nextCursor = page.length === limit ? page[page.length - 1].id : null;
  return { items: page, nextCursor, total: results.length };
}

function findById(id) {
  return todos.get(id) || null;
}

function create({ title, dueDate = null }) {
  const todo = {
    id: nextId++,
    title,
    done: false,
    dueDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  todos.set(todo.id, todo);
  return todo;
}

function replace(id, { title, done, dueDate = null }) {
  if (!todos.has(id)) return null;
  const updated = {
    id,
    title,
    done,
    dueDate,
    createdAt: todos.get(id).createdAt,
    updatedAt: new Date().toISOString(),
  };
  todos.set(id, updated);
  return updated;
}

function patch(id, changes) {
  const existing = todos.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...changes, id, updatedAt: new Date().toISOString() };
  todos.set(id, updated);
  return updated;
}

function remove(id) {
  return todos.delete(id);
}

module.exports = { list, findById, create, replace, patch, remove };
