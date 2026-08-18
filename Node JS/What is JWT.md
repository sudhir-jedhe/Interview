
❓ 1. What is JWT?
👉 JWT (JSON Web Token) is a compact, secure way to transmit data between client & server.

📌 Structure:

- Header
- Payload
- Signature

💡 Used for: Authentication & Authorization

---

❓ 2. How does JWT authentication work?
👉 Flow:

1. User logs in
2. Server generates JWT
3. Client stores it (cookie/local storage)
4. Client sends JWT in every request
5. Server verifies signature → allows access

---

❓ 3. Is JWT stateful or stateless?
👉 Stateless

💡 Why important?

- No session stored on server
- Easy to scale across multiple servers
- Works well with microservices

---

❓ 4. Can JWT be stolen? ⚠️
👉 Yes!

💥 Common interview follow-up:

- XSS attack (if stored in localStorage)
- Man-in-the-middle (if no HTTPS)

💡 Best Answer:

- Use HttpOnly cookies
- Enable HTTPS
- Short expiry + refresh token

---

❓ 5. What happens if JWT is stolen?
👉 Attacker can access APIs as that user until token expires

💡 Add this in interview:
👉 “We can implement token revocation or rotation to reduce risk.”

---

❓ 6. Where should you store JWT?
👉 Best practice:

- ✅ HttpOnly Cookie (secure)
- ❌ localStorage (less secure)

---

❓ 7. How JWT works with multiple servers (e.g., 5 servers)?
👉 Since JWT is stateless:

- Any server can validate token using same secret/public key
- No session sharing needed

💡 Perfect for:

- Load balancers
- Microservices architecture

---

❓ 8. Is JWT encrypted? 🤯 (VERY COMMON TRICK QUESTION)
👉 ❌ No (by default)

👉 It is signed, not encrypted

💡 Payload is Base64 encoded → anyone can decode it

---

❓ 9. Difference between Signing & Encryption?

🔐 Signing

- Ensures data integrity
- Detects tampering

🔒 Encryption

- Hides data

💡 Smart answer:
👉 “JWT uses signing. For sensitive data, we can use JWE (encrypted JWT).”

---

❓ 10. What is Refresh Token?
👉 Used to generate new access tokens without login again

💡 Why needed?

- Short-lived JWT improves security
- Refresh token maintains session

This is a rock-solid, high-yield interview reference sheet. To take these answers from "good" to "staff/senior engineer level," here are the critical technical nuances, gotchas, and follow-up edge cases interviewers will push on next:

---

### Key Technical Deep-Dives & Interview Follow-ups

#### 1️⃣ Symmetric vs. Asymmetric Signing (HMAC vs. RSA/ECDSA)

- **HS256 (Shared Secret):** Every service verifying the token must know the secret key. If one downstream microservice is compromised, an attacker can **forge new tokens**.
- **RS256 / ES256 (Public/Private Key):**
- Only the **Auth Server** holds the **Private Key** to sign tokens.
- All downstream microservices only need the **Public Key** (often fetched dynamically via JWKS endpoint `/.well-known/jwks.json`) to verify tokens. They **cannot forge tokens**.

---

#### 2️⃣ Cookie Storage Gotcha: CSRF vs. XSS Trade-off

Storing JWTs in `HttpOnly` cookies blocks **XSS**, but opens the door to **CSRF (Cross-Site Request Forgery)**.

- **The Senior Answer:**

> "Using `HttpOnly` cookies prevents JavaScript from reading the token (mitigating XSS). However, because the browser automatically attaches cookies to cross-origin requests, we must also set `SameSite=Lax` (or `Strict`), enable the `Secure` flag (HTTPS only), and implement **CSRF protection tokens / double-submit cookies** or custom headers (e.g., `X-Requested-With`)."

---

#### 3️⃣ The "Stateless JWT Revocation" Paradox

- **The Problem:** If a user clicks "Logout", changes their password, or gets banned, how do you revoke an active stateless JWT without querying a database on every request?
- **3 Industry Solutions:**

1. **Short Expiry Times ($5\text{–}15\text{ minutes}$):** Accept the short window of vulnerability until the access token expires naturally.
2. **Token Blacklist / Denylist in Redis:** Store revoked token IDs (`jti` claim) in an in-memory Redis cache with a TTL equal to the remaining token lifetime.
3. **User Token Version / `iat` check:** Store an integer `token_version` on the user record in the database. When the user logs out or resets their password, increment `token_version`. If the `token_version` inside the JWT payload doesn't match the database, reject the request.

---

#### 4️⃣ Refresh Token Rotation & Reuse Detection

- **The Concept:** Every time a client uses a Refresh Token to get a new Access Token, the server **burns the old refresh token and issues a brand-new one**.
- **Automatic Threat Mitigation (Reuse Detection):**
- If an attacker steals a refresh token and uses it *after* the legitimate user has already rotated it, the server detects that an invalidated token was used.
- The server recognizes this as a compromise and **immediately invalidates the entire token family/session tree**, forcing all sessions for that user to log in again.

---

#### 5️⃣ Critical Security Pitfall: The `alg: "none"` Vulnerability

- **The Exploit:** In poorly configured JWT libraries, an attacker can modify the token header to `{"alg": "none"}`, strip the signature entirely, and tamper with the payload (e.g., set `{"role": "admin"}`).
- **The Defense:** Always enforce explicit algorithm whitelisting on the backend verifier:

```javascript
jwt.verify(token, secretOrPublicKey, { algorithms: ['RS256'] });

```

---

### Quick Comparison: Session Cookies vs. JWT

| Criteria            | Session-Based Auth (Stateful)              | JSON Web Token (Stateless)                                         |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------------ |
| **Server Storage**  | Memory / Redis session store required      | Zero session storage required on server                            |
| **Scalability**     | Needs centralized Redis or sticky sessions | Seamless across serverless & distributed microservices             |
| **Revocation**      | Instant (delete key in Redis)              | Hard (requires blacklisting, short TTL, or versioning)             |
| **Payload Size**    | Tiny (session ID string ~32 bytes)         | Larger ($200\text{–}800\text{ bytes}$ header overhead per request) |
| **Data Visibility** | Completely hidden on server                | Payload is visible to client (unless encrypted via JWE)            |
