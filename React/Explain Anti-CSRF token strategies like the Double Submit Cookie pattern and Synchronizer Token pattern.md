While `SameSite` cookie attributes provide strong baseline protection against Cross-Site Request Forgery (CSRF), defense-in-depth requires explicit **Anti-CSRF Tokens**.

Anti-CSRF tokens guarantee that a state-changing request (such as a `POST`, `PUT`, or `DELETE` action) originated intentionally from your application's UI rather than a malicious third-party site.

Here is a detailed breakdown of the two most prevalent token-based anti-CSRF patterns: **Synchronizer Token Pattern** and **Double Submit Cookie Pattern**.

---

# Architecture of Anti-CSRF Token Patterns

```text
 1. SYNCHRONIZER TOKEN PATTERN (Stateful / Server Session)
 Client                                                     Server
   │─── 1. Authenticate / Request Form ────────────────────►│ Generates token "xyz123"
   │◄── 2. HTML Form containing <input name="csrf" value="xyz123"> ──│ Stores "xyz123" in Server Session
   │                                                        │
   │─── 3. POST /submit (Form Data: csrf="xyz123") ────────►│ Compares submitted token
   │                                                        │ against Server Session value
   │◄── 4. 200 OK (Match) / 403 Forbidden (Mismatch) ───────│

 2. DOUBLE SUBMIT COOKIE PATTERN (Stateless / Decoupled)
 Client                                                     Server
   │─── 1. Authenticate / Request Page ────────────────────►│ Generates random token "abc789"
   │◄── 2. Response Sets Cookie: csrf_token="abc789" ───────│ No server-side session stored!
   │                                                        │
   │─── 3. POST /submit                                     │
   │       Cookie: csrf_token="abc789"                      │ Reads Header & Cookie
   │       Header: X-CSRF-Token: "abc789" ─────────────────►│ Validates: Header === Cookie
   │◄── 4. 200 OK (Match) / 403 Forbidden (Mismatch) ───────│

```

---

## 1. Synchronizer Token Pattern (Stateful)

The **Synchronizer Token Pattern** is the traditional, server-side session-based defense against CSRF.

### How It Works

1. **Token Generation:** When a user logs in or establishes a server-side session, the server generates a cryptographically secure, unguessable random string (the CSRF token) and stores it in the **server-side session storage** (e.g., Redis, database, or memory session).
2. **Token Injection:** When rendering an HTML page containing a form, the server embeds the token into a hidden form field or inline meta tag:

```html
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="d92a0b12e3f45678" />
  <input type="text" name="amount" />
  <button type="submit">Submit</button>
</form>

```

1. **Verification:** When the form is submitted, the server compares the incoming token parameter against the token stored in the user's active server session.

* **Match:** Request is processed.
* **Mismatch / Missing:** Request is rejected immediately with HTTP `403 Forbidden`.

### Why It Prevents CSRF

An attacker site (`attacker.com`) can trick the browser into submitting a form to `bank.com` (attaching the session cookie automatically), but the attacker **cannot read or predict** the hidden `csrf_token` embedded in `bank.com`'s DOM due to the browser's **Same-Origin Policy (SOP)**.

---

## 2. Double Submit Cookie Pattern (Stateless)

When building stateless architectures (such as Single Page Applications backed by REST APIs, microservices, or serverless functions), storing session state on the server can be expensive or impractical. The **Double Submit Cookie Pattern** provides a stateless alternative.

### How It Works

1. **Cookie Generation:** Upon authentication, the server generates a random token and sends it to the client as a readable (non-`HttpOnly`) cookie (e.g., `csrf_token=abc789`).
2. **Client-Side Extraction:** The client-side JavaScript application reads the `csrf_token` value from the document cookies.
3. **Double Submission:** When making state-changing API requests (`POST`, `PUT`, `DELETE`), the client submits the token value in **two separate places**:

* Automatically via the **Cookie** header (`Cookie: csrf_token=abc789`).
* Explicitly via a **Custom HTTP Request Header** (`X-CSRF-Token: abc789`) or request body payload.

1. **Stateless Verification:** The server compares the token sent in the custom header against the token sent in the cookie. It does **not** query a database or Redis session store.

* If `Header Value === Cookie Value`, the server trusts the request.

### Why It Prevents CSRF

Under the Same-Origin Policy, an attacker on `attacker.com` can force the victim's browser to send cookies to `bank.com`, but `attacker.com` **cannot read the cookie value** on `bank.com` to inject it into the custom `X-CSRF-Token` header.

---

## 3. Cryptographic / Signed Double Submit Cookie Variant

A vulnerability in the naive Double Submit Cookie pattern occurs if an attacker controls a sub-domain (e.g., `vulnerable.bank.com`) and overwrites the client's `csrf_token` cookie for `.bank.com`.

To prevent token tampering, modern APIs use the **Signed / Encrypted Double Submit Cookie Pattern**:

* The server sets the cookie as `HMAC(SecretKey, UserSessionID + Timestamp)`.
* When validating, the server verifies the cryptographic signature of the header token using its private key rather than performing a simple string equality match.

---

## Technical Comparison Matrix

| Metric                            | Synchronizer Token Pattern                                | Double Submit Cookie Pattern                                |
| --------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------- |
| **Server State Requirement**      | **Stateful** (Requires server session / Redis storage)    | **Stateless** (Zero server storage overhead)                |
| **Primary Token Location**        | Server Session + Hidden Form Field / Meta Tag             | Non-HttpOnly Cookie + Custom Header (`X-CSRF-Token`)        |
| **Ideal Architecture**            | Traditional Server-Rendered Apps (Rails, Django, Blade)   | Single Page Applications (React, Vue) & REST/GraphQL APIs   |
| **Main Vulnerability**            | Session storage exhaustion / multi-tab concurrency issues | Subdomain cookie overwriting (mitigated by HMAC signatures) |
| **Same-Origin Policy Dependency** | Relies on SOP preventing cross-site DOM reading           | Relies on SOP preventing cross-site cookie reading          |

---

## Summary Checklist

1. **State Modifications:** Never allow state changes or data mutations via `GET` requests.
2. **Header Matching:** For modern REST/GraphQL APIs, reading a token from cookies and attaching it to custom request headers (`X-CSRF-Token`) provides stateless, robust CSRF defense.
3. **Combine With SameSite:** Always combine anti-CSRF token patterns with `SameSite=Lax` or `SameSite=Strict` cookies for comprehensive security.
