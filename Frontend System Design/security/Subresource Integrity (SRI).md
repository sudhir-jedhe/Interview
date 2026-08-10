
**Subresource Integrity (SRI)** is a browser security feature that verifies files fetched from external third-party servers—such as Content Delivery Networks (CDNs)—haven't been altered or tampered with before execution.

When an application loads external scripts (`<script>`) or stylesheets (`<link>`), SRI allows developers to supply a base64-encoded cryptographic hash of the expected file content. Upon fetching the resource, the browser calculates its hash in real time. If the hashes do not match perfectly, the browser blocks execution immediately.

---

## 1. How SRI Prevents Supply Chain Attacks

Without SRI, loading external scripts relies on implicit trust in the host CDN. If an attacker compromises the CDN or conducts a Man-in-the-Middle (MitM) attack to inject malicious code into the JavaScript file, your users' browsers will execute it automatically.

```
[ BROWSER ]
    │
    │ 1. Fetches <script src="https://cdn.example.com/lib.js" integrity="sha384-xyz...">
    ▼
[ CDN SERVER ] (Compromised by attacker / Modified script payload)
    │
    │ 2. Returns modified file content
    ▼
[ BROWSER SECURITY ENGINE ]
    │ 3. Calculates sha384 hash of received file
    │ 4. Received Hash ≠ Expected SRI Hash ("sha384-xyz...")
    ▼
[ RESULT ] 🛑 BLOCKED! Browser cancels execution and throws network error in console.

```

---

## 2. Implementing SRI Attributes in Markup

SRI requires two attributes on `<script>` and `<link>` tags:

1. **`integrity`**: Specifier containing the hash algorithm (`sha256`, `sha384`, or `sha512`) followed by a hyphen and the base64-encoded hash value.
2. **`crossorigin="anonymous"`**: Requests CORS headers without passing credentials. SRI validation requires the resource to be served with proper Cross-Origin Resource Sharing (CORS) headers (`Access-Control-Allow-Origin`).

### HTML Example

```html
<!-- JavaScript Script Import with SRI -->
<script 
  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
  integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" 
  crossorigin="anonymous">
</script>

<!-- CSS Stylesheet Import with SRI -->
<link 
  rel="stylesheet" 
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
  integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" 
  crossorigin="anonymous">

```

---

## 3. How to Generate SRI Hashes

### Option A: Command Line (OpenSSL & shasum)

Generate a base64-encoded SHA-384 hash directly from a file or URL via the terminal:

```bash
# Generate SRI hash from a local file
openssl dgst -sha384 -binary my-script.js | openssl base64 -A

# Generate SRI hash directly from a CDN URL
curl -s https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js | openssl dgst -sha384 -binary | openssl base64 -A

```

Prefix the output string with `sha384-` to form the full value:

```text
sha384-1H217fcR4B4i6x+51C68b36qH1c26...

```

---

### Option B: Automated Build Plugins (Webpack / Vite)

Manually generating SRI hashes for dynamically bundled assets in modern front-end build pipelines is error-prone. Use build tools to automate hash calculation during compilation.

#### Webpack Integration (`webpack-subresource-integrity`)

```bash
npm install -D webpack-subresource-integrity

```

```javascript
// webpack.config.js
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');

module.exports = {
  output: {
    filename: '[name].[contenthash].js',
    crossOriginLoading: 'anonymous', // Required for SRI
  },
  plugins: [
    new SubresourceIntegrityPlugin({
      hashFuncNames: ['sha384'],
      enabled: process.env.NODE_ENV === 'production',
    }),
  ],
};

```

#### Vite Integration (`vite-plugin-sri`)

```bash
npm install -D vite-plugin-sri

```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import sri from 'vite-plugin-sri';

export default defineConfig({
  plugins: [
    sri(), // Automatically injects integrity hashes into HTML output during build
  ],
});

```

---

## 4. Enforcing SRI via Content Security Policy (CSP)

To prevent developers or third-party scripts from dynamically injecting unhashed scripts into the DOM, enforce SRI requirement at the browser policy level using CSP's **`require-sri-for`** directive:

```http
Content-Security-Policy: require-sri-for script style;

