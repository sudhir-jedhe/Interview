# Scoping Admin-Only Auth to /admin Without Duplicating Checks

**Scenario:** You're building a multi-tenant SaaS API where every route under `/admin` needs an authenticated admin user, but the rest of the API is public. How do you structure the middleware so auth only applies to the admin routes without duplicating checks in every handler?

**Approach:** Use `express.Router()` to isolate the `/admin` route group, and attach the auth-checking middleware at the router level (or via `app.use('/admin', authMiddleware, adminRouter)`), so it runs automatically for every route mounted under that prefix.

```js
const express = require('express');

function requireAdmin(req, res, next) {
  const token = req.headers['authorization'];
  const user = verifyToken(token); // your own verification logic
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  req.user = user;
  next();
}

const adminRouter = express.Router();
adminRouter.use(requireAdmin); // applies to every route below, on this router only
adminRouter.get('/stats', (req, res) => res.json({ stats: {} }));
adminRouter.delete('/users/:id', (req, res) => res.status(204).end());

const app = express();
app.use('/admin', adminRouter);
app.get('/public/health', (req, res) => res.json({ status: 'ok' })); // no auth needed

app.listen(3000);

function verifyToken() { return { isAdmin: true }; }
```

This keeps the auth concern in exactly one place, scoped by mounting rather than repeated per-handler checks that are easy to forget on a new route.
