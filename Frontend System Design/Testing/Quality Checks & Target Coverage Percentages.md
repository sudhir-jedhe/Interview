Here is the complete English translation of the explanation on Quality Checks and Coverage Percentages across Unit, Component, and End-to-End Testing:

---

# Quality Checks & Target Coverage Percentages in Unit, Component, and E2E Testing

In software testing, quality checks and test coverage percentages are measured using different Key Performance Indicators (KPIs) and metrics depending on the testing layer.

Because each layer in the testing hierarchy carries a distinct scope and responsibility, their **achievable coverage targets (%)** differ accordingly.

---

## 1. Unit Testing

Unit testing focuses on isolated, fine-grained building blocks of an application, such as individual functions, helper utilities, reducers, and pure business logic.

### Primary Quality Metrics

* **Code Coverage:**
* **Line / Statement Coverage:** Percentage of executable code lines executed during test runs.
* **Branch / Decision Coverage:** Percentage of executed conditional branches (`if-else`, `switch` cases, ternary operators).
* **Function / Method Coverage:** Percentage of declared functions invoked by tests.

* **Mutation Testing Score:** Evaluates the strength of the test suite by introducing small code modifications (mutants) and verifying if test assertions catch them.

### Target Coverage Percentage

* **Achievable Target:** **80% – 90%**
* **Practical Reality:** Striving for 100% unit coverage across an entire codebase often yields diminishing returns relative to the time and effort required. However, achieving **90%+ coverage** specifically on pure logic, financial calculations, and shared utility modules is standard industry practice.

---

## 2. Component Testing

Component testing (e.g., using React Testing Library or Cypress Component Testing) validates individual UI components—such as forms, modals, and navigation bars—focusing on state transitions, props, and user DOM interactions.

### Primary Quality Metrics

* **User Interaction Coverage:** Ensures key user events (clicks, text input, keypresses, hovers) are tested.
* **State & Props Variation Coverage:** Validates all component states (e.g., Loading, Error, Success, Disabled) and prop combinations.
* **Accessibility (a11y) Compliance:** Verifies keyboard navigation, ARIA attributes, and screen-reader support (e.g., via `jest-axe`).
* **Conditional Rendering Coverage:** Ensures UI elements render or unmount correctly based on conditional logic.

### Target Coverage Percentage

* **Achievable Target:** **70% – 80%**
* **Practical Reality:** Deep UI styling details, canvas renders, or complex third-party embedded widgets are difficult to mock realistically at the component level. A target around **75%** represents a highly robust component test suite.

---

## 3. End-to-End (E2E) Testing

E2E testing (e.g., using Cypress, Playwright, or Selenium) validates complete user journeys and critical business workflows in a real browser environment from start to finish.

### Primary Quality Metrics

* **Critical User Journey Coverage:** Measures coverage of high-priority business flows (e.g., User Login $\rightarrow$ Add Item to Cart $\rightarrow$ Payment Checkout).
* **Test Pass & Flakiness Rate:** Tracks the reliability of the test suite (reducing false positives/negatives caused by timing or network issues).
* **Cross-Browser / Cross-Device Coverage:** Ensures critical workflows pass across major browser engines (Chromium, WebKit, Firefox) and screen viewports.
* **Requirement Traceability Matrix (RTM):** Maps automated E2E test scenarios directly against product functional requirements.

### Target Coverage Percentage

* **Achievable Target:** **20% – 30%** *(with 100% coverage of Critical User Paths)*
* **Practical Reality:** E2E tests are slow, resource-heavy, and expensive to maintain. Applying E2E testing to 100% of an application's codebase is impractical. Following the **Testing Pyramid**, E2E testing should strictly cover **100% of core business-critical workflows**, which typically represents 20–30% of total application code.

---

## Summary Matrix

