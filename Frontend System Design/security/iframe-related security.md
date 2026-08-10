In Front-End System Design, protecting against iframe-related security risks revolves around defending against two main vectors:

1. **Clickjacking (UI Redressing):** Preventing malicious third-party websites from embedding *your* application inside an `<iframe>` to trick users into performing unintended actions.
2. **Untrusted Frame Execution:** Safely embedding *third-party* content inside your application without exposing your domain's cookies, DOM, or local storage to script injection or sandbox escapes.

An end-to-end frontend system design addresses both incoming and outgoing frame protections across multiple layers:

---

## 1. System Design Architecture for Frame Protection

```
                                INBOUND PROTECTION
                    (Preventing others from framing YOUR app)
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. HTTP Response Headers Layer (Edge / Reverse Proxy / CDN)                │
│  - Content-Security-Policy: frame-ancestors 'none' (or 'self' / domain)     │
│  - X-Frame-Options: DENY (or SAMEORIGIN for legacy browser support)         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Application Logic Layer (Client Fallback)                                │
│  - JS Frame-Busting Scripts (Legacy defense fallback)                       │
│  - Frame Context Detection (window.self !== window.top)                     │
└─────────────────────────────────────────────────────────────────────────────┘

                                       ▲
                                       │
                               OUTBOUND PROTECTION
                   (Safely framing THIRD-PARTY content in your app)

┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Client Sandbox Layer (View Component Layer)                              │
│  - Strict <iframe> `sandbox` attribute flags                                │
│  - `allow-scripts` WITHOUT `allow-same-origin` (Isolates DOM & Storage)     │
│  - Explicit `Permissions-Policy` delegation                                 │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Inbound Protection: Preventing Clickjacking

Clickjacking works by overlaying an invisible `<iframe>` of your application over an attacker's page. To stop other sites from framing your app:

### Layer A: HTTP Headers (Primary Defense)

Defense headers **must** be set by your infrastructure layer (Nginx, Cloudflare, Next.js Middleware, CDN) on all HTML responses:

* **`Content-Security-Policy: frame-ancestors` (Modern Standard):**
Defines exactly which origins are allowed to frame your site.

```http
# Block ALL framing of your app completely
Content-Security-Policy: frame-ancestors 'none';

# Allow framing ONLY by your own origin
Content-Security-Policy: frame-ancestors 'self';

# Allow framing ONLY by specific trusted parent domains
Content-Security-Policy: frame-ancestors 'self' https://trustedpartner.com;

```

* **`X-Frame-Options` (Legacy Browser Fallback):**
Used for older browsers that do not support CSP level 2/3.

```http
# Completely forbid framing
X-Frame-Options: DENY

# Allow framing only by the same origin
X-Frame-Options: SAMEORIGIN

```

> **Note:** If both headers are provided, modern browsers give precedence to `Content-Security-Policy: frame-ancestors`.

---

### Layer B: Frame-Busting Scripts (Client-Side Fallback)

If your application is served in environments where HTTP headers cannot be modified, implement a frame-busting script at the top of your main index document:

```html
<head>
  <style id="antiClickjack">
    /* Hide the document body by default */
    body { display: none !important; }
  </style>
  <script>
    // Verify if current window is the top-level browsing context
    if (self === top) {
      // Not framed: reveal the body
      var style = document.getElementById('antiClickjack');
      if (style) style.parentNode.removeChild(style);
    } else {
      // Framed: break out of the frame or clear top window
      top.location = self.location;
    }
  </script>
</head>

```

---

## 3. Outbound Protection: Safely Framing Third-Party Content

When your application must embed external dynamic content (e.g., payment widgets, video players, user-uploaded HTML previews), isolate the untrusted content using **sandboxed browsing contexts**.

### Strict HTML5 Sandbox Attributes

Never use an un-sandboxed `<iframe>`. Always apply the `sandbox` attribute, which turns on maximum restrictions by default, and selectively re-enable only necessary features:

```html
<iframe
  src="https://thirdparty.com/widget"
  sandbox="allow-scripts allow-forms"
  referrerpolicy="strict-origin-when-cross-origin"
  loading="lazy"
  title="Third Party Widget"
