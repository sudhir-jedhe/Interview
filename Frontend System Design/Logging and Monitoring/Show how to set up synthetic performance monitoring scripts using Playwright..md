Synthetic performance monitoring uses headless browser scripts to continuously simulate critical user journeys (e.g., logging in, searching, adding items to a cart) in isolated, controlled environments.

Using **Playwright**, you can capture real browser timing metrics—including Google's **Core Web Vitals (LCP, INP, CLS)**, network request waterfalls, and Chrome DevTools Protocol (CDP) performance traces—and enforce strict performance budgets in your CI/CD pipelines or scheduled monitoring jobs.

---

## 1. Architecture of a Playwright Synthetic Monitor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SYNTHETIC PERFORMANCE MONITORING FLOW                       │
│                                                                             │
│  [ Scheduled Runner ] ──► (1) Launch Headless Chromium / WebKit             │
│            │                                                                │
│            ├──► (2) Throttles CPU (e.g., 4x) & Network (e.g., Fast 3G)      │
│            ├──► (3) Executes User Journey Script (Click, Type, Navigate)   │
│            ├──► (4) Collects Web Vitals, Long Tasks, & Request Durations    │
│            │                                                                │
│            ▼                                                                │
│  [ Telemetry Collector ] ──► Assert Budgets (Fail CI) or Push to Datadog/Grafana
└─────────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Setting Up Playwright Performance Helpers

To extract performance metrics during synthetic runs, leverage browser performance APIs (`PerformanceObserver`, `window.performance.timing`) injected directly into the page context.

### Performance Metrics Collector Utility (`src/synthetic/perfCollector.ts`)

```typescript
import { Page } from '@playwright/test';

export interface PerformanceMetrics {
  LCP: number; // Largest Contentful Paint (ms)
  CLS: number; // Cumulative Layout Shift score
  FID: number; // First Input Delay (ms)
  longTaskCount: number; // Count of tasks blocking main thread > 50ms
  totalJSHeapSize: number; // Memory usage in bytes
}

export async function injectPerformanceObserver(page: Page): Promise<void> {
  // Inject observers BEFORE page scripts execute
  await page.addInitScript(() => {
    (window as any).__perfMetrics = {
      lcp: 0,
      cls: 0,
      fid: 0,
      longTaskCount: 0,
    };

    // 1. Observe Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      (window as any).__perfMetrics.lcp = lastEntry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // 2. Observe Cumulative Layout Shift (CLS)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          (window as any).__perfMetrics.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // 3. Observe Long Tasks (> 50ms main-thread blocks)
    new PerformanceObserver((entryList) => {
      (window as any).__perfMetrics.longTaskCount += entryList.getEntries().length;
    }).observe({ type: 'longtask', buffered: true });
  });
}

export async function extractPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    const memory = (performance as any).memory;
    return {
      LCP: (window as any).__perfMetrics.lcp || 0,
      CLS: (window as any).__perfMetrics.cls || 0,
      FID: (window as any).__perfMetrics.fid || 0,
      longTaskCount: (window as any).__perfMetrics.longTaskCount || 0,
      totalJSHeapSize: memory ? memory.usedJSHeapSize : 0,
    };
  });
}

```

---

## 3. Writing the Synthetic User Journey Script

This synthetic monitor emulates a user logging in and searching for products while enforcing CPU throttling and performance budget assertions.

### Synthetic Test Suite (`tests/synthetic-checkout.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';
import { injectPerformanceObserver, extractPerformanceMetrics } from '../src/synthetic/perfCollector';

