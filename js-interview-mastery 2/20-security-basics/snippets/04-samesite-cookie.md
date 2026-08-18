# Snippet: Setting a `SameSite` cookie to block cross-site CSRF requests

*(Node/Express-style, illustrative.)*

```js
res.cookie("session_id", token, {
  httpOnly: true,   // JS on the page can't read it (also mitigates XSS-based cookie theft)
  secure: true,      // only sent over HTTPS
  sameSite: "strict" // browser will NOT send this cookie on cross-site requests, blocking CSRF
});
```
