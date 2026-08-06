In Express 4, asynchronous route handlers that throw errors or return rejected Promises do not automatically pass those errors to Express's global error-handling middleware (`app.use((err, req, res, next) => ...)`). Instead, unhandled rejections will hang the request or crash the Node.js process unless explicitly wrapped in a `try...catch` block that calls `next(err)`.

An `asyncHandler` wrapper eliminates the need to write repetitive `try...catch` blocks across every route.

---

### 1. Creating the Custom `asyncHandler` Utility

Under the hood, an `asyncHandler` is a higher-order function that takes an `async` route handler, executes it, and attaches a `.catch(next)` to catch any rejected Promises automatically.

```javascript
// utils/asyncHandler.js

/**
 * Higher-order function that wraps async Express routes to handle errors automatically.
 * @param {Function} fn - The async route handler function (req, res, next)
 * @returns {Function} Express middleware handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

```

#### How it works

1. It returns an Express middleware signature `(req, res, next)`.
2. `Promise.resolve(fn(req, res, next))` invokes your `async` route handler and ensures its output is treated as a Promise.
3. `.catch(next)` catches any rejected Promise (or thrown exception) and forwards the error directly to Express's `next(err)` error pipeline.

---

### 2. Complete Express.js Server Setup & Usage

Here is how to use `asyncHandler` in an Express application alongside custom error handling:

```javascript
// app.js
const express = require('express');
const asyncHandler = require('./utils/asyncHandler');

const app = express();
app.use(express.json());

// -------------------------------------------------------------
// Custom Error Class for Application Errors
// -------------------------------------------------------------
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// -------------------------------------------------------------
// Express Routes wrapped with asyncHandler
// -------------------------------------------------------------

// Route 1: Simulating an async database fetch with a 404 error
app.get('/users/:id', asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Simulate async database query
  const user = await findUserInDatabase(id); 

  if (!user) {
    // Throwing an error inside an async route is caught by asyncHandler!
    throw new ApiError(404, `User with ID ${id} not found.`);
  }

  res.json({ success: true, user });
}));

// Route 2: Simulating an unexpected async failure (e.g., DB crash)
app.post('/users', asyncHandler(async (req, res) => {
  // If JSON parsing fails or DB connection dies, the rejected promise is caught!
  const newUser = await createUserInDatabase(req.body);
  res.status(201).json({ success: true, data: newUser });
}));

// Helper mocks
async function findUserInDatabase(id) {
  return id === '123' ? { id: '123', name: 'Alice' } : null;
}
async function createUserInDatabase(data) {
  if (!data.name) throw new Error('Database insertion failed: Name is required.');
  return { id: '124', name: data.name };
}

// -------------------------------------------------------------
// Global Express Error Handling Middleware
// -------------------------------------------------------------
// (Must be defined AFTER all routes and take 4 arguments)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.url} - ${message}`);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));

```

---

### Comparison: Code Reduction

#### Before (Without `asyncHandler`)

```javascript
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await findUserInDatabase(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    res.json(user);
  } catch (error) {
    next(error); // Manual boilerplace error forwarding
  }
});

```

#### After (With `asyncHandler`)

```javascript
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await findUserInDatabase(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(user);
}));

```

---

### Note on Express 5 vs. Express 4

* **Express 4 (Most widely used):** Requires `asyncHandler` (or the `express-async-errors` npm package) to automatically catch rejected promises.
* **Express 5+:** Native support for `async`/`await` is built directly into Express routes. Rejected promises are passed to `next(err)` automatically, making wrapper utilities optional in Express 5.
