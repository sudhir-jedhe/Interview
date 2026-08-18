# Centralized Error Middleware and Custom Error Classes

## Centralized error middleware

Express identifies error-handling middleware by arity — a function with exactly 4 parameters `(err, req, res, next)`:

```js
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err.stack);
  res.status(status).json({ error: { message: err.message } });
});
```
This must be registered **last**, after all routes, so `next(err)` calls anywhere upstream funnel into it.

## Custom error classes

A custom class lets you attach structured metadata — an HTTP status code, an application-specific error code, maybe a flag for whether the error is "operational" (expected, like invalid input) vs a programmer bug — so your centralized error middleware can map any thrown error to the correct response without string-matching messages. It also lets you build a small hierarchy that documents the API's failure modes in code.

```js
class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    Error.captureStackTrace(this, ApiError);
  }
}

class NotFoundError extends ApiError {
  constructor(resource) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

module.exports = { ApiError, NotFoundError };
```

## Centralized middleware vs per-route try/catch only

| Aspect | Centralized error middleware | Per-route try/catch with ad-hoc responses |
|---|---|---|
| Consistency | One place defines response shape/status-code mapping for all errors | Every route decides its own response format — easy to drift |
| Boilerplate | Routes just `next(err)` or throw (with asyncHandler) | Every route repeats status/JSON-shape logic |
| Extensibility | Easy to add logging, monitoring, or Sentry reporting in one place | Must be added to every route individually, easy to miss one |

Always use centralized error middleware as the single source of truth for turning an `Error` (or `ApiError` subclass) into an HTTP response; use per-route try/catch only to catch the error and forward it (`next(err)`) or to add route-specific recovery logic (e.g. falling back to a cache). The common mistake is putting `res.status(...).json(...)` directly in scattered catch blocks throughout the codebase instead of funneling everything through one handler.

## A gotcha: calling next() after already sending a response

If a handler sends a response and then still calls `next(err)`, the error middleware will attempt to send a second response, which throws `Cannot set headers after they are sent to the client`. The fix is to always `return` immediately after sending a response so no further code in the handler executes.
