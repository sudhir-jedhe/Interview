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
