# Problem: Implement JWT-Based Auth Middleware From Scratch (No JWT Library)

## Problem statement

Implement Express middleware that authenticates requests using a JWT-style token — without using the `jsonwebtoken` package. Hand-roll a minimal HMAC-based sign/verify pair so the underlying mechanics (what's actually being cryptographically checked) are explicit rather than hidden behind a library call.

## Requirements

- `signToken(payload, secret, expiresInSeconds)` produces a `header.payload.signature` string using HMAC-SHA256
- `verifyToken(token, secret)` recomputes the signature and rejects on mismatch, and rejects if the token is expired
- Middleware extracts the token from `Authorization: Bearer <token>`, verifies it, and attaches the payload to `req.user` — or responds `401` on any failure
- Must use a constant-time comparison for the signature check (never a plain `===` on secret-derived strings, which leaks timing information)

## Worked solution

```js
// utils/minimalJwt.js
const crypto = require('crypto');

function base64url(input) {
  return Buffer.from(JSON.stringify(input))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - (str.length % 4 || 4)) % 4, '=');
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
}

function sign(payloadObj, secret, expiresInSeconds = 900) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { ...payloadObj, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + expiresInSeconds };

  const headerPart = base64url(header);
  const payloadPart = base64url(payload);
  const signingInput = `${headerPart}.${payloadPart}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${signingInput}.${signature}`;
}

function verify(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const [headerPart, payloadPart, signaturePart] = parts;

  const signingInput = `${headerPart}.${payloadPart}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signingInput)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // constant-time comparison — a plain === would leak timing info about how many
  // leading bytes matched, which is a real (if narrow) side-channel for a MAC check
  const a = Buffer.from(signaturePart);
  const b = Buffer.from(expectedSignature);
  const signaturesMatch = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!signaturesMatch) throw new Error('Invalid signature');

  const payload = base64urlDecode(payloadPart);
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error('Token expired');
  }

  return payload;
}

module.exports = { sign, verify };
```

```js
// middleware/authenticate.js
const { verify } = require('../utils/minimalJwt');

function authenticate(req, res, next) {
  const header = req.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: { message: 'Missing token' } });

  try {
    const payload = verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
}

module.exports = authenticate;
```

```js
// usage
const { sign } = require('./utils/minimalJwt');

const token = sign({ sub: 'user123', role: 'admin' }, process.env.JWT_SECRET, 900);
// token looks exactly like a real JWT: eyJhbGciOi....eyJzdWIiOi....<signature>

app.get('/admin/dashboard', authenticate, (req, res) => {
  res.json({ data: `Welcome, user ${req.user.id}` });
});
```

**Why this demonstrates the real mechanics:** every real JWT library does essentially this — base64url-encode a header and payload, HMAC them together, and compare the signature on verification. Seeing it hand-built makes two things concrete that are easy to gloss over when just calling `jwt.verify()`: (1) the header/payload are merely *encoded*, not encrypted — `base64urlDecode` on the payload segment alone, with zero secret knowledge, fully reveals its contents; and (2) the entire security guarantee rests on the HMAC comparison — get that comparison wrong (e.g. using `===` on a string prone to timing attacks, or skipping the expiry check) and the "signed" token protects nothing.
