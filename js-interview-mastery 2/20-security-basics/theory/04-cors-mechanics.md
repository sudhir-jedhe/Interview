# CORS Mechanics

The **same-origin policy** is the browser's default rule: JavaScript running on `siteA.com` cannot read responses from `siteB.com` unless `siteB.com` explicitly allows it. CORS (Cross-Origin Resource Sharing) is the mechanism for that explicit opt-in — it's a relaxation of the same-origin policy, enforced entirely by the *browser*, not a server-side security feature.

For "simple" requests (basic GET/POST with standard headers), the browser sends the request and then checks the response's `Access-Control-Allow-Origin` header before letting JavaScript read the response body — the request still *happens* server-side either way. For more complex requests (custom headers, methods like `PUT`/`DELETE`, `Content-Type: application/json`), the browser first sends a **preflight** `OPTIONS` request asking "would you allow this actual request?", and only sends the real one if the preflight response permits it.

`Access-Control-Allow-Origin`, set by the *server*, tells the browser which origins may read the response via JavaScript — it's commonly misunderstood as a wall that blocks the request from reaching the server, but it doesn't; the server still processes it. What it blocks is the *browser* handing the response back to the calling script if the origin isn't allowed. `Access-Control-Allow-Origin: *` means any origin can read the response (fine for public data; forbidden by spec when combined with credentialed requests).

## `Access-Control-Allow-Origin: *` vs. a specific origin

| Aspect | `*` (wildcard) | Specific origin (e.g., `https://app.example.com`) |
|---|---|---|
| Works with `credentials: 'include'` requests | No — browsers reject this combination | Yes |
| Appropriate for | Public, non-authenticated data (public APIs, CDN assets) | Authenticated endpoints, anything cookie/session-based |
| Number of allowed origins | Unlimited (any site) | One per header value — server typically echoes back an allowlisted origin dynamically |

Use the wildcard only for genuinely public data with no session/auth dependency; anything involving cookies or user-specific data needs an explicit, validated origin. The common mistake is dynamically reflecting *any* request's `Origin` header back as `Access-Control-Allow-Origin` without checking it against an allowlist — that defeats the entire purpose of CORS by trusting every origin.

**Does CORS prevent the actual HTTP request from reaching the server?** No — this is a very common misunderstanding. The request is sent and processed by the server regardless (for "simple" requests); CORS only controls whether the *browser* allows the calling JavaScript to read the response. The exception is a preflighted request, where the browser sends `OPTIONS` first and, if the server's response doesn't authorize the actual request, cancels it before ever sending it.
