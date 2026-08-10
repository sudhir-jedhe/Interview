In Front-End System Design, **Permissions Policy** (formerly known as **Feature Policy**) is a browser security standard that gives you granular control over which browser features, hardware APIs, and iframe capabilities your application—and any embedded third-party scripts or iframes—are allowed to access.

By default, modern web browsers grant pages access to powerful APIs like Geolocation, Camera, Microphone, Payment Requests, and Screen Sharing. If an attacker injects a malicious script via XSS or a third-party vendor library gets compromised, they can silently abuse these browser features to spy on users or exfiltrate sensitive data.

Setting a strict **Permissions Policy** acts as a client-side circuit breaker: even if an XSS attack occurs, the browser forcibly blocks execution of forbidden hardware or browser APIs.

---

## 1. Permissions Policy Architecture & System Boundary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   PERMISSIONS POLICY CONTROL BOUNDARIES                      │
│                                                                             │
│  1. HTTP Response Header (Nginx / Edge / CDN / SSR)                         │
│     Permissions-Policy: camera=(), microphone=(), geolocation=(self)        │
│                                                                             │
│  2. Top-Level Browser Context (Main Application)                            │
│     • Camera Access: BLOCKED BY BROWSER                                     │
│     • Microphone Access: BLOCKED BY BROWSER                                 │
│     • Geolocation Access: ALLOWED (Same-Origin Only)                       │
│                                                                             │
│  3. Embedded <iframe> Context (Third-Party Widgets / Micro-frontends)       │
│     <iframe src="..." allow="geolocation 'src'"></iframe>                   │
│     • Explicitly delegated feature access (Inherits default restrictions)   │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Permissions Policy Syntax & Directives

Permissions Policy can be set via **HTTP Response Headers** (recommended) or the **`allow` attribute** on `<iframe>` tags.

### Directive Allowlist Syntax

* `()` *(Empty List)*: Completely disables the feature for the top-level origin and **all** framed documents.
* `self`: Restricts feature usage exclusively to your own origin (e.g., `[https://app.yourdomain.com](https://app.yourdomain.com)`).
* `"[https://trusted.com](https://trusted.com)"`: Grants permission strictly to an explicit origin.
* `*` *(Wildcard - DANGEROUS)*: Allows any origin to use the feature.

---

## 3. Production Implementation: Configuring Security Controls

### A. Server & CDN Layer Configuration (Nginx & Next.js)

Configure your reverse proxy, CDN, or SSR framework to emit the `Permissions-Policy` header on all HTML responses.

#### Nginx (`nginx.conf`)

```nginx
server {
    listen 443 ssl http2;
    server_name app.yourdomain.com;

    # Harden browser features & API privileges
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self \"https://maps.trusted.com\"), payment=(self), display-capture=(), autoplay=(), accelerometer=(), gyroscope=(), magnetometer=(), usb=()" always;

    location / {
        proxy_pass http://localhost:3000;
    }
}

```

#### Next.js (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(self), payment=(self), display-capture=(), usb=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

```

---

### B. View & Component Layer (iframe Delegation)

By default, an `<iframe>` inherits the restrictions of the parent page. If a framed third-party widget (such as a payment portal or identity verification tool) requires access to a hardware feature, you must explicitly delegate access via the `allow` attribute.

```tsx
// src/components/IdentityVerificationWidget.tsx
import React from 'react';

export const IdentityVerificationWidget: React.FC = () => {
  return (
    <div className="verification-container">
      <iframe
        src="https://verify.id-vendor.com/session/123"
        title="ID Verification Component"
        width="100%"
        height="600"
        /*
          1. Permissions Policy Delegation:
             Delegates camera access ONLY to the target iframe origin ('src').
             Blocks microphone, geolocation, and payment access.
        */
        allow="camera 'src'"
        /*
          2. Sandbox Restrictions:
             Isolates DOM and cookies from host application.
        */
        sandbox="allow-scripts allow-forms"
        loading="lazy"
      />
    </div>
  );
};

```

---

### C. Client-Side Runtime Checking

Before invoking powerful browser APIs in JavaScript, verify feature policy status dynamically using `document.featurePolicy` (or `document.permissionsPolicy` in modern Chromium browsers) to handle denied permissions gracefully.

```typescript
// src/utils/mediaCapture.ts

export async function requestUserCamera(): Promise<MediaStream | null> {
  // Check if camera permission is disabled by Permissions-Policy header
  if (
    'permissionsPolicy' in document &&
    !(document as any).permissionsPolicy.allowsFeature('camera')
  ) {
    console.warn('[Security Notice] Camera access is disabled by Permissions-Policy.');
    alert('Camera features are restricted by security policy.');
    return null;
  }

  try {
    return await navigator.mediaDevices.getUserMedia({ video: true });
  } catch (err) {
    console.error('Camera access error or rejected by user:', err);
    return null;
  }
}

```

---

## 4. Key Directives Matrix for Front-End Hardening

| Directive Name        | Security Function                                                | Recommended Production Baseline |
| --------------------- | ---------------------------------------------------------------- | ------------------------------- |
| **`camera`**          | Access to user webcam/video streams                              | `camera=()` or `camera=(self)`  |
| **`microphone`**      | Access to audio recording hardware                               | `microphone=()`                 |
| **`geolocation`**     | Access to device GPS location                                    | `geolocation=(self)`            |
| **`payment`**         | Access to Web Payment Request API                                | `payment=(self)`                |
| **`display-capture`** | Access to screen recording / sharing                             | `display-capture=()`            |
| **`usb` / `serial**`  | Access to WebUSB / WebSerial hardware APIs                       | `usb=()`, `serial=()`           |
| **`autoplay`**        | Ability to auto-play audio/video media                           | `autoplay=(self)`               |
| **`sync-xhr`**        | Synchronous XMLHttpRequest execution (causes main thread freeze) | `sync-xhr=()`                   |

---

## Summary Strategy Checklist

1. **Apply Principle of Least Privilege:** Set `camera=()`, `microphone=()`, and `display-capture=()` to empty lists `()` by default unless your core application functionality explicitly requires them.
2. **Never Use Wildcards:** Avoid setting `feature=(*)`, which exposes sensitive hardware APIs to any embedded third-party script or ad network.
3. **Delegate Explicitly on iframes:** Use `allow="camera 'src'"` on `<iframe>` tags to grant temporary feature access only to authorized vendor origins.
