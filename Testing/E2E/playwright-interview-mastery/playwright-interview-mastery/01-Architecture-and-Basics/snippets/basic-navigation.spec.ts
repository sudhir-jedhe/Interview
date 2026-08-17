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
