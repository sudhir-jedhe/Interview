# Routing: Params, Query, and Router

```js
const express = require('express');
const router = express.Router();

// Route params — captured from the URL path itself
router.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id }); // /users/42 -> { id: "42" }
});

// Query params — from the ?key=value portion of the URL
router.get('/search', (req, res) => {
  res.json({ q: req.query.q }); // /search?q=node -> { q: "node" }
});

const app = express();
app.use('/api', router); // mounted with a prefix: /api/users/:id, /api/search
```

`express.Router()` creates a mini standalone app-like object with its own middleware/routing, meant to be mounted onto a parent app (or another router) with `app.use(prefix, router)`. This is how large apps stay organized — each resource (users, orders, auth) gets its own router file. Router-level middleware (`router.use(fn)`) only applies to routes on that router, not globally.

Route params are always strings, never auto-coerced to numbers — a classic gotcha (`req.params.id === '42'`, not `42`).

## Router-level middleware vs application-level middleware

| Aspect | router.use(fn) | app.use(fn) |
|---|---|---|
| Scope | Only routes registered on that specific router | Every route in the entire app (unless path-scoped) |
| Typical use | Concerns specific to one resource group (e.g., auth just for `/admin/*`) | Global concerns (body parsing, logging, security headers) |

Use router-level middleware to scope logic tightly to a feature/resource area, keeping unrelated routes unaffected; use app-level middleware for truly global concerns applied to every request. The common mistake is putting resource-specific logic (like admin-only auth checks) at the app level with manual path checks instead of scoping it cleanly to an `express.Router()` mounted at `/admin`.
