In Front-End System Design, preventing Cross-Site Scripting (XSS) requires an architectural approach known as **Defense-in-Depth**. Rather than relying on a single mechanism, you build security layers across the **Architecture Layer, Network/Infrastructure Layer, Client Runtime, Data Persistence, and Application Code**.

---

## Front-End System Design Architecture for XSS Prevention

```
[ Incoming Request ]
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Infrastructure Layer (Reverse Proxy / CDN / Edge)       │
│  - Content-Security-Policy (CSP)                            │
│  - HttpOnly, Secure, SameSite Cookie Flags                  │
│  - Web Application Firewall (WAF) Integration               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Data Transfer Layer (Network / Transport)                │
│  - Strict JSON Serialization (No Raw HTML payload execution)│
│  - Token Storage Isolation (HttpOnly vs Memory)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Client Runtime & State Layer (JavaScript)                │
│  - DOM Sanitization Engine (e.g., DOMPurify)               │
│  - Isolated Execution Environments (Web Workers / Sandbox)  │
│  - Short-Lived Access Tokens in Memory                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. View & Rendering Layer (React / Vue / Angular / DOM)     │
│  - Auto-Escaping Template Engines                           │
│  - Safe DOM Insertion Protocols (No dynamic eval/innerHTML) │
│  - Trusted Types Enforcement                                │
└─────────────────────────────────────────────────────────────┘

```

---

## Detailed Component Breakdown

### 1. View & Rendering Layer (Where: UI Components & Template Engines)

Modern UI frameworks (React, Angular, Vue) auto-escape variables by default when rendered inside standard templates. XSS occurs when engineers bypass these protections.

* **Avoid Dangerous Escape Hatches:**
* **React:** Avoid `dangerouslySetInnerHTML`.
* **Vue:** Avoid `v-html`.
* **Vanilla JS:** Avoid `.innerHTML`, `document.write()`, `eval()`, `setTimeout("string")`, and `new Function()`. Use `.textContent` or `.innerText` instead.

* **Context-Aware Encoding:** If raw DOM manipulation is necessary, encode strings based on where they appear (HTML Body, Attribute Context, JavaScript Variable Context, or URL Context).

---

### 2. Client Runtime & Sanitization (Where: Data Ingestion & State Handlers)

When your application **must** render user-generated rich text (e.g., Markdown editors, comment threads, formatted descriptions), sanitize the string before mounting it into the DOM.

* **DOMPurify Integration:** Run untrusted HTML through a battle-tested client-side sanitizer.

```javascript
import DOMPurify from 'dompurify';

// Safe execution before injection
const SafeComponent = ({ userContent }) => {
  const cleanHTML = DOMPurify.sanitize(userContent, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });

  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};

```

* **Enforce Trusted Types API:** Modern browsers support the `Trusted Types` browser API, which blocks DOM sinks (like `innerHTML`) from accepting plain string inputs unless they pass through an approved sanitizer policy.

---

### 3. Token & Session Management (Where: Storage Layer)

The primary goal of an XSS payload is often stealing session tokens (`JWT`, `Session ID`) to hijack accounts. Front-end system design dictates where these tokens live:

* **HttpOnly Cookies (Recommended):** Store sensitive authentication tokens in `HttpOnly` cookies. JavaScript cannot access `document.cookie` for an `HttpOnly` cookie, rendering XSS-based token theft ineffective.
* **In-Memory Storage + Refresh Tokens:** If `HttpOnly` cookies are not an option (e.g., decoupled cross-domain microfrontends), store the short-lived Access Token in JavaScript **memory** (a global state module or closure variable) rather than `localStorage` or `sessionStorage`. Maintain a `HttpOnly` cookie strictly for acquiring new refresh tokens.

---

### 4. Infrastructure & Network Layer (Where: Reverse Proxy, CDN, Edge Workers)

Security headers are configured on web servers (Nginx, Caddy), CDNs (Cloudflare, CloudFront), or Edge Handlers (Next.js Middleware) to restrict what the browser is allowed to execute.

* **Strict Content Security Policy (CSP):**
Restricts where scripts can be fetched from and prohibits unsafe inline scripts:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; object-src 'none'; frame-ancestors 'none';

