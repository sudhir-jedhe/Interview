**API security** is the practice of protecting application programming interfaces (APIs) from malicious attacks, unauthorized access, data leaks, and service disruptions. Because APIs act as direct entry points to your application's business logic and databases, they are prime targets for cyberattacks.

---

## 1. Authentication vs. Authorization

Never confuse who a user is with what they are allowed to do.

* **Authentication (Who are you?):** Verifying the identity of the client. Commonly implemented using **JWT (JSON Web Tokens)**, **OAuth 2.0 flows**, or secure API keys passed via headers (e.g., `Authorization: Bearer <token>`).
* **Authorization (What can you do?):** Ensuring the authenticated user has permission to access a specific resource. Always enforce server-side permission checks.

---

## 2. Preventing OWASP API Top 10 Vulnerabilities

The Open Worldwide Application Security Project (OWASP) maintains a critical list of top API vulnerabilities. The most dangerous and common include:

### A. Broken Object Level Authorization (BOLA / IDOR) — *#1 Threat*

* **The Risk:** An API endpoint allows a user to access or modify data simply by changing an ID in the URL (e.g., changing `/api/v1/users/101/orders` to `/api/v1/users/102/orders` to view another user's orders).
* **The Fix:** Always verify on the server that the currently authenticated user owns or has explicit permission to access the requested resource ID, regardless of what ID was passed in the request.

### B. Broken User Authentication

* **The Risk:** Weak token validation, improper token expiration, or storing secrets insecurely.
* **The Fix:** Use battle-tested auth libraries, enforce short token expiration times coupled with secure refresh token rotation, and never store plaintext passwords.

---

## 3. Input Validation & Sanitization

Never trust data coming from the client. Malicious actors can send malformed payloads, SQL injection scripts, or massive JSON structures to crash your server.

* **Strict Schema Validation:** Use validation libraries like **Zod**, **Joi**, or **AJV** to validate every incoming request body, query parameter, and route variable against a strict schema before processing.
* **Sanitization:** Strip dangerous characters or HTML tags if storing user-generated content to prevent Cross-Site Scripting (XSS).

---

## 4. Rate Limiting & Throttling

APIs without rate limits are vulnerable to **Brute-Force attacks**, **Credential Stuffing**, and **Denial of Service (DoS)** attacks.

* **Implementation:** Restrict the number of requests a single IP address, user, or API key can make within a given time window (e.g., max 100 requests per 15 minutes).
* **Response Headers:** Return standard rate-limiting headers so clients know their limits:
* `X-RateLimit-Limit: 100`
* `X-RateLimit-Remaining: 42`
* `X-RateLimit-Reset: 1717684800`

---

## 5. Transport Security & Headers

* **Enforce HTTPS / TLS:** All API traffic must be encrypted in transit using TLS (Transport Layer Security). Never allow unencrypted HTTP endpoints in production.
* **CORS (Cross-Origin Resource Sharing):** Configure strict CORS headers on your server to ensure only trusted frontend domains can talk to your API.
* **Security Headers:** Implement headers like `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, and `Strict-Transport-Security` (HSTS) via middleware.

---

Are you looking to secure a specific type of API architecture (such as a Node.js Express backend, a Next.js server action, or a public third-party developer API)?
