# Interview Q&A — Error Handling

**Q: How does Express distinguish error-handling middleware from regular middleware?**
Purely by function arity — Express checks `fn.length`. A middleware declared with exactly 4 parameters, `(err, req, res, next)`, is treated as an error handler and only invoked when `next(err)` is called somewhere upstream. A function with 3 or fewer parameters is treated as regular middleware, regardless of what it's named or intended to do.

**Q: Why must error-handling middleware be registered last?**
Express walks the middleware stack in registration order. When `next(err)` is called, Express skips forward through the stack looking for the next error-handling (4-arg) middleware, ignoring regular middleware along the way. If an error handler is registered before a given route, it can never catch errors from routes registered after it, since Express only ever moves forward through the stack, never backward.

**Q: Does Express 4 automatically catch errors thrown inside async route handlers?**
No — this is a common trap. Express 4 only automatically catches synchronous throws within a request handler. If an `async` handler's returned promise rejects, that rejection is not automatically routed to `next(err)`; you need to manually `.catch(next)` or use a wrapper/`express-async-errors`. Express 5 fixes this by automatically forwarding rejected promises from handlers to the error middleware.

**Q: What's the purpose of calling `next(err)` versus just throwing inside an Express route handler?**
For synchronous code, throwing is automatically caught by Express and routed to error middleware, so `next(err)` and `throw err` are functionally equivalent there. But inside callbacks, promises, or any code that escapes the current synchronous call stack (setTimeout, async handlers pre-Express-5, database callbacks), a `throw` will not be caught by Express — you must explicitly call `next(err)` to forward the error correctly.
