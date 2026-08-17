### Theory: Web-First Assertions
Playwright assertions (`expect(locator)`) are asynchronous and retry automatically. If you assert `expect(locator).toBeVisible()`, Playwright will continuously query the DOM until the element appears or the timeout is reached.
