# Interview Q&A: Authentication/Authorization Fundamentals

**Q: What's the difference between authentication and authorization?**
Authentication verifies *who* a request is coming from — typically via credentials exchanged for a session or token. Authorization determines *what* an already-authenticated identity is allowed to do — checking roles/permissions against the requested action. They're implemented as separate middleware layers: authentication runs first and populates `req.user`; authorization runs after and inspects `req.user` to allow or reject (`403`) the specific operation.

**Q: What's the difference between a `401` and a `403` response, and when should auth middleware return each?**
`401 Unauthorized` means the request lacks valid authentication entirely — no token, an expired token, or a bad signature; the client should log in (or refresh) and retry. `403 Forbidden` means the request *is* authenticated but the identity doesn't have permission for the requested action — retrying with the same credentials will never succeed. Authentication middleware should return `401`; authorization middleware, once identity is established, should return `403`.

**Q: Describe how you'd build Express middleware that authenticates a request via JWT.**
Extract the token from the `Authorization: Bearer <token>` header, call `jwt.verify` with the server's secret (or public key), and on success attach the decoded identity to `req.user` before calling `next()`; on failure (missing header, expired token, bad signature) respond `401` immediately without calling `next()`. Downstream route handlers and authorization middleware then read `req.user` without needing to know anything about tokens.

```js
function authenticate(req, res, next) {
  const token = (req.get('Authorization') || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: { message: 'Missing token' } });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: { message: 'Invalid token' } });
  }
}
```
