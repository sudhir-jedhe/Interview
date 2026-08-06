Monitoring a frontend application in production requires a multi-layered observability strategy. Unlike backend monitoring (where you control the server environment), frontend applications run on thousands of different user devices, browsers, screen sizes, and network connections.

A complete production frontend monitoring setup covers **five core pillars**:

---

## 1. Real User Monitoring (RUM) & Performance Metrics

RUM tracks actual user experience in real-time, capturing key performance indicators as users navigate your application.

### Key Metrics to Track

* **Core Web Vitals (Google UX Metrics):**
* **LCP (Largest Contentful Paint):** Loading speed ($< 2.5\text{s}$ is good).
* **INP (Interaction to Next Paint):** Responsiveness to user actions ($< 200\text{ms}$ is good).
* **CLS (Cumulative Layout Shift):** Visual stability ($< 0.1$ is good).

* **Network & Timing Metrics:**
* **TTFB (Time to First Byte):** CDN / Server response latency.
* **FCP (First Contentful Paint):** Time until the first DOM element renders.
* **API Latency & Failure Rates:** Tracking timing and error rates for client-side `fetch` / `axios` requests.

### Popular RUM Tools

* **Datadog RUM**, **New Relic**, **Dynatrace**, **Cloudflare Web Analytics**, **Google Analytics (GA4)**.

---

## 2. Real-Time Error Tracking & Crash Reporting

When JavaScript exceptions or unhandled promise rejections occur in a user's browser, error tracking tools automatically capture the stack trace, user metadata, and environment details.

### What to Capture

* **Unhandled JS Exceptions:** `window.onerror` and `window.onunhandledrejection`.
* **Source Map Integration:** Upload production Source Maps privately to your error monitoring tool so minified stack traces map back to human-readable TypeScript/React source code lines.
* **Breadcrumbs:** Logging preceding user actions (clicks, network calls, route changes) leading up to the crash.
* **Impact Thresholds & Alerts:** Alerting on Slack/PagerDuty when an error spike exceeds a specific threshold ($> 1\%$ of active users affected).

### Popular Error Tracking Tools

* **Sentry**, **Bugsnag**, **Rollbar**, **LogRocket**.

---

## 3. Session Replay & User Experience Observability

Error stack traces tell you *what* broke, but Session Replay shows you *how* it broke from the user's perspective.

### Features & Capabilities

* **DOM Video-like Replay:** Reconstructs the exact DOM states, mouse movements, clicks, scrolls, and console logs.
* **Frustration Signals:** Automatically flags UX anomalies:
* **Rage Clicks:** Users rapidly clicking an un-responsive button.
* **Dead Clicks:** Users clicking non-interactive elements expecting action.
* **Error Flashes / Form Abandons.**

* **PII Masking & Privacy:** Scrubbing sensitive user inputs (passwords, credit cards, emails) before transmitting DOM payloads to the backend.

### Popular Session Replay Tools

* **LogRocket**, **FullStory**, **PostHog**, **Hotjar**, **Datadog Session Replay**.

---

## 4. Synthetic Monitoring & Uptime Checks

While RUM monitors real users, **Synthetic Monitoring** uses automated headless browsers (Playwright, Puppeteer, Selenium) running on global servers to simulate critical user journeys 24/7.

### Typical Synthetic Test Suites

* **Uptime & Health Checks:** pinging the root URL every 1 minute.
* **Critical User Flow Scripts:** Automated scripts testing login, search, adding items to cart, and completing checkout.
* **Lighthouse Automated Audits:** Running CI/CD performance score regressions on every deployment.

### Popular Synthetic Tools

* **Datadog Synthetics**, **Checkly**, **Pingdom**, **UptimeRobot**.

---

## 5. Product Analytics & Business Metrics

Production monitoring must also connect technical health to business outcomes.

### What to Measure

* **Conversion Funnels:** Dropped users at specific steps in the workflow.
* **Feature Adoption:** Tracking usage of newly deployed features via Feature Flags (e.g., LaunchDarkly).
* **Device / Browser Breakdown:** Monitoring if a specific release broke Safari or mobile Chrome viewports.

### Popular Analytics Tools

* **Mixpanel**, **Amplitude**, **PostHog**, **Google Analytics**.

---

## Production Implementation Checklist

1. **Configure Content Security Policy (CSP):** Ensure your CSP headers permit report endpoints (`report-uri` / `report-to`) so browsers report CSP violations automatically.
2. **Private Source Map Management:** Never upload raw source maps to public CDN directories. Upload them via CLI during your build pipeline directly to Sentry/DataDog.
3. **Sampling Strategy:** On high-traffic apps ($1\text{M}+$ daily users), sample performance traces (e.g., capture 10% of sessions for performance, but 100% of errors) to keep vendor costs low.
4. **Custom Error Boundaries:** Wrap React components in `ErrorBoundary` boundaries to catch render errors, show fallback UI, and send context-rich metadata (user ID, workspace ID) to your tracker.
