**Problem:** Visual snapshots taken on a Mac fail when run in a Linux CI/CD environment due to font rendering differences.
**Solution:** Always generate your baseline screenshots inside a Docker container that matches your CI environment, or use `playwright.config.ts` to increase the `maxDiffPixelRatio`.