| Testing Level         | Core Focus Area                              | Key Quality Metrics                           | Achievable Target (%)                    |
| --------------------- | -------------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| **Unit Testing**      | Pure Logic, Utilities, Helpers, Reducers     | Statement, Branch, & Function Coverage        | **80% – 90%**                            |
| **Component Testing** | UI States, Props, User Events, DOM Rendering | State Variations, Accessibility, User Actions | **70% – 80%**                            |
| **End-to-End (E2E)**  | Full User Journeys, API/DB Integration       | Critical Path Coverage, Pass Rate, Flakiness  | **20% – 30%** *(100% of Critical Paths)* |

---

## Establishing Quality Gates in CI/CD

Achieving a specific percentage alone does not guarantee software quality. Industry-standard CI/CD pipelines enforce automated **Quality Gates**:

1. **Zero Flaky Tests:** E2E test suites must maintain near-zero non-deterministic failures before code merges.
2. **Critical Bug Threshold:** Zero open P0/P1 (blocker/critical) bugs allowed in release branches.
3. **Coverage Regressions Check:** Automated checks (e.g., SonarQube or Jest thresholds) fail the build if a Pull Request drops total coverage below pre-established baseline thresholds.

Show me how to configure Jest and React Testing Library code coverage thresholds in package.json and jest.config.js.

Configuring coverage thresholds in Jest ensures that your CI/CD pipeline or local test runner fails whenever code coverage falls below your defined targets.

---

## Option 1: Configuring in `jest.config.js` (Recommended)

Using a dedicated `jest.config.js` file is the standard approach for medium-to-large applications because it keeps your configuration organized and allows inline comments.

```javascript
// jest.config.js
module.exports = {
  // Specify test environment for React components
  testEnvironment: 'jsdom',

  // Enable code coverage collection
  collectCoverage: true,

  // Specify which files to include/exclude for coverage calculation
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.{js,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}', // Exclude Storybook files
    '!src/vendor/**'
  ],

  // Formats for outputting coverage reports
  coverageReporters: ['json', 'lcov', 'text', 'clover'],

  // Define Coverage Thresholds
  coverageThreshold: {
    // Global threshold enforced across the entire project
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },

    // Specific threshold overrides for high-risk pure logic directories
    './src/utils/': {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },

    // Negative threshold: allows at most 10 uncovered statements total
    './src/components/': {
      statements: -10,
    },
  },
};

```

---

## Option 2: Configuring in `package.json`

If you are working on a smaller project or using a tool like Create React App (CRA) without ejecting, you can place the exact same configuration inside the `"jest"` key in `package.json`.

```json
{
  "name": "my-react-app",
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "jsdom",
    "collectCoverage": true,
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/index.{js,tsx}"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 85,
        "lines": 85,
        "statements": 85
      },
      "./src/utils/": {
        "branches": 90,
        "functions": 95,
        "lines": 95,
        "statements": 95
      }
    }
  }
}

```

---

## How Threshold Matching Works

1. **`global` Key:** Applies across the entire repository. If the aggregate coverage drops below these percentages, Jest exits with code `1` and fails the process.
2. **Path-Specific Keys:** Overrides global rules for matched file paths or glob patterns (e.g., enforcing stricter $95\%$ thresholds on pure utility functions in `./src/utils/`).
3. **Positive Numbers (`85`):** Sets a strict minimum percentage required.
4. **Negative Numbers (`-10`):** Sets an absolute maximum count of allowed uncovered items (e.g., `-10` means no more than 10 uncovered statements are allowed across those files).

---

## Running Coverage with React Testing Library

When executing tests via CLI, append the `--coverage` flag (or run `"npm run test:coverage"`):

```bash
npx jest --coverage

```

### Sample CLI Terminal Output on Threshold Failure

```text
Jest: "global" coverage threshold for branches (80%) not met: 74.2%
Jest: "global" coverage threshold for lines (85%) not met: 81.5%

----------|---------|----------|---------|---------|-------------------
| File       | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
| ---------- | --------- | ---------- | --------- | --------- | ------------------- |
| All files  | 81.5      | 74.2       | 86.1      | 81.5      |
| ---------- | --------- | ---------- | --------- | --------- | ------------------- |

```

