# Interview Questions: Error Handling

**Q: Does `finally` always run?**
Yes, with very few exceptions — it runs whether the `try` block completes normally, throws, or hits a `return`/`break`/`continue`. It only fails to run if the process itself terminates (e.g., `process.exit()`, browser tab closes, or the machine loses power) or if the `try` block never finishes (infinite loop, unresolvable await with no timeout).

**Q: If both `try` and `finally` contain a `return`, which value wins?**
The `finally` block's `return` wins, and it discards whatever value or exception was pending from `try`/`catch`. This is considered a code smell — putting a `return` inside `finally` is almost always a bug, since it silently suppresses errors.

**Q: Why doesn't `try/catch` catch an error thrown inside a `setTimeout` callback?**
Because the callback executes on a separate turn of the event loop, after the synchronous `try/catch` block has already finished running and been popped off the call stack. `catch` can only intercept exceptions thrown while control is still inside the corresponding `try` block's execution context.

**Q: How do custom Error subclasses work, and what do you need to remember when creating one?**
You `extend Error` and call `super(message)` to inherit `message` and `stack`. You should explicitly set `this.name` to the subclass name, since it isn't derived automatically from the class name. Additional context (like a field name or status code) can be added as extra properties on `this`.

```js
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}
```

**Q: What's the difference between an uncaught exception and an unhandled promise rejection?**
An uncaught exception is a synchronous `throw` that no `try/catch` intercepts, and it crashes the current execution (in Node, the process, unless a global handler intervenes). An unhandled promise rejection is a promise that settles as rejected with no `.catch()` (or second argument to `.then`) ever attached to it; it's detected asynchronously and reported separately (`unhandledrejection` event in browsers, `unhandledRejection` event in Node) rather than crashing the current stack immediately.

**Q: What does `window.onerror` catch, and what does `unhandledrejection` catch?**
`window.onerror` fires for uncaught synchronous runtime errors (and syntax errors in some cases), giving you the message, filename, line/column, and error object. `unhandledrejection` fires specifically for promises that reject with nobody handling them; it does not fire for synchronous throws. Both are global safety nets for logging/monitoring, not substitutes for local error handling.

**Q: How is error handling different in Node's `process.on('uncaughtException')`?**
It's the Node equivalent of `window.onerror` — a last-resort listener for synchronous exceptions that escaped all `try/catch` blocks. The Node docs explicitly recommend using it only to log and then gracefully shut down the process, because after an uncaught exception the application state may be corrupted; attempting to "resume" normal operation is unsafe.

**Q: What's the difference between fail-fast and graceful degradation, and when would you choose each?**
Fail-fast means throwing/crashing immediately when an invariant is violated, so bugs are caught early and loudly rather than silently corrupting data — appropriate for programmer errors, invalid configuration, or unrecoverable states. Graceful degradation means catching the error and falling back to a safe default so the user experience isn't blocked — appropriate for expected, recoverable failures like a flaky network call or an optional third-party widget failing to load.

**Q: Why is `throw "some string"` discouraged compared to `throw new Error("some string")`?**
A thrown string has no `.stack` trace, can't be reliably distinguished from other thrown values with `instanceof`, and isn't handled well by tooling (debuggers, error-reporting services) that assume `Error` objects. `Error` instances carry a stack trace and support type checks via `instanceof`, both essential for debugging and structured error handling.

**Q: How would you make sure a chain of `.then()` calls doesn't produce unhandled rejections?**
Attach a `.catch()` at the end of the chain (or use `try/catch` with `await`), since a rejection in any `.then()` in the chain propagates forward to the next `.catch()` handler, skipping intermediate `.then()`s. Forgetting the trailing `.catch()` — especially on a promise chain that's fired and not returned/awaited — is the most common source of unhandled rejections.

**Q: What does `Error.prototype.cause` do (the `{ cause }` option), and why use it?**
Introduced in ES2022, `new Error("msg", { cause: originalError })` lets you wrap a lower-level error while preserving a reference to the original via `err.cause`. This avoids losing the root cause when you rethrow a higher-level, more contextual error, which is useful for logging and debugging deep call chains.

**Q: Can you catch a `SyntaxError` from malformed JSON with `JSON.parse`?**
Yes — `JSON.parse` throws a synchronous `SyntaxError` on invalid input, which behaves like any other thrown error and is caught by a normal `try/catch` around the call.

```js
try {
  JSON.parse("{ invalid");
} catch (e) {
  console.log(e instanceof SyntaxError); // true
}
```
