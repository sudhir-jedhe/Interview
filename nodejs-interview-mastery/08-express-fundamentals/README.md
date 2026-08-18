# Express Fundamentals

Express is the de facto standard framework layered on top of Node's `http` module, and its middleware pipeline model — functions of `(req, res, next)` executed in registration order — is the single most important concept to internalize, since nearly every Express interview question circles back to it. This topic covers app structure, built-in vs third-party vs custom middleware, routing (including route params, query params, and `express.Router()`), and the special 4-argument error-handling middleware signature, tying it together with a worked trace of a request moving through a middleware stack.

## Structure

- **theory/** — Concept-by-concept notes: middleware fundamentals, middleware types, routing/params/Router, error-handling middleware, and a full request lifecycle trace.
- **snippets/** — One focused, runnable code example per file, each with its explanation.
- **output-based/** — "What does this log?" questions covering middleware chains, params, static-file precedence, and error-handler arity.
- **scenarios/** — Real-world engineering scenarios (scoped admin auth, async-handler hangs, centralized validation errors, request-duration logging) with a worked approach.
- **interview-qa/** — Q&A pairs grouped into middleware fundamentals, routing/structure, and error handling.
- **problems/** — Hands-on implementation problems (a minimal Express-like router, a catchAsync wrapper with the bug it fixes, a request-logging middleware) with full worked solutions.
- **projects/mini-express-api/** — A real, runnable multi-file Express app: routers, custom logging/error-handling middleware, and the catchAsync pattern, wired together the way a small real service would be.
- **assets/** — Placeholder for original images/PDFs; see `assets/README.md`.

## What's covered

- Express app structure and the middleware concept
- Built-in middleware (`express.json`, `express.static`) vs third-party (cors, helmet) vs custom
- Routing: `app.get/post/put/delete`, route params, query params, `express.Router()`
- Error-handling middleware: the 4-arg signature and why registration order matters
- Full request lifecycle trace through a stack of middleware
- Hands-on: a from-scratch Express-like router, a catchAsync wrapper, a request-duration logger, and a full runnable multi-file Express project

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
