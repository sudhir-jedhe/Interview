# Scenario: No Way to Force-Logout a Compromised Account Before Its JWT Expires

Security review flags that access tokens are valid for 24 hours, and there's no revocation mechanism — a stolen token stays usable for up to a day even after the user changes their password.

**Approach:**
Shorten access token lifetime dramatically (down to 5–15 minutes) so the exposure window shrinks, and introduce a lightweight server-side check that can invalidate all of a user's existing tokens immediately — typically a `tokenVersion` (or `passwordChangedAt` timestamp) stored on the user record and embedded as a claim, checked on every verification.

```js
// on password change / forced logout, bump the version
await db.users.update(userId, { tokenVersion: user.tokenVersion + 1 });

// include it when signing
const accessToken = jwt.sign(
  { sub: user.id, tokenVersion: user.tokenVersion },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// check it in auth middleware — one cheap lookup, not a full session store
async function authenticate(req, res, next) {
  try {
    const payload = jwt.verify(req.get('Authorization')?.slice(7) || '', process.env.JWT_SECRET);
    const currentVersion = await getUserTokenVersion(payload.sub); // cached/short-TTL lookup
    if (payload.tokenVersion !== currentVersion) {
      return res.status(401).json({ error: { message: 'Token revoked' } });
    }
    req.user = { id: payload.sub };
    next();
  } catch {
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
}
```
This reintroduces a small amount of state (one cheap, cacheable lookup) in exchange for real revocation — a deliberate, documented trade-off against pure JWT statelessness.
