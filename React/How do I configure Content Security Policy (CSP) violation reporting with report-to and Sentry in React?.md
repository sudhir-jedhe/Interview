To monitor and capture CSP violations using Sentry, you need to configure your web server to deliver both the **Reporting API** headers (`Report-To` / `Reporting-Endpoints`) and your **CSP Header** containing the `report-to` and `report-uri` directives pointing to your Sentry DSN endpoint.

---

### 1. Get Your Sentry CSP Endpoint

In Sentry, navigate to **Project Settings $\rightarrow$ Security Headers $\rightarrow$ CSP**. Sentry provides a dedicated reporting endpoint formatted as:

```text
https://o[ORG_ID].ingest.sentry.io/api/[PROJECT_ID]/security/?sentry_key=[PUBLIC_KEY]

```

*(You can also append optional tracking parameters such as `&sentry_environment=production&sentry_release=v1.2.0`)*.

---

### 2. Configure HTTP Response Headers on Your Server

Modern browsers use the **Reporting API** (`Reporting-Endpoints` / `Report-To`), while older browsers rely on `report-uri`. Provide both for cross-browser coverage.

#### Express / Node.js Implementation (`server.js`)

```javascript
import express from 'express';
import crypto from 'crypto';

const app = express();

const SENTRY_CSP_ENDPOINT =
  'https://o123456.ingest.sentry.io/api/987654/security/?sentry_key=abcdef1234567890&sentry_environment=production';

app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;

  // 1. Modern W3C Reporting API (Chrome 96+, Edge)
  res.setHeader('Reporting-Endpoints', `sentry-csp-endpoint="${SENTRY_CSP_ENDPOINT}"`);

  // 2. Legacy Reporting API header (fallback)
  const reportToHeader = JSON.stringify({
    group: 'sentry-csp-endpoint',
    max_age: 10886400,
    endpoints: [{ url: SENTRY_CSP_ENDPOINT }],
  });
  res.setHeader('Report-To', reportToHeader);

  // 3. CSP Header with Reporting Directives
  // Use "Content-Security-Policy-Report-Only" first if auditing without blocking
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: https:",
    "font-src 'self' https: data:",
    "connect-src 'self' https://*.sentry.io https://api.yourdomain.com",
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    // Modern Reporting API group name
    "report-to sentry-csp-endpoint",
    // Fallback for Safari & Firefox (which do not yet fully support report-to)
    `report-uri ${SENTRY_CSP_ENDPOINT}`,
  ];

  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));

  next();
});

```

#### Nginx Configuration Alternative

```nginx
# Nginx Configuration
set $sentry_csp "https://o123456.ingest.sentry.io/api/987654/security/?sentry_key=abcdef1234567890&sentry_environment=production";

add_header Reporting-Endpoints "sentry-csp-endpoint=\"$sentry_csp\"" always;
add_header Report-To "{\"group\":\"sentry-csp-endpoint\",\"max_age\":10886400,\"endpoints\":[{\"url\":\"$sentry_csp\"}]}" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https:; report-to sentry-csp-endpoint; report-uri $sentry_csp;" always;

```

---

### 3. Capturing Client-Side CSP Violations in React (`SecurityPolicyViolationEvent`)

Browsers dispatch a `securitypolicyviolation` DOM event whenever a violation occurs. You can capture this in React with `@sentry/react` to attach user breadcrumbs, session context, and user IDs that HTTP reporting endpoints cannot see:

```tsx
// src/components/CspViolationTracker.tsx
import React, { useEffect } from 'react';
import * as Sentry from '@sentry/react';

export function CspViolationTracker({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleCspViolation = (event: SecurityPolicyViolationEvent) => {
      // Ignore known false-positives (like browser extensions injecting scripts)
      if (
        event.blockedURI.startsWith('chrome-extension://') ||
        event.blockedURI.startsWith('moz-extension://')
      ) {
        return;
      }

      // Add a structured breadcrumb in Sentry
      Sentry.addBreadcrumb({
        category: 'csp',
        message: `CSP Violation: Blocked ${event.blockedURI || 'inline'} by directive '${event.effectiveDirective}'`,
        level: 'warning',
        data: {
          documentURI: event.documentURI,
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective,
          effectiveDirective: event.effectiveDirective,
          originalPolicy: event.originalPolicy,
          statusCode: event.statusCode,
          sample: event.sample?.slice(0, 100), // First 100 chars of inline violation
        },
      });

      // Optionally capture a dedicated Sentry event
      Sentry.captureMessage(
        `CSP Violation: ${event.effectiveDirective} on ${event.documentURI}`,
        {
          level: 'warning',
          tags: {
            'csp.directive': event.effectiveDirective,
            'csp.blocked_uri': event.blockedURI,
          },
          extra: {
            lineNumber: event.lineNumber,
            columnNumber: event.columnNumber,
            sourceFile: event.sourceFile,
          },
        }
      );
    };

    document.addEventListener('securitypolicyviolation', handleCspViolation);

    return () => {
      document.removeEventListener('securitypolicyviolation', handleCspViolation);
    };
  }, []);

  return <>{children}</>;
}

```

Wrap your root layout in `App.tsx`:

```tsx
// src/App.tsx
import React from 'react';
import { CspViolationTracker } from './components/CspViolationTracker';

export default function App() {
  return (
    <CspViolationTracker>
      <MainRouter />
    </CspViolationTracker>
  );
}

```

---

### 4. Testing the Report Flow

To test if your Sentry endpoint receives reports, create a temporary button that triggers an inline violation:

```tsx
<button
  onClick={() => {
    // Intentionally inject a forbidden inline script or eval
    const script = document.createElement('script');
    script.src = 'https://unauthorized-evil-cdn.example.com/malicious.js';
    document.body.appendChild(script);
  }}
>
  Test CSP Violation
</button>

```

When clicked:

1. The browser blocks the request with a console error: `[Report Only] Refused to load the script...`.
2. The browser automatically sends a `POST` request with the JSON payload to your Sentry ingest endpoint in the background.
3. The report appears in Sentry under **Security $\rightarrow$ CSP Reports**.

---

### Best Practices

* **Start with `Content-Security-Policy-Report-Only`:** Deploy the policy in report-only mode first for 1–2 weeks. This lets you observe third-party trackers, analytics widgets, or extension noise without breaking functionality for users.
* **Filter Browser Extensions:** Ad blockers and browser plugins often inject scripts matching `chrome-extension://` or `safari-extension://`. Sentry provides built-in settings under **Inbound Filters** $\rightarrow$ **Filter out browser extension issues** to drop this noise automatically.
* **Include `connect-src` for Sentry:** Ensure your `connect-src` directive includes `https://*.sentry.io` or your custom ingest domain, so standard client-side error telemetry is never blocked by your own CSP.
