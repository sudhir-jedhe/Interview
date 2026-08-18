# Output-Based: Session Cookie vs JWT Statelessness Under Server Restart

```js
// Server A (in-memory session store, no persistence)
app.use(session({ secret: 's', resave: false, saveUninitialized: false })); // default MemoryStore

app.post('/login', (req, res) => { req.session.userId = 42; res.json({ ok: true }); });
app.get('/me', (req, res) => res.json({ userId: req.session.userId }));

// 1. client logs in, gets a session cookie
// 2. server process restarts (e.g. deploy)
// 3. client calls GET /me with the same cookie
```

**Answer:** `{ "userId": undefined }` (or the session behaves as if logged out) after the restart.

**Why:** The default `express-session` `MemoryStore` keeps session data purely in the Node process's memory — it's explicitly documented as not production-safe. A process restart wipes it entirely; the cookie the client holds still references a session ID, but the server no longer has any record of it, so `req.session.userId` is `undefined`. Contrast with JWT-based auth, where the token itself carries the claims and survives a server restart untouched — this is the core "statelessness" trade-off in practice, not just in theory.
