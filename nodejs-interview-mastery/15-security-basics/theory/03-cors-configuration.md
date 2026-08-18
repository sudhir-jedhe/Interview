# Security Basics — CORS Configuration

## CORS is browser-enforced

CORS is a *browser-enforced* mechanism restricting which origins can read a cross-origin response. Setting `Access-Control-Allow-Origin: '*'` is fine for public, unauthenticated APIs, but combining it with `Access-Control-Allow-Credentials: true` is explicitly disallowed by browsers (and if you somehow bypass that, it's dangerous) — credentials (cookies, auth headers) should never be sent to an unrestricted wildcard origin.

```js
const cors = require('cors');
// SAFE: explicit allowlist + credentials
app.use(cors({ origin: ['https://app.example.com'], credentials: true }));

// DANGEROUS pattern to avoid: reflecting any origin back with credentials enabled
app.use(cors({ origin: true, credentials: true })); // effectively allows any site to send authenticated requests
```

## `origin: '*'` vs an explicit allowlist

| Aspect | `origin: '*'` | Explicit allowlist |
|---|---|---|
| Credentials support | Not allowed by spec with credentials | Fully supported |
| Use case | Public, unauthenticated APIs (e.g. open data endpoints) | Any API involving cookies/auth tokens tied to user sessions |
| Risk if misused | Any site can read responses (fine if truly public data) | None, if the list is genuinely restrictive |

Use `'*'` only for genuinely public, non-authenticated data; use an explicit origin allowlist (or a validated per-request origin check) the moment cookies or bearer tokens are involved. The common mistake is dynamically reflecting the incoming `Origin` header back as the allowed origin (`origin: true` in the `cors` package) to "make CORS errors go away," which technically works but defeats the security boundary entirely — it behaves like an unrestricted wildcard while looking configured.
