# Comparisons: Security Basics

## Stored vs. reflected vs. DOM-based XSS

| Aspect | Stored XSS | Reflected XSS | DOM-based XSS |
|---|---|---|---|
| Where payload lives | Persisted server-side (DB, file) | In the request itself (URL param, form field) | Never touches the server — client-side JS only |
| Who's affected | Every user who views the poisoned content | Only users tricked into clicking a crafted link | Only users who trigger the vulnerable client-side code path |
| Typical fix location | Server-side output encoding on render | Server-side output encoding on the reflected response | Client-side: avoid unsafe sinks (`innerHTML`, `eval`) with untrusted data |

Stored XSS is generally considered the most severe because it requires no social engineering — every visitor is a victim automatically. The common mistake is assuming server-side escaping alone covers DOM-based XSS, when the vulnerable data flow (e.g., `location.hash` into `innerHTML`) never goes through the server at all.

## `textContent` vs. `innerHTML` vs. sanitized `innerHTML`

| Aspect | `textContent` | Raw `innerHTML` | `innerHTML` with sanitizer (e.g., DOMPurify) |
|---|---|---|---|
| Parses input as markup | No | Yes | Yes, but strips dangerous elements/attributes first |
| Safe with untrusted input | Always | Never | Yes, if the sanitizer's allowlist is correctly configured |
| Supports rich formatting (bold, links) | No | Yes | Yes |
| Performance | Fastest | Fast | Slower (parsing + sanitization pass) |

Default to `textContent` unless you have a concrete need for rendered HTML; reach for a sanitizer only when rich formatting from untrusted sources is a real product requirement. The common mistake is writing a custom regex-based "sanitizer" instead of using a maintained library — regex-based HTML filtering is well documented to have bypasses.

## CSRF token vs. `SameSite` cookie

| Aspect | CSRF token | `SameSite=Strict`/`Lax` cookie |
|---|---|---|
| Mechanism | Unpredictable value the server validates per-request | Browser refuses to attach the cookie on cross-site requests at all |
| Requires server-side plumbing | Yes — generate, embed, validate on every state-changing request | No — just a cookie attribute at set time |
| Browser support dependency | None (works everywhere) | Relies on browser enforcing the attribute (modern browsers all do) |
| Covers non-cookie auth (e.g., bearer tokens in headers) | N/A — CSRF mainly matters for cookie-based auth | N/A — same |

`SameSite` cookies are the modern, low-effort default defense and block most CSRF automatically; CSRF tokens add defense-in-depth for cases where `SameSite=Lax` still allows some cross-site GET navigation, or for extra safety on especially sensitive actions. The common mistake is relying on `SameSite` alone for `Strict`-incompatible flows (like a payment form that needs to work when linked from an external email) without a token-based fallback.

## `Access-Control-Allow-Origin: *` vs. a specific origin

| Aspect | `*` (wildcard) | Specific origin (e.g., `https://app.example.com`) |
|---|---|---|
| Works with `credentials: 'include'` requests | No — browsers reject this combination | Yes |
| Appropriate for | Public, non-authenticated data (public APIs, CDN assets) | Authenticated endpoints, anything cookie/session-based |
| Number of allowed origins | Unlimited (any site) | One per header value — server typically echoes back an allowlisted origin dynamically |

Use the wildcard only for genuinely public data with no session/auth dependency; anything involving cookies or user-specific data needs an explicit, validated origin. The common mistake is dynamically reflecting *any* request's `Origin` header back as `Access-Control-Allow-Origin` without checking it against an allowlist — that defeats the entire purpose of CORS by trusting every origin.
