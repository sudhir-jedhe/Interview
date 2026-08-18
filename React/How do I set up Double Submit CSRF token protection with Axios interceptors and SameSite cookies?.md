The **Double Submit Cookie pattern** prevents Cross-Site Request Forgery (CSRF) by requiring two matching proofs of identity on state-changing requests ($\text{POST}, \text{PUT}, \text{PATCH}, \text{DELETE}$):

1. **A Cookie:** Stored in the browser (usually `SameSite=Lax` or `SameSite=Strict`, `Secure`, and **non-HttpOnly** so JS can read it, or paired with an HMAC signed copy).
2. **A Custom Header:** Read from the cookie and attached as an HTTP header (e.g., `X-XSRF-TOKEN` or `X-CSRF-Token`) by Axios.

Because cross-origin scripts cannot read or steal cookies from another domain under the **Same-Origin Policy (SOP)**, an attacker cannot forge the custom request header.

---

### 1. Backend Cookie Configuration Standards

For the frontend to read and echo the CSRF token, the backend must set the cookie with specific flags:

* `SameSite=Lax` (or `Strict`): Blocks cross-site transmission on cross-origin requests.
* `Secure`: Transmitted only over HTTPS.
* `HttpOnly=false`: Allows client-side JavaScript to read `document.cookie` (unlike the session/refresh token cookie, which must remain `HttpOnly=true`).
* `Path=/`: Ensures the cookie is available across all API routes.

---

### 2. Cookie Extraction Utility (`utils/cookies.ts`)

A lightweight helper to parse cookies from `document.cookie`:

```typescript
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

```

---

### 3. Axios Configuration & Request Interceptor (`services/apiClient.ts`)

Axios has built-in support for default names (`XSRF-TOKEN` $\rightarrow$ `X-XSRF-TOKEN`), but implementing an explicit interceptor allows you to:

* Handle custom cookie names (e.g., `csrf_token`, `__Host-csrf`).
* Target only state-changing HTTP methods.
* Automatically handle `403 CSRF token mismatch` recovery.

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getCookie } from '../utils/cookies';

const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';

// State-modifying methods that require CSRF validation
const MUTATIVE_METHODS = new Set(['post', 'put', 'patch', 'delete']);

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Sends session/CSRF cookies automatically
});

// Dedicated client for bootstrapping CSRF cookie without loops
const csrfBootstrapClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// -------------------------------------------------------------
// 1. Request Interceptor: Attach CSRF Token to Mutative Calls
// -------------------------------------------------------------
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toLowerCase();

    if (method && MUTATIVE_METHODS.has(method)) {
      let csrfToken = getCookie(CSRF_COOKIE_NAME);

      // If token is missing (first page load), fetch an initial token
      if (!csrfToken) {
        try {
          await csrfBootstrapClient.get('/auth/csrf');
          csrfToken = getCookie(CSRF_COOKIE_NAME);
        } catch (err) {
          console.warn('Failed to bootstrap CSRF token before request:', err);
        }
      }

      if (csrfToken && config.headers) {
        config.headers[CSRF_HEADER_NAME] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------------------------
// 2. Response Interceptor: Handle CSRF Token Expiration / Invalidation
// -------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ code?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _csrfRetry?: boolean };

    // Detect CSRF mismatch/expiry (commonly 403 Forbidden with custom error code)
    const isCsrfError =
      error.response?.status === 403 &&
      (error.response.data?.code === 'ERR_CSRF_INVALID' ||
        error.response.data?.code === 'EBADCSRFTOKEN');

    if (isCsrfError && originalRequest && !originalRequest._csrfRetry) {
      originalRequest._csrfRetry = true;

      try {
        // Request fresh CSRF cookie from the server
        await csrfBootstrapClient.get('/auth/csrf');
        const newToken = getCookie(CSRF_COOKIE_NAME);

        if (newToken && originalRequest.headers) {
          originalRequest.headers[CSRF_HEADER_NAME] = newToken;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

```

---

### 4. Native Axios Defaults Alternative (Zero-Config Approach)

If your backend adheres strictly to the standard naming conventions, Axios can attach the header natively without writing custom interceptor logic:

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  // Name of the cookie containing the CSRF token
  xsrfCookieName: 'XSRF-TOKEN',
  // Name of the HTTP header to populate with the cookie value
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

```

---

### 5. Backend Verification Protocol (HMAC Double Submit)

To guard against subdomain injection attacks (where an attacker on `bad.example.com` writes a cookie to `.example.com`), standard modern implementations use **Signed/Encrypted (HMAC) Double Submit**:

```
Client Browser                              Backend Server
      │                                           │
      ├─────── GET /auth/csrf ───────────────────>│ Generates:
      │                                           │ - Plain Token: `raw_csrf_xyz`
      │                                           │ - Signed Hash: HMAC(raw_csrf_xyz, SECRET)
      │<────── Sets Cookie (raw_csrf_xyz) ────────┤
      │                                           │
      ├─────── POST /api/checkout ───────────────>│ Verifies:
      │        Cookie: `raw_csrf_xyz`             │ 1. Header value matches Cookie value
      │        Header X-XSRF-TOKEN: `raw_csrf_xyz`│ 2. Hash of header value matches signature
      │                                           │
      │<────── 200 OK ────────────────────────────┤

```

---

### Key Security Safeguards

* **Use the `__Host-` Prefix:** Where supported, name the cookie `__Host-XSRF-TOKEN`. This forces the browser to treat the cookie as strict origin-only, preventing subdomains from overwriting or injecting fake CSRF cookies.
* **Combine with `SameSite=Lax`:** While Double Submit protects against forged requests, `SameSite=Lax` or `Strict` prevents the browser from sending session cookies on cross-origin requests in modern browsers.
* **Idempotent Methods Excluded:** Safe HTTP methods (`GET`, `HEAD`, `OPTIONS`) must remain read-only and free of side effects; they should not require CSRF token validation.
