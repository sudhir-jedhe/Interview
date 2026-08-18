# The Refresh Token Pattern

Because access tokens must be short-lived (5–15 min) to limit the damage of a leaked token, you pair them with a longer-lived **refresh token**, stored more securely (httpOnly cookie, sometimes also persisted server-side so it *can* be revoked) and used only to mint new access tokens:

```js
app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;
  const stored = await refreshTokenStore.find(refreshToken); // enables revocation
  if (!stored || stored.revoked) return res.sendStatus(401);
  const user = await getUser(stored.userId);
  const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  res.json({ accessToken });
});
```

## Access token vs Refresh token

| Aspect | Access token | Refresh token |
|---|---|---|
| Lifespan | Short (minutes) | Long (days/weeks) |
| Sent on | Every API request (`Authorization` header) | Only to the token-refresh endpoint |
| Where verified | Stateless — signature/expiry check only | Usually checked against a server-side store, enabling revocation |
| Risk if leaked | Limited — expires soon | High — attacker can mint new access tokens until revoked or expired; must be stored securely (httpOnly cookie) and ideally rotated on use |

Use the pair together: short access tokens limit the blast radius of a leaked token, while the refresh token (checked server-side) is what actually gives you a practical revocation mechanism for JWT-based systems. The common mistake is making the refresh token just as easy to steal as the access token (e.g. also putting it in `localStorage`) — that defeats the entire point of separating them.

## Revoking a JWT before it naturally expires

Pure stateless JWT verification can't revoke a still-valid token by design. In practice you reintroduce a small amount of state: either maintain a denylist of revoked token IDs (`jti` claim) checked on every request, or embed a `tokenVersion`/`passwordChangedAt` claim and compare it against a current value stored per-user — bumping that value instantly invalidates every previously issued token for that user on their next request, with only one cheap (often cached) lookup per request rather than a full session store.
