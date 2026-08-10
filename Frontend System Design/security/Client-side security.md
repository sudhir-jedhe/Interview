In Front-End System Design, **Client-Side Security** focuses on protecting the application runtime executing inside the user’s browser. Because the client environment is fundamentally untrusted and fully accessible to the end-user (and potential attackers via dev tools or malicious extensions), client-side security is about **reducing attack surface, isolating sensitive data, and building defense-in-depth**.

---

## Client-Side Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          BROWSER EXECUTION ENVIRONMENT                       │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. DATA & STORAGE LAYER                                               │  │
│  │  • In-Memory Access Tokens (Closure Variables / State)                │  │
│  │  • HttpOnly, Secure, SameSite Refresh Cookies                         │  │
│  │  • Data Minimization (No sensitive PII in LocalStorage/IndexedDB)    │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. RUNTIME & RENDERING LAYER                                          │  │
│  │  • Auto-Escaping View Frameworks (React / Vue / Angular)             │  │
│  │  • Sanitization Engine (DOMPurify) for Rich User Content               │  │
│  │  • Enforced Trusted Types API (Blocks unsafe DOM sinks)               │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 3. SYSTEM BOUNDARY & ISOLATION LAYER                                  │  │
│  │  • Sandboxed <iframe> Elements (Un-trusted 3rd-Party Plugins)          │  │
│  │  • Strict postMessage Origin Verification                             │  │
│  │  • Web Worker Processing for isolated script execution               │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│                                      ▼                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 4. SUPPLY CHAIN & CODE HARDENING                                      │  │
│  │  • Subresource Integrity (SRI) for CDN Assets                         │  │
│  │  • Dependency Scanning (Snyk, Dependabot) in CI/CD                    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## Core Pillars of Client-Side Security

### 1. Secure Token & State Management

Storing sensitive information (JWTs, Session IDs, PII) in browser storage (`localStorage` or `sessionStorage`) exposes it to XSS attacks because any JavaScript executing on the origin can read `window.localStorage`.

* **In-Memory Access Tokens:** Store short-lived access tokens (~5–15 minutes) inside JavaScript closures or state handlers, making them inaccessible to external scripts.
* **HttpOnly Refresh Cookies:** Store long-lived session renewal tokens in cookies flagged with `HttpOnly; Secure; SameSite=Strict`. This makes the refresh token unreadable by `document.cookie`.
* **Data Minimization:** Never cache sensitive user data (SSNs, credit cards, credentials) in `IndexedDB` or `localStorage` without explicit client-side encryption.

```typescript
// Example: Isolated In-Memory Token Store Closure
let accessToken: string | null = null;

export const tokenStore = {
  getToken: () => accessToken,
  setToken: (token: string) => { accessToken = token; },
  clearToken: () => { accessToken = null; }
};

```

---

### 2. Defensive DOM Rendering & Sanitization

XSS occurs when untrusted input reaches a dangerous DOM sink (`element.innerHTML`, `document.write()`, `eval()`).

* **Avoid Escape Hatches:** Eliminate dangerous framework bypasses like React's `dangerouslySetInnerHTML` or Vue's `v-html`. Use `.textContent` or standard template bindings (`{value}`) which automatically auto-escape variables.
* **Sanitize Dynamic HTML:** When rendering user-generated rich text is unavoidable, pass payloads through a client-side sanitizer like **DOMPurify** before mounting.
* **Enforce Trusted Types:** Configure the browser's native Trusted Types API to lock down DOM sinks, preventing raw string assignments unless they pass through an explicit policy.

```javascript
import DOMPurify from 'dompurify';

// Safe rendering of dynamic rich text
const cleanHTML = DOMPurify.sanitize(userBioInput, {
  ALLOWED_TAGS: ['b', 'i', 'p', 'strong'],
});

```

---

### 3. Component Isolation & Sandboxing

When integrating third-party widgets, analytics, payment gateways, or user-uploaded plugins, isolate their runtime execution from your main application DOM.

* **Sandboxed iFrames:** Wrap untrusted third-party UI components inside an `<iframe>` with strict sandbox rules:

```html
<iframe src="https://vendor.com/widget" sandbox="allow-scripts"></iframe>

```

*Omitting `allow-same-origin` places the frame into a unique `null` origin context, preventing it from accessing your host app's cookies or storage.*

