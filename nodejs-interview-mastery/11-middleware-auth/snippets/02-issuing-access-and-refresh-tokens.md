# Snippet: Issuing an Access Token + Refresh Token Pair on Login

```js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

async function login(req, res) {
  const user = await verifyLogin(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: { message: 'Invalid credentials' } });

  const accessToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = crypto.randomBytes(40).toString('hex');
  await refreshTokenStore.save(refreshToken, user.id); // persisted so it can be revoked

  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  res.json({ accessToken });
}
```

**Explanation:** The access token is a signed JWT the client attaches to every API call; the refresh token is a random, unguessable string (not a JWT) that's meaningless without a server-side lookup — that's precisely what makes it revocable. Storing the refresh token in an `httpOnly` cookie keeps it out of reach of JS (closing the XSS vector), while returning the access token in the JSON body lets the client hold it in memory and attach it manually via `Authorization: Bearer`.
