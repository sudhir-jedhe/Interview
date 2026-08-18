# JWT Structure and Where to Store It

## JWT structure

A JWT is three base64url-encoded segments separated by dots: `header.payload.signature`.

```js
// header:  { "alg": "HS256", "typ": "JWT" }
// payload: { "sub": "user123", "role": "admin", "iat": 1700000000, "exp": 1700000900 }
// signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```
**Critical distinction:** the header and payload are only base64-encoded, not encrypted — anyone can decode and read them (paste a token into jwt.io). The **signature** is what's cryptographically verified — it proves the payload hasn't been tampered with since the server signed it, assuming the secret hasn't leaked. Never put sensitive data (passwords, secrets) in the payload; treat it as visible, not verified-content-wise but definitely readable.

```js
jwt.decode(token);              // reads the payload, NO verification — never trust this alone
jwt.verify(token, JWT_SECRET);  // verifies signature AND expiry — throws if invalid/expired/tampered
```
A common interview trap: code that calls `jwt.decode` and trusts the result without ever calling `jwt.verify` — that accepts a forged token from anyone who knows the JWT structure. Also always pin the accepted algorithms explicitly (`jwt.verify(token, secret, { algorithms: ['HS256'] })`) rather than letting the token dictate which algorithm verifies it — historically, misconfigured verifiers have been tricked into accepting `alg: none` tokens or mixing symmetric/asymmetric verification.

## Where to store a JWT on the client

| Aspect | `localStorage` | `httpOnly` cookie |
|---|---|---|
| Readable by JS (XSS risk) | Yes — any injected script can read and exfiltrate it | No — browser blocks JS access entirely |
| Sent automatically (CSRF risk) | No — you must manually attach it to each request | Yes — browser attaches it to every matching request automatically |
| Mitigation needed | Strong XSS prevention (CSP, output encoding, dependency hygiene) | `SameSite` attribute and/or CSRF tokens |

Use `httpOnly` cookies for browser-based web apps where you control the domain — it closes off the more commonly exploited XSS-token-theft vector, and CSRF is well-understood and mitigable with `SameSite=Strict/Lax`. Use `Authorization: Bearer` headers with in-memory (not localStorage) token storage for mobile apps, SPA-to-API integrations, or server-to-server calls where CSRF doesn't apply. The common mistake is defaulting to `localStorage` "because it's simpler," which is the single most exploited real-world JWT storage pattern. `httpOnly` cookies are deliberately excluded from `document.cookie` and any other JS-accessible API — the browser enforces this at the API level regardless of same-origin status.
