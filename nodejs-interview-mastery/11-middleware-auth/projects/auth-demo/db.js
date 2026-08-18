// db.js — a tiny in-memory user store standing in for a real database.
// Passwords are NEVER stored in plaintext — only bcrypt hashes.

const users = new Map(); // id -> { id, email, passwordHash, role }
let nextId = 1;

function findByEmail(email) {
  return [...users.values()].find((u) => u.email === email) || null;
}

function findById(id) {
  return users.get(id) || null;
}

function create({ email, passwordHash, role = 'user' }) {
  const user = { id: nextId++, email, passwordHash, role };
  users.set(user.id, user);
  return user;
}

function list() {
  return [...users.values()];
}

module.exports = { findByEmail, findById, create, list };
