# Interview Q&A: Sessions, JWT, and Refresh Tokens

**Q: Walk through the trade-offs between session-based auth and JWT-based auth.**
Sessions are stateful — the server stores session data and the client just holds an opaque cookie ID — which makes revocation trivial (delete the session) but requires a shared store across server instances for horizontal scaling. JWTs are stateless — all the claims are embedded and signed in the token itself — which scales cleanly across servers with no shared store, but you can't revoke a valid JWT before it expires without adding back some form of server-side state (a denylist or version check), which partially undermines the statelessness benefit.

**Q: What are the three parts of a JWT, and what's actually cryptographically verified?**
`header.payload.signature`, each base64url-encoded and dot-separated. Only the **signature** is cryptographically verified — it's computed from the header and payload using a secret (HMAC) or private key (RSA/ECDSA), and `jwt.verify` recomputes it and compares. The header and payload themselves are just encoded, not encrypted, so anyone can decode and read them — never put secrets in the payload, and never trust a payload you only `decode`d without also `verify`ing the signature.

**Q: Why is `jwt.decode()` dangerous to use on its own for authentication?**
`decode()` performs zero cryptographic verification — it just base64-decodes whatever payload is present, valid or forged. An attacker can hand-craft a token with any claims they like (e.g. `{ role: 'admin' }`) and `decode()` will happily return it. Only `jwt.verify()`, which checks the signature against your secret/public key and validates expiry, can be trusted to confirm a token was actually issued by your server and hasn't been tampered with.

**Q: What is the refresh token pattern, and why do you need it?**
Access tokens are kept short-lived (minutes) to limit the damage if one leaks, but that would force users to re-login constantly. A refresh token — longer-lived, stored more securely, and typically checked against a server-side record (which is what actually enables revocation) — is exchanged for a fresh access token when the old one expires, without requiring the user to re-enter credentials. It's the mechanism that reconciles short-lived tokens with usable session length.

**Q: How would you revoke a compromised JWT before it naturally expires?**
Pure stateless JWT verification can't do this by design. In practice you reintroduce a small amount of state: either maintain a denylist of revoked token IDs (`jti` claim) checked on every request, or embed a `tokenVersion`/`passwordChangedAt` claim and compare it against a current value stored per-user — bumping that value instantly invalidates every previously issued token for that user on their next request, with only one cheap (often cached) lookup per request rather than a full session store.

**Q: Where should you store a JWT on the client, and why does it matter?**
`httpOnly` cookies are generally preferred for browser web apps because JavaScript cannot read them at all, closing off the XSS-token-theft vector — the trade-off is that cookies are sent automatically, which opens a CSRF angle mitigated with `SameSite` and/or CSRF tokens. `localStorage` is readable by any script running on the page (including injected malicious scripts via XSS), making it a common real-world attack target — it should generally be avoided for anything sensitive. Mobile/native apps typically use secure OS-level storage (Keychain/Keystore) instead of either.
