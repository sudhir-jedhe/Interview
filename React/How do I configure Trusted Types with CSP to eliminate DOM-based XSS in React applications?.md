**Trusted Types** locks down dangerous DOM injection sinks—such as `element.innerHTML`, `element.outerHTML`, `document.write`, and `iframe.srcdoc`. Once enabled via Content Security Policy (CSP), the browser will reject raw strings passed into these sinks, throwing a runtime `TypeError` unless the value is wrapped in a verified `TrustedHTML`, `TrustedScript`, or `TrustedScriptURL` object.

---

### 1. Configure the CSP Header for Trusted Types

Enable Trusted Types by adding the `require-trusted-types-for` and `trusted-types` directives to your HTTP response headers:

```http
Content-Security-Policy:
  require-trusted-types-for 'script';
  trusted-types default react-dompurify;

```

* `require-trusted-types-for 'script'`: Mandates Trusted Types for all script-execution and HTML-injection sinks.
* `trusted-types default react-dompurify`: Declares an allowlist of permitted policy names (`react-dompurify` for application sanitization and `default` for fallback handling of third-party libraries).

---

### 2. Add TypeScript Definitions & Polyfill

For browsers without native support (such as Safari/Firefox) and for strict TypeScript typing:

```bash
npm install dompurify
npm install -D @types/dompurify @types/trusted-types trusted-types

```

Create a central policy module (`src/security/trustedTypes.ts`):

```typescript
import DOMPurify from 'dompurify';

// Polyfill window.trustedTypes if not natively supported
if (typeof window !== 'undefined' && !window.trustedTypes) {
  import('trusted-types');
}

// 1. Primary Policy: Sanitizes user-provided HTML via DOMPurify
export const dompurifyPolicy =
  typeof window !== 'undefined' && window.trustedTypes
    ? window.trustedTypes.createPolicy('react-dompurify', {
        createHTML: (dirty: string) => {
          return DOMPurify.sanitize(dirty, {
            RETURN_TRUSTED_TYPE: false, // Return plain string; policy wraps it in TrustedHTML
          });
        },
      })
    : null;

// 2. Helper to produce TrustedHTML safely in React
export function sanitizeToTrustedHTML(dirty: string): TrustedHTML | string {
  if (dompurifyPolicy) {
    return dompurifyPolicy.createHTML(dirty);
  }
  // Fallback for browsers without Trusted Types support
  return DOMPurify.sanitize(dirty);
}

```

---

### 3. Register a `default` Fallback Policy

Some legacy dependencies or internal React mechanisms may write strings directly to DOM properties. A `default` policy acts as an automated bridge, sanitizing unexpected raw strings rather than crashing the application:

```typescript
// src/security/defaultPolicy.ts
import DOMPurify from 'dompurify';

if (typeof window !== 'undefined' && window.trustedTypes) {
  // Only create if not already registered
  try {
    window.trustedTypes.createPolicy('default', {
      createHTML: (stringInput: string) => {
        // Automatically sanitize any unmanaged string passed to a DOM sink
        return DOMPurify.sanitize(stringInput);
      },
      createScriptURL: (url: string) => {
        // Enforce same-origin or trusted CDN origins for dynamic script URLs
        const parsed = new URL(url, window.location.origin);
        const allowedOrigins = [window.location.origin, 'https://cdn.yourdomain.com'];
        
        if (allowedOrigins.includes(parsed.origin)) {
          return url;
        }
        throw new URIError(`Untrusted script URL blocked by Trusted Types: ${url}`);
      },
      createScript: (scriptSource: string) => {
        // Block all untrusted inline script evaluation via sinks like eval / setTimeout(string)
        throw new Error('Dynamic script execution blocked by Trusted Types policy.');
      },
    });
  } catch (err) {
    console.warn('Default Trusted Types policy already created or failed to register:', err);
  }
}

```

Import this file **at the very top** of your application entry point (`src/main.tsx` or `src/index.tsx`) before any UI libraries execute.

---

### 4. Rendering User HTML in React (`dangerouslySetInnerHTML`)

When using `dangerouslySetInnerHTML`, React 18+ and React 19 natively accept a `TrustedHTML` object inside `__html`:

```tsx
import React from 'react';
import { sanitizeToTrustedHTML } from './security/trustedTypes';

interface SafeHTMLRendererProps {
  content: string;
  className?: string;
}

export const SafeHTMLRenderer: React.FC<SafeHTMLRendererProps> = ({ content, className }) => {
  // Returns a valid TrustedHTML object in compliant browsers
  const trustedContent = sanitizeToTrustedHTML(content);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: trustedContent as unknown as string,
      }}
    />
  );
};

```

If an engineer mistakenly writes raw unsanitized input:

```tsx
// ❌ Rejected by the browser with a TypeError when Trusted Types is enforced:
// "Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment."
element.innerHTML = userInput;

```

---

### 5. Managing Dynamic Script Injections (`TrustedScriptURL`)

If you dynamically load third-party scripts (e.g., Stripe, Google Maps, analytics), wrap the URLs in a dedicated policy:

```typescript
// src/security/scriptPolicy.ts
export const scriptPolicy =
  typeof window !== 'undefined' && window.trustedTypes
    ? window.trustedTypes.createPolicy('dynamic-scripts', {
        createScriptURL: (src: string) => {
          const allowedDomains = ['https://js.stripe.com', 'https://maps.googleapis.com'];
          if (allowedDomains.some((domain) => src.startsWith(domain))) {
            return src;
          }
          throw new SecurityError(`Script URL not allowlisted: ${src}`);
        },
      })
    : null;

export function loadExternalScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    
    // Assign either TrustedScriptURL or validated string
    if (scriptPolicy) {
      script.src = scriptPolicy.createScriptURL(src) as unknown as string;
    } else {
      script.src = src;
    }

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

```

Add `dynamic-scripts` to your CSP header's `trusted-types` list:

```http
Content-Security-Policy: require-trusted-types-for 'script'; trusted-types default react-dompurify dynamic-scripts;

```

---

### Verification and Rollout Strategy

1. **Start with Report-Only Mode:**
Deploy `Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; trusted-types default react-dompurify;` to monitor unmigrated injection sinks via Sentry before hard-blocking.
2. **Audit Browser Console:**
In Chrome/Edge DevTools under the **Console** and **Issues** tabs, inspect any `[Report Only] Trusted Types violation` alerts to identify packages calling native DOM sinks directly.
3. **Lock Down the Policy List:**
Avoid wildcard declarations like `trusted-types *`. Explicitly list only the exact policy names your application uses to prevent malicious scripts from registering their own pass-through policies.
