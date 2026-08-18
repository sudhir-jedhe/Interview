# Centralizing Consistent 422 Validation Error Responses

**Scenario:** You need to validate and sanitize the request body for a `POST /orders` endpoint, and want validation errors to produce a consistent `422` JSON response across the whole API, not just this one route. How do you design this?

**Approach:** Write validation as its own middleware (or middleware-generating function) that calls `next(err)` with a typed error on failure, and centralize the formatting of that error type in the app's single error-handling middleware, so every route that uses the validator gets consistent output for free.

```js
const express = require('express');

class ValidationError extends Error {
  constructor(details) {
    super('Validation failed');
    this.statusCode = 422;
    this.details = details;
  }
}

function validateOrder(req, res, next) {
  const errors = [];
  if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
    errors.push('items must be a non-empty array');
  }
  if (!req.body.customerId) {
    errors.push('customerId is required');
  }
  if (errors.length) return next(new ValidationError(errors));
  next();
}

const app = express();
app.use(express.json());

app.post('/orders', validateOrder, (req, res) => {
  res.status(201).json({ id: 'order-1', ...req.body });
});

// Centralized error formatting — every validation error across the API looks the same
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({ error: err.message, details: err.details });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000);
```

Because `validateOrder` is just middleware, it's reusable across any route that needs the same shape validated, and the error format stays consistent since it's produced in exactly one place.
