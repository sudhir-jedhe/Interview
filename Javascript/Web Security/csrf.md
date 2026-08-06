### **Cross-Site Request Forgery (CSRF) in Detail**

**Cross-Site Request Forgery (CSRF)**, also known as **one-click attack** or **session riding**, is a type of **malicious exploit** where an attacker tricks a user into performing an unwanted action on a web application where they are authenticated. This can lead to **data theft**, **data manipulation**, or even **unauthorized actions** being performed on behalf of the user, without their consent.

CSRF attacks exploit the **trust that a web application has in the user's browser**. Essentially, if the user is authenticated and has an active session with a web application, the attacker can trick the browser into making requests that appear legitimate to the server, using the user’s credentials.

### **How CSRF Works**

Here's how a typical CSRF attack works:

1. **User Authentication**: The user logs into a web application (e.g., a banking app or social media site), and the server creates a session cookie to authenticate the user. This cookie is stored in the user's browser.

2. **Attacker's Malicious Site**: The attacker creates a malicious website or email that includes a **hidden request** (e.g., a form submission or an AJAX request) that targets the web application the user is authenticated with.

3. **User Visits the Malicious Site**: While the user is still logged into the legitimate web application (in the background), they unknowingly visit the malicious site controlled by the attacker.

4. **The Attack Request is Sent**: The malicious site sends a request (e.g., a POST request, typically with the user's credentials, using the s
5.
6. ession cookie) to the legitimate application, leveraging the user's active session and authentication cookies.

7. **Action is Executed**: Since the browser sends the authenticated request with the **session cookie**, the server processes the request as if it were made by the legitimate user, and the requested action is executed (e.g., transferring funds, changing an email address, etc.).

---

### **Example of a CSRF Attack**

Imagine you are logged into your online banking application and your session is still active. You visit a malicious website that contains a hidden form like this:

```html
<form action="https://yourbank.com/transfer" method="POST" style="display:none">
  <input type="text" name="account" value="attacker_account" />
  <input type="text" name="amount" value="1000" />
  <input type="submit" />
</form>
<script>
  document.forms[0].submit();
</script>
```

- The form is submitted to the bank's website, and the attacker has embedded it in a script that automatically submits the form without the user's knowledge.
- Since you are still logged into your bank’s website, the server processes the request with your session cookie, transferring $1000 to the attacker’s account.

---

### **How to Prevent CSRF**

There are several effective strategies to prevent CSRF attacks. Below are the most widely used methods:

### **1. Use Anti-CSRF Tokens**

One of the most common and effective techniques to prevent CSRF attacks is the use of **anti-CSRF tokens**.

- **Anti-CSRF Token**: A unique token is generated on the server side and added to each request made by the client (usually in the form of a hidden field or HTTP header). This token is tied to the user’s session and must be sent back with every state-changing request (like POST, PUT, DELETE).
- If the token is missing or incorrect, the request is rejected because it’s considered to be potentially a CSRF attack.

#### How Anti-CSRF Token Works:

1. The server generates a unique token for the user session and embeds it in the form or the HTTP request (e.g., as a hidden input field or in headers).
2. The browser submits the token along with the form or request.
3. The server compares the token in the request with the token stored in the session.
4. If they match, the request is processed. If not, the server rejects it.

Example:

- Server generates a CSRF token for the user: `csrfToken = "abc123"`.
- When sending a request (such as submitting a form), the token is included:

```html
<form method="POST" action="/update-profile">
  <input type="hidden" name="csrfToken" value="abc123" />
  <!-- other form fields -->
  <input type="submit" />
</form>
```

On the server, the request would be checked to ensure that `csrfToken` matches the one stored in the session.

### **2. SameSite Cookies**

The `SameSite` cookie attribute is another preventive measure that helps to prevent CSRF attacks by restricting how cookies are sent in cross-origin requests.

