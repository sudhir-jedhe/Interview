Here is how to set up and write a production-grade **End-to-End (E2E)** test for the `LoginForm` component using **Playwright**.

Unlike unit or component tests running in a simulated DOM (`jsdom`), Playwright executes tests against **real browser engines** (Chromium, WebKit/Safari, Firefox), validating full user interactions, network requests, and visual accessibility.

---

## 1. Playwright Test Suite (`tests/login.spec.ts`)

This test suite covers four critical E2E scenarios:

1. **Initial Page Render & Accessibility Checks**
2. **Form Validation Error Handling (Client-side validation)**
3. **Successful Authentication Flow (Intercepting & Mocking API Network Calls)**
4. **Server Error / 500 Response Handling**

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Form E2E Feature Suite', () => {
  // Navigate to the login route before each test run
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should render all form controls with correct accessible roles', async ({ page }) => {
    // Verify page heading and form landmark
    await expect(page.getByRole('form', { name: /login form/i })).toBeVisible();

    // Verify input fields and role selector
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/select role/i)).toBeVisible();

    // Verify submit button state
    const submitBtn = page.getByRole('button', { name: /submit login/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test('should display client-side validation errors when submitting empty or malformed inputs', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i);
    const submitBtn = page.getByRole('button', { name: /submit login/i });

    // 1. Submit empty form
    await submitBtn.click();

    // Assert inline alert error message appears
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText('Email is required');

    // 2. Type an invalid email format
    await emailInput.fill('invalid-email-address');
    await submitBtn.click();

    // Assert updated validation message
    await expect(alert).toHaveText('Invalid email format');
  });

  test('should successfully authenticate user when valid credentials are submitted', async ({ page }) => {
    // 1. Intercept network request at the browser layer
    await page.route('**/api/v1/auth/login', async (route) => {
      const requestPayload = route.request().postDataJSON();

      // Assert payload sent over the wire by the browser matches inputs
      expect(requestPayload).toEqual({
        email: 'admin@enterprise.com',
        role: 'admin',
      });

      // Fulfill request with mock HTTP 200 OK
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'jwt_mock_token_12345',
          user: { name: 'Admin User' },
        }),
      });
    });

    // 2. Fill out form controls
    await page.getByLabel(/email/i).fill('admin@enterprise.com');
    await page.getByLabel(/select role/i).selectOption('admin');

    // 3. Submit Form
    const submitBtn = page.getByRole('button', { name: /submit login/i });
    await submitBtn.click();

    // 4. Assert navigation redirect to dashboard route after successful login
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('should handle server authentication failures (HTTP 401)', async ({ page }) => {
    // Intercept API call to simulate a failed login response
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials provided' }),
      });
    });

    await page.getByLabel(/email/i).fill('user@example.com');
    await page.getByRole('button', { name: /submit login/i }).click();

    // Assert error message returned from API is displayed
    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText('Invalid credentials provided');
  });
});

```

---

## 2. Playwright Configuration (`playwright.config.ts`)

Configure Playwright to run across multiple browser engines, handle environment URLs, and automatically launch local dev servers during testing runs:

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // Execute tests concurrently
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // Retry failed tests twice in CI pipelines
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright-report' }]],

  use: {
    baseURL: 'http://localhost:3000', // Base URL for page.goto('/login')
    trace: 'on-first-retry', // Capture performance traces and screenshots on failures
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Test across modern cross-browser engines
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit (Safari)',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Automatically start application web server before running tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});

```

---

## 3. Advanced Pattern: Page Object Model (POM)

For larger applications, abstracting DOM selectors into a **Page Object Model (POM)** keeps tests clean and prevents duplication when element selectors change.

### Create the Page Object (`tests/pages/LoginPage.ts`)

```typescript
// tests/pages/LoginPage.ts
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.roleSelect = page.getByLabel(/select role/i);
    this.submitButton = page.getByRole('button', { name: /submit login/i });
    this.errorAlert = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, role: string = 'user') {
    await this.emailInput.fill(email);
    await this.roleSelect.selectOption(role);
    await this.submitButton.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toHaveText(message);
  }
}

```

### Clean Test Usage with POM

```typescript
// tests/loginWithPOM.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('should validate empty email field using Page Object Model', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.submitButton.click();
  await loginPage.expectErrorMessage('Email is required');
});

```

---

## Key Differences: Playwright E2E vs. Vitest Component Testing

| Testing Feature            | Vitest + React Testing Library            | Playwright E2E                                               |
| -------------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| **Execution Environment**  | Node.js + Synthetic DOM (`jsdom`)         | Real Browser Engines (Chromium, WebKit, Firefox)             |
| **Layout & CSS Rendering** | Limited (no real layout box calculations) | Full CSS Engine, visual screenshots, and layout calculations |
| **Network Interception**   | MSW at the Node process level             | Native browser `page.route()` network mocking                |
| **Best Used For**          | Fast unit and component interaction tests | Cross-browser validation of end-to-end user journeys         |