```

If a script tag is created without an `integrity` attribute while this header is active, the browser refuses to load it entirely.

---

## SRI Best Practices Matrix

| Operational Aspect     | Implementation Rule                                                                                       | Security Benefit                                                        |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Hash Algorithm**     | Use **`sha384`** or **`sha512`** (`sha256` is acceptable, but 384/512 offer higher collision resistance). | Prevents hash collision vulnerabilities.                                |
| **CORS Configuration** | Always include `crossorigin="anonymous"` on tags. Ensure CDNs serve `Access-Control-Allow-Origin: *`.     | Prevents cross-origin SRI verification failures in browsers.            |
| **Version Pinning**    | Never use floating versions (e.g., `jquery@latest`) when applying SRI hashes. Always pin exact versions.  | Prevents broken builds when third parties legitimately release updates. |
| **Dynamic Injection**  | Use Webpack/Vite build plugins to calculate content hashes automatically during production bundling.      | Guarantees 100% hash coverage across assets.                            |

Show how to configure a comprehensive Content Security Policy (CSP) header including SRI and script policies.

A comprehensive **Content Security Policy (CSP)** is the primary browser-side defense against Cross-Site Scripting (XSS), data exfiltration, clickjacking, and supply-chain attacks.

By combining **Strict Script Policies** (Nonce/Hash-based execution) with **Subresource Integrity (SRI)**, you can create a zero-trust execution environment where unapproved inline scripts and tampered CDN bundles are forcibly blocked by the browser.

---

## 1. Production-Grade CSP Header Blueprint

Here is a complete, strict CSP response header designed for modern front-end architectures (Next.js, React, Remix, SPA):

```http
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'nonce-rAnd0mN0nc3V4lu3' 'strict-dynamic'; 
  style-src 'self' 'nonce-rAnd0mN0nc3V4lu3' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='; 
  img-src 'self' data: blob: https://images.yourdomain.com; 
  font-src 'self' data:; 
  connect-src 'self' https://api.yourdomain.com wss://ws.yourdomain.com; 
  frame-ancestors 'none'; 
  object-src 'none'; 
  base-uri 'self'; 
  form-action 'self'; 
  require-sri-for script style; 
  require-trusted-types-for 'script'; 
  trusted-types default appPolicy; 
  upgrade-insecure-requests; 
  block-all-mixed-content; 
  report-uri /api/v1/csp-reports;

```

---

## 2. Directives & Security Function Breakdown

| Directive                       | Configuration                         | Security Purpose                                                                                                                                                                                                                              |
| ------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`default-src`**               | `'self'`                              | Default fallback rule: Only load assets originating from the exact same host domain.                                                                                                                                                          |
| **`script-src`**                | `'self' 'nonce-...' 'strict-dynamic'` | **Strict Nonce-based Script Policy.** Disables raw inline scripts and domain allowlists. Only scripts carrying a valid cryptographically generated `nonce` can run. `'strict-dynamic'` allows trusted scripts to load child scripts securely. |
| **`style-src`**                 | `'self' 'nonce-...' 'sha256-...'`     | Restricts stylesheets to local assets, nonced tags, or explicitly hashed CSS blocks.                                                                                                                                                          |
| **`connect-src`**               | `'self' https://api... wss://...`     | Prevents data exfiltration by restricting `fetch`, `XHR`, `WebSocket`, and `EventSource` calls strictly to verified endpoints.                                                                                                                |
| **`frame-ancestors`**           | `'none'`                              | **Clickjacking Defense.** Completely blocks any malicious site from embedding your application inside an `<iframe>`.                                                                                                                          |
| **`object-src`**                | `'none'`                              | Disables legacy browser plugins (Flash, Java Applets).                                                                                                                                                                                        |
| **`require-sri-for`**           | `script style`                        | **Enforces Subresource Integrity.** Refuses to load external `<script>` or `<link>` tags unless they include a valid `integrity="sha384-..."` attribute.                                                                                      |
| **`require-trusted-types-for`** | `'script'`                            | Locks down DOM XSS sinks (`innerHTML`, `script.src`). Requires string values to pass through an approved policy before DOM assignment.                                                                                                        |
| **`upgrade-insecure-requests`** | *(Flag)*                              | Automatically converts all plain `http://` asset requests to encrypted `https://` before sending.                                                                                                                                             |

