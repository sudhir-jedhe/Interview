# Snippet: Centralized Error-Handling Middleware (Must Be Registered Last)

```js
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err.stack);
  res.status(status).json({
    error: { message: err.message || 'Internal Server Error', code: err.code || 'INTERNAL_ERROR' },
  });
}

// app.use(errorHandler);  // register after all routes
module.exports = errorHandler;
```

**Explanation:** Express recognizes this as error-handling middleware purely by its **arity** — exactly four declared parameters. Any call to `next(err)` anywhere upstream (including from an `asyncHandler`-wrapped route) skips all remaining normal middleware and jumps straight here. Falling back to `err.status || 500` and `err.code || 'INTERNAL_ERROR'` means even a plain, un-typed `Error` thrown from deep inside a library still produces a well-formed response instead of crashing the handler itself.
