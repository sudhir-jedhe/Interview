# Cross-Site Request Forgery (CSRF)

CSRF exploits the fact that browsers automatically attach cookies to requests regardless of which site initiated them. If a user is logged into `bank.com` and then visits a malicious site that silently submits a form to `bank.com/transfer`, the browser attaches the valid session cookie, and the request looks legitimate to the server — even though the user never intended it.

```html
<!-- On attacker.com, auto-submitted via JS onload -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker-account" />
</form>
```

## Defenses

- **`SameSite` cookie attribute** (`Strict` or `Lax`) tells the browser not to send the cookie on cross-site requests, blocking most CSRF by default.
- **CSRF tokens** are an unpredictable value embedded in forms that the server validates against the user's session — an attacker's page can't obtain a valid one because same-origin policy blocks it from reading the legitimate page's content.

## CSRF token vs. `SameSite` cookie

| Aspect | CSRF token | `SameSite=Strict`/`Lax` cookie |
|---|---|---|
| Mechanism | Unpredictable value the server validates per-request | Browser refuses to attach the cookie on cross-site requests at all |
| Requires server-side plumbing | Yes — generate, embed, validate on every state-changing request | No — just a cookie attribute at set time |
| Browser support dependency | None (works everywhere) | Relies on browser enforcing the attribute (modern browsers all do) |
| Covers non-cookie auth (e.g., bearer tokens in headers) | N/A — CSRF mainly matters for cookie-based auth | N/A — same |

`SameSite` cookies are the modern, low-effort default defense and block most CSRF automatically; CSRF tokens add defense-in-depth for cases where `SameSite=Lax` still allows some cross-site GET navigation, or for extra safety on especially sensitive actions. The common mistake is relying on `SameSite` alone for `Strict`-incompatible flows (like a payment form that needs to work when linked from an external email) without a token-based fallback.

A full worked CSRF-token generate/attach/verify flow is in `../problems/02-csrf-token-flow.md`.
