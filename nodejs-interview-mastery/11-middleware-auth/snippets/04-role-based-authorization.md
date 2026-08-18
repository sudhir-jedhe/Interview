# Snippet: Role-Based Authorization Middleware, Layered on Top of Authentication

```js
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { message: 'Not authenticated' } });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Insufficient permissions' } });
    }
    next();
  };
}

app.delete('/users/:id', authenticate, authorize('admin'), (req, res) => {
  res.status(204).end();
});
```

**Explanation:** `authorize` is a middleware *factory* — calling `authorize('admin')` returns the actual middleware function, closing over the list of allowed roles via a rest parameter, so the same factory can protect different routes with different role requirements (`authorize('admin', 'moderator')`). It defensively checks `req.user` exists first (a `401` guard in case it's ever accidentally used without `authenticate` running first), then checks role membership and returns `403` — never `401` — since the request *is* authenticated, just not permitted.
