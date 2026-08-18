# Error-Handling Middleware

Error-handling middleware is distinguished purely by **arity**: it must declare exactly 4 parameters, `(err, req, res, next)`. Express detects this arity via `fn.length` to decide whether a middleware is a normal handler or an error handler — this is not optional or stylistic, it's how Express's internal dispatch works.

```js
app.get('/risky', (req, res, next) => {
  try {
    doSomethingThatMightThrow();
    res.send('ok');
  } catch (err) {
    next(err); // passing an argument to next() skips all remaining normal middleware
  }
});

// Error handler — MUST be registered last, after all routes/middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

Calling `next(err)` (with any argument) tells Express to skip all remaining regular middleware and jump straight to the next **error-handling** middleware in the stack. This is why error handlers must be registered last — Express walks the stack in registration order, and an error handler registered before a route can't catch that route's errors.

Note: Express 4 does **not** automatically catch errors thrown inside `async` route handlers — an unhandled rejection there won't reach your error middleware unless you either wrap it in try/catch and call `next(err)` yourself, or use a helper like `express-async-errors`, or upgrade to Express 5, which does catch rejected promises from async handlers automatically. See `problems/02-catch-async-wrapper.md` for a worked implementation of this wrapper and the exact bug it fixes.

## Express 4 vs Express 5 async error handling

| Aspect | Express 4 | Express 5 |
|---|---|---|
| Rejected promise from async handler | NOT automatically caught — silently becomes an unhandled rejection unless you manually `.catch(next)` | Automatically caught and forwarded to error middleware |
| Migration effort | Requires a wrapper helper or `express-async-errors` package | Works out of the box |
| Sync throws | Caught automatically in both versions | Caught automatically in both versions |

If you're on Express 4 with heavy async/await route handlers, wrap them in an async-catching helper or install `express-async-errors`; if you're starting a new project, prefer Express 5 to avoid this whole class of silent failures. The common mistake is assuming Express 4 behaves like Express 5 and omitting `.catch(next)`, resulting in requests that hang or crash the process on rejected promises instead of hitting your error handler.
