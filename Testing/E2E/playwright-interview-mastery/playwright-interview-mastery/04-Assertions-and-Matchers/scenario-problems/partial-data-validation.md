**Scenario:** You need to assert that a UI card contains a specific string, but the text includes dynamic dates.
**Implementation:** Use Regex inside your assertions: `await expect(page.locator('.status')).toHaveText(/Invoice created on .*/);`.
