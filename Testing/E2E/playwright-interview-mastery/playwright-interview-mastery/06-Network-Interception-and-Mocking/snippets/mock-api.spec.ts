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
