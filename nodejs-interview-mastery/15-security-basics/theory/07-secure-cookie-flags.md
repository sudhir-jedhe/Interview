# Security Basics — Secure Cookie Flags

## The three flags

- **`httpOnly`** — cookie isn't accessible via `document.cookie` in JS, mitigating XSS-based session theft.
- **`secure`** — cookie only sent over HTTPS, preventing plaintext interception on the wire.
- **`sameSite`** — controls whether the cookie is sent on cross-site requests; `strict`/`lax` mitigates CSRF.

```js
res.cookie('sessionId', token, {
  httpOnly: true,
  secure: true,     // requires HTTPS in production
  sameSite: 'lax',
});
```

## Why all three matter together

| Aspect | httpOnly | secure | sameSite |
|---|---|---|---|
| Protects against | XSS-based cookie theft via `document.cookie` | Network interception on plaintext HTTP | CSRF via cross-site requests |
| What it restricts | JS access to the cookie | Transmission channel (HTTPS only) | Which requests include the cookie |
| Typical value | `true` for session cookies | `true` in production | `'lax'` or `'strict'` |

Set all three on session/auth cookies — they defend against different, unrelated attack vectors and none substitutes for another. The common mistake is setting `secure: true` in local development without HTTPS, silently breaking login because the browser refuses to send the cookie over plain HTTP — gate it behind `NODE_ENV === 'production'` or use HTTPS locally too.
