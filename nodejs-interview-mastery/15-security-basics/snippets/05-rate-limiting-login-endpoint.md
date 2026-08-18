# Snippet: Rate limiting a login endpoint

```js
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, try again later.',
});
app.post('/login', loginLimiter, (req, res) => res.send('login handler'));
```

**Explanation:** `express-rate-limit` tracks request counts per client (by IP, by default) within a sliding time window and rejects requests once the cap is hit. Scoping it specifically to `/login` with a tight `max: 5` per 15 minutes blunts brute-force password guessing without affecting the rate limit on unrelated, lower-risk routes.
