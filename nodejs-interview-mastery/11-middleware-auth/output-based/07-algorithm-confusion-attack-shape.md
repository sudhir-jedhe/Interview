# Output-Based: Signature Algorithm Confusion ("alg: none" Attack Shape)

```js
const jwt = require('jsonwebtoken');

// server verifies without restricting algorithms:
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET); // no `algorithms` option passed
}

// vs a hardened version:
function verifyTokenHardened(token) {
  return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
}
```

**Answer:** Both versions, using a current `jsonwebtoken` release, reject a token forged with `alg: none` or signed with a mismatched algorithm — but the first version is still not fully hardened against algorithm-confusion attacks in every deployment configuration (e.g. mixing symmetric and asymmetric key verification without pinning), whereas the second, explicit `algorithms: ['HS256']` version closes that class of vulnerability entirely.

**Why:** Older/misconfigured JWT libraries and homemade verifiers have historically been tricked into accepting `alg: none` tokens (no signature at all) or into verifying an RS256-signed token's payload using the public key as if it were an HMAC secret. Modern `jsonwebtoken` defends against `none` by default, but explicitly whitelisting `algorithms` is still the recommended defensive practice — never let the token itself dictate which algorithm is used to verify it.