></iframe>

```

### Critical Sandbox Rules Matrix

| Sandbox Flag             | Purpose                                                                     | Security Impact                                                |
| ------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **`sandbox=""`** (empty) | Max restriction. Blocks scripts, forms, popups, and same-origin privileges. | Highest security. Rendered as plain untrusted static document. |
| **`allow-scripts`**      | Permits execution of JavaScript inside the frame.                           | Essential for interactive widgets.                             |
| **`allow-same-origin`**  | Allows iframe to retain its origin identity (cookies, local storage).       | **DANGEROUS when combined with `allow-scripts**`.              |
| **`allow-forms`**        | Permits form submission from inside the frame.                              | Required for checkout/payment processing frames.               |
| **`allow-popups`**       | Allows opening new tabs/windows.                                            | Useful for OAuth login windows inside widgets.                 |

> ⚠️ **The Fatal Combination:** Never set `sandbox="allow-scripts allow-same-origin"` if you are hosting the framed content on the **same domain** as your main app. Doing so allows the iframe script to remove its own sandbox attribute and compromise the host page's DOM and cookies.

---

## 4. Hardware & Feature Policy Isolation

To prevent framed third-party content from accessing hardware APIs (camera, microphone, geolocation, payment APIs) without authorization, use the `Permissions-Policy` header and the iframe `allow` attribute.

### Header Configuration (Parent Page)

```http
Permissions-Policy: camera=(), microphone=(), geolocation=(self)

```

### Explicit Feature Delegation (iFrame Tag)

Only delegate access to specific features if strictly required by the iframe component:

```html
<!-- Allow camera access ONLY for this specific frame, blocking microphone & payment -->
<iframe
  src="https://verify.id-check.com"
  sandbox="allow-scripts allow-forms"
  allow="camera 'src'"
></iframe>

```

---

## 5. Safe Cross-Frame Communication (`postMessage`)

When your host page must communicate with an embedded `<iframe>`, enforce strict origin validation on both sending and receiving ends.

### Host Page (Sending Messages)

Always pass an explicit `targetOrigin` instead of `*`:

```javascript
const iframeEl = document.getElementById('my-frame');

// SAFE: Sends payload ONLY if the iframe matches targetOrigin
iframeEl.contentWindow.postMessage(
  { type: 'SET_THEME', theme: 'dark' },
  'https://trusted-widget.com' // Never pass '*'
);

```

### Host Page (Receiving Messages)

Always validate `event.origin` before processing the payload:

```javascript
window.addEventListener('message', (event) => {
  // 1. Verify message origin
  if (event.origin !== 'https://trusted-widget.com') {
    console.warn('Rejected postMessage from unauthorized origin:', event.origin);
    return;
  }

  // 2. Validate payload structure
  const { type, data } = event.data;
  if (type === 'PAYMENT_SUCCESS') {
    handlePaymentCompletion(data);
  }
});

