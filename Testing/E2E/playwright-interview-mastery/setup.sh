	#!/bin/bash

echo "🚀 Bootstrapping Playwright Master Repository with all content..."

# 1. Create root folder and install dependencies
mkdir -p playwright-interview-mastery
cd playwright-interview-mastery
npm init -y
npm install -D @playwright/test typescript @types/node

# ==========================================
# 01 - Architecture and Basics
# ==========================================
mkdir -p 01-Architecture-and-Basics/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 01-Architecture-and-Basics/theory/notes.md
### Theory: How Playwright Works
Unlike Selenium, which translates commands through a WebDriver, Playwright communicates directly with the browser engine using the Chrome DevTools Protocol (CDP). This architecture allows it to execute commands instantly, intercept network traffic, and listen to console events without flakiness.
EOF

cat << 'EOF' > 01-Architecture-and-Basics/snippets/basic-navigation.spec.ts
import { test, expect } from '@playwright/test';

test('has title and navigates correctly', async ({ page }) => {
  // Navigation
  await page.goto('https://playwright.dev/');
  
  // Web-first assertion
  await expect(page).toHaveTitle(/Playwright/);
  
  // Interaction
  const getStarted = page.getByRole('link', { name: 'Get started' });
  await getStarted.click();
});
EOF

cat << 'EOF' > 01-Architecture-and-Basics/debug-problems/context-isolation.md
**Problem:** Tests are interfering with each other because they share local storage.
**Solution:** Playwright automatically provides an isolated `BrowserContext` for every test. If you manually create a `browser.newContext()` inside a `beforeAll` block instead of `beforeEach`, you break this isolation. Always use the built-in `{ page }` fixture which guarantees a pristine context per test.
EOF

cat << 'EOF' > 01-Architecture-and-Basics/scenario-problems/headless-vs-headed.md
**Scenario:** You need to debug a test visually, but the CI pipeline must run silently.
**Implementation:** You configure your `playwright.config.ts` to run headless by default, but override it locally via the CLI using `npx playwright test --headed`.
EOF

# ==========================================
# 02 - Locators and Selectors
# ==========================================
mkdir -p 02-Locators-and-Selectors/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 02-Locators-and-Selectors/theory/notes.md
### Theory: Resilient Locators
Playwright enforces "User-Facing Locators." Relying on CSS classes (`.btn-primary`) or XPaths makes tests brittle. You should select elements the way a user sees them: by their accessible role, text, or label.
EOF

cat << 'EOF' > 02-Locators-and-Selectors/snippets/locator-chaining.ts
import { test, expect } from '@playwright/test';

test('find specific item in a list', async ({ page }) => {
  // Chain locators to narrow down the scope
  const row = page.getByRole('row')
                  .filter({ hasText: 'Pending Invoice' })
                  .filter({ has: page.getByRole('button', { name: 'Pay Now' }) });

  await row.getByRole('button', { name: 'Pay Now' }).click();
});
EOF

cat << 'EOF' > 02-Locators-and-Selectors/debug-problems/strict-mode-violation.md
**Problem:** Playwright throws `Error: strict mode violation (resolved to 2 elements)`.
**Solution:** Playwright locators are strict. If your selector finds more than one element, it will not default to the first one (like Cypress does) to prevent accidental clicks. You must make the locator unique using `.filter()`, `.first()`, or `.nth()`.
EOF

cat << 'EOF' > 02-Locators-and-Selectors/scenario-problems/dynamic-tables.md
**Scenario:** Finding an element in a constantly shuffling data table.
**Implementation:** Never use `page.locator('tr:nth-child(3)')`. Always use `.filter({ hasText: 'Unique ID' })` to locate the exact row regardless of its physical position in the DOM.
EOF

# ==========================================
# 03 - Actions and AutoWaiting
# ==========================================
mkdir -p 03-Actions-and-AutoWaiting/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 03-Actions-and-AutoWaiting/theory/notes.md
### Theory: The Auto-Waiting Engine
Before Playwright performs an action (like `.click()`), it automatically waits for the element to pass actionable checks: it must be Attached, Visible, Stable (not animating), Receives Events, and Enabled.
EOF

cat << 'EOF' > 03-Actions-and-AutoWaiting/snippets/complex-inputs.spec.ts
import { test } from '@playwright/test';

