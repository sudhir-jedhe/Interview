# Interview Q&A: Express Error Handling

**Q: Why doesn't Express (v4) catch an error thrown inside an `async` route handler?**
Because `async` functions return a promise, and a `throw` inside one produces a *rejected* promise rather than a synchronous exception. Express 4's router only wraps handler invocation in a synchronous try/catch — it never attaches a `.catch()` to the promise your async handler returns, so a rejection just disappears and the request hangs with no response ever sent.

**Q: How do you fix the async-handler bug in Express 4?**
Either wrap the handler body in `try/catch` and call `next(err)` in the catch block, or use a generic wrapper utility (`asyncHandler`) that does `Promise.resolve(fn(req, res, next)).catch(next)` around every async handler. Express 5 solves this natively by automatically forwarding rejected handler promises to `next(err)`.

```js
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

**Q: What is centralized error-handling middleware in Express, and how does Express know it's an error handler?**
It's a middleware function registered last in the stack, after all routes, that Express identifies by its **arity** — exactly four parameters: `(err, req, res, next)`. Any route or middleware that calls `next(err)` (with a truthy first argument), or an async handler wrapped so its rejection reaches `next`, skips all remaining normal middleware and jumps straight to the first error-handling middleware in the chain.

**Q: What happens if you call `next()` twice, or call it after already sending a response?**
Calling `next()` a second time in the same request cycle can cause the request to be processed by more middleware than intended, potentially double-handling it, and if a handler sends a response and then still calls `next(err)`, the error middleware will attempt to send a second response, which throws `Cannot set headers after they are sent to the client`. The fix is to always `return` immediately after sending a response so no further code in the handler executes.
