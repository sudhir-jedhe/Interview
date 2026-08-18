# Interview Q&A: Custom Error Types

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

**Q: Why is `throw "some string"` discouraged compared to `throw new Error("some string")`?**
A thrown string has no `.stack` trace, can't be reliably distinguished from other thrown values with `instanceof`, and isn't handled well by tooling (debuggers, error-reporting services) that assume `Error` objects. `Error` instances carry a stack trace and support type checks via `instanceof`, both essential for debugging and structured error handling.

**Q: What does `Error.prototype.cause` do (the `{ cause }` option), and why use it?**
Introduced in ES2022, `new Error("msg", { cause: originalError })` lets you wrap a lower-level error while preserving a reference to the original via `err.cause`. This avoids losing the root cause when you rethrow a higher-level, more contextual error, which is useful for logging and debugging deep call chains.
