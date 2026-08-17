**Problem:** `DashboardPage` imports `LoginPage`, and `LoginPage` imports `DashboardPage`, causing a crash.
**Solution:** Never couple Page Objects directly to each other. Navigation between pages should be handled within the test file itself, keeping POM classes strictly isolated.
