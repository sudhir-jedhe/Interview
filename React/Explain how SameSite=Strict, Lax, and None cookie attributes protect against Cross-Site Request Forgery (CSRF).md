**Cross-Site Request Forgery (CSRF)** is an attack vector where a malicious website tricks a user's browser into performing unwanted actions on a trusted site where the user is currently authenticated.

Historically, browsers attached cookies to **every** outgoing request targeting a domain—regardless of where that request originated (top-level link, cross-site `POST` form, image tag, or `fetch` call). The `SameSite` cookie attribute was introduced to restrict cross-site cookie transmission, serving as a primary defense against CSRF attacks.

---

# Architecture of Cross-Site Requests & SameSite Rules

```text
 User browsing attacker.com
   │
   ├── Scenario A: <img src="https://bank.com/transfer?amt=1000"> (GET Request)
   │     • SameSite=Strict  ──► Cookie WITHHELD ❌ (Safe)
   │     • SameSite=Lax     ──► Cookie WITHHELD ❌ (Safe)
   │     • SameSite=None    ──► Cookie SENT     ⚠️ (Vulnerable without CSRF token)
   │
   └── Scenario B: Top-level navigation <a href="https://bank.com/dashboard"> (GET Link)
         • SameSite=Strict  ──► Cookie WITHHELD ❌ (Logged out state initially)
         • SameSite=Lax     ──► Cookie SENT     ✅ (User stays logged in)
         • SameSite=None    ──► Cookie SENT     ⚠️

```

---

## 1. Defining "Site" vs. "Origin"

To understand `SameSite`, you must distinguish between **Origin** and **Site**:

* **Origin:** Scheme + Domain + Port (`[https://sub.example.com:443](https://sub.example.com:443)`).
* **Site (eTLD+1):** Scheme + Effective Top-Level Domain plus one label (`[https://example.com](https://example.com)`).

Requests between `[https://a.example.com](https://a.example.com)` and `[https://b.example.com](https://b.example.com)` are **Cross-Origin**, but **Same-Site**. A request is considered **Cross-Site** when navigating between different eTLD+1 domains (e.g., from `[https://attacker.com](https://attacker.com)` to `[https://bank.com](https://bank.com)`).

---

## 2. The Three `SameSite` Modes Explained

### A. `SameSite=Strict`

* **Behavior:** The cookie is **never** sent in cross-site requests under any circumstances—not even when a user clicks a regular link (`<a href="...">`) on an external site pointing to your domain.
* **CSRF Protection:** **100% Complete Protection.**
* **User Experience Trade-off:** High friction. If a user clicks a link to `[https://your-app.com/dashboard](https://your-app.com/dashboard)` from an email or external website, they will arrive in an unauthenticated state (logged out) until they refresh or navigate within the site.
* **Best Used For:** Highly sensitive endpoints, banking operations, administrative APIs, and state-changing actions.

---

### B. `SameSite=Lax` (The Modern Default)

Since Chrome 80+, browsers set `SameSite=Lax` as the default when no `SameSite` attribute is specified.

* **Behavior:** Withholds cookies on cross-site subresource requests (`<img>`, `<iframe>`, `fetch()`, `axios`, cross-site `POST` forms), but **sends cookies on top-level safe navigations**.
* **Definition of Safe Navigation:** Must satisfy two conditions:

1. The navigation changes the URL in the browser address bar (**Top-Level Navigation**).
2. The HTTP method is **safe / idempotent** (specifically `GET`).

* **CSRF Protection:** Protects against `POST`, `PUT`, `DELETE`, and subresource CSRF attacks, while preserving seamless user logins when following external links.
* **Best Used For:** Standard web session cookies, balancing strong security with seamless user experience.

---

### C. `SameSite=None`

* **Behavior:** The browser attaches the cookie to **all** requests (same-site and cross-site), mimicking legacy browser behavior.
* **Mandatory Requirement:** Must be paired with the `Secure` attribute (`SameSite=None; Secure`). Browsers will reject any `SameSite=None` cookie sent over plain HTTP.
* **CSRF Protection:** **Zero CSRF Protection.**
* **Best Used For:** Cross-site embedded widgets, third-party authentication redirects, and cross-domain iframe embeds where cookies *must* be shared.