```

* **Subresource Integrity (SRI):**
When loading third-party scripts from CDNs, enforce cryptographic hash checks so compromised third-party dependencies cannot execute malicious payloads inside your app:

```html
<script 
  src="https://cdn.example.com/library.js" 
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYb15M8w=" 
  crossorigin="anonymous">
</script>

```

---

### 5. Architectural Sandbox & Isolation (Where: Iframe / Web Worker Boundaries)

When executing untrusted third-party JavaScript or user-uploaded scripts (e.g., plugin architectures, embedded widgets):

* **Iframe Sandboxing:** Render untrusted widgets inside an `<iframe>` with the `sandbox` attribute enabled:

```html
<iframe src="untrusted_page.html" sandbox="allow-scripts"></iframe>

```

*Leaving out `allow-same-origin` prevents the iframe from accessing the host origin's DOM, local storage, and cookies.*

* **Web Worker Isolation:** Execute heavy data processing or dynamic evaluation inside a Web Worker thread, which operates without access to the `window` or `document` DOM context.

---

## System Design Decision Matrix

| XSS Risk / Vector                             | Primary Front-End Control                            | Where Implemented               |
| --------------------------------------------- | ---------------------------------------------------- | ------------------------------- |
| **Reflected / Stored XSS via HTML Injection** | Framework Auto-Escaping & `DOMPurify`                | View / Component Layer          |
| **Inline Script Injection**                   | Content Security Policy (`script-src 'self'`)        | CDN / Web Server / Edge         |
| **DOM-based XSS (`innerHTML`, `eval`)**       | Trusted Types API & Code Audits                      | JS Engine Runtime / CI Pipeline |
| **Session Theft via `document.cookie**`       | `HttpOnly`, `Secure`, `SameSite=Strict` Cookie Flags | Auth Backend / Gateway          |
| **Third-party CDN Compromise**                | Subresource Integrity (SRI) Tags                     | Build / Template Generation     |
| **Untrusted Third-Party Code / Widgets**      | Isolated `<iframe>` with `sandbox` attribute         | DOM / Layout Component          |

Show how to configure and enforce the Trusted Types API in a front-end application with examples.

The **Trusted Types API** is a modern browser security feature designed to lock down **DOM XSS sinks** (such as `element.innerHTML`, `location.href`, `eval()`, and `script.src`).

Instead of allowing plain strings to be assigned directly to these sinks, Trusted Types forces all inputs to pass through an approved **policy** that converts plain strings into typed objects (`TrustedHTML`, `TrustedScript`, or `TrustedScriptURL`). If a raw string is passed to a sink without passing through a policy, the browser throws a runtime DOMException error.

---

## 1. Enabling Trusted Types via CSP Headers

Trusted Types is enforced via the `Content-Security-Policy` HTTP header.

### Enforce Mode (Blocks violations)

```http
Content-Security-Policy: require-trusted-types-for 'script'; trusted-types default myAppPolicy;

```

### Report-Only Mode (Logs violations without breaking execution)

Use this mode during migration or testing:

```http
Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; trusted-types default myAppPolicy;

```

* **`require-trusted-types-for 'script'`**: Tells the browser to restrict DOM sinks that write HTML, Scripts, or Script URLs.
* **`trusted-types default myAppPolicy`**: Defines an explicit allowlist of policy names the browser permits to generate trusted objects.

---

## 2. Creating and Using a Trusted Types Policy

Before writing to a DOM sink, create a policy using `window.trustedTypes.createPolicy()`.

### Example: Creating a Policy with DOMPurify

```javascript
import DOMPurify from 'dompurify';

