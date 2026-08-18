# Problem: Consistent Error-Response Formatting Middleware Across an API

## Problem statement

An API has grown organically and every route currently formats its own errors — some return `{ message }`, some `{ error }`, some a bare string, with inconsistent status codes for the same class of failure. Implement middleware that gives the whole API one consistent error response shape.

## Requirements

- One JSON envelope for every error: `{ error: { code, message, details? } }`
- A custom `ApiError` hierarchy so route code throws typed, meaningful errors instead of hand-building responses
- A single centralized error-handling middleware, registered last, that all errors funnel through
- Validation errors (400), auth errors (401/403), not-found errors (404), and unexpected errors (500) should all be handled by the same middleware, with 500s logged server-side but not leaking internals to the client
- Works for both synchronous throws and async route handlers (via `next(err)`)

## Worked solution

```js
// errors/ApiError.js
class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, ApiError);
  }
}

class ValidationError extends ApiError {
  constructor(message, details) { super(400, 'VALIDATION_ERROR', message, details); }
}
class UnauthorizedError extends ApiError {
  constructor(message = 'Not authenticated') { super(401, 'UNAUTHORIZED', message); }
}
class ForbiddenError extends ApiError {
  constructor(message = 'Insufficient permissions') { super(403, 'FORBIDDEN', message); }
}
class NotFoundError extends ApiError {
  constructor(resource = 'Resource') { super(404, 'NOT_FOUND', `${resource} not found`); }
}
class ConflictError extends ApiError {
  constructor(message) { super(409, 'CONFLICT', message); }
}

module.exports = { ApiError, ValidationError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError };
```

```js
// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  // ApiError instances carry their own status/code; anything else is an unexpected 500
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const isServerFault = status >= 500;

  if (isServerFault) {
    // never leak stack traces / internal messages to the client for 5xx
    console.error(`[${req.method} ${req.originalUrl}]`, err.stack || err);
  }

  res.status(status).json({
    error: {
      code,
      message: isServerFault ? 'Something went wrong' : err.message,
      ...(err.details ? { details: err.details } : {}),
    },
  });
}

module.exports = errorHandler;
```

```js
// middleware/asyncHandler.js — lets async route handlers' rejections reach errorHandler
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
module.exports = asyncHandler;
```

```js
// routes/users.js — routes throw typed errors, never build responses themselves
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { ValidationError, NotFoundError } = require('../errors/ApiError');
const db = require('../db');

router.post('/users', asyncHandler(async (req, res) => {
  if (!req.body.email) throw new ValidationError('email is required', { field: 'email' });
  const user = await db.users.create(req.body);
  res.status(201).json({ data: user });
}));

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await db.users.findById(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.json({ data: user });
}));

module.exports = router;
```

```js
// app.js
const express = require('express');
const app = express();
app.use(express.json());

app.use('/', require('./routes/users'));

// catch-all for unmatched routes, formatted the same way as every other error
app.use((req, res) => {
  res.status(404).json({ error: { code: 'ROUTE_NOT_FOUND', message: 'No such route' } });
});

// error middleware MUST be registered last
app.use(require('./middleware/errorHandler'));

app.listen(3000);
```

Every route either throws a typed `ApiError` subclass (synchronous handlers) or lets `asyncHandler` forward a rejection (async handlers) — neither ever calls `res.status().json()` for an error case directly, so the response shape can never drift between routes.