test('handling complex forms', async ({ page }) => {
  // Text inputs
  await page.getByLabel('Username').fill('testuser');
  
  // Dropdowns (by value or label)
  await page.getByRole('combobox').selectOption('Enterprise Plan');
  
  // File uploads
  await page.getByLabel('Upload Resume').setInputFiles('./test-data/resume.pdf');
  
  // Hovering
  await page.getByText('Account Menu').hover();
});
EOF

cat << 'EOF' > 03-Actions-and-AutoWaiting/debug-problems/timing-issues.md
**Problem:** A developer uses `await page.waitForTimeout(5000)` to wait for a slow search result, slowing down the entire suite.
**Solution:** Replace hard sleeps with network waiting: `await page.waitForResponse('**/api/search')`.
EOF

cat << 'EOF' > 03-Actions-and-AutoWaiting/scenario-problems/debounce-handling.md
**Scenario:** A search input waits 500ms after the user stops typing before calling the API.
**Implementation:** Fill the input, then explicitly wait for the specific API response payload to return before asserting the UI changes.
EOF

# ==========================================
# 04 - Assertions and Matchers
# ==========================================
mkdir -p 04-Assertions-and-Matchers/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 04-Assertions-and-Matchers/theory/notes.md
### Theory: Web-First Assertions
Playwright assertions (`expect(locator)`) are asynchronous and retry automatically. If you assert `expect(locator).toBeVisible()`, Playwright will continuously query the DOM until the element appears or the timeout is reached.
EOF

cat << 'EOF' > 04-Assertions-and-Matchers/snippets/custom-matchers.spec.ts
import { test, expect } from '@playwright/test';

test('soft assertions and polling', async ({ page }) => {
  // Soft assertion: The test continues even if this fails
  await expect.soft(page.getByText('Minor Warning')).toBeVisible();

  // Polling assertion: Keep hitting the API until the status is "Complete"
  await expect(async () => {
    const response = await page.request.get('/api/job-status');
    const json = await response.json();
    expect(json.status).toBe('Complete');
  }).toPass({ timeout: 10000 });
});
EOF

cat << 'EOF' > 04-Assertions-and-Matchers/debug-problems/async-assertion-traps.md
**Problem:** A test passes immediately, but the assertion never actually ran.
**Solution:** You forgot the `await` keyword before `expect(locator)`. Because web-first assertions return Promises, omitting `await` causes the runner to exit before the assertion completes.
EOF

cat << 'EOF' > 04-Assertions-and-Matchers/scenario-problems/partial-data-validation.md
**Scenario:** You need to assert that a UI card contains a specific string, but the text includes dynamic dates.
**Implementation:** Use Regex inside your assertions: `await expect(page.locator('.status')).toHaveText(/Invoice created on .*/);`.
EOF

# ==========================================
# 05 - Advanced Interactions and DOM
# ==========================================
mkdir -p 05-Advanced-Interactions-and-DOM/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 05-Advanced-Interactions-and-DOM/theory/notes.md
### Theory: Piercing Shadow DOM and Iframes
Playwright automatically pierces open Shadow DOMs, allowing you to use standard locators. However, for security reasons, Iframes require you to explicitly switch context using a `frameLocator`.
EOF

cat << 'EOF' > 05-Advanced-Interactions-and-DOM/snippets/iframe-handling.spec.ts
import { test, expect } from '@playwright/test';

test('interacting with iframes and new tabs', async ({ page, context }) => {
  // Iframe Interaction
  const stripeFrame = page.frameLocator('#stripe-checkout');
  await stripeFrame.getByPlaceholder('Card Number').fill('4242 4242');

  // Multi-tab Handling
  const pagePromise = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Open PDF' }).click();
  const newTab = await pagePromise;
  
  await expect(newTab).toHaveURL(/.*document.pdf/);
});
EOF

cat << 'EOF' > 05-Advanced-Interactions-and-DOM/debug-problems/dialog-dismissal.md
**Problem:** The test freezes and times out because a browser `window.alert()` or `window.confirm()` popped up.
**Solution:** Playwright auto-dismisses dialogs by default. To accept them, you must add an event listener before triggering the dialog: `page.on('dialog', dialog => dialog.accept());`.
EOF

