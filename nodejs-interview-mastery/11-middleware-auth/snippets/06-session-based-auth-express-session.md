# Snippet: Session-Based Auth with express-session (Alternative to JWT)

```js
const session = require('express-session');
const RedisStore = require('connect-redis').default;

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 }, // 1 hour
}));

app.post('/login', async (req, res) => {
  const user = await verifyLogin(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });
  req.session.userId = user.id; // server stores this; cookie only holds the session ID
  res.json({ ok: true });
});

app.get('/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: { message: 'Not logged in' } });
  res.json({ userId: req.session.userId });
});
```

**Explanation:** `express-session` middleware handles reading/writing the session cookie and looking up session data in the configured `store` (here, Redis — never the default in-memory store in production, since it doesn't survive restarts and doesn't work across multiple server instances). The cookie the browser holds contains only an opaque session ID; the actual `userId` lives server-side in Redis, which is what makes instant server-side revocation possible (just delete that Redis key).
