import { test, expect } from '@playwright/test';

test('find specific item in a list', async ({ page }) => {
  // Chain locators to narrow down the scope
  const row = page.getByRole('row')
                  .filter({ hasText: 'Pending Invoice' })
                  .filter({ has: page.getByRole('button', { name: 'Pay Now' }) });

  await row.getByRole('button', { name: 'Pay Now' }).click();
});