cat << 'EOF' > 05-Advanced-Interactions-and-DOM/scenario-problems/stripe-iframe-checkout.md
**Scenario:** Automating a payment flow where the credit card inputs are hosted on a third-party Stripe iframe.
**Implementation:** Use `frameLocator` combined with `getByPlaceholder` to securely target the cross-origin elements without violating browser security policies.
EOF

# ==========================================
# 06 - Network Interception and Mocking
# ==========================================
mkdir -p 06-Network-Interception-and-Mocking/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 06-Network-Interception-and-Mocking/theory/notes.md
### Theory: Controlling the Network Layer
Playwright can act as a proxy between the browser and the backend. You can block images to speed up tests, mock API responses to simulate edge cases, or modify request headers on the fly.
EOF

cat << 'EOF' > 06-Network-Interception-and-Mocking/snippets/mock-api.spec.ts
import { test, expect } from '@playwright/test';

test('mocks the dashboard API', async ({ page }) => {
  // Intercept the request and fulfill it with fake data
  await page.route('**/api/dashboard', async route => {
    const json = { revenue: "$1,000,000", status: "Critical" };
    await route.fulfill({ json });
  });

  await page.goto('/dashboard');
  await expect(page.getByText('$1,000,000')).toBeVisible();
});
EOF

cat << 'EOF' > 06-Network-Interception-and-Mocking/debug-problems/unhandled-routes.md
**Problem:** You used `page.route('**/*', route => { ... })` and now the page never finishes loading.
**Solution:** You forgot to call `route.continue()` for requests you did not want to mock. Always call `route.fallback()` or `route.continue()` if your route logic does not match the request.
EOF

cat << 'EOF' > 06-Network-Interception-and-Mocking/scenario-problems/simulate-500-error.md
**Scenario:** Verifying that the application displays a user-friendly error banner when the backend returns a 500 error.
**Implementation:** Intercept the API call and use `route.fulfill({ status: 500 })`, then assert that the red error banner becomes visible in the DOM.
EOF

# ==========================================
# 07 - Authentication and State Management
# ==========================================
mkdir -p 07-Authentication-and-State-Management/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 07-Authentication-and-State-Management/theory/notes.md
### Theory: Bypassing the UI for Login
Logging in via the UI before every test is slow and consumes backend resources. Playwright allows you to authenticate once, save the cookies and local storage to a file, and inject that state into all subsequent tests.
EOF

cat << 'EOF' > 07-Authentication-and-State-Management/snippets/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://myapp.com/login');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

  // Save state to a file
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}
export default globalSetup;
EOF

cat << 'EOF' > 07-Authentication-and-State-Management/debug-problems/token-expiration.md
**Problem:** The test suite takes 30 minutes to run, but the JWT access token expires after 15 minutes, causing tests at the end of the suite to fail.
**Solution:** Instead of a single `global-setup`, inject an API call into a `beforeEach` hook to programmatically fetch a fresh token and inject it into the browser context via `context.addCookies()`.
EOF

cat << 'EOF' > 07-Authentication-and-State-Management/scenario-problems/multi-role-testing.md
**Scenario:** You need to test that an Admin can see the delete button, but a Viewer cannot.
**Implementation:** Generate two different storage state files (`adminState.json` and `viewerState.json`). Use `test.use({ storageState: 'viewerState.json' })` at the top of the relevant test blocks.
EOF

# ==========================================
# 08 - Page Object Model and Custom Fixtures
# ==========================================
mkdir -p 08-Page-Object-Model-and-Custom-Fixtures/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 08-Page-Object-Model-and-Custom-Fixtures/theory/notes.md
### Theory: Custom Fixtures over Classes
While you can instantiate POM classes manually (`const loginPage = new LoginPage(page)`), Playwright's `test.extend()` allows you to inject POMs as fixtures directly into the test arguments, resulting in cleaner code and automatic setup/teardown.
EOF

cat << 'EOF' > 08-Page-Object-Model-and-Custom-Fixtures/snippets/base.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './LoginPage';

type MyFixtures = {
  loginPage: LoginPage;
};

// Extend the base test to include our custom fixture
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate(); // Setup
    await use(loginPage);       // Provide to test
    // Teardown code can go here
  },
});
EOF