Show me how to ignore specific lines or blocks from Jest coverage using istanbul ignore comments.

Jest uses **Istanbul** under the hood for code coverage tracking. You can instruct Istanbul to ignore specific lines, individual statements, or entire blocks of code by adding special comment flags directly above the code you want to skip.

---

## 1. Skipping a Single Statement or Line

Use `/* istanbul ignore next */` directly above a statement, function declaration, or conditional branch. It tells Istanbul to skip the **very next node** in the Abstract Syntax Tree (AST).

### Example: Unreachable Fallbacks & Defensive Guard Clauses

```typescript
function processUserData(user?: { name: string }) {
  // Ignore defensive checks that TypeScript guarantees or are hard to trigger in unit tests
  /* istanbul ignore next */
  if (!user) return null;

  return user.name.toUpperCase();
}

```

### Example: Default Parameter Fallbacks

```typescript
// Skip coverage tracking for default API parameters or environment variable fallbacks
export const fetchConfig = (
  apiUrl = /* istanbul ignore next */ process.env.REACT_APP_API_URL || 'https://api.default.com'
) => {
  return { apiUrl };
};

```

---

## 2. Skipping Conditional Branches Only (`if-else` / Ternaries)

If you have executed one branch of an `if` statement or ternary operator but cannot easily trigger the other (e.g., handling rare vendor SDK errors or Node vs. Browser environment checks), use `/* istanbul ignore if */` or `/* istanbul ignore else */`.

### Example: Skipping an Unreachable Branch

```typescript
function getStorageItem(key: string) {
  // If your test environment always has window.localStorage defined,
  // ignore the branch where it's missing:
  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(key);
}

```

---

## 3. Skipping Entire Files or Multi-Line Blocks

To ignore an entire section of code across multiple lines, wrap the block using `/* istanbul ignore start */` and `/* istanbul ignore end */`.

### Example: Legacy Utilities or Development-Only Helpers

```typescript
// Normal code (tracked for coverage)
export function add(a: number, b: number) {
  return a + b;
}

/* istanbul ignore start */
// Everything inside this block is ignored by Jest coverage
export function devOnlyLogger(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Dev Debug Log]:', ...args);
  }
}

export function deprecatedHelper() {
  throw new Error('This function is deprecated.');
}
/* istanbul ignore end */

// Normal code (tracked for coverage)
export function multiply(a: number, b: number) {
  return a * b;
}

```

---

## 4. Skipping Entire Files

If an entire file should be omitted from coverage reports (like entry points, third-party wrappers, or type definitions), adding `/* istanbul ignore file */` at the very top of the file skips it completely.

```typescript
/* istanbul ignore file */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Root mounting code is typically excluded from Jest unit test coverage
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

```

> **Note:** For ignoring entire file patterns globally, it is cleaner to use `collectCoverageFrom` in `jest.config.js` rather than adding comments to every file (e.g., `!src/**/*.stories.tsx`).

---

## Cheat Sheet Summary

| Comment Flag                                                  | Scope / Purpose                                            |
| ------------------------------------------------------------- | ---------------------------------------------------------- |
| `/* istanbul ignore next */`                                  | Ignores the **next single statement, function, or block**. |
| `/* istanbul ignore if */`                                    | Ignores the `if` branch of a conditional check.            |
| `/* istanbul ignore else */`                                  | Ignores the `else` branch of a conditional check.          |
| `/* istanbul ignore start */` ... `/* istanbul ignore end */` | Ignores **all lines between** the start and end tags.      |
| `/* istanbul ignore file */`                                  | Placed at the top of a file to **skip the entire file**.   |

Playwright provides built-in API support to measure **JavaScript and CSS code coverage** for Chromium-based browsers via the Chrome DevTools Protocol (CDP).

For WebKit (Safari) and Firefox, or for generating production-grade coverage reports (HTML/Istanbul format) across all browsers, Playwright integrates directly with **Babel / SWC code instrumentation** tools like `monocart-coverage-reports` or `vite-plugin-istanbul`.

