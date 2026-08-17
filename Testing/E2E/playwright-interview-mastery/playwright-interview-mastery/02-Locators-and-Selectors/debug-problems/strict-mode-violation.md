**Problem:** Playwright throws `Error: strict mode violation (resolved to 2 elements)`.
**Solution:** Playwright locators are strict. If your selector finds more than one element, it will not default to the first one (like Cypress does) to prevent accidental clicks. You must make the locator unique using `.filter()`, `.first()`, or `.nth()`.