---

## 3. Implementing Dynamic Nonce-Based CSP in Next.js / Node SSR

In Server-Side Rendered (SSR) frameworks, a **unique, cryptographically secure random nonce** must be generated **per HTTP request**, attached to the CSP header, and injected into HTML script tags.

### A. Next.js Middleware (`middleware.ts`)

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Generate a unique cryptographic nonce per request (Base64 encoded string)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // 2. Build the strict CSP policy string
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    connect-src 'self' https://api.yourdomain.com;
    frame-ancestors 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    require-sri-for script style;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // 3. Clone request headers and pass nonce down to render context
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  // 4. Create response and set Content-Security-Policy header
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
}

export const config = {
  matcher: [
    // Match all request paths except static files, images, and favicon
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

```

---

### B. Consuming Nonce in Root Layout Component (`app/layout.tsx`)

```tsx
// app/layout.tsx
import { headers } from 'next/headers';
import Script from 'next/script';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Extract the generated nonce from request headers set by Middleware
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || undefined;

  return (
    <html lang="en">
      <head>
        {/* External Third-Party CDN Script with SRI & Nonce Validation */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossOrigin="anonymous"
          nonce={nonce}
        />
      </head>
      <body>
        {children}

        {/* Inline Application Script passing Nonce Check */}
        <Script
          id="analytics-init"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `console.log("App initialized securely with CSP Nonce:", "${nonce}");`,
          }}
        />
      </body>
    </html>
  );
}

```

---

## 4. Reverse Proxy / Edge Deployment (Nginx Configuration)

If you serve static Single-Page Applications (SPA) or terminate SSL at the Nginx edge, configure headers at the server block level:

```nginx
server {
    listen 443 ssl http2;
    server_name app.yourdomain.com;

    # SSL TLS configurations...

    # Production CSP Header with SRI Enforcement
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.yourdomain.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; require-sri-for script style; upgrade-insecure-requests;" always;

    location / {
        root /var/www/my-spa-app;
        try_files $uri /index.html;
    }

    # Endpoint to collect CSP violation reports asynchronously
    location /api/v1/csp-reports {
        proxy_pass http://localhost:5000/reports;
    }
}

```

---

## 5. CSP Violation Report Telemetry Handler

Setting up a CSP report handler catches breaking policy violations or active XSS attempts in production.

```typescript
// pages/api/v1/csp-reports.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const report = req.body['csp-report'] || req.body;

    console.warn('[CSP Violation Detected]:', {
      documentUri: report['document-uri'],
      blockedUri: report['blocked-uri'],
      violatedDirective: report['violated-directive'],
      originalPolicy: report['original-policy'],
      sample: report['script-sample'],
    });

    // Forward telemetry alert to Sentry, Datadog, or Slack alerting webhook
    // sendToSecurityMonitoringTool(report);

    return res.status(204).end();
  }

  return res.status(405).end();
}

```

---

## Deployment Strategy: Report-Only Transition

When migrating an existing application to a strict CSP, deploy using **`Content-Security-Policy-Report-Only`** first to catch unintended script or stylesheet breaks without blocking legitimate application features:

```http
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'nonce-xyz'; report-uri /api/v1/csp-reports;

