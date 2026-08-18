# Building Express Auth Middleware

Extract the token from the `Authorization: Bearer <token>` header, call `jwt.verify` with the server's secret (or public key), and on success attach the decoded identity to `req.user` before calling `next()`; on failure (missing header, expired token, bad signature) respond `401` immediately without calling `next()`. Downstream route handlers and authorization middleware then read `req.user` without needing to know anything about tokens.

```js
function authenticate(req, res, next) {
  const authHeader = req.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: { message: 'Missing token' } });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
}
```

## Distinguishing failure types

`jwt.verify` throws different error types depending on why verification failed — `TokenExpiredError` for an expired-but-otherwise-valid token, `JsonWebTokenError` for a malformed or bad-signature token. A more polished middleware can use `err.name` to give a more specific response (e.g. "please refresh your token" for expired vs "please log in again" for a bad signature), though returning a uniform `401` is also perfectly correct and arguably safer (it reveals less about *why* a token was rejected to a potential attacker probing your auth).

## Layering authorization on top

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
`authenticate` must always run first in the chain — `authorize` only inspects `req.user`, it never establishes identity itself.
