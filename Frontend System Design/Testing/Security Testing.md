In Front-End System Design, **Security Testing** is the systematic process of validating that client-side applications—running in untrusted user environments—are resilient against exploitation, unauthorized access, state tampering, and data leakage.

Because JavaScript, DOM trees, local storage, and client-side state are fully exposed inside the user's browser, front-end security operates on a core architectural rule: **Never trust the client**. Security testing verifies that defense-in-depth controls are enforced at both the application layer and the browser security policy layer.

---

## The Front-End Security Testing Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FRONT-END SECURITY TESTING DOMAINS                       │
│                                                                             │
│  1. SCRIPT INJECTION & SANITIZATION (XSS & DOM-XSS)                         │
│     • Reflected, Stored, & DOM-based XSS, Dangerous HTML Sinks             │
│                                                                             │
│  2. HEADERS & BROWSER SECURITY POLICIES                                     │
│     • Content Security Policy (CSP), CORS, Frameguard (Clickjacking)        │
│                                                                             │
│  3. STATE & TOKEN SECURITY (SESSION SAFETY)                                 │
│     • SameSite Cookie Flags, Token Storage Leakage (JWTs in LocalStorage)  │
│                                                                             │
│  4. SUPPLY CHAIN & DEPENDENCY AUDITING                                      │
│     • Software Bill of Materials (SBOM), Vulnerable Packages (Snyk / npm)   │
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 1. Cross-Site Scripting (XSS) & DOM Injection Testing

XSS occurs when malicious JavaScript is injected and executed inside a user's browser session, allowing attackers to steal session tokens, manipulate DOM content, or log keystrokes.

### A. Testing for Dangerous Sinks & Unsafe Rendering

Ensure that dynamic user content is sanitized before hitting dangerous browser sinks:

* **Dangerous DOM Sinks:** `innerHTML`, `outerHTML`, `document.write()`, `eval()`, `dangerouslySetInnerHTML` (React).

#### Bad Pattern (Vulnerable to XSS)

```tsx
// VULNERABLE: Direct HTML injection without sanitization
export const UserBio = ({ bioHtml }: { bioHtml: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: bioHtml }} />;
};

```

#### Secure Pattern & Unit Test Verification

Sanitize dynamic input using libraries like **DOMPurify** before rendering.

```tsx
// src/components/UserBio.tsx
import DOMPurify from 'dompurify';

export const UserBio = ({ bioHtml }: { bioHtml: string }) => {
  const sanitizedHtml = DOMPurify.sanitize(bioHtml);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

```

```typescript
// src/components/__tests__/UserBio.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserBio } from '../UserBio';

describe('UserBio Security Sanity Tests', () => {
  it('strips malicious <script> tags and onerror event handlers', () => {
    const maliciousPayload = `<img src="invalid.jpg" onerror="alert('XSS_EXPLOIT')" /><span>Hello</span>`;

    render(<UserBio bioHtml={maliciousPayload} />);

    const img = screen.getByRole('img', { hidden: true });
    
    // Verify that the dangerous event handler attribute was stripped by DOMPurify
    expect(img).not.toHaveAttribute('onerror');
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

```

---

## 2. Testing Browser Security Policies & Headers

Browser security policies instruct the browser engine how to restrict resource loading, framing, and cross-origin interactions.

### A. Content Security Policy (CSP) Automated Auditing

A strong **Content Security Policy (CSP)** restricts where scripts, styles, images, and worker threads can be fetched or executed from, preventing unauthorized script execution even if an XSS vulnerability exists.

#### Target Production CSP Header Example

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests;

```

#### Testing CSP in Playwright

```typescript
// tests/security-headers.spec.ts
import { test, expect } from '@playwright/test';

test('verify application enforces strict security headers', async ({ page }) => {
  const response = await page.goto('/');
  const headers = response?.headers();

  // 1. Assert Strict Content-Security-Policy is set
  expect(headers?.['content-security-policy']).toBeDefined();
  expect(headers?.['content-security-policy']).toContain("object-src 'none'");

  // 2. Prevent Clickjacking Attacks (X-Frame-Options)
  expect(headers?.['x-frame-options'] || headers?.['content-security-policy']).toMatch(/DENY|SAMEORIGIN|frame-ancestors 'none'/);

  // 3. Prevent MIME-type Sniffing
  expect(headers?.['x-content-type-options']).toBe('nosniff');
});

```

---

## 3. Session State & Token Security Testing

A common front-end vulnerability is storing sensitive authentication tokens (e.g., JWTs) in `localStorage` or `sessionStorage`. Any XSS exploit on the domain can read `localStorage` instantly via JavaScript (`localStorage.getItem('jwt')`).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TOKEN STORAGE SECURITY PROTOCOL                       │
│                                                                             │
│  ❌ BAD: LocalStorage / SessionStorage                                      │
│     Accessible via JavaScript ──► `localStorage.getItem()` ──► XSS Leak     │
│                                                                             │
│  ✅ SECURE: HttpOnly, Secure, SameSite Cookies                              │
│     Inaccessible to JS ──► Browser handles cookie automatically ──► Safe   │
└─────────────────────────────────────────────────────────────────────────────┘

```

### Testing Token Exposure via Automated Tests

Ensure sensitive session variables do not leak into `window` state or local storage mechanisms.

```typescript
// tests/session-security.spec.ts
import { test, expect } from '@playwright/test';

test('verify sensitive auth tokens are not exposed in localStorage', async ({ page }) => {
  await page.goto('/dashboard');

  // Evaluate local and session storage values
  const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
  const sessionStorageKeys = await page.evaluate(() => Object.keys(sessionStorage));

  // Assert JWT or session secrets are not stored in insecure Web Storage
  expect(localStorageKeys).not.toContain('jwt');
  expect(localStorageKeys).not.toContain('access_token');
  expect(sessionStorageKeys).not.toContain('bearer_token');
});

```

---

## 4. Supply Chain Security & Dependency Auditing

Modern React applications rely on hundreds of third-party NPM packages (`node_modules`). Malicious updates or compromised transitive dependencies represent a primary supply-chain vector.

### Automated CI/CD Dependency Scanning

Integrate dependency vulnerability scanners into GitHub Actions or GitLab CI pipelines:

```yaml
# .github/workflows/security-audit.yml
name: Security Supply Chain Audit

on:
  push:
    branches: [ main ]
  pull_request:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      # 1. Audit NPM dependencies for known CVEs
      - name: Execute NPM Audit
        run: npm audit --audit-level=high

      # 2. Advanced Static Application Security Testing (SAST)
      - name: Run Snyk Security Audit
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

```

---

## Front-End Security Testing Checklist

| Vulnerability Threat           | Architectural Prevention Strategy                                              | Automated Testing Method                                           |
| ------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **Cross-Site Scripting (XSS)** | Context-aware HTML sanitization (`DOMPurify`), avoiding raw DOM sinks.         | Vitest / RTL tests asserting sanitized inputs; CSP enforcement.    |
| **Clickjacking**               | Prevent framing using `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'`. | Playwright HTTP Header response assertions.                        |
| **Credential & Token Theft**   | Store session tokens in `HttpOnly`, `Secure`, `SameSite=Lax/Strict` cookies.   | E2E Browser storage assertion tests (`localStorage` key checks).   |
| **Supply Chain Poisoning**     | Lockfile enforcement (`pnpm-lock.yaml`), dependency scanning.                  | CI/CD pipeline integration (`npm audit`, Snyk, Socket.dev).        |
| **Data Leakage in Errors**     | Strip stack traces and detailed error logs in production builds.               | Production build log audits (`drop: ['console']` in Vite/ESbuild). |
