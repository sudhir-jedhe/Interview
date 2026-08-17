# Snippets: Security Basics

*(Some examples are browser-only, noted inline.)*

```js
// 1. DOM-based XSS sink: innerHTML executes injected markup, textContent doesn't (browser-only)
const untrusted = "<img src=x onerror=\"console.log('XSS ran')\">";

const safeDiv = document.createElement("div");
safeDiv.textContent = untrusted; // just displays the literal string, nothing executes

const dangerousDiv = document.createElement("div");
dangerousDiv.innerHTML = untrusted; // the onerror handler actually fires
document.body.append(dangerousDiv);
// logs: "XSS ran" -- purely from assigning to innerHTML
```

```js
// 2. Reflected XSS pattern: untrusted query param flows straight into the DOM (browser-only)
// URL: https://example.com/search?q=<script>alert(1)</script>
const query = new URLSearchParams(location.search).get("q");
document.getElementById("results").innerHTML = `You searched for: ${query}`;
// DANGEROUS -- never interpolate untrusted strings into an innerHTML template literal.
// Fix: use textContent, or escape/sanitize `query` first.
```

```js
// 3. A minimal (illustrative, not production-grade) HTML-escaping helper
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

console.log(escapeHtml("<script>alert(1)</script>"));
// "&lt;script&gt;alert(1)&lt;/script&gt;" -- renders as literal text if inserted via innerHTML
```

```js
// 4. Setting a SameSite cookie to block cross-site CSRF requests (Node/Express-style, illustrative)
res.cookie("session_id", token, {
  httpOnly: true,   // JS on the page can't read it (also mitigates XSS-based cookie theft)
  secure: true,      // only sent over HTTPS
  sameSite: "strict" // browser will NOT send this cookie on cross-site requests, blocking CSRF
});
```

```js
// 5. fetch with credentials -- CORS explicitly forbids wildcard origin here (browser-only)
fetch("https://api.example.com/account", {
  credentials: "include", // send cookies cross-origin
})
  .then(res => res.json())
  .catch(err => console.log("blocked or failed:", err));
// The server's response MUST include a specific Access-Control-Allow-Origin
// (not "*") AND Access-Control-Allow-Credentials: true, or the browser
// refuses to expose the response to this script.
```

```js
// 6. A preflight-triggering request (custom header + non-simple method) (browser-only)
fetch("https://api.example.com/items/42", {
  method: "PUT",
  headers: { "Content-Type": "application/json", "X-Custom-Header": "1" },
  body: JSON.stringify({ name: "updated" }),
});
// Before sending this, the browser automatically sends:
//   OPTIONS /items/42
//   Access-Control-Request-Method: PUT
//   Access-Control-Request-Headers: content-type, x-custom-header
// The server must respond with matching Access-Control-Allow-Methods/Headers
// or the browser cancels the real request before it's ever sent.
```

```js
// 7. Client-side validation is trivially bypassable -- never the only line of defense
function submitForm(age) {
  if (age < 18) {
    console.log("Blocked client-side: must be 18+");
    return;
  }
  sendToServer({ age }); // server MUST re-validate `age` independently
}
// Anyone can call sendToServer({ age: -5 }) directly via devtools console or curl,
// completely bypassing this function and its check.
```
