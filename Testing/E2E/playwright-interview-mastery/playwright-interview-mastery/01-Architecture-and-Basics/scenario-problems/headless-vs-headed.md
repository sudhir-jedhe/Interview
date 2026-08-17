**Scenario:** You need to debug a test visually, but the CI pipeline must run silently.
**Implementation:** You configure your `playwright.config.ts` to run headless by default, but override it locally via the CLI using `npx playwright test --headed`.
