**`Content-Security-Policy-Report-Only` (CSPRO)** is a diagnostic HTTP response header that allows security engineers to evaluate and test Content Security Policies without risking site breakage.

Instead of blocking requests that violate policy rules, the browser **allows all executions to proceed unimpeded** while logging and sending structured JSON violation payloads to a designated **Reporting Endpoint**.

---

# Architecture of Report-Only CSP & Reporting API

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │ 1. ENFORCED CSP (Content-Security-Policy)                              │
 │ Violations ──► BLOCKED immediately ──► Logged & Reported               │
 └────────────────────────────────────────────────────────────────────────┘

 ┌────────────────────────────────────────────────────────────────────────┐
 │ 2. REPORT-ONLY CSP (Content-Security-Policy-Report-Only)              │
 │ Violations ──► ALLOWED to execute ──► Logged & Reported to Endpoint    │
 └────────────────────────────────────────────────────────────────────────┘

 ┌────────────────────────────────────────────────────────────────────────┐
 │ 3. REPORTING API (Reporting-Endpoints Header)                          │
 │ Browser batches JSON violation logs ──► POST /api/csp-reports          │
 └────────────────────────────────────────────────────────────────────────┘

```

---

## 1. `Content-Security-Policy-Report-Only` vs. Enforced `Content-Security-Policy`

You can deploy both headers simultaneously. This allows you to maintain an active, enforcing baseline policy while dry-testing stricter additions in report-only mode.

```http
# 1. Enforced baseline policy (Blocks unsafe objects/frames)
Content-Security-Policy: default-src 'self'; object-src 'none';

# 2. Experimental strict policy (Monitors script execution without breaking the site)
Content-Security-Policy-Report-Only: script-src 'nonce-abc123' 'strict-dynamic'; report-to csp-endpoint;

```

---

## 2. Legacy Reporting (`report-uri`) vs. Modern Reporting API (`Report-To` & `Reporting-Endpoints`)

The mechanism for routing CSP violation logs to external servers has evolved across browser specifications.

### A. Modern Reporting API (`Reporting-Endpoints` + `report-to`)

The modern W3C Reporting API decouples policy definitions from reporting destinations and introduces asynchronous, out-of-band batch reporting.

#### Step 1: Define endpoints using the `Reporting-Endpoints` header

```http
Reporting-Endpoints: csp-endpoint="https://analytics.example.com/reports/csp",
                    csp-backup="https://backup.example.com/reports"

```

#### Step 2: Reference the endpoint in your CSP header

```http
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self'; report-to csp-endpoint;

```

### B. Legacy Reporting Directive (`report-uri`)

The older `report-uri` directive specified the endpoint URL directly inside the CSP directive string. While deprecated in favor of `report-to`, it is still widely included as a fallback for older browser engines:

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-uri https://analytics.example.com/reports/csp;

```

> **Best Practice:** Include both `report-to` and `report-uri` in your CSP string for maximum browser compatibility. Modern browsers prioritize `report-to` when `Reporting-Endpoints` is present and ignore `report-uri`.

---

## 3. Structure of a CSP Violation Report

When a violation occurs in Report-Only mode, the browser queues an asynchronous `POST` request to the specified endpoint with `Content-Type: application/reports+json` (or `application/csp-report` for legacy endpoints).

### Modern Reporting API JSON Payload Example

```json
[
  {
    "age": 42,
    "type": "csp-violation",
    "url": "https://app.example.com/dashboard",
    "user_agent": "Mozilla/5.0 ...",
    "body": {
      "blockedURL": "https://untrusted-cdn.com/malicious.js",
      "classification": "inline",
      "columnNumber": 12,
      "documentURL": "https://app.example.com/dashboard",
      "effectiveDirective": "script-src-elem",
      "lineNumber": 84,
      "originalPolicy": "default-src 'self'; script-src 'self'; report-to csp-endpoint;",
      "referrer": "https://app.example.com/login",
      "sample": "console.log('injected')",
      "sourceFile": "https://app.example.com/dashboard",
      "statusCode": 200
    }
  }
]

```

### Key Payload Fields

* **`blockedURL`:** The URI of the resource that violated the policy.
* **`effectiveDirective`:** The specific directive that triggered the violation (e.g., `script-src-elem`, `style-src`, `connect-src`).
* **`sample`:** The first 40 characters of the offending inline script or handler (requires `report-sample` in policy).
* **`originalPolicy`:** The complete policy string as evaluated by the browser engine.

---

## 4. The 4-Phase Safe Deployment Workflow

Using `Content-Security-Policy-Report-Only` enables a safe, zero-downtime path to implementing strict CSP across large applications:

```text
 PHASE 1: Audit & Draft
 └── Analyze application dependencies, Inline scripts, and API connections.
                                     │
                                     ▼
 PHASE 2: Deploy Report-Only Header
 └── Content-Security-Policy-Report-Only: ...; report-to main-endpoint;
                                     │
                                     ▼
 PHASE 3: Monitor & Refine
 └── Ingest violation logs via Datadog, Sentry, or custom endpoint.
 └── Fix legitimate application bugs or add missing nonces/hashes.
                                     │
                                     ▼
 PHASE 4: Promote to Enforced CSP
 └── Change header to Content-Security-Policy (Enforce mode).

```

---

## Summary Matrix

| Feature                    | Enforced CSP                  | Report-Only CSP                                        |
| -------------------------- | ----------------------------- | ------------------------------------------------------ |
| **HTTP Header**            | `Content-Security-Policy`     | `Content-Security-Policy-Report-Only`                  |
| **Violation Execution**    | **Blocked** instantly         | **Allowed** to execute normally                        |
| **Browser Console Output** | Red Error (Blocked resource)  | Yellow Warning (Report-Only violation)                 |
| **Reporting Behavior**     | Sends JSON report to endpoint | Sends JSON report to endpoint                          |
| **Primary Use Case**       | Active protection against XSS | Testing, dry-runs, and discovering third-party scripts |
