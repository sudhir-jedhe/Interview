# mini-express-api

A small, genuinely runnable Express application demonstrating the core concepts from `../../theory/` and `../../problems/` in one cohesive project: a modular route structure with `express.Router()`, a request-timing logging middleware, a centralized error handler, and a `catchAsync` wrapper that fixes Express 4's async-handler error-catching gap.

## Features

- `express.Router()`-based route modules (`routes/health.js`, `routes/users.js`) instead of one giant `app.js`
- Custom request logging middleware (`middleware/logger.js`) that logs method, path, status, and duration — measured correctly via `res.on('finish', ...)`, not immediately after `next()`
- Centralized error handling (`middleware/errorHandler.js`) via a typed `HttpError` class and a single 4-argument error middleware, so every route gets consistent JSON error responses
- `catchAsync`, an async-route wrapper that forwards rejected promises to `next(err)` — the standard Express 4 fix for the fact that Express 4 does not automatically catch async handler rejections (see `../../problems/02-catch-async-wrapper.md` for the bug this fixes in isolation)
- A 404 fallback handler registered after all routes but before the error handler

## Project layout

```
mini-express-api/
  app.js                    # creates and wires up the Express app
  routes/
    health.js                # GET /health
    users.js                 # GET/POST /users, GET/DELETE /users/:id
  middleware/
    logger.js                # request timing/logging middleware
    errorHandler.js           # HttpError, catchAsync, notFoundHandler, errorHandler
  package.json
  README.md                  # this file
```

## Setup

```bash
npm install
```

## Running

```bash
npm start
# mini-express-api listening on http://localhost:3000
```

Or with auto-restart on file changes (Node 18.11+):

```bash
npm run dev
```

## API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check — returns `{ status, uptimeSeconds }` |
| GET | `/users` | List all users |
| GET | `/users/:id` | Fetch one user (404 if missing; try `/users/boom` to trigger a simulated DB failure caught by `catchAsync`) |
| POST | `/users` | Create a user — body `{ "name": "..." }`; returns `422` if `name` is missing/invalid |
| DELETE | `/users/:id` | Delete a user — `204` on success, `404` if missing |

### Example requests

```bash
curl http://localhost:3000/health

curl http://localhost:3000/users

curl http://localhost:3000/users/1

curl -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Margaret Hamilton"}'

curl -X DELETE http://localhost:3000/users/1

# Deliberately triggers a simulated async DB failure, caught by catchAsync
# and surfaced as a clean 500 JSON response instead of a hung request:
curl http://localhost:3000/users/boom
```

## Why this structure

This project intentionally mirrors how a real small Express service is organized: routes live in their own files under `routes/`, cross-cutting concerns (logging, error handling) live under `middleware/`, and `app.js` is just wiring — creating the app, registering middleware and routers in the correct order, and starting the server. The middleware registration order in `app.js` matters: the logger and body parser run first (so every request is timed and has a parsed body available), routers run next, and the 404 handler plus the error handler are registered last, since Express only walks the middleware stack forward.
