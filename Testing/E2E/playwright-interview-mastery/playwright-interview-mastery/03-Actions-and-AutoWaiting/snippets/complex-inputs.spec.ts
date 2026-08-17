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