- **SameSite=Lax**: The cookie is sent with top-level navigations (i.e., links or form submissions) but not with third-party requests.
- **SameSite=Strict**: The cookie is only sent in same-origin requests, meaning that the cookie won’t be sent if the user is navigating to a different site.
- **SameSite=None**: The cookie is sent with all requests, including cross-origin ones, but requires the `Secure` flag (only transmitted over HTTPS).

```http
Set-Cookie: sessionId=abcd1234; SameSite=Strict;
```

Setting `SameSite` to `Strict` or `Lax` ensures that cookies are not sent with cross-origin requests, which are often the vector for CSRF attacks.

### **3. Require Authentication for Sensitive Actions (e.g., Re-authentication)**

Another strategy to prevent CSRF attacks is to **require re-authentication** or **additional confirmation** for sensitive actions (such as transferring money, changing passwords, etc.).

For example:

- For highly sensitive actions like changing the email or transferring funds, require the user to input their password or use multi-factor authentication (MFA).
- This ensures that even if the CSRF token or session is hijacked, the attacker cannot perform critical operations without the user’s credentials.

### **4. Use HTTP Headers (CORS)**

Cross-Origin Resource Sharing (CORS) allows you to specify which domains are allowed to make requests to your server. By restricting the allowed origins, you can mitigate the risk of CSRF.

- **CORS Headers**: Make sure that the server only accepts requests from trusted origins by using the `Access-Control-Allow-Origin` header.
- This prevents malicious sites from sending requests using the user’s credentials.

```http
Access-Control-Allow-Origin: https://yourtrusteddomain.com
```

### **5. Use HTTP Method Security**

- **Ensure GET Requests are Safe**: CSRF attacks typically target **state-changing operations** (POST, PUT, DELETE), so ensure that all GET requests are **idempotent** (i.e., they should not change data).
- For actions like form submissions or database updates, use **POST**, **PUT**, or **DELETE**, and make sure that these methods are protected by anti-CSRF tokens.

### **6. CAPTCHA for Form Submissions**

Adding **CAPTCHA** or **reCAPTCHA** to sensitive forms can help prevent CSRF attacks by ensuring that the request is coming from a legitimate human user rather than a malicious script.

- This step is especially useful in preventing automated attacks that attempt to exploit CSRF vulnerabilities.

### **7. Implement Content Security Policy (CSP)**

A **Content Security Policy (CSP)** is a browser feature that can be used to mitigate certain types of attacks, including CSRF. It allows a web application to specify which domains are allowed to load resources, preventing malicious scripts from running on your site.

Example:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; img-src 'self';
```

This helps prevent external domains from injecting scripts or malicious code that can perform CSRF attacks.

---

### **Conclusion: How to Prevent CSRF Attacks**

1. **Anti-CSRF Tokens**: Use unique tokens for each request that require state-changing actions. Validate these tokens on the server side.
2. **SameSite Cookies**: Set the `SameSite` attribute on cookies to restrict cross-origin requests.
3. **Re-authentication**: For critical operations, require the user to re-authenticate or perform additional actions (e.g., CAPTCHA, MFA).
4. **CORS Headers**: Restrict which origins are allowed to send requests to your server using CORS headers.
5. **Method Security**: Ensure that GET requests are safe and do not modify state.
6. **CAPTCHA**: Use CAPTCHA or reCAPTCHA for form submissions to prevent automated attacks.
7. **Content Security Policy (CSP)**: Implement CSP to restrict external scripts and resources.

By using a combination of these methods, you can significantly reduce the risk of CSRF attacks and protect your users from malicious exploits.

Here's my take: This snippet is the signature for **LeetCode 1389: Create Target Array in the Given Order**.

You are given two integer arrays, `nums` and `index`. Your goal is to insert each element `nums[i]` into a target array at index `index[i]`. In JavaScript, this is cleanly solved using `Array.prototype.splice()`.

---

### Optimal JavaScript Implementation ($\mathcal{O}(n^2)$)

Because `splice` shifts elements to the right when inserting at an existing index, it natively handles all insertion rules for this problem:

```javascript
/**
 * Given two arrays nums and index, creates a target array according to the rules:
 * Insert nums[i] at index index[i] in target array.
 *
 * @param {number[]} nums
 * @param {number[]} index
 * @returns {number[]} target
 */