```

---

## Summary Matrix: iFrame Protection Strategy

| Hazard Vector                                       | Front-End System Control                                    | Where Implemented                    |
| --------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------ |
| **Preventing Clickjacking on Your App**             | `Content-Security-Policy: frame-ancestors 'self'`           | Reverse Proxy / CDN / Server Headers |
| **Untrusted Script Execution from External Frames** | `<iframe sandbox="allow-scripts">` (No `allow-same-origin`) | Component / View Layer               |
| **Unauthorized Hardware Access**                    | `Permissions-Policy` Header + `allow` attribute             | Web Server Headers & `<iframe>` tags |
| **Cross-Frame Data Leakage**                        | Strict `postMessage` origin checking (`event.origin`)       | Client JavaScript Event Handlers     |

Show how to design a secure micro-frontend host container using sandboxed iframes and postMessage.

Designing a micro-frontend (MFE) container using **sandboxed `<iframe>` elements** and a structured **`postMessage` Event Bus** provides the strongest isolation boundary possible in front-end system design.

This architecture guarantees that untrusted micro-frontends (e.g., third-party plugins, isolated vendor modules, multi-tenant apps) cannot:

* Access the host app's DOM, `window`, or global variables.
* Access sensitive cookies, `localStorage`, or `sessionStorage`.
* Execute unauthorized API calls using the host's credentials.

---

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             HOST APPLICATION                                │
│                                                                             │
│  ┌────────────────────────┐                   ┌──────────────────────────┐  │
│  │   Host State / Shell   │                   │  Secure Message Broker   │  │
│  │  - Theme / Auth Token  │ ◄────────────────►│ - Validates Origins      │  │
│  │  - Global Layout       │                   │ - Schema Verification    │  │
│  └────────────────────────┘                   └────────────┬─────────────┘  │
│                                                            │                │
│                                                postMessage │ Strict Protocol│
│                                                            ▼                │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Sandbox Shell Container (<iframe sandbox="allow-scripts">)             │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │                  ISOLATED MICRO-FRONTEND APP                    │  │  │
│  │  │                                                                 │  │  │
│  │  │  - Isolated DOM Context                                         │  │  │
│  │  │  - Isolated Local JS Memory                                     │  │  │
│  │  │  - No Access to Parent document.cookie or localStorage          │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Core Security Design Principles

1. **Strict Sandbox Isolation:** The `iframe` is configured with `sandbox="allow-scripts"`. By **omitting** `allow-same-origin`, the micro-frontend is forced into a unique null-origin context—completely severing its access to the host domain’s storage, cookies, and DOM.
2. **Explicit Target Origins:** `postMessage` requests always specify the target frame's exact origin—never using `*`.
3. **Structured Event Schema:** All messages pass through a strictly validated payload schema containing a `type`, `payload`, `transactionId`, and `origin`.
4. **Origin Allowlisting:** The host Message Broker maintains a strict registry of authorized MFE origins and discards unverified messages.

---

## 3. Host System Implementation

### A. Secure Message Broker (`HostMessageBroker.ts`)

```typescript
// host/src/services/HostMessageBroker.ts

export interface BridgeMessage<T = unknown> {
  type: string;
  payload: T;
  transactionId?: string;
  origin?: string;
}

type MessageHandler = (payload: any, reply: (data: any) => void) => void;

export class HostMessageBroker {
  private allowedOrigins: Set<string>;
  private handlers: Map<string, MessageHandler> = new Map();

  constructor(allowedOrigins: string[]) {
    this.allowedOrigins = new Set(allowedOrigins);
    this.initListener();
  }

  private initListener() {
    window.addEventListener('message', (event: MessageEvent<BridgeMessage>) => {
      // 1. Strict Origin Validation
      if (!this.allowedOrigins.has(event.origin)) {
        console.warn(`[Host Broker] Blocked message from untrusted origin: ${event.origin}`);
        return;
      }

      const { type, payload, transactionId } = event.data || {};
      if (!type || !this.handlers.has(type)) return;

      // 2. Helper to reply back to the specific child frame securely
      const reply = (replyPayload: unknown) => {
        if (event.source && 'postMessage' in event.source) {
          (event.source as Window).postMessage(
            {
              type: `${type}_RESPONSE`,
              payload: replyPayload,
              transactionId,
            },
            event.origin // Explicit origin target
          );
        }
      };

      // 3. Dispatch to handler
      const handler = this.handlers.get(type)!;
      handler(payload, reply);
    });
  }

  public registerHandler(messageType: string, handler: MessageHandler) {
    this.handlers.set(messageType, handler);
  }
}

