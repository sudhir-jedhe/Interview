### Theory: Custom Fixtures over Classes
While you can instantiate POM classes manually (`const loginPage = new LoginPage(page)`), Playwright's `test.extend()` allows you to inject POMs as fixtures directly into the test arguments, resulting in cleaner code and automatic setup/teardown.
