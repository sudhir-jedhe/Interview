# Snippet: Instant Revocation of a Specific Refresh Token (What JWT Alone Can't Do)

```js
app.post('/logout', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await refreshTokenStore.revoke(refreshToken); // deletes/marks it invalid server-side
  }
  res.clearCookie('refreshToken');
  res.status(204).end();
  // note: any already-issued access token remains valid until it naturally expires (short TTL limits blast radius)
});
```

**Explanation:** Logging out revokes the *refresh token* server-side, which prevents any future access tokens from being minted for that session — but it deliberately does **not** (and structurally cannot) invalidate an access token that's already been issued and is still within its short TTL. This is the practical consequence of JWT statelessness: revocation happens at the refresh-token layer (which is checked server-side), while the access token itself remains valid until natural expiry, which is exactly why access tokens are kept short-lived in the first place.