export function createTargetArray(nums, index) {
  const target = [];

  for (let i = 0; i < nums.length; i++) {
    // Array.prototype.splice(start, deleteCount, item1)
    // Inserts nums[i] at position index[i] without deleting any existing elements
    target.splice(index[i], 0, nums[i]);
  }

  return target;
}
```

---

### Step-by-Step Example Execution

#### Input:

```javascript
const nums = [0, 1, 2, 3, 4];
const index = [0, 1, 2, 2, 1];

console.log(createTargetArray(nums, index));
```

#### Step-by-Step Trace:

| Step (`i`) | `nums[i]` | `index[i]` | Action                                           | Target Array State    |
| ---------- | --------- | ---------- | ------------------------------------------------ | --------------------- |
| **0**      | `0`       | `0`        | Insert `0` at index `0`                          | `[0]`                 |
| **1**      | `1`       | `1`        | Insert `1` at index `1`                          | `[0, 1]`              |
| **2**      | `2`       | `2`        | Insert `2` at index `2`                          | `[0, 1, 2]`           |
| **3**      | `3`       | `2`        | Insert `3` at index `2` _(shifts `2` right)_     | `[0, 1, 3, 2]`        |
| **4**      | `4`       | `1`        | Insert `4` at index `1` _(shifts `1,3,2` right)_ | **`[0, 4, 1, 3, 2]`** |

**Output:** `[0, 4, 1, 3, 2]`

---

### One-Liner Version (`Array.prototype.reduce`)

If you prefer a concise functional approach:

```javascript
export const createTargetArray = (nums, index) =>
  nums.reduce(
    (target, num, i) => (target.splice(index[i], 0, num), target),
    [],
  );
```

---

### Complexity Analysis

- **Time Complexity:** $\mathcal{O}(n^2)$ — Iterating through $n$ elements takes $\mathcal{O}(n)$, and `splice()` requires shifting up to $n$ elements in memory on each insertion, leading to $\mathcal{O}(n^2)$ overall time.
- **Space Complexity:** $\mathcal{O}(n)$ — Space needed to store the resulting `target` array of size $n$.

Here's my take: **CSRF (Cross-Site Request Forgery)** is a web security vulnerability that tricks an authenticated user into unknowingly submitting a malicious request to a web application where they are currently logged in.

Because browsers automatically attach stored session cookies with cross-site requests, the targeted website cannot distinguish between a legitimate request made by the user and a forged request triggered by an attacker's site.

---

### How a CSRF Attack Works (Step-by-Step)

1. **Active Session:** You log into your online banking platform at `bank.com`. The bank sets a session cookie (`session_id`) in your browser.
2. **Malicious Link:** Without logging out of `bank.com`, you visit a malicious website or click a phishing link (`evil.com`).
3. **Forged Request:** `evil.com` contains a hidden HTML form or JavaScript snippet that targets `bank.com`:

```html
<form action="https://bank.com/transfer" method="POST" id="csrfForm">
  <input type="hidden" name="toAccount" value="attacker_id" />
  <input type="hidden" name="amount" value="5000" />
</form>
<script>
  document.getElementById("csrfForm").submit();
</script>
```

4. **Automatic Cookie Transmission:** Your browser executes the request. Since `bank.com` owns the session cookie, the browser automatically attaches your valid authentication cookie to the request.
5. **Execution:** `bank.com` validates the cookie, assumes _you_ intended to transfer $5,000, and processes the transaction.

---

### How to Prevent CSRF (Defensive Strategies)

Modern web applications rely on three primary defense layers to prevent CSRF:

#### 1. Anti-CSRF Tokens (Synchronizer Token Pattern)

The server generates a unique, cryptographically random, unpredictable token for the user's current session. Every form submission must include this token as a hidden field.

- **Server Check:** The server validates the submitted token against the session token. Because `evil.com` cannot read cross-origin response content, it cannot predict or include this token in forged requests.

```html
<!-- Form with anti-CSRF token -->
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="d9f8a3c2e10b45..." />
  <input type="submit" value="Transfer" />
