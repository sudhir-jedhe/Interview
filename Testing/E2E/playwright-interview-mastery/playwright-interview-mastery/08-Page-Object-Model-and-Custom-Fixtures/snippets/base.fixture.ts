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
