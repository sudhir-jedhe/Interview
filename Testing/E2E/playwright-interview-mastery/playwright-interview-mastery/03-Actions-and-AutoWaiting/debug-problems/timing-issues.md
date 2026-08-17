**Problem:** A developer uses `await page.waitForTimeout(5000)` to wait for a slow search result, slowing down the entire suite.
**Solution:** Replace hard sleeps with network waiting: `await page.waitForResponse('**/api/search')`.
