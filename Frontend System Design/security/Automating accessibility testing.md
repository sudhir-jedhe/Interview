Automating accessibility testing in your CI/CD pipeline ensures your front-end application continually adheres to **WCAG 2.1 AA** and **ADA Section 508** standards before code hits production.

Combining **Playwright** (for browser automation and navigation) with **`@axe-core/playwright`** (Deque’s battle-tested accessibility engine) allows you to scan dynamically rendered DOM states, modal dialogs, and interactive component flows.

---

## 1. Installation & Dependency Setup

Install Playwright and the `@axe-core/playwright` bridge package in your front-end project:

```bash
npm install -D @playwright/test @axe-core/playwright

```

---

## 2. Writing Accessibility Tests in Playwright

Create an accessibility test file (e.g., `tests/accessibility.spec.ts`). You can scan an entire page or isolate specific DOM components (like navigation menus or modals).

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Accessibility Scans (WCAG 2.1 AA)', () => {
  
  test('Landing page should have no detectable accessibility violations', async ({ page }) => {
    // 1. Navigate to target page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 2. Initialize AxeBuilder & specify compliance standards
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa']) // Standard WCAG Tags
      .analyze();

    // 3. Assert zero violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('User Profile Modal should be accessible when opened', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Interact with the page to trigger dynamic UI states
    await page.click('button#open-profile-modal');
    await page.waitForSelector('[role="dialog"]');

    // Scan ONLY the isolated modal container
    const modalScanResults = await new AxeBuilder({ page })
      .include('[role="dialog"]') // Target specific CSS selector
      .withTags(['wcag2aa', 'wcag21aa'])
      .analyze();

    expect(modalScanResults.violations).toEqual([]);
  });

  test('Form controls should pass screen-reader and contrast rules', async ({ page }) => {
    await page.goto('/register');

    const formScanResults = await new AxeBuilder({ page })
      .include('form#registration-form')
      // Disable rules conditionally if working through legacy technical debt
      // .disableRules(['color-contrast']) 
      .analyze();

    // Custom assertion formatting for cleaner terminal logs on failure
    if (formScanResults.violations.length > 0) {
      console.log(
        'Accessibility Violations Found:\n',
        JSON.stringify(formScanResults.violations, null, 2)
      );
    }

    expect(formScanResults.violations).toEqual([]);
  });
});

```

---

## 3. Formatting Failures & Generating HTML Reports

To make debugging actionable for developers, format violation output or attach an HTML accessibility audit report to Playwright's test results.

### Utility for Clean Terminal Violation Output

```typescript
// tests/utils/axeHelper.ts
import { Result } from 'axe-core';

export function formatAxeViolations(violations: Result[]): string {
  if (violations.length === 0) return 'No violations found.';

  return violations
    .map((v, i) => {
      const nodes = v.nodes.map((n) => `  - Target: ${n.target.join(', ')}\n    HTML: ${n.html}`).join('\n');
      return `\n[Violation ${i + 1}] ID: ${v.id} (${v.impact?.toUpperCase()})\nHelp: ${v.help}\nURL: ${v.helpUrl}\nAffected DOM Elements:\n${nodes}`;
    })
    .join('\n---------------------------------------------------');
}

```

---

## 4. GitHub Actions CI/CD Integration Workflow

Configure GitHub Actions to execute your Playwright accessibility test suite on every pull request to `main`.

Create `.github/workflows/accessibility-ci.yml`:

```yaml
name: Accessibility CI Checks

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  a11y-test:
    name: Run Axe-Core & Playwright Scans
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium

      - name: Build Application
        run: npm run build

      - name: Start App & Run Accessibility Tests
        run: npx playwright test tests/accessibility.spec.ts
        env:
          CI: true

      - name: Upload Playwright Test Artifacts (On Failure)
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: a11y-test-results
          path: playwright-report/
          retention-days: 7

```

---

## 5. Playwright Configuration (`playwright.config.ts`)

Ensure your Playwright configuration boots your local development/production preview server automatically before running the tests:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Automatically spin up your build server before testing
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

```

---

## Summary Matrix

| Tool                                  | Role in Architecture                                                                                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Axe-Core (`@axe-core/playwright`)** | Injects the accessibility evaluation rules engine (`wcag21aa`) directly into the DOM context.                                                        |
| **Playwright Engine**                 | Automates browser actions (clicking modals, opening tabs, filling forms) to scan interactive UI states.                                              |
| **GitHub Actions Pipeline**           | Blocks pull requests if automated scans detect critical WCAG violations (e.g., missing ARIA labels, low color contrast, form inputs without labels). |