* **Strict `postMessage` Contracts:** Always check `event.origin` when receiving messages across iframe boundaries, and explicitly state the target origin when sending messages:

```javascript
// Receiving
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://trusted-vendor.com') return;
  handleMessage(event.data);
});

// Sending
iframeWindow.postMessage(data, 'https://trusted-vendor.com'); // Never pass '*'

```

---

### 4. Supply Chain & Dependency Hardening

Modern SPAs rely on hundreds of `npm` dependencies. A single compromised package can introduce a supply-chain attack.

* **Subresource Integrity (SRI):** When loading scripts from external CDNs, include cryptographic hashes in your tags to ensure the file hasn't been tampered with:

```html
<script 
  src="https://cdn.example.com/library.js" 
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYb15M8w=" 
  crossorigin="anonymous">
</script>

```

* **Lockfile Pinning & CI Audits:** Commit `package-lock.json` or `pnpm-lock.yaml` to ensure deterministic builds. Integrate `npm audit`, Snyk, or Dependabot into build pipelines to block deployment of vulnerable packages.

---

### 5. Client-Side Input Validation (UX Boundary)

While client-side input validation enhances UX by giving instantaneous feedback, **it is never a security boundary**. Attackers can bypass front-end forms, disable JavaScript, or manipulate network traffic via proxy tools (e.g., Burp Suite).

* **Role of Client-Side Validation:** Form validation (e.g., Zod, Yup) prevents malformed data submissions and improves application usability.
* **Role of Backend Validation:** All business logic checks, type checks, and authorization rules must be re-validated on the backend server.

---

## Client-Side Security Decision Matrix

| Vector / Risk                    | Client-Side Security Control                         | Where It Is Implemented         |
| -------------------------------- | ---------------------------------------------------- | ------------------------------- |
| **Session Theft via XSS**        | In-Memory Access Tokens + `HttpOnly` Refresh Cookies | Auth Module & API Interceptors  |
| **DOM-based XSS**                | Auto-Escaping, `DOMPurify`, Trusted Types API        | UI Component / View Layer       |
| **Third-Party Script Isolation** | Sandboxed `<iframe>` without `allow-same-origin`     | Layout / Embed Components       |
| **CDN File Tampering**           | Subresource Integrity (SRI) Hash Checking            | HTML Template / Build Pipelines |
| **Data Leakage in Storage**      | Data Minimization (avoid storing PII locally)        | Front-End State Management      |
| **Malicious Package Injection**  | CI Dependency Audits & Lockfile Pinning              | Build & Deployment Pipeline     |

Here is a complete, production-grade example demonstrating how to implement **Client-Side Security** in code across all 5 key pillars within a modern Front-End application (React/TypeScript).

---

### Pillar 1: In-Memory Token Storage & Auth Closure

Instead of storing access tokens in `localStorage` or `sessionStorage` (where any XSS script can read them), encapsulate the token inside an isolated module closure.

```typescript
// src/security/tokenStore.ts

// The access token is stored in module memory — isolated from window scope
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

```typescript
// src/security/apiClient.ts
import axios from 'axios';
import { tokenStore } from './tokenStore';

export const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com/v1',
  withCredentials: true, // Required to automatically send HttpOnly refresh cookies
});

// Request Interceptor: Attach in-memory token to outgoing requests
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

```

---

### Pillar 2: DOM Sanitization & Trusted Types Enforcer

Defends against DOM-based XSS when dynamic HTML must be rendered.

```typescript
// src/security/trustedTypes.ts
import DOMPurify from 'dompurify';

// 1. Initialize Trusted Types Policy
export const htmlPolicy = window.trustedTypes?.createPolicy('appSanitizerPolicy', {
  createHTML: (dirtyInput: string) => {
    // Sanitize string before returning typed TrustedHTML
    return DOMPurify.sanitize(dirtyInput, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'a'],
      ALLOWED_ATTR: ['href'],
    });
  },
});

```

```tsx
// src/components/UserProfileBio.tsx
import React from 'react';
import { htmlPolicy } from '../security/trustedTypes';

interface UserBioProps {
  rawBio: string;
}

