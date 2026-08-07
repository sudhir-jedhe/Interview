**HTTP Cookies** are small text files stored directly in the user's browser by websites. In JavaScript, you can create, read, and delete cookies using the **`document.cookie`** string property.

Unlike modern client-side storage mechanisms like `localStorage`, cookies are automatically sent to the server with every subsequent HTTP request, making them essential for server-side session management, authentication tokens, and user tracking.

---

## 1. How `document.cookie` Works

Reading `document.cookie` returns a single string containing **all** cookies for the current domain, separated by semicolons (`name1=value1; name2=value2`).

Writing to `document.cookie` does **not** overwrite all cookies; instead, it assigns or updates a single cookie based on the string you provide.

---

## 2. Cookie Attributes & Configuration

When setting a cookie, you can append optional security and scope attributes separated by semicolons:

| Attribute      | Description                                                        | Example                                   |
| -------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| **`expires`**  | Specific UTC date when the cookie expires and is deleted.          | `; expires=Wed, 31 Oct 2028 12:00:00 UTC` |
| **`max-age`**  | Lifetime of the cookie in seconds (preferred over `expires`).      | `; max-age=86400` (1 day)                 |
| **`path`**     | URL path where the cookie is accessible. Default is current path.  | `; path=/` (accessible site-wide)         |
| **`domain`**   | Specifies which domains can receive the cookie.                    | `; domain=example.com`                    |
| **`Secure`**   | Ensures the cookie is only transmitted over encrypted HTTPS.       | `; Secure`                                |
| **`SameSite`** | Controls cross-site request behavior (`Strict`, `Lax`, or `None`). | `; SameSite=Lax`                          |

---

## 3. Practical Code Examples (Helper Functions)

Because working with `document.cookie` raw strings is tedious, developers typically use small helper functions to set, get, and delete cookies:

### A. Setting a Cookie

```javascript
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  // Set cookie with secure defaults (path=/ and SameSite=Lax)
  document.cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=/; SameSite=Lax`;
}

// Usage: Set a cookie named "username" to "Alice" that lasts for 7 days
setCookie("username", "Alice", 7);

```

---

### B. Reading a Cookie

```javascript
function getCookie(name) {
  const nameEQ = name + "=";
  const cookiesArray = document.cookie.split(';');

  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim();
    // Check if this cookie starts with the requested name
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
}

// Usage: Retrieve the username cookie
const currentUser = getCookie("username");
console.log(currentUser); // "Alice"

```

---

### C. Deleting a Cookie

To delete a cookie, you set its expiration date or `max-age` to a past time:

```javascript
function deleteCookie(name) {
  // Set max-age to 0 or a negative number to instantly expire it
  document.cookie = `${name}=; max-age=-99999999; path=/`;
}

// Usage: Delete the username cookie
deleteCookie("username");

```

---

## 4. Client-Side vs. Server-Side Security (`HttpOnly`)

* **JavaScript-accessible cookies:** Cookies set via `document.cookie` can be read and modified by any malicious XSS (Cross-Site Scripting) script running in the browser.
* **`HttpOnly` cookies:** For sensitive authentication tokens (like JWTs or session IDs), the server should set the cookie with the **`HttpOnly`** flag in the HTTP header (e.g., `Set-Cookie: token=xyz; HttpOnly; Secure`). **`HttpOnly` cookies cannot be accessed or modified by JavaScript**, protecting them from theft via XSS attacks.

Explain web security best practices against XSS and CSRF in JavaScript

**XSS (Cross-Site Scripting)** and **CSRF (Cross-Site Request Forgery)** are two of the most prevalent client-side vulnerabilities on the web. Understanding how they operate—and enforcing defense-in-depth practices—is essential for building secure web applications in JavaScript.

---

## 1. Cross-Site Scripting (XSS)

### How XSS Works

XSS occurs when an attacker tricks a web application into executing malicious JavaScript code within an innocent victim's browser context.

* **Stored XSS:** The malicious payload is saved directly into a database (e.g., inside a comment section) and rendered to every user who loads that page.
* **Reflected XSS:** The payload is embedded inside an incoming HTTP request (e.g., query strings like `?search=<script>...</script>`) and reflected back in the HTML response.
* **DOM-based XSS:** Client-side JavaScript directly reads unsanitized user input (from `location.hash`, `location.search`, etc.) and dynamically inserts it into the DOM.

---

### XSS Prevention Best Practices

#### A. Avoid Dangerous DOM Insertion APIs

Never use `innerHTML`, `outerHTML`, or `document.write()` with user-supplied data. Instead, use safe node-creation APIs that treat input strictly as string data rather than executable HTML:

```javascript
// ❌ VULNERABLE: Executes injected script tags
const userInput = "<img src=x onerror=alert('XSS')>";
document.getElementById("user-comment").innerHTML = userInput;