// Check if Trusted Types API is supported by the browser
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  
  // Create a policy named "myAppPolicy" matching your CSP header allowlist
  const appPolicy = window.trustedTypes.createPolicy('myAppPolicy', {
    // 1. Policy for raw HTML injection (innerHTML, outerHTML, document.write)
    createHTML: (stringInput) => {
      // Pass the raw string through a battle-tested sanitizer
      return DOMPurify.sanitize(stringInput, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href']
      });
    },

    // 2. Policy for dynamic Script URLs (script.src)
    createScriptURL: (urlInput) => {
      const allowedOrigins = ['https://cdn.yourdomain.com', 'https://api.yourdomain.com'];
      const parsedUrl = new URL(urlInput, window.location.origin);
      
      if (allowedOrigins.includes(parsedUrl.origin)) {
        return parsedUrl.href;
      }
      throw new Error(`[SECURITY] Unauthorised Script URL blocked: ${urlInput}`);
    },

    // 3. Policy for dynamic JavaScript execution (eval, new Function)
    createScript: (scriptString) => {
      // Strongly discourage dynamic string-to-code execution
      throw new Error('[SECURITY] Dynamic code execution via createScript is prohibited.');
    }
  });

  // Example Usage with DOM Sinks:
  
  // A. Writing HTML safely
  const userComment = '<img src=x onerror=alert(1)> <b>Hello World!</b>';
  const trustedHTML = appPolicy.createHTML(userComment);
  
  // Inject into DOM - Browsers accept TrustedHTML objects
  document.getElementById('content').innerHTML = trustedHTML; 
  // Result rendered safely in DOM: <b>Hello World!</b>

  // B. Loading a dynamic script safely
  const scriptTag = document.createElement('script');
  scriptTag.src = appPolicy.createScriptURL('https://cdn.yourdomain.com/lib.js');
  document.head.appendChild(scriptTag);
}

```

---

## 3. What Happens on Violation?

If an engineer or malicious script attempts to write a raw string directly to an enforced sink:

```javascript
// Direct raw string assignment without a policy
document.getElementById('content').innerHTML = '<b>Direct string assignment</b>';

```

**Browser Console Error Output:**

```text
TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment.

```

The browser aborts the DOM mutation completely, stopping the potential XSS attack before it executes.

---

## 4. Setting Up a `default` Fallback Policy

If your application relies on third-party libraries or legacy code that directly assigns raw strings to DOM sinks, you can define a `default` policy. The browser automatically passes raw strings through the `default` policy before writing them to the sink.

```javascript
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  window.trustedTypes.createPolicy('default', {
    createHTML: (string) => DOMPurify.sanitize(string),
    createScriptURL: (url) => {
      if (url.startsWith('https://cdn.yourdomain.com/')) return url;
      throw new Error('Blocked unapproved dynamic script URL');
    },
    createScript: (script) => script,
  });
}

```

> **Security Warning:** A permissive `default` policy simplifies migration, but it diminishes the primary security benefit of Trusted Types because all raw string assignments pass through automatically. Use `default` policies primarily as a temporary migration stepping stone.

---

## 5. Integrating with React / Frameworks

Modern frameworks like **React 18+** natively support Trusted Types when setting raw HTML or executing dynamic scripts.

### React Example (`dangerouslySetInnerHTML`)

When passing a `TrustedHTML` object to `dangerouslySetInnerHTML`, React accepts the object directly without throwing validation warnings:

```jsx
import React from 'react';
import DOMPurify from 'dompurify';

// Define policy once globally
const htmlPolicy = window.trustedTypes?.createPolicy('reactPolicy', {
  createHTML: (input) => DOMPurify.sanitize(input),
});

export const UserBioComponent = ({ rawBio }) => {
  // Convert raw user string to TrustedHTML
  const safeBio = htmlPolicy ? htmlPolicy.createHTML(rawBio) : rawBio;

  return (
    <div className="user-bio">
      <h3>User Bio</h3>
      {/* React accepts TrustedHTML objects */}
      <div dangerouslySetInnerHTML={{ __html: safeBio }} />
    </div>
  );
};

```

---

## Browser Support

Trusted Types is natively supported in Chromium-based browsers (Chrome, Edge, Opera, Android Webview). For non-supporting browsers (Firefox, Safari), you can load the official W3C Trusted Types Polyfill:

```bash
npm install trusted-types

```

```javascript
import 'trusted-types'; // Polyfills window.trustedTypes for unsupported browsers

