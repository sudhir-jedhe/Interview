# Problem: Custom Error Hierarchy with Status Codes

**Goal:** Implement a base `AppError` class with subclasses `ValidationError` and `NotFoundError`, each carrying an HTTP-style status code — the standard shape for structured error handling in a Node API or any layered application.

## Implementation

```js
class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message, options); // supports { cause } passthrough
    this.name = this.constructor.name; // automatically matches the actual subclass name
    this.statusCode = statusCode;
    this.isOperational = true; // "expected" error vs. an unexpected programmer bug

    // V8-only: excludes the constructor call itself from the stack trace for cleaner logs
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ValidationError extends AppError {
  constructor(message, field, options = {}) {
    super(message, 400, options);
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource, options = {}) {
    super(`${resource} not found`, 404, options);
    this.resource = resource;
  }
}
```

Using `this.constructor.name` instead of hardcoding a string means every subclass automatically gets the correct `name` without needing to repeat `this.name = "..."` in each constructor — including any *further* subclasses added later.

## Usage

```js
function getUser(id) {
  if (typeof id !== "string") {
    throw new ValidationError("id must be a string", "id");
  }
  const user = db.find(id);
  if (!user) {
    throw new NotFoundError("User");
  }
  return user;
}

function handleRequest(req, res) {
  try {
    const user = getUser(req.params.id);
    res.json(user);
  } catch (err) {
    if (err instanceof AppError) {
      // known, "operational" error — safe to expose message + status to the client
      res.status(err.statusCode).json({ error: err.message, field: err.field });
    } else {
      // unexpected programmer error — don't leak internals, log it instead
      console.error("Unexpected error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
```

## Key implementation details interviewers probe for

- **`instanceof AppError` as the branch point**: any current or future subclass (`ValidationError`, `NotFoundError`, or one added later) is automatically caught by a single `instanceof AppError` check, so the request handler doesn't need to know about every subclass individually.
- **`isOperational` flag**: distinguishes "expected" errors (bad input, missing resource — safe to show a friendly message) from genuine bugs (a `TypeError` from a coding mistake) — a common production pattern for deciding whether to keep the process alive or crash/restart (see `problems/03-global-unhandled-rejection-uncaught-exception-handlers.md`).
- **`Error.captureStackTrace`**: a V8-specific optimization that excludes the `AppError` constructor's own frame from the stack trace, so the trace points at where the error was actually thrown from, not at the base class internals. It's guarded with a feature check since it doesn't exist on all engines.
- **Passing `options` through to `super()`**: preserves support for `{ cause }` chaining (see the theory file on custom error subclasses) without every subclass needing to redeclare it.
