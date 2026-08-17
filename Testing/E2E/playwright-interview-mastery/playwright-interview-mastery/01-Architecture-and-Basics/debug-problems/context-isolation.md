**Problem:** Tests are interfering with each other because they share local storage.
**Solution:** Playwright automatically provides an isolated `BrowserContext` for every test. If you manually create a `browser.newContext()` inside a `beforeAll` block instead of `beforeEach`, you break this isolation. Always use the built-in `{ page }` fixture which guarantees a pristine context per test.
