# Session-Based Auth vs Token-Based Auth (JWT)

## Session-based auth

The server creates a session on login, stores session data server-side (Redis, a DB table, or in-memory for dev), and gives the client an opaque session ID in a cookie. Every subsequent request, the cookie is sent automatically by the browser, and the server looks up the session.

```js
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body.email, req.body.password);
  req.session.userId = user.id; // express-session persists this server-side
  res.json({ ok: true });
});
```
Revocation is trivial — delete the session server-side and the cookie is instantly worthless. The cost is state: every server instance needs access to the same session store, and every authenticated request costs a lookup.

## Token-based auth (JWT)

The server issues a self-contained, cryptographically signed token containing the claims (user ID, role, expiry) directly. The client sends it back, typically in an `Authorization: Bearer <token>` header. The server verifies the signature and trusts the claims without any database lookup or shared state.

```js
const jwt = require('jsonwebtoken');

const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
```
This is genuinely stateless — any server instance with the shared secret can verify any token, no shared session store needed. The cost: you **cannot revoke a JWT before it expires** without maintaining some kind of denylist (which reintroduces state, defeating half the point). This is why access tokens are kept short-lived.

## Comparison

| Aspect | Session-based (cookie + server store) | Token-based (JWT) |
|---|---|---|
| State | Stateful — server must look up session data on every request | Stateless — claims are self-contained in the signed token |
| Revocation | Trivial — delete the session server-side, instantly invalid | Hard — a signed, unexpired JWT remains valid until it expires; needs a denylist to revoke early |
| Scaling across servers | Needs a shared store (Redis, DB) accessible to every instance | Any instance with the shared secret/public key can verify independently |

Use sessions when you need instant, reliable revocation (e.g. banking, admin tools) and control your own infrastructure end-to-end. Use JWTs when you need statelessness across many services or third-party consumption (e.g. microservices, mobile APIs) and can tolerate short-lived access tokens plus a refresh flow. The most common mistake is issuing long-lived JWTs "for convenience" and then having no way to kick out a compromised account until the token naturally expires.

## A concrete consequence: what happens across a server restart

With the default `express-session` `MemoryStore` (not production-safe by design), a process restart wipes all session data instantly — a client holding a still-valid-looking cookie is silently logged out because the server has no record of that session ID anymore. A JWT, by contrast, carries its own claims and survives a server restart untouched — this is the statelessness trade-off made concrete rather than theoretical.
