# Snippet: Auth Middleware — Verify JWT, Attach req.user, Reject Invalid/Missing Tokens

```js
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: { message: 'Missing token' } });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
}

module.exports = authenticate;
```

**Explanation:** This is the canonical shape of Express JWT middleware: extract the bearer token, `jwt.verify` it (never `jwt.decode`, which skips signature checking entirely), and either populate `req.user` and call `next()`, or short-circuit with a `401` and never call `next()`. Every route downstream of this middleware can trust `req.user` is present and was cryptographically verified — they don't need to know anything about tokens at all.