test.describe('Synthetic Performance Monitor: Critical Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Emulate low-end mobile / throttled desktop via Chrome DevTools Protocol (CDP)
    const client = await page.context().newCDPSession(page);
    
    // Simulate 4x CPU Slowdown (Mid-tier mobile experience)
    await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

    // Simulate Fast 3G Network Throttling
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8, // 1.6 Mbps
      uploadThroughput: (750 * 1024) / 8,         // 750 Kbps
      latency: 150,                               // 150ms RTT
    });

    // 2. Attach performance observers
    await injectPerformanceObserver(page);
  });

  test('User Search & Add-to-Cart meets Core Web Vitals budgets', async ({ page }) => {
    const startTime = Date.now();

    // Step A: Navigate to Landing Page
    const response = await page.goto('https://app.example.com', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.status()).toBe(200);

    // Step B: Simulate User Interactions
    await page.getByRole('textbox', { name: /search/i }).fill('wireless headphones');
    await page.getByRole('button', { name: /submit/i }).click();

    // Wait for search results container to render
    await page.waitForSelector('.search-results-grid');

    // Step C: Extract Collected Performance Metrics
    const metrics = await extractPerformanceMetrics(page);
    const totalJourneyDuration = Date.now() - startTime;

    console.log('--- SYNTHETIC RUN METRICS ---');
    console.log(`LCP: ${metrics.LCP.toFixed(2)} ms`);
    console.log(`CLS: ${metrics.CLS.toFixed(4)}`);
    console.log(`Long Tasks Count: ${metrics.longTaskCount}`);
    console.log(`JS Heap Used: ${(metrics.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total Journey Time: ${totalJourneyDuration} ms`);

    // Step D: Enforce Synthetic Performance Budgets
    expect(metrics.LCP, 'LCP must be under 2500ms').toBeLessThan(2500);
    expect(metrics.CLS, 'CLS must be under 0.1').toBeLessThan(0.1);
    expect(metrics.longTaskCount, 'Main thread long tasks should be minimal').toBeLessThan(5);
    expect(totalJourneyDuration, 'Complete flow must execute under 5s').toBeLessThan(5000);
  });
});

```

---

## 4. Playwright Configuration for Synthetic Runs

Define headless browser instances, video recording, and HAR (HTTP Archive) trace logging for debugging failed synthetic runs.

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2, // Retry twice on flaky network conditions before flagging an incident
  reporter: [
    ['list'],
    ['json', { outputFile: 'synthetic-results.json' }],
    ['html', { open: 'never' }],
  ],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Record video and trace ONLY on failure for root-cause analysis
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Desktop Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari (iPhone 13)',
      use: { ...devices['iPhone 13'] },
    },
  ],
});

```

---

## 5. Scheduling Synthetic Monitors in GitHub Actions

Run synthetic monitoring scripts automatically every 15 minutes to detect production degradation before real users do.

### `.github/workflows/synthetic-monitor.yml`

```yaml
name: Scheduled Synthetic Performance Monitor

on:
  schedule:
    # Run every 15 minutes
    - cron: '*/15 * * * *'
  workflow_dispatch: # Allows manual trigger from GitHub UI

jobs:
  run-synthetic-monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium

      - name: Execute Synthetic Monitor
        run: npx playwright test tests/synthetic-checkout.spec.ts

      - name: Send Alert on Failure (Slack / Datadog)
        if: failure()
        run: |
          echo "Synthetic performance monitoring failed or exceeded budget!"
          # Curl request to alert webhook (e.g., Slack / PagerDuty / Datadog)
          curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚨 Synthetic Performance Monitor Alert: LCP or Budget breached on app.example.com"}' \
            ${{ secrets.SLACK_WEBHOOK_URL }}

      - name: Upload Test Artifacts / Traces
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: synthetic-performance-report
          path: |
            synthetic-results.json
            playwright-report/

```

---

## Synthetic Monitoring Summary Checklist

| Performance Metric                    | Target Budget              | Action Taken When Breached                                                                |
| ------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| **LCP (Largest Contentful Paint)**    | $\le 2500\text{ms}$        | Optimize image assets, pre-connect CDNs, check server response time (TTFB).               |
| **CLS (Cumulative Layout Shift)**     | $\le 0.1$                  | Reserve explicit dimensions (`width`/`height`) on images and dynamic UI blocks.           |
| **Long Tasks Count ($>50\text{ms}$)** | $\le 3\text{ per journey}$ | Code-split heavy JS bundles, defer non-critical third-party analytics scripts.            |
| **Total Journey Duration**            | $\le 5000\text{ms}$        | Trigger PagerDuty/Slack notification to alert on call engineers to potential regressions. |