---

## Method 1: Built-in Playwright API (Chromium Only)

Playwright exposes `page.coverage.startJSCoverage()` and `page.coverage.startCSSCoverage()` natively for Chromium browsers.

### Example Usage

```typescript
import { test, expect } from '@playwright/test';

test('Collect JS & CSS Coverage on Page Load', async ({ page }) => {
  // 1. Start collecting coverage
  await Promise.all([
    page.coverage.startJSCoverage({ resetOnNavigation: false }),
    page.coverage.startCSSCoverage({ resetOnNavigation: false }),
  ]);

  // 2. Perform user actions
  await page.goto('https://example.com');
  await page.click('button#submit');

  // 3. Stop collecting coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);

  // 4. Calculate total bytes executed vs downloaded
  let totalBytes = 0;
  let usedBytes = 0;

  for (const entry of jsCoverage) {
    totalBytes += entry.text.length;
    for (const range of entry.ranges) {
      usedBytes += range.end - range.start;
    }
  }

  const unusedPercentage = ((1 - usedBytes / totalBytes) * 100).toFixed(2);
  console.log(`Unused JS Code: ${unusedPercentage}%`);
});

```

---

## Method 2: Multi-Browser NYC / Istanbul Reports (Recommended)

To get full **line, branch, and function coverage** reported in standard Istanbul HTML formats across Chrome, Firefox, and Safari, follow this 2-step setup:

### Step 1: Instrument Your Frontend App

Use an instrumentation plugin in your frontend bundler (Vite, Webpack, or Babel) so your client-side JavaScript outputs global coverage statistics to `window.__coverage__`.

#### If using Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/'],
      extension: ['.js', '.ts', '.tsx'],
      requireEnv: false,
    }),
  ],
});

```

### Step 2: Collect `window.__coverage__` in Playwright Fixture

Collect the coverage object after every test and save it to disk for report generation.

```typescript
import { test as baseTest } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Extend base test to auto-collect coverage
export const test = baseTest.extend({
  page: async ({ page }, use, testInfo) => {
    await use(page);

    // Retrieve coverage object injected into the DOM by Istanbul
    const coverage = await page.evaluate(() => (window as any).__coverage__);

    if (coverage) {
      const outputDir = path.join(__dirname, '../.nyc_output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(outputDir, `playwright_coverage_${testInfo.testId}.json`),
        JSON.stringify(coverage)
      );
    }
  },
});

export { expect } from '@playwright/test';

```

### Step 3: Generate the HTML Report

Add `nyc` to your `package.json` scripts to compile the saved `.json` files into an interactive HTML coverage report:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "coverage:report": "nyc report --reporter=html --reporter=text"
  }
}

```

---

## Method 3: Using `monocart-coverage-reports` (Zero-Babel Approach)

If you do not want to instrument your application code using Babel/Istanbul, you can use the popular `monocart-coverage-reports` library. It automatically converts V8 raw coverage data from Playwright directly into Istanbul format.

### Step 1: Install

```bash
npm install -D monocart-coverage-reports

```

### Step 2: Configure in `playwright.config.ts` Global Teardown / Fixture

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';
import MCR from 'monocart-coverage-reports';

const mcr = MCR({
  name: 'Playwright Coverage Report',
  outputDir: './coverage-reports',
  reports: ['v8', 'console-summary', 'html'],
});

export const test = base.extend({
  autoCoverage: [async ({ page }, use) => {
    // Start coverage before test
    await Promise.all([
      page.coverage.startJSCoverage({ resetOnNavigation: false }),
      page.coverage.startCSSCoverage({ resetOnNavigation: false })
    ]);

    await use();

    // Stop coverage after test
    const [jsCoverage, cssCoverage] = await Promise.all([
      page.coverage.stopJSCoverage(),
      page.coverage.stopCSSCoverage()
    ]);

    await mcr.add([...jsCoverage, ...cssCoverage]);
  }, { auto: true }]
});