export const UserProfileBio: React.FC<UserBioProps> = ({ rawBio }) => {
  // Pass untrusted bio string through our Trusted Types policy
  const safeBioHTML = htmlPolicy ? htmlPolicy.createHTML(rawBio) : rawBio;

  return (
    <div className="user-bio-card">
      <h3>About User</h3>
      {/* React accepts TrustedHTML without throwing runtime security errors */}
      <div dangerouslySetInnerHTML={{ __html: safeBioHTML as unknown as string }} />
    </div>
  );
};

```

---

### Pillar 3: Sandboxed iFrame & Secure `postMessage` Communication

Safely embeds third-party widgets without exposing main app storage or cookies.

```tsx
// src/components/ThirdPartyWidget.tsx
import React, { useEffect, useRef } from 'react';

const ALLOWED_VENDOR_ORIGIN = 'https://widget.vendor.com';

export const ThirdPartyWidget: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 1. Secure Inbound Message Handler
    const handleMessage = (event: MessageEvent) => {
      // STRICT ORIGIN CHECK
      if (event.origin !== ALLOWED_VENDOR_ORIGIN) {
        console.warn('Rejected postMessage from unauthorized origin:', event.origin);
        return;
      }

      const { type, payload } = event.data || {};
      if (type === 'WIDGET_COMPLETED') {
        console.log('Received data safely from widget:', payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const sendDataToWidget = () => {
    if (iframeRef.current?.contentWindow) {
      // 2. Strict Target Origin when sending
      iframeRef.current.contentWindow.postMessage(
        { action: 'INITIALIZE' },
        ALLOWED_VENDOR_ORIGIN // NEVER pass '*'
      );
    }
  };

  return (
    <div>
      <button onClick={sendDataToWidget}>Initialize Widget</button>
      <iframe
        ref={iframeRef}
        src={`${ALLOWED_VENDOR_ORIGIN}/embed`}
        title="Third Party Vendor Component"
        width="100%"
        height="400"
        /* 
           SANDBOX FLAGS:
           - 'allow-scripts': Permits JS inside the widget.
           - OMIT 'allow-same-origin': Assigns frame to a unique null origin,
             blocking access to host app document.cookie, localStorage, or DOM.
        */
        sandbox="allow-scripts allow-forms"
        loading="lazy"
      />
    </div>
  );
};

```

---

### Pillar 4: Subresource Integrity (SRI) for CDN Scripts

Enforces cryptographic verification of external third-party JS libraries before execution.

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Secure Front-End App</title>
</head>
<body>
  <div id="root"></div>

  <!-- Load CDN script with Subresource Integrity (SRI) hash -->
  <script 
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
    crossorigin="anonymous">
  </script>
</body>
</html>

```

---

### Pillar 5: Client-Side Input Validation (Zod Schema Validation)

Validates form structure on the client for instant UX feedback before sending network requests.

```typescript
// src/schemas/userRegistrationSchema.ts
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address format'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;

```

```tsx
// src/components/RegistrationForm.tsx
import React, { useState } from 'react';
import { userRegistrationSchema } from '../schemas/userRegistrationSchema';
import { apiClient } from '../security/apiClient';

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-Side Validation Step
    const validationResult = userRegistrationSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return; // Stop invalid execution locally
    }

    setErrors({});

    // 2. Submit validated payload to backend API
    try {
      await apiClient.post('/auth/register', validationResult.data);
      alert('Registration successful!');
    } catch (err) {
      console.error('API submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <button type="submit">Register</button>
    </form>
  );
};

```

---

### Implementation Code Summary

| Pillar       | Security Implementation Technique                   | Primary Security Benefit                                                                            |
| ------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Pillar 1** | Closure-Scoped Token Store (`tokenStore.ts`)        | Keeps tokens out of `window.localStorage` to prevent XSS theft.                                     |
| **Pillar 2** | DOMPurify + Trusted Types (`trustedTypes.ts`)       | Blocks unapproved string assignments to dangerous DOM sinks like `.innerHTML`.                      |
| **Pillar 3** | Sandboxed `<iframe>` + Strict Origin checking       | Isolates vendor scripts in a null origin context with mandatory origin validation on `postMessage`. |
| **Pillar 4** | Subresource Integrity (`integrity="sha384-..."`)    | Guarantees third-party CDN files haven't been tampered with or infected.                            |
| **Pillar 5** | Zod Schema Validation (`userRegistrationSchema.ts`) | Sanitizes and validates data types before triggering network requests.                              |
