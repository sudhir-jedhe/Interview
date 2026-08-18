# Snippet: Refresh Endpoint That Rotates the Access Token Using a Stored Refresh Token

```js
app.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: { message: 'Missing refresh token' } });

  const record = await refreshTokenStore.find(refreshToken);
  if (!record || record.revoked) return res.status(401).json({ error: { message: 'Invalid refresh token' } });

  const user = await db.users.findById(record.userId);
  const accessToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken });
});
```

**Explanation:** Unlike access-token verification (pure signature/expiry check, no DB hit), refresh-token verification requires a database lookup — that lookup is exactly what makes revocation possible. If the token isn't found, or is found but marked `revoked`, the request fails with `401` and the client must fully re-authenticate. A production-grade version would also rotate the refresh token itself on every use (issue a new one, invalidate the old), which limits the window an attacker has if a refresh token is ever intercepted.
