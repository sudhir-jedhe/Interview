# Output-Based: Middleware Order — authorize Before authenticate

```js
function authenticate(req, res, next) {
  console.log('authenticate ran');
  req.user = { id: 1, role: 'user' };
  next();
}
function authorize(role) {
  return (req, res, next) => {
    console.log('authorize ran, req.user =', req.user);
    if (req.user?.role !== role) return res.status(403).end();
    next();
  };
}

app.get('/admin', authorize('admin'), authenticate, (req, res) => res.json({ ok: true }));
// GET /admin
```

**Answer:** Logs `authorize ran, req.user = undefined`, then the client gets `403`. `"authenticate ran"` never logs, and the route handler never runs.

**Why:** Express middleware executes strictly in registration order. `authorize('admin')` is registered before `authenticate`, so it runs first — `req.user` hasn't been set yet, `req.user?.role` is `undefined`, which never equals `'admin'`, so it responds `403` and never calls `next()`. Authentication must always precede authorization in the middleware chain.