</form>
```

#### 2. `SameSite` Cookie Attribute

Configuring session cookies with `SameSite` restricts whether cookies are sent with cross-site requests:

- **`SameSite=Lax` (Default in modern browsers):** Withholds cookies on cross-site POST/PUT/DELETE requests (protects state-changing operations).
- **`SameSite=Strict`:** Withholds cookies on **all** cross-site requests, including standard incoming links.
- **`SameSite=None; Secure`:** Sends cookies on all requests, requiring HTTPS (leaves application vulnerable to CSRF unless protected by tokens).

```http
Set-Cookie: session_id=xyz123; SameSite=Lax; Secure; HttpOnly

```

#### 3. Custom Request Headers (`X-Requested-With` / Bearer Tokens)

APIs built with Single Page Applications (React, Vue) typically store access tokens in memory (e.g., JS variables or `localStorage`) rather than cookies.

Cross-origin sites (`evil.com`) cannot attach headers like `Authorization: Bearer <token>` or `X-Requested-With: XMLHttpRequest` without passing CORS preflight checks (`OPTIONS`), neutralizing CSRF risks for cookie-less APIs.

---

### CSRF vs. XSS (Quick Distinction)

| Feature                | CSRF (Cross-Site Request Forgery)                                      | XSS (Cross-Site Scripting)                                                  |
| ---------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Core Vulnerability** | Exploits the target app's trust in the browser/cookie.                 | Exploits the user's trust in vulnerable web page content.                   |
| **Attacker Action**    | Triggers an action on behalf of the user without reading the response. | Injects and executes arbitrary JavaScript code inside the victim's browser. |
| **Impact**             | Unauthorized state changes (password resets, transfers).               | Full account takeover, session hijacking, keylogging.                       |

How do you set up anti-CSRF token protection in an Express.js Node application using cookies or session tokens?
Here's my take: To set up anti-CSRF token protection in Express, you should choose the implementation pattern based on whether your application uses **server-side sessions** or **stateless double-submit cookies**.

> ⚠️ **Important Note:** The legacy `csurf` package is officially deprecated. Modern Express applications use **`csrf-sync`** (for server-side sessions using the Synchronizer Token Pattern) or **`csrf-csrf`** (for stateless apps using Double-Submit Cookies).

---

### Option 1: Synchronizer Token Pattern with `csrf-sync` (Stateful / Session-Based)

Use this pattern if your application uses `express-session` or `cookie-session` to store session state on the server. The server stores a secret in `req.session` and verifies the submitted CSRF token against it.

#### 1. Install Dependencies

```bash
npm install express express-session cookie-parser csrf-sync

```

#### 2. Server Setup (`app.js`)

```javascript
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { csrfSync } from "csrf-sync";

const app = express();

// 1. Essential Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("cookie-secret-key"));

// 2. Session Middleware (Required for csrf-sync)
app.use(
  session({
    secret: "session-super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "lax",
    },
  }),
);

// 3. Initialize csrf-sync
const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (req) => req.headers["x-csrf-token"] || req.body._csrf, // Look in header or body
});

// 4. Endpoint to fetch a new CSRF Token
app.get("/api/csrf-token", (req, res) => {
  const token = generateToken(req);
  res.json({ csrfToken: token });
});

// 5. Apply CSRF Protection to all routes below this middleware
app.use(csrfSynchronisedProtection);

// --- Protected Routes ---
app.post("/api/transfer", (req, res) => {
  res.json({ message: "Transfer processed safely!" });
});