```

Once telemetry confirms zero false positives over 7–14 days, remove `-Report-Only` to enforce full blocking behavior in production.

Show how to implement fallback mechanisms in JavaScript when a CDN resource fails SRI checks.

When a Content Delivery Network (CDN) resource fails Subresource Integrity (SRI) verification or suffers an outage, the browser immediately blocks execution and throws a network error in the console.

Because standard `<script>` and `<link>` tags don't natively provide fallback attributes, front-end system design handles CDN SRI failures using **Dynamic DOM Script Injection with Event Error Listeners** or **Build-Time Bundling Fallbacks**.

---

## 1. Complete Architecture & Execution Flow

```
[ Browser parses <script src="https://cdn..." integrity="..." onerror="..."> ]
                                    │
                                    ▼
                     Was CDN script fetched & hash verified?
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
             [ YES: 200 OK ]                     [ NO: SRI Fail / 404 ]
                  │                                   │
                  ▼                                   ▼
        Executes CDN script              `onerror` Handler Fires
                                                      │
                                                      ▼
                                         Injects Local Fallback Script
                                         <script src="/static/vendor/lib.js">
                                                      │
                                                      ▼
                                         Application Executes Normally

```

---

## 2. Inline Fallback Pattern (Vanilla JS / HTML)

This pattern listens to the `onerror` event of the CDN tag. If the CDN fails (due to an SRI mismatch, network error, or 404), it dynamically appends a locally hosted fallback script to the DOM.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SRI Fallback System Design</title>
</head>
<body>
  <div id="app">System Initializing...</div>

  <!-- Primary CDN Script with SRI Hash & Fallback Trigger -->
  <script 
    src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
    integrity="sha384-2WO33L/vB/L2Y2m3/SBy7tE0b/4kS6d4IInKjU989a3r3o2aQ4r7J130s9/4K3L"
    crossorigin="anonymous"
    onerror="loadLocalFallback('/static/vendor/lodash.min.js', 'lodashFallback')"
    onload="window.isLodashLoaded = true">
  </script>

  <!-- Fallback Execution Script -->
  <script>
    function loadLocalFallback(fallbackUrl, scriptId) {
      console.warn('[CDN Failure]: SRI hash check failed or CDN is down. Loading local fallback:', fallbackUrl);

      // Prevent duplicate fallback injections
      if (document.getElementById(scriptId)) return;

      const fallbackScript = document.createElement('script');
      fallbackScript.id = scriptId;
      fallbackScript.src = fallbackUrl;

      fallbackScript.onload = function() {
        console.log('[Fallback Successful]: Loaded script from local origin:', fallbackUrl);
        // Dispatch custom event to resume app startup if needed
        window.dispatchEvent(new CustomEvent('vendor:loaded'));
      };

      fallbackScript.onerror = function() {
        console.error('[Critical Error]: Both CDN and local fallback failed to load.');
      };

      document.head.appendChild(fallbackScript);
    }
  </script>

  <!-- Application Entry Point -->
  <script>
    // Ensure dependency exists before initializing app logic
    function initializeApp() {
      if (typeof _ !== 'undefined') {
        console.log('App running successfully using Lodash version:', _.VERSION);
      } else {
        // Retry or wait for fallback load event
        window.addEventListener('vendor:loaded', initializeApp, { once: true });
      }
    }

    initializeApp();
  </script>
</body>
</html>

```

---

## 3. Reusable Automated SRI Fallback Loader Utility

For multi-vendor or Single-Page Applications (SPA), use a centralized JavaScript utility function that handles dynamic script loading, SRI verification, timeout safeguards, and fallback resolution programmatically.

