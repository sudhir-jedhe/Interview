# Snippet: Setting secure cookie flags correctly

```js
app.post('/login', (req, res) => {
  res.cookie('sessionId', 'abc123', {
    httpOnly: true,   // JS on the page cannot read this cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS-only in prod
    sameSite: 'lax',  // blocks most cross-site CSRF vectors
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.send('logged in');
});
```

**Explanation:** All three security-relevant cookie flags are set together, since each defends against a different threat: `httpOnly` blocks JS-based theft (even via XSS), `secure` prevents plaintext network interception, and `sameSite: 'lax'` blocks most CSRF vectors. Gating `secure` behind `NODE_ENV === 'production'` avoids breaking local development over plain HTTP, where a browser would otherwise silently refuse to send a `secure`-flagged cookie.
