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