cat << 'EOF' > 08-Page-Object-Model-and-Custom-Fixtures/debug-problems/circular-dependency.md
**Problem:** `DashboardPage` imports `LoginPage`, and `LoginPage` imports `DashboardPage`, causing a crash.
**Solution:** Never couple Page Objects directly to each other. Navigation between pages should be handled within the test file itself, keeping POM classes strictly isolated.
EOF

cat << 'EOF' > 08-Page-Object-Model-and-Custom-Fixtures/scenario-problems/reusable-component-objects.md
**Scenario:** A complex Navigation Drawer exists on every page of the app.
**Implementation:** Do not duplicate the drawer locators in every Page Object. Create a `NavigationDrawer` component class, and instantiate it as a property inside your other Page Objects.
EOF

# ==========================================
# 09 - Visual Comparison and Accessibility
# ==========================================
mkdir -p 09-Visual-Comparison-and-Accessibility/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 09-Visual-Comparison-and-Accessibility/theory/notes.md
### Theory: Snapshots and A11y
Visual regression testing catches styling bugs that functional tests miss. Playwright uses `pixelmatch` internally. Accessibility (A11y) testing is achieved using the official `@axe-core/playwright` plugin.
EOF

cat << 'EOF' > 09-Visual-Comparison-and-Accessibility/snippets/visual-regression.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('visual and accessibility checks', async ({ page }) => {
  await page.goto('/dashboard');

  // Visual Snapshot (masking the live clock)
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [page.locator('.live-clock-widget')]
  });

  // Accessibility Audit
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
EOF

cat << 'EOF' > 09-Visual-Comparison-and-Accessibility/debug-problems/anti-aliasing-diffs.md
**Problem:** Visual snapshots taken on a Mac fail when run in a Linux CI/CD environment due to font rendering differences.
**Solution:** Always generate your baseline screenshots inside a Docker container that matches your CI environment, or use `playwright.config.ts` to increase the `maxDiffPixelRatio`.
EOF

cat << 'EOF' > 09-Visual-Comparison-and-Accessibility/scenario-problems/dark-mode-snapshots.md
**Scenario:** You need to ensure the application renders correctly in both Light and Dark themes.
**Implementation:** Use `test.use({ colorScheme: 'dark' })` in your test block to force the browser engine to emulate user OS dark mode preferences before taking the snapshot.
EOF

# ==========================================
# 10 - CI/CD Reporting and Debugging
# ==========================================
mkdir -p 10-CI-CD-Reporting-and-Debugging/{theory,snippets,debug-problems,scenario-problems}

cat << 'EOF' > 10-CI-CD-Reporting-and-Debugging/theory/notes.md
### Theory: The Trace Viewer
Playwright's Trace Viewer is a game-changer. It records a full DOM snapshot, network requests, console logs, and action timelines for every step of the test. When a test fails in CI, you download the trace ZIP and explore the failure exactly as it happened.
EOF

cat << 'EOF' > 10-CI-CD-Reporting-and-Debugging/snippets/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    // Only capture traces when a test fails to save CI disk space
    trace: 'retain-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
EOF

cat << 'EOF' > 10-CI-CD-Reporting-and-Debugging/debug-problems/ci-only-failures.md
**Problem:** A test passes locally but fails consistently in GitHub Actions.
**Solution:** Usually caused by screen size differences or locale issues. Ensure your CI viewport matches local configurations by explicitly setting `viewport: { width: 1280, height: 720 }` and `timezoneId: 'UTC'` in the config.
EOF

cat << 'EOF' > 10-CI-CD-Reporting-and-Debugging/scenario-problems/matrix-sharding-ci.md
**Scenario:** Your suite has grown to 1,500 tests and takes 45 minutes to run.
**Implementation:** Configure your CI pipeline (e.g., GitHub Actions) to use Playwright's sharding feature: `npx playwright test --shard=1/4`. This splits the test suite across 4 parallel cloud runners, cutting execution time down to 12 minutes, and then merges the HTML reports at the end.
EOF

# ==========================================
# ROOT CONFIGURATION
# ==========================================
cat << 'EOF' > playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: 'html',
  use: {
    trace: 'retain-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
EOF

echo "✅ Playwright Master Repository built successfully! All content has been inserted into the files."
