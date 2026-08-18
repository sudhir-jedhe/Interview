# Scenario: A Single-Page App Needs Auth That Guards Against Both XSS and CSRF

You're deciding where to store the auth token for a web app served from `app.example.com` calling an API at `api.example.com`, and the security team is worried about both XSS and CSRF.

**Approach:**
Store the JWT in an `httpOnly`, `Secure`, `SameSite=Strict` (or `Lax` if you need cross-site navigation flows) cookie, scoped to the API's domain. This removes JS's ability to read the token (closing the XSS-token-theft vector) while `SameSite` blocks the cookie from being sent on cross-site requests initiated by other origins (mitigating CSRF for the common case). Add a CSRF token for state-changing requests as defense in depth, since `SameSite` alone doesn't cover every browser/edge case.

```js
app.post('/login', async (req, res) => {
  const user = await verifyLogin(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });

  const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    domain: '.example.com',
  });
  res.json({ ok: true });
});

// CSRF double-submit token for extra defense on state-changing routes
app.post('/orders', requireCsrfToken, authenticate, asyncHandler(async (req, res) => {
  const order = await createOrder(req.user.id, req.body);
  res.status(201).json({ data: order });
}));
```
Also invest in standard XSS mitigations (Content-Security-Policy, output escaping, dependency auditing) since a cookie-stored token isn't readable by injected JS, but a sufficiently compromised page can still make authenticated requests on the user's behalf within the `SameSite` policy's limits.
