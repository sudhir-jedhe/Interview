**Problem:** The test suite takes 30 minutes to run, but the JWT access token expires after 15 minutes, causing tests at the end of the suite to fail.
**Solution:** Instead of a single `global-setup`, inject an API call into a `beforeEach` hook to programmatically fetch a fresh token and inject it into the browser context via `context.addCookies()`.