// ✅ SECURE: Treats input strictly as text content
const commentEl = document.getElementById("user-comment");
commentEl.textContent = userInput; // Renders plain text safely

```

#### B. Sanitize Untrusted HTML Output

If users *must* post formatted HTML (e.g., rich-text editors), sanitize the input using an audited library like **DOMPurify** before rendering:

```javascript
import DOMPurify from 'dompurify';

const rawHtml = `<p>Hello <script>stealCookies()</script> world!</p>`;

// ✅ SECURE: Strips executable script tags and malicious attributes
const cleanHtml = DOMPurify.sanitize(rawHtml);
document.getElementById("content").innerHTML = cleanHtml;

```

#### C. Enforce Content Security Policy (CSP)

Configure your server to send a **`Content-Security-Policy`** HTTP response header. A strong CSP restricts where scripts can be loaded from and blocks inline `<script>` tag execution:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com;

```

#### D. Store Sensitive Session Tokens in `HttpOnly` Cookies

Do **not** store session tokens or JWTs in `localStorage` or `sessionStorage`—any XSS vulnerability on the domain allows an attacker to read all stored keys. Store authentication tokens in `HttpOnly` cookies so JavaScript cannot read them via `document.cookie`.

---

## 2. Cross-Site Request Forgery (CSRF)

### How CSRF Works

CSRF occurs when a malicious website tricks a user's browser into performing an unauthorized action on a target web application where the user is currently authenticated.

1. Alice logs into `bank.com`. Her browser receives a session cookie.
2. Without logging out, Alice visits a malicious site `evil.com`.
3. `evil.com` contains a hidden form or `fetch()` call targeting `[https://bank.com/transfer?amount=1000](https://bank.com/transfer?amount=1000)`.
4. The browser automatically attaches Alice's `bank.com` session cookie to the cross-site request, and the bank processes the unauthorized transfer.

---

### CSRF Prevention Best Practices

#### A. Use strict `SameSite` Cookie Attributes

Set the `SameSite` attribute on all session cookies. This prevents browsers from attaching the cookie to cross-site requests initiated by third-party sites:

```http
Set-Cookie: session_id=xyz123; Secure; HttpOnly; SameSite=Lax;

```

* **`SameSite=Lax` (Recommended Default):** Cookies are withheld on cross-site subrequests (like images or `fetch()`), but attached when navigating top-level GET requests (like following a link).
* **`SameSite=Strict`:** Cookies are never sent on cross-site requests, even when following a direct link.

#### B. Implement Anti-CSRF Synchronizer Tokens

For state-changing requests (`POST`, `PUT`, `DELETE`), generate a cryptographically secure, unpredictable token on the server for each user session. Require client-side JavaScript to send this token in an HTTP header (such as `X-CSRF-Token`):

```javascript
// Send CSRF token in fetch headers
async function transferFunds(recipient, amount) {
  // Read CSRF token from a <meta> tag or initial payload
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

  await fetch("/api/transfer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken // Server verifies this token before processing
    },
    body: JSON.stringify({ recipient, amount })
  });
}

```

#### C. Use Custom HTTP Request Headers

Browsers enforce Same-Origin Policy (SOP) preflight checks (`OPTIONS` requests) for requests containing custom HTTP headers (like `X-Requested-With`). Cross-site forms cannot attach custom headers without explicitly passing CORS preflight validation on the target domain.

---

## Defense Matrix Summary

| Vulnerability | Attack Vector                                                      | Key Defense Best Practices                 |
| ------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| **XSS**       | Injected JavaScript executing inside the victim's browser context. | • Use `.textContent` over `.innerHTML`<br> |

<br>• Sanitize HTML with `DOMPurify`<br>

<br>• Enforce a strict `Content-Security-Policy`<br>

<br>• Store session tokens in `HttpOnly` cookies |
| **CSRF** | Cross-site request leveraging automatically attached ambient credentials (cookies). | • Set `SameSite=Lax` or `SameSite=Strict` on cookies<br>

<br>• Require Anti-CSRF tokens in custom HTTP headers<br>

<br>• Verify request origins on the server (`Origin` and `Referer` headers) |

Explain JavaScript Cookies with code examples

**HTTP Cookies** are small text key-value pairs stored directly in the user's browser. In client-side JavaScript, you create, read, and delete cookies using the **`document.cookie`** property.