// Error handling for invalid/missing CSRF tokens
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN" || err.message?.includes("CSRF")) {
    return res.status(403).json({ error: "Invalid or missing CSRF token" });
  }
  next(err);
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

### Option 2: Double-Submit Cookie Pattern with `csrf-csrf` (Stateless / SPAs)

Use this pattern if you don't use server-side sessions. It generates an encrypted/signed HMAC token in a cookie and requires the client to mirror that token back in a custom HTTP header (e.g., `X-CSRF-Token`).

#### 1. Install Dependencies

```bash
npm install express cookie-parser csrf-csrf

```

#### 2. Server Setup (`app.js`)

```javascript
import express from "express";
import cookieParser from "cookie-parser";
import { doubleCsrf } from "csrf-csrf";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("cookie-secret-key"));

// Configure double-submit cookie protection
const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => "csrf-secret-key-must-be-secure",
  cookieName: "__Host-ps.x-csrf-token", // Secure host prefix
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

// Route to get token (sets the HTTP-only cookie and returns the raw token)
app.get("/api/csrf-token", (req, res) => {
  const token = generateToken(req, res);
  res.json({ csrfToken: token });
});

// Apply protection to state-changing methods (POST, PUT, DELETE, etc.)
app.use(doubleCsrfProtection);

app.post("/api/update-profile", (req, res) => {
  res.json({ message: "Profile updated successfully!" });
});
```

---

### Client-Side Integration Examples

#### Standard HTML Form (Server-Side Templating e.g., EJS/Pug)

Include the token as a hidden input field:

```html
<form action="/api/transfer" method="POST">
  <!-- Include hidden token input -->
  <input type="hidden" name="_csrf" value="<%= csrfToken %>" />

  <input type="number" name="amount" placeholder="Amount" />
  <button type="submit">Submit Transfer</button>
</form>
```

#### SPA Client (`fetch` / `axios`)

Fetch the token on initialization and pass it in the `X-CSRF-Token` header:

```javascript
// 1. Fetch token from server
const response = await fetch("/api/csrf-token");
const { csrfToken } = await response.json();

// 2. Attach token header to subsequent POST/PUT/DELETE requests
await fetch("/api/transfer", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken, // Required by CSRF middleware
  },
  body: JSON.stringify({ amount: 500 }),
});
```

---

### Summary Checklist for Anti-CSRF Setup

1. **HTTP-Only Cookies:** Set `httpOnly: true` on session cookies so malicious scripts cannot read them via JavaScript (`XSS`).
2. **`SameSite=Lax` or `Strict`:** Instructs modern browsers to withhold cookies on cross-site state-changing requests.
3. **Safe Methods Ignored:** Ensure `GET`, `HEAD`, and `OPTIONS` requests remain read-only and bypass token checks.
4. **`Secure` Flag:** Always enforce `secure: true` in production so cookies travel exclusively over HTTPS.

What are the key differences between SameSite Lax, Strict, and None cookie attributes with real-world examples?
Here's my take: The `SameSite` cookie attribute controls whether cookies are sent along with **cross-site requests** (e.g., when navigating to or fetching resources on `siteA.com` from `siteB.com`).

It serves as a primary browser-level defense against **Cross-Site Request Forgery (CSRF)** attacks by preventing unauthorized session cookie leakage.

---

### Understanding "Site" vs "Origin"

Before looking at the attributes, remember that `SameSite` evaluates the **eTLD+1** (effective Top-Level Domain + 1 level).

- `app.example.com` and `api.example.com` are **Same-Site** (both belong to `example.com`).
- `example.com` and `evil.com` are **Cross-Site**.

---

### The Three Modes Compared

#### 1. `SameSite=Lax` (The Modern Default)

The cookie is withheld on cross-site subrequests (like `<img>`, `<iframe>`, or `POST` forms), but **it IS sent during top-level user navigations using safe HTTP methods (`GET`)**.

