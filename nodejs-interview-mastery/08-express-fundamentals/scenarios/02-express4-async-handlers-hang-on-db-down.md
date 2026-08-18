# Fixing Hanging Requests When Express 4 Async Handlers Reject

**Scenario:** Your Express 4 API has several `async` route handlers, and QA reports that when the database is down, requests just hang instead of returning a 500. What's happening and how do you fix it globally without touching every handler?

**Approach:** In Express 4, a rejected promise inside an `async` handler is not automatically forwarded to error middleware — it becomes an unhandled rejection that Express never sees, so the response is simply never sent. Fix it globally with a wrapping helper applied consistently, or by installing `express-async-errors` once at startup so all `async` handlers get automatic `.catch(next)` behavior.

```js
// Option A: one shared wrapper, apply to every async handler
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await db.users.findById(req.params.id); // rejection now reaches next()
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
}));

// Option B: patch Express globally, one line, no per-route changes
require('express-async-errors');
// now every async handler's rejection automatically calls next(err)

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

`express-async-errors` is the pragmatic fix for existing large codebases; the manual wrapper is better for new code where you want explicitness without a monkey-patching dependency. See `problems/02-catch-async-wrapper.md` for a deeper look at this exact wrapper, including the specific bug it fixes.