```

Design an end-to-end front-end authentication architecture using HttpOnly refresh cookies and in-memory access tokens.

An **In-Memory Access Token + HttpOnly Cookie** architecture provides strong protection against token theft. By keeping short-lived Access Tokens in application memory (closure/state) and storing long-lived Refresh Tokens in `HttpOnly, Secure, SameSite` cookies, you protect against both XSS token extraction and CSRF attacks.

---

## 1. End-to-End System Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (BROWSER SPA)                          │
│                                                                        │
│  ┌─────────────────────────┐           ┌────────────────────────────┐  │
│  │   In-Memory JS State    │           │      Browser Cookie Store  │  │
│  │ ─────────────────────── │           │ ────────────────────────── │  │
│  │ Access Token: "jwt..."  │           │ HttpOnly, Secure Cookie:   │  │
│  │ (Lost on page refresh)  │           │ refresh_token="rt_xyz..."  │  │
│  └────────────┬────────────┘           └──────────────┬─────────────┘  │
└───────────────┼───────────────────────────────────────┼────────────────┘
                │                                       │
      1. Bearer Header                        2. Automatic Cookie
 (Authorization: Bearer jwt...)             (SameSite=Strict/Lax)
                │                                       │
                ▼                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         BACKEND / API GATEWAY                          │
│                                                                        │
│  ┌─────────────────────────┐           ┌────────────────────────────┐  │
│  │   Protected Endpoints   │           │      Auth Service          │  │
│  │  (/api/v1/user/profile) │           │  (/api/auth/refresh, etc.) │  │
│  └─────────────────────────┘           └────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘

```

### Complete Auth Lifecycle Flow

1. **Login:** User submits credentials to `POST /api/auth/login`. On success:

* Backend returns the short-lived **Access Token** (~5–15 min) in the **JSON response body**.
* Backend sets the **Refresh Token** (~7–30 days) in an **`HttpOnly; Secure; SameSite=Strict` cookie**.

1. **Authenticated Requests:** Client attaches the in-memory Access Token to API calls via the HTTP Header: `Authorization: Bearer <access_token>`.
2. **App Initialization / Page Refresh:**

* When the user reloads or opens a new tab, the in-memory Access Token is lost.
* On app boot, the React/JS app fires `POST /api/auth/refresh`.
* The browser automatically sends the `HttpOnly` refresh cookie.
* Backend verifies the cookie and returns a fresh Access Token in the JSON payload.

1. **Silent Token Refresh (Token Expiration):**

* If an API call fails with `401 Unauthorized`, an HTTP client interceptor intercepts the failure, invokes `/api/auth/refresh`, updates the in-memory token, and replays the original request transparently.

1. **Logout:** Client calls `POST /api/auth/logout`. Backend clears the `HttpOnly` cookie (`Max-Age=0`) and revokes the Refresh Token in DB/Redis.

---

## 2. Front-End Implementation (React + Axios)

### Token Store Module (In-Memory Isolation)

Use a JavaScript closure module to store the token outside global state management (Redux/Zustand) and window scope to keep it isolated from potential XSS scripts:

```typescript
// src/services/tokenStore.ts

let inMemoryAccessToken: string | null = null;

export const tokenStore = {
  getToken: (): string | null => inMemoryAccessToken,
  setToken: (token: string | null): void => {
    inMemoryAccessToken = token;
  },
  clearToken: (): void => {
    inMemoryAccessToken = null;
  },
};

```

---

### HTTP Client with Automatic Refresh Interceptor

Below is a production-ready Axios instance configured with a queue mechanism to handle concurrent failed requests during token renewal without triggering race conditions.

```typescript
// src/services/apiClient.ts
import axios from 'axios';
import { tokenStore } from './tokenStore';

export const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com',
  withCredentials: true, // Crucial: Ensures cookies are sent across origins
});

// Flag and Queue to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Attach Access Token
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Handle 401s and Refresh Token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue concurrent requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint - Browser automatically includes HttpOnly cookie
        const { data } = await axios.post(
          'https://api.yourdomain.com/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        tokenStore.setToken(newAccessToken);

        // Retry queued requests with the new token
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStore.clearToken();
        
        // Trigger client-side logout/redirect to login page
        window.dispatchEvent(new Event('auth:session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

```

---

### React Auth Provider & Bootstrapping

