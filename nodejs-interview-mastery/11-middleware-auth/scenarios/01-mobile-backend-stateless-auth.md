# Scenario: Mobile App Backend Needs Auth That Works Across Restarts Without Sticky Sessions

The app talks to a horizontally-scaled fleet of API servers behind a load balancer with no session affinity configured, and users shouldn't have to log in every time they reopen the app.

**Approach:**
Use JWT-based auth with a short-lived access token and a longer-lived refresh token. Any server instance can verify the access token statelessly (no shared session lookup needed on every request), and the mobile app stores the refresh token securely (iOS Keychain / Android Keystore, not plain storage) to silently mint new access tokens without forcing re-login.

```js
app.post('/login', async (req, res) => {
  const user = await verifyLogin(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });

  const accessToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = crypto.randomBytes(40).toString('hex');
  await refreshTokenStore.save(refreshToken, user.id, { expiresIn: '30d' });

  res.json({ accessToken, refreshToken }); // mobile stores both in secure OS storage, not localStorage-equivalent
});

app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  const record = await refreshTokenStore.find(refreshToken);
  if (!record || record.revoked || record.expiresAt < Date.now()) {
    return res.status(401).json({ error: { message: 'Session expired, please log in again' } });
  }
  const user = await db.users.findById(record.userId);
  const accessToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken });
});
```
No cookies are needed at all for a native mobile client, sidestepping CSRF entirely — the concern there is just securing on-device storage of the refresh token.
