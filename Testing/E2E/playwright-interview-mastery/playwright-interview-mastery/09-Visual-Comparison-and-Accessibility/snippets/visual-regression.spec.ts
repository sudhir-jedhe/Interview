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
