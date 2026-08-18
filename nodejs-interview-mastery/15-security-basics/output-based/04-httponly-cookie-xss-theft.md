# Output-Based: missing `httpOnly` exposes cookies to XSS

```js
res.cookie('token', 'abc123', { httpOnly: false });
// Attacker-injected script on the page runs:
console.log(document.cookie);
```

**Answer:** The injected script's `console.log(document.cookie)` prints `token=abc123` (plus any other non-httpOnly cookies).

**Why:** Without `httpOnly: true`, cookies are readable via `document.cookie` from any JavaScript running on the page — including injected XSS payloads. This is exactly the theft vector `httpOnly` exists to close: even if an XSS bug lets an attacker run JS, they still can't read the session cookie directly.
