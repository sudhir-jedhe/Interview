# Status Codes Worth Knowing Cold

- **200 OK** — success, generic.
- **201 Created** — a resource was created (typically after POST).
- **204 No Content** — success, no body (common for DELETE).
- **301/302** — permanent/temporary redirect (301 cacheable, 302 not, by convention browsers re-check).
- **304 Not Modified** — cache validation succeeded, client should use its cached copy.
- **400 Bad Request** — malformed request (client's fault, generic).
- **401 Unauthorized** — not authenticated (misnamed historically; really means "unauthenticated").
- **403 Forbidden** — authenticated but not permitted.
- **404 Not Found** — resource doesn't exist.
- **409 Conflict** — request conflicts with current state (e.g., duplicate unique key).
- **422 Unprocessable Entity** — syntactically valid but semantically invalid (e.g., failed validation).
- **429 Too Many Requests** — rate limited.
- **500 Internal Server Error** — unhandled server-side failure.
- **502 Bad Gateway** — an upstream server returned an invalid response.
- **503 Service Unavailable** — server temporarily can't handle the request (overload, maintenance).

## 401 Unauthorized vs 403 Forbidden

| Aspect | 401 Unauthorized | 403 Forbidden |
|---|---|---|
| Meaning | Client is not authenticated (missing/invalid credentials) | Client is authenticated but lacks permission |
| Typical response header | Often paired with `WWW-Authenticate` | No such requirement |
| Client action | Re-authenticate / provide credentials | Retrying with the same identity won't help |

Use 401 when you don't know who the caller is (missing/expired token); use 403 when you do know who they are and they're simply not allowed to do this action. The common mistake is returning 403 for missing auth tokens, which misleads clients into thinking re-authenticating won't help. This is a classic interview trip-up: 401 means "I don't know who you are," 403 means "I know who you are, and you're not allowed."

## 301 Moved Permanently vs 302 Found (temporary redirect)

| Aspect | 301 | 302 |
|---|---|---|
| Caching | Browsers/CDNs may cache the redirect target long-term | Not cached long-term by convention |
| Use case | Permanent URL changes (domain migration) | Temporary redirects (post-login bounce, A/B routing) |
| SEO impact | Passes link equity to the new URL | Does not signal a permanent move |

Use 301 for durable URL changes you want search engines and browsers to remember; use 302 (or 307 for method-preserving temporary redirects) for anything short-lived. The common mistake is using 302 for a permanent domain migration, which forces every future request to still round-trip through the old URL since clients won't cache it.
