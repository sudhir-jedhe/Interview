# Interview Q&A: Process-Level Safety Nets and Custom Error Classes

**Q: What's the difference between `process.on('unhandledRejection')` and `process.on('uncaughtException')`?**
`unhandledRejection` fires when a promise rejects and nothing ever attached a `.catch`/awaited it in a try/catch. `uncaughtException` fires when a synchronous error is thrown and propagates all the way up without being caught anywhere in the call stack. Both are last-resort process-level events, not a substitute for handling errors locally.

**Q: Why shouldn't you try to keep the process running after an `uncaughtException`?**
Once an exception escapes its intended handling scope, the process may be in an inconsistent state — in-flight I/O, timers, or shared in-memory state could be partially mutated or corrupted in ways you can't fully reason about. The Node.js documentation explicitly recommends logging the error, performing synchronous cleanup, and exiting — letting a process manager (PM2, systemd, Kubernetes) spin up a fresh, known-good process rather than continuing to serve requests from a potentially broken one.

**Q: Why would you create a custom error class like `ApiError` instead of throwing plain `Error` objects?**
A custom class lets you attach structured metadata — an HTTP status code, an application-specific error code, maybe a flag for whether the error is "operational" (expected, like invalid input) vs a programmer bug — so your centralized error middleware can map any thrown error to the correct response without string-matching messages. It also lets you build a small hierarchy (`NotFoundError`, `ValidationError`, `UnauthorizedError`) that documents the API's failure modes in code.

```js
class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
```

**Q: If a `finally` block itself throws, what happens to the original error?**
The error thrown inside `finally` overwrites/replaces the original error that was propagating — the original is lost entirely unless you explicitly capture and rethrow it yourself. This is a real footgun in cleanup code (e.g., closing a database connection in `finally`) that can mask the actual root-cause error with an unrelated cleanup failure.