```typescript
// src/utils/sriLoader.ts

interface ResourceConfig {
  cdnUrl: string;
  fallbackUrl: string;
  integrity: string;
  globalCheck?: string; // e.g., 'jQuery' or '_' on window object
  timeoutMs?: number;
}

export function loadScriptWithSriFallback(config: ResourceConfig): Promise<void> {
  const { cdnUrl, fallbackUrl, integrity, globalCheck, timeoutMs = 5000 } = config;

  return new Promise((resolve, reject) => {
    // 1. Check if resource is already present on global window scope
    if (globalCheck && (window as unknown as Record<string, unknown>)[globalCheck]) {
      return resolve();
    }

    const cdnScript = document.createElement('script');
    cdnScript.src = cdnUrl;
    cdnScript.integrity = integrity;
    cdnScript.crossOrigin = 'anonymous';

    let isResolved = false;

    // Timeout safety net in case network hangs without triggering onerror
    const timeoutTimer = setTimeout(() => {
      if (!isResolved) {
        console.warn(`[SRI Timeout]: CDN load timed out after ${timeoutMs}ms. Initiating fallback.`);
        cleanupAndLoadFallback();
      }
    }, timeoutMs);

    const cleanupAndLoadFallback = () => {
      isResolved = true;
      clearTimeout(timeoutTimer);
      cdnScript.remove(); // Remove failed script tag from DOM

      // Inject Local Fallback
      const fallbackScript = document.createElement('script');
      fallbackScript.src = fallbackUrl;

      fallbackScript.onload = () => resolve();
      fallbackScript.onerror = () =>
        reject(new Error(`[Critical Failure]: Failed to load fallback script from ${fallbackUrl}`));

      document.head.appendChild(fallbackScript);
    };

    cdnScript.onload = () => {
      if (isResolved) return;
      clearTimeout(timeoutTimer);

      // Verify global variable exists if check string was provided
      if (globalCheck && !(window as unknown as Record<string, unknown>)[globalCheck]) {
        console.warn(`[SRI Validation Warning]: CDN loaded but window.${globalCheck} is undefined.`);
        cleanupAndLoadFallback();
      } else {
        isResolved = true;
        resolve();
      }
    };

    cdnScript.onerror = () => {
      if (isResolved) return;
      cleanupAndLoadFallback();
    };

    document.head.appendChild(cdnScript);
  });
}

```

### Usage Example

```typescript
// src/index.ts
import { loadScriptWithSriFallback } from './utils/sriLoader';

async function bootstrapApp() {
  try {
    // Load Bootstrap JS with SRI hash and local fallback
    await loadScriptWithSriFallback({
      cdnUrl: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
      fallbackUrl: '/static/vendor/bootstrap.bundle.min.js',
      integrity: 'sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz',
      globalCheck: 'bootstrap',
    });

    console.log('App bootstrapped securely with verified dependencies.');
  } catch (error) {
    console.error('Application failed to initialize:', error);
  }
}

bootstrapApp();

```

---

## 4. Fallback Handling for Stylesheets (`<link>`)

CSS stylesheets do not expose a JavaScript global variable, but you can detect SRI failure by checking if a CSS rule/class defined by that stylesheet was successfully applied to the DOM.

```html
<!-- Primary CDN Stylesheet -->
<link 
  id="bootstrap-css"
  rel="stylesheet" 
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
  integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" 
  crossorigin="anonymous"
  onerror="loadCssFallback('/static/vendor/bootstrap.min.css')"
/>

<script>
  function loadCssFallback(fallbackCssUrl) {
    console.warn('[CSS SRI Fail]: Loading local CSS fallback:', fallbackCssUrl);
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fallbackCssUrl;
    document.head.appendChild(link);
  }

  // Double-Check CSS application via DOM Element computed style
  window.addEventListener('DOMContentLoaded', function() {
    const testEl = document.createElement('div');
    testEl.className = 'navigation-test-element d-none'; // Bootstrap class
    document.body.appendChild(testEl);

    const isLoaded = window.getComputedStyle(testEl).display === 'none';
    document.body.removeChild(testEl);

    if (!isLoaded) {
      loadCssFallback('/static/vendor/bootstrap.min.css');
    }
  });
</script>

```

---

## Best Practices Matrix for Fallback Design

| Operational Layer      | Design Strategy                                                                                  | System Benefit                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **Storage Origin**     | Host fallback assets on your primary domain or multi-region origin server (`S3` / `Nginx`).      | Guarantees fallback assets are available even during third-party CDN outages.              |
| **Cache Control**      | Set strong `Cache-Control: public, max-age=31536000, immutable` headers on local fallback files. | Minimizes latency penalty when users fall back to local assets.                            |
| **Timeout Protection** | Include a 3–5 second JavaScript timeout wrapper around CDN script loading.                       | Prevents application hangs if a CDN freezes without returning a fast 404 or network error. |
| **Telemetry Alerts**   | Trigger a log event to Sentry or Datadog when `onerror` fires.                                   | Alerts your DevOps team when CDNs are compromised, mismatched, or down in production.      |
