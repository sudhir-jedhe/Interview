**Cross-Origin Resource Sharing (CORS)** is a browser security mechanism that uses HTTP headers to determine whether a web application running at one origin (e.g., `[https://app.mydomain.com](https://app.mydomain.com)`) is allowed to request and read restricted resources hosted on a different origin (e.g., `[https://api.partnerdomain.com](https://api.partnerdomain.com)`).

An **origin** is defined by the combination of **Protocol (Scheme) + Domain (Host) + Port**. If any of these three elements differ between the requesting page and the target API, the request is considered **Cross-Origin**.

```
https://app.mydomain.com:443  ───►  https://api.mydomain.com:443     ❌ Different Subdomain (Cross-Origin)
http://app.mydomain.com:80    ───►  https://app.mydomain.com:443     ❌ Different Protocol (Cross-Origin)
https://app.mydomain.com:8080 ───►  https://app.mydomain.com:3000     ❌ Different Port (Cross-Origin)
https://app.mydomain.com:443  ───►  https://app.mydomain.com:443     ✅ Same Origin

```

---

## 1. How CORS is Validated in Front-End System Design

It is crucial to understand that **CORS is enforced entirely by the client browser, not the server**. The backend server executes the request and sends data back, but the browser blocks JavaScript from reading the response payload if the server fails to provide valid CORS headers.

The browser handles validation through two primary request types:

### A. Simple Requests

Requests using `GET`, `POST`, or `HEAD` with standard headers (e.g., `Content-Type: text/plain` or `application/x-www-form-urlencoded`) do not trigger a preflight check.

1. The browser attaches an `Origin` header to the outgoing request:

```http
GET /api/v1/users HTTP/1.1
Host: api.partnerdomain.com
Origin: https://app.mydomain.com

```

1. The server responds with the data and an `Access-Control-Allow-Origin` header.
2. **Browser Validation:** The browser checks if `Access-Control-Allow-Origin` matches `[https://app.mydomain.com](https://app.mydomain.com)` (or `*`). If it matches, JavaScript can read the data. If not, the browser drops the response payload and throws a console error.

---

### B. Preflighted Requests (Complex Requests)

If a request uses methods like `PUT`, `DELETE`, or `PATCH`, or includes custom headers (like `Authorization` or `X-CSRF-Token`), or uses `Content-Type: application/json`, the browser automatically executes an **OPTIONS Preflight Check** before sending the actual request.

```
[ BROWSER ]                                                [ API SERVER ]
     │                                                           │
     │ 1. OPTIONS Preflight Request                              │
     │    (Origin: https://app.mydomain.com)                    │
     │ ────────────────────────────────────────────────────────> │
     │                                                           │
     │ 2. Preflight Response                                     │
     │    (Access-Control-Allow-Origin: https://app.mydomain.com)│
     │    (Access-Control-Allow-Methods: GET, POST, PUT, DELETE) │
     │ <──────────────────────────────────────────────────────── │
     │                                                           │
     │ 3. Actual HTTP Request (PUT /api/v1/users/123)            │
     │ ────────────────────────────────────────────────────────> │
     │                                                           │
     │ 4. HTTP Response Data                                     │
     │ <──────────────────────────────────────────────────────── │

```

**Preflight Request Headers sent by Browser:**

```http
OPTIONS /api/v1/users/123 HTTP/1.1
Host: api.partnerdomain.com
Origin: https://app.mydomain.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: authorization, content-type

```

**Preflight Response Headers expected from Server:**

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.mydomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400

```

---

## 2. Common CORS Errors & How to Fix Them

Because CORS is a server-configured policy, **frontend JavaScript alone cannot "fix" a CORS error directly**. You must configure either your backend API, reverse proxy, or API gateway.

### Solution 1: Fix at the Backend API Server Layer

Configure your backend server framework to return explicit CORS headers matching your frontend origin.

#### Node.js / Express (`server.js`)

```javascript
import express from 'express';
import cors from 'cors';

const app = express();

// Configure CORS for explicit trusted frontend origin
const corsOptions = {
  origin: ['https://app.mydomain.com', 'https://admin.mydomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true, // Allows HttpOnly cookies across origins
  maxAge: 86400, // Cache preflight response for 24 hours (reduces OPTIONS latency)
};

app.use(cors(corsOptions));

```

---

### Solution 2: Fix at the Reverse Proxy / Edge Layer (Nginx)

Configuring CORS at your Nginx edge gateway or CDN (Cloudflare) removes the CORS workload from your application microservices and guarantees consistent headers across all routes.

```nginx
# /etc/nginx/sites-available/api.conf
server {
    listen 443 ssl http2;
    server_name api.partnerdomain.com;

    location / {
        # Define allowed frontend origins
        if ($http_origin ~* (https://app\.mydomain\.com|https://admin\.mydomain\.com)$) {
            add_header 'Access-Control-Allow-Origin' "$http_origin" always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-CSRF-Token' always;
        }

        # Handle Preflight OPTIONS Requests Immediately at Edge
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' "$http_origin" always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-CSRF-Token' always;
            add_header 'Access-Control-Max-Age' 86400;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        proxy_pass http://localhost:5000;
    }
}

```

---

### Solution 3: Fix via Front-End Proxy / BFF Architecture

If you do not have control over the third-party backend API to add CORS headers, route client requests through a **Same-Origin Reverse Proxy** or **Backend-For-Frontend (BFF)** layer in your front-end repository.

Because server-to-server HTTP requests are **not** restricted by browser CORS policies, the proxy fetches the data on the server and returns it to your front-end app under the same origin.

#### Next.js Rewrites (`next.config.js`)

```javascript
// next.config.js in your Front-End Repository
module.exports = {
  async rewrites() {
    return [
      {
        // Client makes request to same-origin path: /api/proxy/users
        source: '/api/proxy/:path*',
        // Next.js server proxies request to external origin seamlessly
        destination: 'https://api.partnerdomain.com/:path*',
      },
    ];
  },
};

```

---

## Critical Security Anti-Patterns in CORS

| Anti-Pattern                                                                          | Security Risk                                                                                                                                       | Correct Practice                                                                                                                      |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **`Access-Control-Allow-Origin: *` with `Credentials: true**`                         | Browsers strictly forbid this combination. It causes request failure.                                                                               | Explicitly reflect the validated incoming origin instead of `*`.                                                                      |
| **Reflecting ANY Origin blindly** (`Access-Control-Allow-Origin: req.headers.origin`) | Nullifies CORS security. Allows any malicious site to read user data.                                                                               | Validate the incoming `Origin` against a strict allowlist array.                                                                      |
| **Using `no-cors` mode in `fetch()**`                                                 | `fetch(url, { mode: 'no-cors' })` strips custom headers, turns response status to `0` (opaque), and **prevents JS from reading the response body**. | `no-cors` is meant for fire-and-forget asset loading (e.g., images), not API data retrieval. Configure proper server headers instead. |
