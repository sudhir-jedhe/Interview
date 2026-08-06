**OAuth 2.1** consolidates a decade of security learned from OAuth 2.0. Among its biggest changes: **it deprecates the Implicit Grant and Resource Owner Password Credentials flows entirely**, making the **Authorization Code Flow with PKCE (Proof Key for Code Exchange, pronounced "pixie")** the mandatory standard for *all* clients—including Single Page Applications (SPAs), mobile apps, and server-side web apps.

PKCE (defined originally in RFC 7636) prevents **Authorization Code Interception Attacks**, making OAuth safe on public or untrusted clients.

---

# Architecture of OAuth 2.1 Authorization Code Flow with PKCE

```text
 Client (SPA / Mobile App)             Browser / User Agent             Authorization Server
   │                                           │                                 │
   │ 1. Generates code_verifier & code_challenge                              │
   │                                           │                                 │
   │ 2. Redirects to /authorize ──────────────►│                                 │
   │    (with code_challenge & method=S256)    │ 3. User authenticates & consents│
   │                                           ├────────────────────────────────►│
   │                                           │                                 │
   │ 4. Authorization Code returned ───────────┼◄────────────────────────────────┤
   │    (Redirect to redirect_uri?code=XYZ)    │                                 │
   │                                           │                                 │
   │ 5. POST /token ────────────────────────────────────────────────────────────►│
   │    (code=XYZ + original code_verifier)                                      │ Verifies: SHA256(code_verifier)
   │                                                                             │           === code_challenge
   │ 6. Returns Access Token (+ Refresh Token) ◄─────────────────────────────────┤

```

---

## 1. The Vulnerability PKCE Solves: Authorization Code Interception

In the legacy OAuth 2.0 flow, the client redirected the user to the Authorization Server, which returned an **Authorization Code** via a redirect URI callback (e.g., `my-app://oauth-callback?code=XYZ`).

### The Threat on Public Clients (SPAs & Mobile)

On mobile OSs or desktop environments, multiple apps can register custom URI schemes (e.g., `my-app://`). A malicious app installed on the victim's device could register the same custom URI scheme, intercept the redirect containing `code=XYZ`, and exchange that authorization code for tokens—stealing access to the user's account.

Because public clients cannot safely store a secret (`client_secret`), the Authorization Server had no way to verify whether the entity exchanging `code=XYZ` was the *same application* that initiated the authorization request.

---

## 2. How PKCE Works: The Cryptographic Binding

PKCE solves this by generating a dynamic, high-entropy secret **per request** on the client.

### Step 1: Create `code_verifier` and `code_challenge`

Before making the authorization request, the client generates two cryptographically linked values locally:

1. **`code_verifier`:** A high-entropy, cryptographically random string (43 to 128 characters long using `[A-Z]`, `[a-z]`, `[0-9]`, `-`, `.`, `_`, `~`).
2. **`code_challenge`:** The SHA-256 hash of the `code_verifier`, Base64URL-encoded:

$$\text{code\_challenge} = \text{Base64URL}(\text{SHA256}(\text{code\_verifier}))$$

```javascript
// Conceptual PKCE Generation in JavaScript
const crypto = window.crypto;

function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

```

---

### Step 2: The Authorization Request

The client redirects the user to the Authorization Server's `/authorize` endpoint, sending the **`code_challenge`** and transformation method (`code_challenge_method=S256`), but keeping the `code_verifier` hidden locally in memory:

```http
GET /authorize?
  response_type=code
  &client_id=my_spa_client
  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback
  &scope=openid%20profile%20email
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256
  &state=xyz123 HTTP/1.1
Host: auth.example.com

```

The Authorization Server authenticates the user, stores the `code_challenge` alongside the generated Authorization Code (`code=XYZ`), and redirects the browser back to the client.

---

### Step 3: Token Exchange

The client intercepts `code=XYZ` and makes a `POST` request to the `/token` endpoint, including the original, raw **`code_verifier`**:

```http
POST /token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id=my_spa_client
&redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback
&code=XYZ_AUTH_CODE
&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

```

---

### Step 4: Verification

The Authorization Server performs the verification step:

1. Takes the submitted `code_verifier` from the POST body.
2. Applies SHA-256 hashing and Base64URL encoding to it.
3. Compares the result against the `code_challenge` previously stored during Step 2.

$$\text{Base64URL}(\text{SHA256}(\text{submitted \_ verifier})) \stackrel{?}{=} \text{stored \_ challenge}$$

* **Match:** Proves that the entity exchanging the code is the **exact same entity** that initiated the request. Tokens are issued.
* **Mismatch:** Request is rejected immediately. Even if a malicious app intercepted `code=XYZ`, it cannot exchange it because it lacks the original `code_verifier`.

---

## 3. Key Enhancements in OAuth 2.1

Beyond making PKCE mandatory across all client types, OAuth 2.1 introduces several critical security upgrades:

1. **Mandatory PKCE for Confidential Clients Too:** Even backend web applications with a `client_secret` must use PKCE to prevent authorization code injection and cross-site code leaks.
2. **Strict Exact Match Redirect URIs:** Partial matching, wildcard paths, or subdomain matching on `redirect_uri` are forbidden. The URI must match character-for-character.
3. **Deprecation of Implicit Grant (`response_type=token`):** Tokens must never be returned directly in URL hash fragments (`#access_token=...`), preventing token leaks in access logs, browser histories, and `Referer` headers.
4. **Bearer Token Usage Restrictions:** Discourages plain Bearer tokens in favor of sender-constrained tokens like **mTLS** or **DPoP (Demonstrating Proof-of-Possession)** to prevent stolen token replay attacks.

---

## Technical Summary Matrix

| Metric                      | OAuth 2.0 (Legacy)                                         | OAuth 2.1 (Current Standard)                          |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------------------------- |
| **PKCE Usage**              | Optional (Recommended for public clients)                  | **Mandatory** for all clients (Public & Confidential) |
| **Allowed Flows**           | Authorization Code, Implicit, Password, Client Credentials | Authorization Code + PKCE, Client Credentials         |
| **Redirect URI Matching**   | Loose / Wildcards allowed in some implementations          | **Strict Exact String Match** required                |
| **Token Delivery**          | Allowed in URI hash fragment (Implicit)                    | **Strictly via POST `/token` Response Body**          |
| **`code_challenge_method`** | Allowed `plain` or `S256`                                  | `S256` required (`plain` is deprecated)               |