```tsx
// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { tokenStore } from '../services/tokenStore';
import { apiClient } from '../services/apiClient';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: object) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Silent Refresh on App Initialization (Handles F5 Refresh)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await apiClient.post('/auth/refresh');
        tokenStore.setToken(data.accessToken);
        setIsAuthenticated(true);
      } catch {
        tokenStore.clearToken();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for global session expiration from Axios interceptor
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      tokenStore.clearToken();
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  const login = async (credentials: object) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    tokenStore.setToken(data.accessToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      tokenStore.clearToken();
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

```

---

## 3. Backend Requirements & Cookie Configuration

For this front-end architecture to function securely, your auth server must configure responses as follows:

### Cookie Headers

```http
Set-Cookie: refresh_token=rt_9f8a7b6c5d...; Path=/api/auth; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000;

```

* **`HttpOnly`**: Blocks `document.cookie` access from JavaScript, neutralizing XSS token theft.
* **`Secure`**: Ensures cookies travel exclusively over HTTPS.
* **`SameSite=Strict`**: Blocks CSRF by ensuring the browser never attaches this cookie on cross-site requests.
* **`Path=/api/auth`**: Restricts cookie transmission so it is sent **only** to authentication routes (`/refresh`, `/logout`), limiting exposure on standard API endpoints.

### CSRF Protection for SameSite Lax Scenarios

If your frontend and backend run on different top-level domains (requiring `SameSite=None`), pair the cookie with an **Anti-CSRF Token** (Double Submit Cookie pattern or `X-CSRF-Token` header) on modification requests.

---

## Security Trade-off Matrix

| Vector                  | In-Memory Access Token + HttpOnly Cookie                                                   | LocalStorage Storage                                              |
| ----------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **XSS Attack Vector**   | Access token is lost on reload; cannot be read via `document.cookie`.                      | Malicious scripts read `localStorage.getItem('token')` instantly. |
| **CSRF Attack Vector**  | Mitigated via `SameSite=Strict` and scoping cookie to `Path=/api/auth`.                    | Vulnerable if using cookies without CSRF defense.                 |
| **Tab Synchronization** | Refresh token is shared via cookie across tabs; access tokens fetch independently on load. | Shared synchronously, but vulnerable to global XSS.               |
| **Page Refresh UX**     | Requires 1 silent `/refresh` network hit on F5 boot (~50ms latency).                       | Instant load from storage (high risk for high convenience).       |

Here is the complete end-to-end architecture, sequence flow, and implementation code for an **In-Memory Access Token + HttpOnly Cookie** authentication system.

