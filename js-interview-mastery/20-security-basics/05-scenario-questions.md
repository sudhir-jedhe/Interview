# Scenario Questions: Security Basics

## 1. You're building a user profile page that displays a "bio" field users can edit, including basic formatting (bold, italics, links). The bio is stored in your database and shown to every visitor of the profile. How do you render it safely, and what's the specific risk if you get this wrong?

**Approach:**
This is a stored XSS risk: since the bio is persisted and shown to *every* visitor, a single malicious bio (e.g., containing `<img src=x onerror="steal cookies/session">`) would compromise every user who views that profile, not just the author. Never store or render raw HTML from user input directly. Instead, store the bio as plain text or a constrained markup format (like Markdown), and when rendering, either use `textContent` for plain text or run any HTML output through a sanitizer with a strict allowlist before inserting it.

```js
import DOMPurify from "dompurify";

function renderBio(container, rawBio) {
  // If bio supports limited formatting (e.g., converted from Markdown to HTML server-side or client-side):
  const html = markdownToHtml(rawBio); // produces HTML from a constrained subset
  container.innerHTML = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "a", "p", "br"],
    ALLOWED_ATTR: ["href"],
  });
}
```
Sanitize on render (or at minimum, on write *and* re-sanitize on any migration/import), and never trust that "we already sanitized it once" holds true forever as sanitizer configs and libraries change.

## 2. Your app's login form sets a session cookie, and users have reported unauthorized actions happening on their accounts after clicking links from suspicious emails. What's the likely vulnerability, and how do you fix it?

**Approach:**
This is a classic CSRF pattern: the session cookie is being automatically attached by the browser to requests triggered from a malicious external page/email, and the server has no way to distinguish a legitimate same-site request from a forged cross-site one. Fix it in layers: set `SameSite=Lax` (or `Strict` for highly sensitive actions) on the session cookie so the browser won't send it on cross-site requests, and add CSRF tokens to state-changing forms/requests as defense-in-depth, validated server-side against the user's session.

```js
// Server: setting the session cookie
res.cookie("session", token, { httpOnly: true, secure: true, sameSite: "lax" });

// Server: issuing and validating a CSRF token for sensitive forms
app.get("/transfer-form", (req, res) => {
  const csrfToken = generateCsrfToken(req.session);
  res.render("transfer", { csrfToken });
});

app.post("/transfer", (req, res) => {
  if (req.body.csrfToken !== req.session.csrfToken) {
    return res.status(403).send("Invalid CSRF token");
  }
  performTransfer(req.body);
});
```

## 3. Your frontend team wants to call a third-party partner's API directly from the browser, but requests are failing with a CORS error even though the API works fine when called from a backend service or Postman. How do you explain what's happening and what needs to change?

**Approach:**
This is expected behavior, not a bug in the frontend code: the same-origin policy is enforced entirely by the *browser*, so tools like Postman or a server-to-server call (which aren't browsers) never trigger it — the API itself is reachable and working fine, as evidenced by those tools succeeding. The fix has to happen on the partner API's side: they need to respond with an `Access-Control-Allow-Origin` header that includes your app's origin (and handle the preflight `OPTIONS` request correctly if the call uses custom headers or non-simple methods). If the partner can't or won't add CORS headers, the alternative is routing the request through your own backend as a proxy, since server-to-server calls aren't subject to CORS at all.

```js
// This fails in the browser with a CORS error if partner-api.com doesn't
// send an Access-Control-Allow-Origin header matching your origin:
fetch("https://partner-api.com/data").then(res => res.json());

// Workaround: proxy through your own backend, which isn't a browser and isn't CORS-restricted
fetch("/api/proxy/partner-data").then(res => res.json());
```

## 4. Your team is auditing the app for XSS before a security review. You find several places where user-controlled data (usernames, search queries, URL parameters) is inserted into the DOM via template literals and `innerHTML`. How do you prioritize and fix these systematically?

**Approach:**
First, triage by data flow: does the value come from persisted storage visible to other users (highest priority — stored XSS), from the URL/query string (reflected/DOM-based), or is it fully static/trusted (no risk)? For each real risk, the default fix is switching to `textContent` if no HTML formatting is actually needed — the majority of "usernames" and "search queries" cases fall here. For genuine rich-content cases, introduce a sanitizer at the render boundary. As a systemic fix beyond one-off patches, add an ESLint rule (e.g., `no-unsanitized/property`) to flag any future `innerHTML` assignment for manual review, and consider adding a `Content-Security-Policy` header as a safety net that blocks inline/injected scripts even if a sanitization bug slips through later.

```js
// Before (risky):
resultsEl.innerHTML = `You searched for: ${query}`;

// After (safe):
resultsEl.textContent = `You searched for: ${query}`;
```

## 5. Your app has a signup form with client-side validation for password strength, email format, and age eligibility (18+). A pentest report flags that all of these can be bypassed. How do you respond, and what's the underlying principle?

**Approach:**
This finding is expected and correct — client-side validation is a UX convenience, not a security boundary, because anything running in the browser is fully under the user's control (they can disable JS, tamper with form data in DevTools, or bypass the browser entirely with direct API calls via `curl`/Postman). The fix is to keep the client-side checks (they're still valuable for instant user feedback) but ensure every one of them is independently re-implemented and enforced on the server, which is the only trust boundary that matters for actual security and data integrity.

```js
// Server-side (Node/Express-style) — this is what actually protects the system
app.post("/signup", (req, res) => {
  const { email, password, age } = req.body;
  if (!isValidEmail(email)) return res.status(400).send("Invalid email");
  if (!isStrongPassword(password)) return res.status(400).send("Weak password");
  if (age < 18) return res.status(400).send("Must be 18 or older");
  createAccount({ email, password, age });
  res.status(201).send("Account created");
});
```