- **Behavior:** Sent on same-site requests + top-level `GET` navigation from external sites.
- **Withheld on:** Cross-site `POST` requests, AJAX `fetch()` / `axios`, images, or iframes embedded on another site.
- **Real-World Example:** You are logged into `github.com`. Someone posts a link to `[github.com/my-repo](https://github.com/my-repo)` on Twitter. When you click that link, your browser performs a top-level `GET` navigation. Because the cookie is `SameSite=Lax`, your session cookie is attached, and GitHub renders the page with you already logged in. However, if `evil.com` tries to submit an auto-submitting `<form action="[github.com/settings](https://github.com/settings)" method="POST">`, the cookie is withheld, blocking the CSRF attack.

#### 2. `SameSite=Strict`

The cookie is **never** sent in any cross-site context. It is strictly limited to first-party requests originating from the exact same site.

- **Behavior:** Sent ONLY when the user is already navigating within your domain.
- **Withheld on:** ALL cross-site requests, including incoming links clicked from external sites.
- **Real-World Example:** Your online banking application sets `Set-Cookie: session=xyz; SameSite=Strict`. You are logged in, but then click a link to your bank from an email or a Google search result. Because you arrived from an external origin, the browser withholds the `Strict` cookie. The bank sees you as unauthenticated and prompts you to log in again.
- **Best Used For:** High-security sensitive portals (banking, admin panels) where UX friction (re-authentication upon external link click) is acceptable for maximum security.

#### 3. `SameSite=None`

The cookie is sent across **all** contexts, including third-party `<iframe>` embeds, cross-origin `fetch()` requests, and cross-site form posts.

- **Mandatory Requirement:** You **MUST** append the `Secure` attribute (`SameSite=None; Secure`). Browsers will reject `SameSite=None` cookies sent over plain HTTP.
- **Behavior:** Behaves like legacy cookies (sent everywhere).
- **Real-World Example:** Embedded widgets, cross-domain SSO, or embedded video players. If `youtube.com` embeds an interactive player via an `<iframe>` inside `news-website.com`, Youtube needs your user preference cookies attached to that iframe request. Youtube sets its session/preference cookies with `SameSite=None; Secure`.
- **Best Used For:** Embedded widgets, cross-site API integrations, and third-party embeds.

---

### Summary Comparison Table

| Feature / Scenario                                           | `SameSite=Strict` | `SameSite=Lax` (Default) | `SameSite=None; Secure`       |
| ------------------------------------------------------------ | ----------------- | ------------------------ | ----------------------------- |
| **Internal navigation** (`a.com` $\to$ `a.com`)              | ✅ Sent           | ✅ Sent                  | ✅ Sent                       |
| **Clicking external link** (`b.com` $\to$ `a.com` via `GET`) | ❌ Withheld       | ✅ Sent                  | ✅ Sent                       |
| **Cross-site POST Form** (`b.com` $\to$ `a.com`)             | ❌ Withheld       | ❌ Withheld              | ✅ Sent                       |
| **Cross-site `fetch()` / AJAX** (`b.com` $\to$ `a.com`)      | ❌ Withheld       | ❌ Withheld              | ✅ Sent                       |
| **Embedded `<iframe>` / `<img>**` (`b.com`embeds`a.com`)     | ❌ Withheld       | ❌ Withheld              | ✅ Sent                       |
| **Requires `Secure` flag?**                                  | Optional          | Optional                 | **Mandatory**                 |
| **CSRF Defense Level**                                       | Maximum           | Strong (Default)         | None (Requires manual tokens) |

---

### Syntax Quick Reference

```http
# Modern Default (Safe for most web apps)
Set-Cookie: session=123; Path=/; SameSite=Lax; HttpOnly; Secure

# High Security (Banking / Admin)
Set-Cookie: session=123; Path=/; SameSite=Strict; HttpOnly; Secure

# Third-Party / Embedded Content
Set-Cookie: widget_id=abc; Path=/; SameSite=None; Secure; HttpOnly

```
