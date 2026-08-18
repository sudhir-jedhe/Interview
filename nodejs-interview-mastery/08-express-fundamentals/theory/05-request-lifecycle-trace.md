# Request Lifecycle Trace

For `GET /api/users/42` hitting `app.use(logger) -> app.use(express.json()) -> app.use('/api', router) -> router.get('/users/:id', handler) -> errorHandler`:

1. `logger` runs, calls `next()`.
2. `express.json()` runs — since there's no body on a GET, it's a no-op but still calls `next()`.
3. Express matches the `/api` prefix, delegates to `router`, stripping `/api` from the path it sees.
4. `router` matches `GET /users/:id`, sets `req.params.id = '42'`, invokes the handler.
5. Handler sends `res.json(...)` — response is sent, the chain naturally terminates (no `next()` needed since a response was sent).
6. If the handler had called `next(err)` instead, steps would skip directly to `errorHandler`, bypassing anything else in between.

Tracing a request through the full middleware stack like this — step by step, noting which functions call `next()` versus send a response — is one of the most reliable ways to reason about (and debug) Express apps, and it's exactly the mental model interviewers are probing for when they ask "walk me through what happens when this request comes in."
