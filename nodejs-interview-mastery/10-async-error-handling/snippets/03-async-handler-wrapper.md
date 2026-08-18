# Snippet: Reusable asyncHandler Wrapper to Catch Rejections in Express 4 Routes

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const express = require('express');
const app = express();

app.get('/orders/:id', asyncHandler(async (req, res) => {
  const order = await db.orders.findById(req.params.id);
  if (!order) throw new NotFoundError('Order'); // caught by asyncHandler, sent to error middleware
  res.json({ data: order });
}));
```

**Explanation:** `asyncHandler` wraps any route handler function so that whatever it returns is coerced into a promise via `Promise.resolve(...)`, then `.catch(next)` is attached — meaning any rejection (from an awaited call or a `throw` inside the async function) is automatically forwarded to Express's error-handling middleware via `next(err)`. This is the standard fix for the Express 4 async-handler bug, applied uniformly across every route without repeating try/catch boilerplate in each one.