---

## 3. Comprehensive Request Matrix

This table illustrates whether a `Set-Cookie: session=xyz; SameSite=<Mode>` cookie is sent when a user on `[https://attacker.com](https://attacker.com)` interacts with a target resource on `[https://bank.com](https://bank.com)`:

| Outgoing Request Type (Attacker $\rightarrow$ Bank)                                       | HTTP Method | `Strict`   | `Lax` (Default) | `None; Secure` |
| ----------------------------------------------------------------------------------------- | ----------- | ---------- | --------------- | -------------- |
| **Link Click:** `<a href="[https://bank.com](https://bank.com)">`                         | `GET`       | ❌ Withheld | ✅ **Sent**      | ✅ **Sent**     |
| **Form Submission:** `<form action="[https://bank.com](https://bank.com)" method="GET">`  | `GET`       | ❌ Withheld | ✅ **Sent**      | ✅ **Sent**     |
| **Form Submission:** `<form action="[https://bank.com](https://bank.com)" method="POST">` | `POST`      | ❌ Withheld | ❌ **Withheld**  | ✅ **Sent**     |
| **Image Tag:** `<img src="[https://bank.com/transfer](https://bank.com/transfer)">`       | `GET`       | ❌ Withheld | ❌ **Withheld**  | ✅ **Sent**     |
| **Fetch / Axios API Call:** `fetch('[https://bank.com/api](https://bank.com/api)')`       | `GET/POST`  | ❌ Withheld | ❌ **Withheld**  | ✅ **Sent**     |
| **Iframe Embed:** `<iframe src="[https://bank.com](https://bank.com)">`                   | `GET`       | ❌ Withheld | ❌ **Withheld**  | ✅ **Sent**     |

---

## 4. Defense-in-Depth: Why `SameSite=Lax` Isn't Enough

While `SameSite=Lax` stops standard cross-site `POST` form submissions, it does not make an application completely immune to CSRF on its own:

1. **State-Changing `GET` Endpoints:** If your API executes state modifications via `GET` requests (e.g., `[https://bank.com/transfer?to=bob&amt=100](https://bank.com/transfer?to=bob&amt=100)`), a simple cross-site link or `GET` form bypasses `SameSite=Lax` completely.
2. **Top-Level Window Popups:** In certain scenarios, `window.open()` popups can navigate top-level frames using `GET` requests.
3. **Legacy Browser Fallbacks:** Older browser engines that do not understand `SameSite` ignore the attribute entirely.

### Production Defense-in-Depth Strategy

* **Enforce Restful HTTP Verbs:** Never execute mutations or state changes via `GET` requests.
* **Anti-CSRF Tokens (Synchronizer Token Pattern):** Require cryptographically signed, unguessable CSRF tokens in request headers for state-changing operations.
* **Custom Request Headers:** For SPA / API architectures, require custom headers like `X-Requested-With: XMLHttpRequest` or `X-CSRF-Token`. Custom headers trigger a CORS preflight (`OPTIONS`), preventing cross-site attacks before the `POST` request executes.

---

## Summary Matrix

| Mode         | Syntax Example                                           | Sent on Cross-Site `GET` Link? | Sent on Cross-Site `POST` Form? | Sent on Cross-Site `fetch()`? |
| ------------ | -------------------------------------------------------- | ------------------------------ | ------------------------------- | ----------------------------- |
| **`Strict`** | `Set-Cookie: sid=123; SameSite=Strict; Secure; HttpOnly` | ❌ No                           | ❌ No                            | ❌ No                          |
| **`Lax`**    | `Set-Cookie: sid=123; SameSite=Lax; Secure; HttpOnly`    | ✅ **Yes**                      | ❌ No                            | ❌ No                          |
| **`None`**   | `Set-Cookie: sid=123; SameSite=None; Secure; HttpOnly`   | ✅ **Yes**                      | ✅ **Yes**                       | ✅ **Yes**                     |