```

---

## Summary Comparison

| Approach                   | Setup Effort | Multi-Browser Support             | Accuracy / Source Maps           | Best For                            |
| -------------------------- | ------------ | --------------------------------- | -------------------------------- | ----------------------------------- |
| **Native Playwright API**  | Minimal      | Chromium only                     | Raw V8 Bytes                     | Quick dead-code / asset load audits |
| **Istanbul / Vite Plugin** | Moderate     | All Browsers (Chrome, FF, Safari) | Exact (Source-code level)        | Production E2E coverage reporting   |
| **Monocart MCR**           | Low-Moderate | Chromium / V8 focused             | High (V8 to Istanbul conversion) | Comprehensive reports without Babel |

Show me a step-by-step example setting up Vite, Playwright, and Istanbul for E2E code coverage.

1. **Install Required Dependencies:**
Install Vite, Playwright, Istanbul plugins, and `nyc` as development dependencies.

```bash
npm install -D vite @playwright/test vite-plugin-istanbul nyc

```

1. **Configure Vite for Code Instrumentation:** vite.config.ts.
Add `vite-plugin-istanbul` to your Vite configuration. This instruments your client-side code during development and test builds so it exposes coverage data on `window.__coverage__`.

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/'],
      extension: ['.js', '.ts', '.jsx', '.tsx'],
      requireEnv: false, // Ensures instrumentation runs during Playwright test runs
      forceBuildInstrument: true,
    }),
  ],
  server: {
    port: 3000,
  },
});

```

1. **Create Custom Playwright Coverage Fixture:** tests/fixtures.ts.
Extend Playwright's base `test` runner to extract `window.__coverage__` at the end of every test execution and save the raw JSON payloads to a `.nyc_output` directory.

```typescript
import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const test = baseTest.extend({
  page: async ({ page }, use, testInfo) => {
    // Run the test
    await use(page);

    // Extract window.__coverage__ after the test completes
    const coverage = await page.evaluate(() => (window as any).__coverage__);

    if (coverage) {
      const nycDir = path.join(process.cwd(), '.nyc_output');

      if (!fs.existsSync(nycDir)) {
        fs.mkdirSync(nycDir, { recursive: true });
      }

      const fileName = `coverage-${testInfo.testId}-${Date.now()}.json`;
      fs.writeFileSync(path.join(nycDir, fileName), JSON.stringify(coverage));
    }
  },
});

export { expect };

```

1. **Configure Playwright Configuration:** playwright.config.ts.
Set up Playwright to automatically start your Vite preview/dev server before executing tests.

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});

```

1. **Write E2E Test Using the Custom Fixture:** tests/app.spec.ts.
Import `test` and `expect` from your custom fixture file (`./fixtures.ts`) instead of `@playwright/test`.

```typescript
import { test, expect } from './fixtures';

test('increments counter and records coverage', async ({ page }) => {
  await page.goto('/');

  const button = page.locator('button');
  await expect(button).toContainText('count is 0');

  await button.click();
  await expect(button).toContainText('count is 1');
});

```

1. **Add npm Scripts for Execution & Reporting:** package.json.
Add scripts to clean up previous run artifacts, execute tests, and invoke `nyc` to compile the `.json` files into an interactive HTML report.

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "pretest:e2e": "rimraf .nyc_output coverage",
    "test:e2e": "playwright test",
    "coverage:report": "nyc report --reporter=html --reporter=text --reporter=text-summary",
    "test:e2e:coverage": "npm run test:e2e && npm run coverage:report"
  }
}

```

---

## Output Verification

Run the full suite using your npm script:

```bash
npm run test:e2e:coverage

```

Once execution completes:

1. `nyc` reads all coverage files generated in `.nyc_output/`.
2. A detailed terminal summary will display statement, branch, and line coverage percentages.
3. An interactive HTML coverage report will be generated in `./coverage/index.html`.
