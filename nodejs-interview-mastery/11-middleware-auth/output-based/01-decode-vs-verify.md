# Output-Based: decode vs verify

```js
const jwt = require('jsonwebtoken');

const forgedPayload = { sub: 'user1', role: 'admin' };
const fakeToken = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64') +
  '.' + Buffer.from(JSON.stringify(forgedPayload)).toString('base64') + '.fakesignature';

console.log(jwt.decode(fakeToken));

try {
  jwt.verify(fakeToken, process.env.JWT_SECRET);
  console.log('verified!');
} catch (err) {
  console.log('verify failed:', err.message);
}
```

**Answer:** `jwt.decode` prints `{ sub: 'user1', role: 'admin' }` successfully. `jwt.verify` throws and logs something like `verify failed: invalid signature` (or `jwt malformed` depending on exact format) — `"verified!"` never prints.

**Why:** `decode` just base64-decodes the payload segment with zero cryptographic checking — it will happily parse any well-formed-looking token, forged or not. `verify` recomputes the HMAC signature using the server's secret and compares it against the token's signature segment; since the forged token's signature wasn't produced with the real secret, verification fails. This is exactly why middleware must call `verify`, never rely on `decode` alone.
