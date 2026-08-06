**Content Security Policy (CSP)** is an HTTP response header that acts as a primary defense-in-depth mechanism against Cross-Site Scripting (XSS) and data injection attacks.

Historically, CSP relied on **Domain Whitelisting** (e.g., `script-src 'self' [https://cdn.example.com](https://cdn.example.com)`). However, domain whitelisting proved fragile and vulnerable to JSONP bypasses or open-redirect exploits on whitelisted CDNs.

Modern CSP security relies on **Cryptographic Nonces**, **Source Hashes**, and the **`'strict-dynamic'`** directive to strictly restrict script execution without maintaining fragile domain allowlists.

---

# Architecture of Modern CSP Script Controls

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. NONCE-BASED EXECUTION                                               │
 │ Server generates random token ──► HTTP Header: script-src 'nonce-r4nd0m'│
 │ Browser checks tag attribute ──► <script nonce="r4nd0m">               │
 └────────────────────────────────────────────────────────────────────────┘

 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. HASH-BASED EXECUTION                                                │
 │ Server calculates SHA-256 hash ──► HTTP Header: script-src 'sha256-...'│
 │ Browser hashes script contents ──► Executes ONLY if hash matches       │
 └────────────────────────────────────────────────────────────────────────┘

 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. 'STRICT-DYNAMIC' PROPAGATION                                        │
 │ Trusted Nonce/Hash Script ──► Dynamically creates new <script>        │
 │ Browser automatically trusts dynamically loaded child scripts          │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 1. Cryptographic Nonces (`'nonce-<base64>'`)

A **nonce** ("number used once") is a cryptographically strong, unguessable random string generated **uniquely per HTTP request** by the application server.

### How Nonces Work Step-by-Step

1. **Server Generation:** For every HTTP GET request, the server generates a unique Base64 string (minimum 128 bits of entropy):

```text
Nonce: "d92a0b12e3f456789a10b11c12d13e14"

```

1. **Header Emission:** The server injects the nonce into the CSP HTTP header:

```http
Content-Security-Policy: script-src 'nonce-d92a0b12e3f456789a10b11c12d13e14';

```

1. **HTML Injection:** The server attaches the matching `nonce` attribute to all authorized inline and external `<script>` tags in the HTML response:

```html
<!-- ✅ Executed: Nonce matches header -->
<script nonce="d92a0b12e3f456789a10b11c12d13e14" src="/js/app.js"></script>

<script nonce="d92a0b12e3f456789a10b11c12d13e14">
  console.log("Authorized inline script execution");
</script>

<!-- ❌ Blocked: Injected XSS payload has no valid nonce -->
<script>alert(document.cookie)</script>

```

> **Critical Safety Rule:** Never reuse nonces across multiple HTTP responses or static files. If an attacker can predict or read a static nonce, they can bypass the policy entirely.

---

## 2. Script Hashes (`'sha256-...` / `'sha384-...` / `'sha512-...`)

When server-side rendering with dynamic per-request nonces is not possible (e.g., static site generation or Jamstack architectures), **Cryptographic Hashes** allow you to whitelist exact inline script bodies.

### How Hashes Work Step-by-Step

1. Calculate the SHA-256 digest of the exact string contents inside the `<script>` tag:

```bash
echo -n "console.log('Hello World');" | openssl dgst -sha256 -binary | openssl base64
# Output: 5J3a...=

```

1. Add the hash to your CSP header:

```http
Content-Security-Policy: script-src 'sha256-5J3a...=';

```

1. The browser hashes inline scripts during HTML parsing. If the computed digest matches the value in the CSP header, the browser executes the script.

```html
<!-- ✅ Executed: Hash matches header -->
<script>console.log('Hello World');</script>

<!-- ❌ Blocked: Any modification (even a single space) changes the hash -->
<script>console.log('Hello World'); </script>

```

---

## 3. The `'strict-dynamic'` Keyword

Historically, complex web applications loaded secondary modules dynamically using JavaScriptDOM APIs (`document.createElement('script')`). Under a strict nonce policy, every dynamically created script element would fail because client-side JavaScript cannot predict or access the server-side HTTP nonce header safely.

To solve this, CSP Level 3 introduced **`'strict-dynamic'`**.

### How `'strict-dynamic'` Operates

When `'strict-dynamic'` is present in `script-src`:

1. **Trust Inheritance:** The browser grants trust to any script that has a valid `nonce` or `hash`.
2. **Propagated Trust:** If an already-trusted script dynamically creates a new `<script>` element using `document.createElement('script')`, the browser **automatically trusts the new child script**—without requiring a `nonce` or domain whitelist on the child script.
3. **Disables Domain Allowlists & Inline Constraints:** `'strict-dynamic'` automatically overrides and disables domain allowlists (like `https:`) and `'unsafe-inline'` in supporting browsers, simplifying management while improving security.

```html
<!-- CSP Header: script-src 'nonce-12345' 'strict-dynamic'; -->

<!-- 1. Trusted Root Script (Has valid nonce) -->
<script nonce="12345">
  // 2. Dynamically creates a child script
  const s = document.createElement('script');
  s.src = "https://third-party.com/analytics.js";
  
  // ✅ Executed: 'strict-dynamic' instructs browser to trust scripts 
  // created by an already-authenticated parent script!
  document.head.appendChild(s);
</script>

```

---

## 4. Modern Strict CSP Configuration Blueprint

Here is the industry-standard, production-ready **Strict CSP** header pattern recommended by Google Security:

```http
Content-Security-Policy:
  script-src 'nonce-RANDOM_BASE64_TOKEN' 'strict-dynamic' 'unsafe-inline' https:;
  object-src 'none';
  base-uri 'none';

```

### Breakdown of Fallbacks

* `'nonce-RANDOM_BASE64_TOKEN'`: Enforces nonce verification in modern CSP Level 3 browsers.
* `'strict-dynamic'`: Enables dynamic script propagation for analytics/tag managers.
* `'unsafe-inline'`: **Ignored by modern browsers** when a nonce is present; acts as a backward-compatibility fallback for legacy browsers (CSP Level 1).
* `https:`: **Ignored by CSP Level 3** when `'strict-dynamic'` is present; acts as a fallback for older browsers.
* `object-src 'none'`: Blocks dangerous legacy plugins like Flash or Java Applets.
* `base-uri 'none'`: Prevents attackers from injecting `<base href="...">` tags to hijack relative script path resolution.

---

## Summary Matrix

| Mechanism                   | Dynamic Server Required?               | Primary Use Case                                            | Key Strength / Trade-off                                              |
| --------------------------- | -------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| **Nonces (`'nonce-...'`)**  | **Yes** (New token per request)        | Server-Rendered Applications (Next.js, Express, Rails)      | High security; prevents inline XSS payloads completely.               |
| **Hashes (`'sha256-...'`)** | **No** (Calculated at build time)      | Static Sites (SSG / Jamstack / Single Page Apps)            | Perfect for fixed inline boot scripts; breaks if script text changes. |
| **`'strict-dynamic'`**      | Optional (Works with nonces or hashes) | Applications using third-party tag managers or lazy-loading | Eliminates domain whitelists; delegates trust to root scripts.        |
