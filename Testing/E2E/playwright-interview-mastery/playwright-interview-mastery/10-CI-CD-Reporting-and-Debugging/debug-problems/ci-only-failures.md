**Problem:** A test passes locally but fails consistently in GitHub Actions.
**Solution:** Usually caused by screen size differences or locale issues. Ensure your CI viewport matches local configurations by explicitly setting `viewport: { width: 1280, height: 720 }` and `timezoneId: 'UTC'` in the config.
