**Cross-Origin Resource Sharing (CORS)** is a browser enforcement mechanism that dictates how web applications running at one origin (e.g., `[https://app.example.com](https://app.example.com)`) can interact with resources on a different origin (e.g., `[https://api.external.com](https://api.external.com)`).

At the heart of CORS lies the distinction between **Simple Requests** and **Preflight Requests**, alongside key HTTP **Security Headers**.

---

# 1. Simple vs. Non-Simple Requests

The browser automatically categorizes cross-origin HTTP requests into one of two buckets.

```text
                     Is it a Simple Request?
                     • Method: GET, HEAD, or POST
                     • Headers: Accept, Accept-Language, Content-Language, Content-Type
                     • Content-Type: application/x-www-form-urlencoded, multipart/form-data, text/plain
                     • No custom headers (e.g., Authorization, X-Api-Key)
                                /               \
                          (YES)/                 \(NO)
                              /                   \
                             ▼                     ▼
                     SIMPLE REQUEST           NON-SIMPLE REQUEST
                  (Fires request directly)    (Requires OPTIONS Preflight)

```

### Simple Requests

A request is classified as **Simple** if it meets **all** of the following criteria:

1. **Allowed HTTP Methods:** Only `GET`, `HEAD`, or `POST`.
2. **Safe Custom Headers Only:** Only headers automatically set by the user agent or manually set from the CORS-safelisted request headers list: `Accept`, `Accept-Language`, `Content-Language`, and `Content-Type`.
3. **Restricted `Content-Type` Values:**

* `application/x-www-form-urlencoded`
* `multipart/form-data`
* `text/plain`

> **Behavior:** The browser sends the request **immediately**, injecting the `Origin` header. The server processes the request and responds. If the server does not return a matching `Access-Control-Allow-Origin` header, the browser blocks the JavaScript client from reading the response (though the server **did** execute the request).

### Non-Simple Requests

If a request violates *any* of the simple request rules—such as sending a `PUT` or `DELETE` request, using `Content-Type: application/json`, or attaching a custom header like `Authorization: Bearer <token>` or `X-API-Key`—it is classified as **Non-Simple**.

> **Behavior:** The browser **will not send the actual request first**. It pauses execution and issues an automatic `OPTIONS` preflight request.

---

# 2. The CORS Preflight (`OPTIONS`) Request

A **Preflight Request** is a lightweight `OPTIONS` call sent by the browser to ask the server for permission *before* making the actual ("actual") request. It protects legacy servers from executing potentially destructive operations (like `DELETE` or `PUT`) from untrusted cross-origin scripts.

```text
 Browser (https://app.com)                                 Server (https://api.com)
     │                                                               │
     │ 1. Preflight Request: OPTIONS /data                           │
     │    Origin: https://app.com                                    │
     │    Access-Control-Request-Method: DELETE                      │
     │    Access-Control-Request-Headers: Authorization, Content-Type│
     ├──────────────────────────────────────────────────────────────►│
     │                                                               │
     │ 2. Preflight Response: HTTP 204 No Content                    │
     │    Access-Control-Allow-Origin: https://app.com               │
     │    Access-Control-Allow-Methods: GET, POST, DELETE            │
     │    Access-Control-Allow-Headers: Authorization, Content-Type │
     │    Access-Control-Max-Age: 86400                              │
     │◄──────────────────────────────────────────────────────────────┤
     │                                                               │
     │ 3. Actual Request: DELETE /data                               │
     │    Origin: https://app.com                                    │
     │    Authorization: Bearer token123                             │
     ├──────────────────────────────────────────────────────────────►│
     │                                                               │
     │ 4. Actual Response: HTTP 200 OK                               │
     │    Access-Control-Allow-Origin: https://app.com               │
     │◄──────────────────────────────────────────────────────────────┤

```

### Preflight Request Headers (Sent by Browser)

