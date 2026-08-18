# Authentication vs Authorization

**Authentication** answers "who are you?" — verifying identity, typically via credentials. **Authorization** answers "what are you allowed to do?" — checking permissions on an already-authenticated identity. It's common to conflate them, but they're separate middleware concerns:

```js
app.get('/admin/reports', authenticate, authorize('admin'), (req, res) => {
  res.json({ data: getReports() });
});
```
`authenticate` establishes `req.user`; `authorize('admin')` checks `req.user.role === 'admin'` and rejects with `403` (not `401` — that's reserved for "not authenticated at all") if it fails.

## Why the order matters

Middleware executes strictly in registration order. If `authorize` is registered before `authenticate`, it runs before `req.user` has ever been set — every authenticated request would incorrectly be treated as unauthenticated (or worse, as having no role, silently defaulting to a rejection or, in a buggier implementation, silently passing). Authentication must always precede authorization in the middleware chain.

## 401 vs 403

`401 Unauthorized` means the request lacks valid authentication entirely — no token, an expired token, or a bad signature; the client should log in (or refresh) and retry. `403 Forbidden` means the request *is* authenticated but the identity doesn't have permission for the requested action — retrying with the same credentials will never succeed. Authentication middleware should return `401`; authorization middleware, once identity is established, should return `403`.
