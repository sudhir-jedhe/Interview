Monitoring your Sentry error integration and overall React application health involves setting up **dashboards, alerts, performance tracking, and source maps** so you get notified when critical issues happen—before your users report them.

Here is how to effectively monitor your React app using Sentry.

---

## 1. Upload Source Maps for Readable Stack Traces

By default, production React builds minify JavaScript code (e.g., `app.a8f2c.js`). Without source maps, Sentry stack traces will show unreadable, minified code lines like `at e (app.a8f2c.js:1:1204)`.

### Automatic Source Map Upload using Vite / Webpack Plugin

If you use **Vite**, install the official Sentry plugin:

```bash
npm install @sentry/vite-plugin --save-dev

```

Add it to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    // Automatically creates releases & uploads source maps during build
    sentryVitePlugin({
      org: 'YOUR_SENTRY_ORG_SLUG',
      project: 'YOUR_SENTRY_PROJECT_SLUG',
      authToken: process.env.SENTRY_AUTH_TOKEN, // Set in CI/CD env vars
    }),
  ],
  build: {
    sourcemap: true, // Enables source map generation
  },
});

```

> 🔒 **Security Tip:** The Sentry plugin uploads source maps directly to Sentry's secure servers during the build step and deletes public `.map` files so users cannot inspect your source code in browser DevTools.

---

## 2. Set Up Actionable Sentry Alerts

Instead of checking the Sentry dashboard manually, configure automated alert rules in **Sentry Settings ➔ Alerts**.

### Recommended Alert Rules

| Alert Type                | Condition / Trigger                               | Notification Channel  | Action Taken                                      |
| ------------------------- | ------------------------------------------------- | --------------------- | ------------------------------------------------- |
| **High Spike Alert**      | Event count exceeds 50 errors in 5 minutes        | **Slack / PagerDuty** | Notifies team of active outage or bad release.    |
| **New Issue Alert**       | A brand new error type is seen for the first time | **Slack / Email**     | Catches regressions immediately after deployment. |
| **Issue Frequency Alert** | An error impacts > 5% of unique users in an hour  | **Slack / Teams**     | Escalates high-impact user-facing bugs.           |

---

## 3. Monitor Web Vitals & Frontend Performance

Sentry doesn't just catch JavaScript exceptions—it monitors user experience metrics (Core Web Vitals) to highlight slow route transitions and rendering delays.

### A. Trace React Route Navigation

Ensure Sentry tracks page load performance and route transitions by integrating with your router (e.g., **React Router v6/v7**):

```typescript
import { useEffect } from 'react';
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router-dom';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_DSN',
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 0.2, // Capture 20% of user sessions for performance tracing
});

```

### B. Track Core Web Vitals on Sentry's Performance Tab

In the **Sentry ➔ Performance** dashboard, monitor:

* **LCP (Largest Contentful Paint):** How fast primary page content loads (< 2.5s is good).
* **INP (Interaction to Next Paint):** Measures UI responsiveness to user clicks/taps (< 200ms is good).
* **CLS (Cumulative Layout Shift):** Measures visual stability/layout jumps (< 0.1 is good).

---

## 4. Use Breadcrumbs for Reproducing Bugs

Breadcrumbs are a chronological log of events that occurred leading up to an error. Sentry automatically records console logs, DOM clicks, page navigations, and HTTP requests.

You can also record **custom breadcrumbs** inside important business logic (e.g., checkout flows or form submissions):

```typescript
import * as Sentry from '@sentry/react';

function handleCheckoutSubmit(cartItems: Item[]) {
  // Add custom breadcrumb prior to processing
  Sentry.addBreadcrumb({
    category: 'checkout',
    message: `User started checkout with ${cartItems.length} items`,
    level: 'info',
    data: {
      totalAmount: 149.99,
    },
  });

  processPayment();
}

```

When an error happens during `processPayment()`, Sentry attaches this breadcrumb log to the error report so developers can see the exact steps the user took before the crash.

---

## 5. Session Replays for Visual Debugging

Session Replay records a video-like DOM reconstruction of user interactions leading up to a crash.

When an error occurs, you can click **"Watch Replay"** inside the Sentry issue page to see the user's cursor movements, clicks, device viewport, and console errors right before the app broke.

```typescript
// Sentry Init Configuration for Replays
Sentry.init({
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,       // Hides sensitive user input text
      blockAllMedia: true,     // Masks images and media
    }),
  ],
  replaysSessionSampleRate: 0.05, // Record 5% of standard user sessions
  replaysOnErrorSampleRate: 1.0,  // Record 100% of sessions where a JavaScript error occurred
});

```

---

## Summary Monitoring Dashboard Checklist

```
  1. Build Pipeline ──────► Source Maps Uploaded (Readable Stack Traces)
                                 │
  2. Runtime Engine ──────► Sentry Error Boundary + Interceptors
                                 │
  3. Context Layers ──────► User ID + Custom Breadcrumbs + Session Replay
                                 │
  4. Alert Channels ──────► Real-time Slack/PagerDuty Alerts on Critical Spikes

```
