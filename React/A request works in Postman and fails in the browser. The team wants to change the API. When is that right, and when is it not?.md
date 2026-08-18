When a request succeeds in Postman but fails in a web browser, the root cause is almost always the browser's **security sandbox** (CORS, credentials, preflight checks, restricted headers, or mixed content). Postman operates as a standalone desktop client and completely ignores browser-enforced security boundaries.

Changing the API code is sometimes necessary, but doing so without understanding the underlying mechanism often introduces security vulnerabilities or breaks standard HTTP conventions.

---

### 1. When Changing the API Is WRONG (Fix the Frontend / Environment)

Do **not** alter the backend API if the failure is caused by frontend misconfiguration, browser security violations, or client-side request construction:

| Scenario                                      | What's Happening in the Browser                                                                                                                                                       | What the Team Mistakenly Wants to Do                                         | The Correct Fix                                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Missing `credentials: 'include'**`          | The API uses session cookies, but the frontend `fetch()` omitted `credentials: 'include'`. Postman sends cookies automatically; the browser strips them.                              | Change the API to accept credentials in query parameters or custom headers.  | Add `credentials: 'include'` to the frontend `fetch()` / `axios` config.                                  |
| **Sending Restricted Headers**                | Frontend tries to set forbidden headers like `Origin`, `User-Agent`, `Referer`, or `Host` manually in `fetch()`. The browser drops them.                                              | Rewrite the backend logic to parse custom replacements for standard headers. | Remove prohibited headers from frontend request options; let the browser populate them naturally.         |
| **Mixed Content Blocking**                    | A page served over HTTPS tries to call an `http://` API endpoint. The browser blocks the request before it leaves the client.                                                         | Change API payload or endpoint paths.                                        | Serve the API over HTTPS or route it through an SSL-terminating reverse proxy.                            |
| **Payload / Content-Type Mismatch**           | Postman sent raw JSON with `Content-Type: application/json`. Frontend code passed an unstringified JS object without headers, causing the browser to send `Content-Type: text/plain`. | Change API to parse plain text or malformed bodies.                          | Add `headers: { 'Content-Type': 'application/json' }` and pass `JSON.stringify(body)` in frontend.        |
| **Calling Third-Party APIs with Secret Keys** | A public client tries to call a vendor API (e.g., Stripe, SendGrid, OpenAI) that does not enable CORS by design to prevent secret key leakage.                                        | Ask the third-party vendor to enable wildcard CORS.                          | Route the request through your own backend/BFF server; never expose private API keys in client-side code. |

---

### 2. When Changing the API Is RIGHT (Backend / Infrastructure Fix Required)

Changing the API (or its API Gateway / Reverse Proxy) is necessary when the API intends to serve web clients from a different origin but fails to participate in the standard W3C/Fetch specification:

| Scenario                                               | Technical Failure                                                                                                                                                                                                                       | Why the API Must Change                                                                              | The Correct Backend / Gateway Fix                                                                                                                         |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Missing or Incomplete CORS Headers**                 | The browser blocks reading the response because `Access-Control-Allow-Origin` is missing or doesn't match the client's origin (`[https://app.example.com](https://app.example.com)`).                                                   | The browser security model explicitly requires the API to whitelist the requesting origin.           | Return `Access-Control-Allow-Origin: [https://app.example.com](https://app.example.com)` (or dynamic lookup from an origin allowlist).                    |
| **Unhandled HTTP `OPTIONS` Preflight**                 | Browser sends an `OPTIONS` preflight for non-simple requests (e.g., `PUT`, `DELETE`, custom headers like `Authorization` or `Content-Type: application/json`). The backend returns `404 Not Found`, `405 Method Not Allowed`, or `500`. | The backend must handle HTTP `OPTIONS` requests before the browser will dispatch the actual request. | Implement an `OPTIONS` handler returning `204 No Content` or `200 OK` with appropriate `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`. |
| **Exposing Custom Response Headers**                   | Frontend JavaScript needs to read custom headers (e.g., `X-Total-Count`, `X-RateLimit-Remaining`), but the browser hides them.                                                                                                          | Browsers hide non-standard response headers from JS unless explicitly exposed by the server.         | Add `Access-Control-Expose-Headers: X-Total-Count, X-RateLimit-Remaining` to the API response.                                                            |
| **Authenticated Cross-Origin Requests with Wildcards** | The client sends credentials (`cookies`/`Authorization`), but the server returns `Access-Control-Allow-Origin: *`. Browsers strictly reject this combination.                                                                           | The W3C spec forbids `*` when `Access-Control-Allow-Credentials: true` is set.                       | Reflect the specific requesting origin in `Access-Control-Allow-Origin` and set `Access-Control-Allow-Credentials: true`.                                 |

---

### 3. Triage Flowchart: Postman vs. Browser

```
[Request Works in Postman, Fails in Browser]
                      │
                      ▼
       Open Browser DevTools Network Tab
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[Request is RED / 0 Bytes]    [Request Returns 4xx / 5xx]
        │                           │
        ├─► Console: "CORS error"?  ├─► 401/403: Check missing Authorization/Cookie
        │     └─► FIX API/Gateway   │     └─► FIX Frontend (credentials: 'include')
        │                           │
        ├─► Console: "Mixed Content"? ├─► 400/422: Inspect Request Payload tab
        │     └─► FIX Frontend URL  │     └─► Compare JSON structure with Postman
        │                           │
        └─► OPTIONS returns 404/405?└─► 415 Unsupported Media Type:
              └─► FIX API Routing         └─► FIX Frontend (Content-Type header)

```

---

### 4. Golden Rules for the Team

1. **Never use `Access-Control-Allow-Origin: *` as a quick fix for authenticated APIs.** It creates severe CSRF/data leakage vulnerabilities and fails when cookies/credentials are used.
2. **Postman is not a browser emulator.** It does not enforce Same-Origin Policy, send preflights, or enforce cookie sandboxing.
3. **Use Reverse Proxies / BFFs for local development.** If CORS issues arise strictly in local development (`localhost:3000` calling `localhost:8080`), use a dev-server proxy (e.g., Vite proxy or Next.js rewrites) rather than modifying production API code to allow random local origins.
