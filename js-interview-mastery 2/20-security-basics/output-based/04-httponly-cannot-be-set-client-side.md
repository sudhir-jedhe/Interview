# Output: `HttpOnly` cannot actually be set via `document.cookie`

```js
document.cookie = "sessionId=abc123; HttpOnly";
console.log(document.cookie);
```

**Answer:**
```
"" (or existing non-HttpOnly cookies, but NOT sessionId)
```

**Why:** `HttpOnly` can only be set by the *server* via a `Set-Cookie` response header — it cannot actually be applied through `document.cookie` in client-side JS (this line silently fails to set the flag; in practice it just sets a regular, JS-readable cookie or does nothing depending on the browser). The point of `HttpOnly` is that once a cookie legitimately has that flag (set server-side), `document.cookie` cannot read it at all, which is why it's an effective mitigation against XSS-based cookie theft — but the flag must originate from the server, not from client JS.