Unlike `localStorage` or `sessionStorage`, cookies are automatically attached to every outgoing HTTP request to the origin server, making them the primary tool for server-side session identification, authentication tokens, and user preferences.

---

## 1. How `document.cookie` Works

Reading `document.cookie` returns a single string containing **all** cookies for the current domain, separated by semicolons (`key1=val1; key2=val2`).

Writing to `document.cookie` does **not** overwrite the entire string; instead, it sets or updates a single cookie based on the key-value string provided.

```javascript
// Setting a cookie
document.cookie = "username=Alice";

// Reading all cookies
console.log(document.cookie); // "username=Alice; theme=dark"

```

---

## 2. Cookie Attributes & Security Options

When assigning a cookie, you can append key attributes separated by semicolons:

| Attribute      | Description                                                        | Example                                   |
| -------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| **`expires`**  | Expiration date in UTC string format. Default is session end.      | `; expires=Wed, 31 Oct 2029 12:00:00 UTC` |
| **`max-age`**  | Expiration offset in seconds (preferred over `expires`).           | `; max-age=86400` (1 day)                 |
| **`path`**     | Defines the scope URL path.                                        | `; path=/` (accessible site-wide)         |
| **`domain`**   | Subdomain scope for the cookie.                                    | `; domain=example.com`                    |
| **`Secure`**   | Ensures transmission occurs strictly over HTTPS.                   | `; Secure`                                |
| **`SameSite`** | Controls cross-site request behavior (`Lax`, `Strict`, or `None`). | `; SameSite=Lax`                          |

---

## 3. Practical Code Examples (Helper Functions)

Because raw parsing of `document.cookie` strings is prone to errors, developers use reusable helper functions:

### A. Setting a Cookie

```javascript
function setCookie(name, value, days = 7) {
  // Convert days to seconds for max-age
  const maxAge = days * 24 * 60 * 60;
  
  // Always encode values to safely handle spaces and special characters
  const encodedValue = encodeURIComponent(value);

  // Assign cookie with recommended security attributes
  document.cookie = `${name}=${encodedValue}; max-age=${maxAge}; path=/; SameSite=Lax; Secure`;
}

// Usage: Store "theme" as "dark" for 14 days
setCookie("theme", "dark", 14);

```

---

### B. Reading a Cookie

```javascript
function getCookie(name) {
  const cookieName = name + "=";
  const cookieArray = document.cookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    // Check if the current entry starts with the requested key name
    if (cookie.indexOf(cookieName) === 0) {
      return decodeURIComponent(cookie.substring(cookieName.length));
    }
  }
  return null; // Return null if not found
}

// Usage: Retrieve the "theme" cookie
const currentTheme = getCookie("theme");
console.log(currentTheme); // "dark"

```

---

### C. Deleting a Cookie

To delete a cookie, set its `max-age` attribute to `0` or pass a past date to `expires`. The key name and `path` must match the original configuration:

```javascript
function deleteCookie(name) {
  // Setting max-age to 0 forces immediate deletion
  document.cookie = `${name}=; max-age=0; path=/`;
}

// Usage: Delete the "theme" cookie
deleteCookie("theme");

```

---

## 4. Client-Side vs. Server-Side Security (`HttpOnly`)

* **JavaScript Cookies:** Any cookie set via JavaScript (`document.cookie`) can be read by scripts on the page. If your site suffers an **XSS (Cross-Site Scripting)** vulnerability, attackers can steal these cookies.
* **`HttpOnly` Cookies:** Sensitive data (such as session IDs or authentication JWTs) should be set by the **server** using the `Set-Cookie` HTTP response header with the **`HttpOnly`** flag:

```http
Set-Cookie: session_id=xyz123; Secure; HttpOnly; SameSite=Lax

```

`HttpOnly` cookies **cannot be accessed or read by JavaScript** (`document.cookie` ignores them), protecting authentication tokens from XSS theft.

---

## Storage Mechanism Matrix

| Feature                      | Cookies (`document.cookie`)    | `localStorage`             | `sessionStorage`    |
| ---------------------------- | ------------------------------ | -------------------------- | ------------------- |
| **Capacity**                 | ~4 KB per domain               | ~5 MB                      | ~5 MB               |
| **Sent with HTTP Requests?** | **Yes** (Automated)            | No                         | No                  |
| **Expiration**               | Manual (`max-age` / `expires`) | Persistent (Never expires) | On tab/window close |
| **Server Access**            | Readable on client & server    | Client-side only           | Client-side only    |