This model represents the current gold standard in Single Page Application (SPA) security, combining strong **XSS defense** (tokens aren't accessible via JavaScript) with **CSRF immunity** (strict cookie scoping and anti-CSRF measures).

---

## 1. System Architecture & Component Mapping

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT / SPA (BROWSER)                          │
│                                                                        │
│  ┌──────────────────────────────┐     ┌─────────────────────────────┐  │
│  │   In-Memory Token Closure    │     │    Browser Cookie Jar       │  │
│  │ ───────────────────────────  │     │ ─────────────────────────── │  │
│  │ Short-Lived Access Token     │     │ HttpOnly Refresh Cookie     │  │
│  │ (Lifetime: 5–15 min)         │     │ (Path=/api/auth/refresh)    │  │
│  └──────────────┬───────────────┘     └──────────────┬──────────────┘  │
└─────────────────┼────────────────────────────────────┼─────────────────┘
                  │                                    │
    Authorization: Bearer <token>             Automatic Cookie Transfer
                  │                                    │
                  ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         BACKEND / API GATEWAY                          │
│                                                                        │
│  ┌──────────────────────────────┐     ┌─────────────────────────────┐  │
│  │       Resource Server        │     │     Authentication Service  │  │
│  │    (Validates Bearer Token)  │     │   (Rotates Refresh Cookies) │  │
│  └──────────────────────────────┘     └─────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Token Lifecycle & Sequence Flows

### Scenario A: Login Flow

1. User posts credentials via `POST /api/auth/login`.
2. Backend responds with:

* **JSON Body:** `{ "accessToken": "jwt_ey..." }`
* **`Set-Cookie` Header:** `refresh_token=rt_xyz; Path=/api/auth/refresh; HttpOnly; Secure; SameSite=Strict`

1. Front-end stores the `accessToken` in JavaScript memory **only**.

### Scenario B: Page Refresh / Tab Bootstrapping

1. On F5 refresh or opening a new tab, the in-memory `accessToken` is lost.
2. The SPA mounts and immediately executes `POST /api/auth/refresh`.
3. The browser automatically includes the `refresh_token` cookie.
4. Backend issues a fresh `accessToken` in the JSON body and **rotates** the refresh token cookie.

### Scenario C: Silent Auto-Refresh via Axios Interceptors

When an Access Token expires during an active session, client requests return `401 Unauthorized`. An HTTP interceptor automatically pauses pending API requests, fetches a new token, and replays failed requests seamlessly.

```
Client App                   Axios Interceptor               Backend API
    │                               │                             │
    │ ─── 1. GET /api/v1/data ────> │                             │
    │     (Expired Access Token)    │ ──── 2. GET /api/v1/data ─> │
    │                               │                             │
    │                               │ <─── 3. HTTP 401 Unauth ─── │
    │                               │                             │
    │                               │ ─── 4. POST /auth/refresh > │
    │                               │     (Sends HttpOnly Cookie) │
    │                               │                             │
    │                               │ <─── 5. HTTP 200 OK ─────── │
    │                               │     (New Access Token JSON) │
    │                               │                             │
    │                               │ ─── 6. Replay Request ────> │
    │                               │     (New Bearer Token)      │
    │                               │                             │
    │ <── 7. HTTP 200 Data Response │ <── 8. HTTP 200 OK ───────── │

```

---

## 3. Production Code Implementation

### A. Isolated In-Memory Token Store (`tokenStore.ts`)

To prevent cross-site scripting (XSS) from inspecting global window variables (like `window.accessToken` or Redux dev tools), encapsulate token state within a closed module scope:

```typescript
// src/services/tokenStore.ts

let accessToken: string | null = null;

export const tokenStore = {
  getToken: (): string | null => accessToken,
  setToken: (token: string | null): void => {
    accessToken = token;
  },
  clearToken: (): void => {
    accessToken = null;
  },
};

```

---

### B. Axios Client with Request Queue Interceptor (`apiClient.ts`)

Handles concurrent requests that fail simultaneously when a token expires, avoiding race conditions on the `/refresh` endpoint.

```typescript
// src/services/apiClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from './tokenStore';

export const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com/v1',
  withCredentials: true, // Required to send cookies cross-origin
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Attach bearer token to outgoing calls
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor: Catch 401s and execute silent token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Intercept 401 responses and ensure request hasn't retried already
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in flight, queue concurrent requests
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Exchange HttpOnly Cookie for a fresh Access Token
        const { data } = await axios.post(
          'https://api.yourdomain.com/v1/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;
        tokenStore.setToken(newAccessToken);

        // Process all queued requests with the new token
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStore.clearToken();
        
        // Dispatch global event to force user redirect to login
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

```

---

### C. React Application Auth Context (`AuthContext.tsx`)

```tsx
// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { tokenStore } from '../services/tokenStore';
import { apiClient } from '../services/apiClient';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // App initialization: Attempt silent refresh to restore session on page reload
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data } = await apiClient.post('/auth/refresh');
        tokenStore.setToken(data.accessToken);
        setIsAuthenticated(true);
      } catch {
        tokenStore.clearToken();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      tokenStore.clearToken();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (credentials: Record<string, unknown>) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    tokenStore.setToken(data.accessToken);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      tokenStore.clearToken();
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

```

---

## 4. Required Backend Cookie Configuration

To support this front-end architecture, your backend must configure cookie attributes correctly on `/login` and `/refresh` responses:

```http
Set-Cookie: refresh_token=rt_9f8a7b...; Path=/v1/auth/refresh; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000;

```

* **`HttpOnly`**: Prevents `document.cookie` reading via malicious XSS scripts.
* **`Secure`**: Enforces HTTPS transmission only.
* **`SameSite=Strict`**: Blocks cross-site request forgery (CSRF) by preventing browsers from attaching the cookie on third-party link clicks.
* **`Path=/v1/auth/refresh`**: Limits cookie transmission exclusively to the token renewal endpoint, hiding it from standard REST API routes.
