# Scenario: A security scan flags your login endpoint as vulnerable to brute-force attacks

You're building a login API and a pentest report calls out that an attacker can attempt unlimited password guesses against `/login` with no throttling.

**Approach:** Add rate limiting scoped to the endpoint (and ideally per-account, not just per-IP, since distributed attacks rotate IPs), plus generic error messages that don't reveal whether the *email* or the *password* was wrong (which otherwise lets an attacker enumerate valid accounts):

```js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  message: { error: 'Too many attempts. Try again later.' },
});

app.post('/login', loginLimiter, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const valid = user && (await bcrypt.compare(req.body.password, user.passwordHash));
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' }); // same message either way
  res.json({ token: issueToken(user) });
});
```

For stronger protection against distributed/credential-stuffing attacks, layer in account lockout after N failures (tracked in Redis, not in-process memory, so it survives across `cluster` workers) and consider CAPTCHA after repeated failures.