```

---

### B. Micro-Frontend Iframe Container Component (`MicroFrontendContainer.tsx`)

```tsx
// host/src/components/MicroFrontendContainer.tsx
import React, { useEffect, useRef } from 'react';
import { HostMessageBroker } from '../services/HostMessageBroker';

interface MfeContainerProps {
  mfeUrl: string;       // e.g., "https://mfe-analytics.yourdomain.com"
  title: string;
  messageBroker: HostMessageBroker;
}

export const MicroFrontendContainer: React.FC<MfeContainerProps> = ({
  mfeUrl,
  title,
  messageBroker,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mfeOrigin = new URL(mfeUrl).origin;

  useEffect(() => {
    // Example: Register host handling for a specific action request from this MFE
    messageBroker.registerHandler('GET_USER_THEME', (_payload, reply) => {
      reply({ theme: 'dark', primaryColor: '#0066ff' });
    });
  }, [messageBroker]);

  return (
    <div className="mfe-wrapper" style={{ width: '100%', height: '500px', border: 'none' }}>
      <iframe
        ref={iframeRef}
        src={mfeUrl}
        title={title}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        /* 
          CRITICAL SECURITY ATTRIBUTES:
          - 'allow-scripts': Runs JS execution inside MFE
          - OMIT 'allow-same-origin': Forces MFE into unique null origin, isolating local storage & cookies
          - OMIT 'allow-top-navigation': Stops MFE from redirecting parent window
        */
        sandbox="allow-scripts allow-forms"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
      />
    </div>
  );
};

```

---

## 4. Micro-Frontend (Child) Client Implementation

Inside the isolated micro-frontend app, import a lightweight Bridge SDK to communicate back to the Host Container.

### MFE Client SDK (`MfeBridgeClient.ts`)

```typescript
// child-mfe/src/services/MfeBridgeClient.ts

export class MfeBridgeClient {
  private hostOrigin: string;

  constructor(hostOrigin: string) {
    this.hostOrigin = hostOrigin;
  }

  /**
   * Sends a request to the host container and waits for an async response
   */
  public request<TResponse = unknown>(type: string, payload?: unknown): Promise<TResponse> {
    return new Promise((resolve) => {
      const transactionId = crypto.randomUUID();

      const responseHandler = (event: MessageEvent) => {
        // Validate host origin response
        if (event.origin !== this.hostOrigin) return;

        const { type: responseType, payload: responsePayload, transactionId: id } = event.data || {};

        if (responseType === `${type}_RESPONSE` && id === transactionId) {
          window.removeEventListener('message', responseHandler);
          resolve(responsePayload as TResponse);
        }
      };

      window.addEventListener('message', responseHandler);

      // Post message to Parent Host Shell
      window.parent.postMessage(
        {
          type,
          payload,
          transactionId,
        },
        this.hostOrigin // Strict target origin restriction
      );
    });
  }
}

// Usage inside child MFE:
const bridge = new MfeBridgeClient('https://app.yourdomain.com');

// Safely fetch configuration from parent host
bridge.request<{ theme: string }>('GET_USER_THEME').then((config) => {
  console.log('Applied theme from Host:', config.theme);
});

```

---

## 5. Security & Isolation Guarantee Summary

| Security Hazard                      | How This Design Mitigates It                                                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Storage & Cookie Theft**           | Omitting `allow-same-origin` sets the iframe origin to `null`. The child MFE cannot access `document.cookie` or `localStorage` of the host app.  |
| **Unauthorized Parent Redirection**  | Omitting `allow-top-navigation` prevents malicious MFE code from running `window.top.location = '[https://phishing.com](https://phishing.com)'`. |
| **Eavesdropping / Message Spoofing** | Host and Child both check `event.origin` on every inbound `postMessage` and explicitly pass destination origins when transmitting.               |
| **DOM Tampering**                    | The iframe cannot reach into `window.parent.document` to alter host elements or steal tokens from memory.                                        |