* `Origin`: The origin of the web page attempting the request (`[https://app.example.com](https://app.example.com)`).
* `Access-Control-Request-Method`: The HTTP method of the actual request (`DELETE`).
* `Access-Control-Request-Headers`: A comma-separated list of custom headers being sent (`Authorization, Content-Type`).

### Preflight Response Headers (Returned by Server)

* `Access-Control-Allow-Origin`: Explicitly states which origin can read the response.
* `Access-Control-Allow-Methods`: List of HTTP methods allowed for cross-origin access.
* `Access-Control-Allow-Headers`: List of HTTP request headers allowed in the actual request.
* `Access-Control-Max-Age`: Time in seconds that the browser can **cache the preflight result**. While cached, subsequent requests skip the `OPTIONS` step, drastically reducing network overhead.

---

# 3. Essential CORS & Security Response Headers

### A. Core CORS Headers

| Header                             | Description                                                                                                                                                                  | Example Value                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `Access-Control-Allow-Origin`      | Specifies allowed origin(s). Can be `*` (wildcard) or a single exact origin.                                                                                                 | `[https://app.example.com](https://app.example.com)` |
| `Access-Control-Allow-Methods`     | Whitelists allowed HTTP methods for preflight responses.                                                                                                                     | `GET, POST, PUT, DELETE, OPTIONS`                    |
| `Access-Control-Allow-Headers`     | Whitelists custom request headers accepted by the server.                                                                                                                    | `Authorization, Content-Type, X-Api-Key`             |
| `Access-Control-Expose-Headers`    | Whitelists response headers that JavaScript (`fetch`/`axios`) is allowed to read. (By default, JavaScript can only read basic headers like `Cache-Control`, `Content-Type`). | `X-Request-Id, X-Total-Count`                        |
| `Access-Control-Allow-Credentials` | Indicates whether the browser should expose the response when credentials (cookies, HTTP Auth, TLS client certificates) are included in the request.                         | `true`                                               |
| `Access-Control-Max-Age`           | Duration (in seconds) the preflight result can be cached by the browser.                                                                                                     | `86400` (24 hours)                                   |

> **Crucial Rule for Credentials:** If the client sets `credentials: "include"`, `Access-Control-Allow-Origin` **CANNOT** be set to `*`. It **must** explicitly match the requesting origin (`Access-Control-Allow-Origin: [https://app.example.com](https://app.example.com)`), and `Access-Control-Allow-Credentials` must be set to `true`.

---

### B. Modern Browser Security Headers

CORS is only one layer of browser security. Production APIs and web servers should set these accompanying security headers:

1. **Content-Security-Policy (CSP):**
Restricts which domains can execute scripts, load stylesheets, images, or establish WebSocket/fetch connections.

```http
Content-Security-Policy: default-src 'self'; connect-src 'self' https://api.example.com;

```

1. **Cross-Origin-Opener-Policy (COOP):**
Isolates top-level windows to prevent cross-origin popups from accessing `window.opener` memory spaces.

```http
Cross-Origin-Opener-Policy: same-origin

```

1. **Cross-Origin-Embedder-Policy (COEP):**
Prevents a document from loading cross-origin resources that do not explicitly grant permission (via CORS or CORP). Required for isolating threads for `SharedArrayBuffer`.

```http
Cross-Origin-Embedder-Policy: require-corp

```

1. **Cross-Origin-Resource-Policy (CORP):**
Tells the browser whether a static file (images, scripts, styles) can be embedded by other origins.

```http
Cross-Origin-Resource-Policy: same-origin | same-site | cross-origin

```

1. **Strict-Transport-Security (HSTS):**
Forces the browser to interact with the domain exclusively over HTTPS.

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

```

---

## Summary Checklist

* **Content-Type Trigger:** Sending `application/json` automatically converts a request into a **Non-Simple Request**, triggering an `OPTIONS` preflight.
* **Preflight Caching:** Always configure `Access-Control-Max-Age` (e.g., 2 hours or 24 hours) on your API gateway/server to eliminate unnecessary `OPTIONS` latency.
* **Never Use `*` With Credentials:** Combining `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true` will cause browser security checks to fail.
