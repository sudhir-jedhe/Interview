**Interaction to Next Paint (INP)** assesses page responsiveness by measuring the time from a user interaction (click, tap, or keypress) until the browser presents the next visual frame.

INP is composed of three distinct phases:

$$\text{INP} = \text{Input Delay} + \text{Processing Duration} + \text{Presentation Delay}$$

* **Input Delay:** Time waiting for background/main-thread long tasks to finish before event listeners can execute.
* **Processing Duration:** Time spent executing JavaScript callbacks (`pointerdown`, `click`, etc.).
* **Presentation Delay:** Time spent calculating layout, recalculating styles, compositing, and rasterizing pixels to the display.

A "Good" INP is **$\le 200\text{ms}$**, "Needs Improvement" is between **$200\text{ms} - 500\text{ms}$**, and "Poor" is **$> 500\text{ms}$**.

---

### 1. Real-Time INP Measurement with `PerformanceObserver`

To log and monitor INP in real-time in both development and production (RUM - Real User Monitoring), use the `event` entry type with `durationThreshold`:

```typescript
// src/monitoring/inpObserver.ts

export interface InpMetricReport {
  interactionId: number;
  duration: number;
  inputDelay: number;
  processingDuration: number;
  presentationDelay: number;
  targetElement: string;
  eventType: string;
}

export function observeINP(onReport: (metric: InpMetricReport) => void) {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as PerformanceEventTiming[];

      for (const entry of entries) {
        // Only track interactions with an interactionId (filters out passive scrolls/hovers)
        if (!entry.interactionId) continue;

        const inputDelay = entry.processingStart - entry.startTime;
        const processingDuration = entry.processingEnd - entry.processingStart;
        const presentationDelay = entry.duration - (entry.processingEnd - entry.startTime);

        const target = entry.target as HTMLElement | null;
        const targetElement = target
          ? `${target.tagName.toLowerCase()}${target.id ? `#${target.id}` : ''}${
              target.className ? `.${target.className.split(' ').join('.')}` : ''
            }`
          : 'unknown';

        onReport({
          interactionId: entry.interactionId,
          duration: Math.round(entry.duration),
          inputDelay: Math.round(inputDelay),
          processingDuration: Math.round(processingDuration),
          presentationDelay: Math.round(presentationDelay),
          targetElement,
          eventType: entry.name,
        });
      }
    });

    // Observe user interaction events with a threshold (e.g. 40ms to catch frame drops)
    observer.observe({
      type: 'event',
      durationThreshold: 40,
      buffered: true,
    });
  } catch (err) {
    console.warn('PerformanceObserver for INP not supported:', err);
  }
}

```

#### Console Debugger Setup

```typescript
// Enable in development:
observeINP((metric) => {
  const color =
    metric.duration > 500 ? '#ef4444' : metric.duration > 200 ? '#f59e0b' : '#10b981';

  console.groupCollapsed(
    `%c[INP Metric] ${metric.eventType.toUpperCase()} on <${metric.targetElement}>: ${metric.duration}ms`,
    `color: ${color}; font-weight: bold;`
  );
  console.table({
    'Total Duration': `${metric.duration} ms`,
    'Input Delay': `${metric.inputDelay} ms`,
    'Processing Duration': `${metric.processingDuration} ms`,
    'Presentation Delay': `${metric.presentationDelay} ms`,
  });
  console.groupEnd();
});

```

---

### 2. Standard `web-vitals` Integration (Production RUM)

Using the official Google `web-vitals` library handles worst-interaction sampling (98th percentile filtering for high-interaction sessions):

```bash
npm install web-vitals

```

```typescript
import { onINP } from 'web-vitals';

onINP(
  ({ name, value, rating, attribution }) => {
    // Send to Datadog, Sentry, or custom endpoint
    const payload = {
      metric: name,
      value, // Duration in ms
      rating, // 'good' | 'needs-improvement' | 'poor'
      eventTarget: attribution.interactionTarget,
      eventType: attribution.interactionType,
      inputDelay: attribution.inputDelay,
      processingDuration: attribution.processingDuration,
      presentationDelay: attribution.presentationDelay,
      loadState: attribution.loadState,
    };

    navigator.sendBeacon('/api/telemetry/vitals', JSON.stringify(payload));
  },
  { reportAllChanges: false }
);

```

---

### 3. Debugging INP Bottlenecks in Chrome DevTools

#### Step 1: Open the Performance Panel

1. Open Chrome DevTools (`F12` / `Cmd + Option + I`).
2. Go to the **Performance** tab.
3. Check **Web Vitals** and configure CPU Throttling (e.g., **4x CPU slowdown**) to simulate mid-tier mobile hardware.
4. Click **Record**, perform the interaction (e.g., click a button or type in an input), and click **Stop**.

#### Step 2: Analyze the "Interactions" Track

1. Expand the **Interactions** track in the flame chart.
2. Locate the red-striped interaction bar (interactions $> 200\text{ms}$ are highlighted with warning stripes).
3. Click on the interaction bar to inspect the **Summary** tab at the bottom:

* It breaks down the exact milliseconds across **Input Delay**, **Processing Time**, and **Presentation Delay**.

#### Step 3: Identify the Root Cause by Phase

| High Phase Metric                               | Primary Root Cause                                                                           | Remediation Strategy                                                                                  |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **High Input Delay** ($> 50\text{ms}$)          | Long Tasks running on the main thread when the interaction occurred.                         | Break up non-urgent tasks using `scheduler.yield()` or `setTimeout(0)`. Defer analytics/logging.      |
| **High Processing Duration** ($> 100\text{ms}$) | Synchronous JS execution in the event handler (large array parsing, heavy React re-renders). | Wrap non-urgent state updates in `startTransition()`. Offload CPU work to a Web Worker.               |
| **High Presentation Delay** ($> 50\text{ms}$)   | Large DOM tree size ($> 1,500$ nodes), complex layout thrashing, or heavy CSS selectors.     | Virtualize lists/tables (`content-visibility: auto`), remove forced reflows (`element.offsetHeight`). |

---

### 4. Code Optimizations to Fix INP

#### A. Yielding the Main Thread (`scheduler.yield()`)

Break monolithic click tasks so the browser can paint intermediate progress updates:

```typescript
async function handleBatchAction(items: string[]) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);

    // Yield to the browser every 50 items so the frame can render
    if (i % 50 === 0) {
      if ('scheduler' in window && 'yield' in (window as any).scheduler) {
        await (window as any).scheduler.yield();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }
}

```

#### B. Eliminating Layout Thrashing (Forced Synchronous Reflow)

Avoid alternating reads and writes against the DOM:

```typescript
// ❌ Bad: Triggers layout recalculation on every loop
elements.forEach((el) => {
  const width = el.getBoundingClientRect().width; // Read
  el.style.width = `${width + 10}px`;              // Write
});

// ✅ Good: Batch reads first, then batch writes
const widths = elements.map((el) => el.getBoundingClientRect().width); // Read all
elements.forEach((el, idx) => {
  el.style.width = `${widths[idx] + 10}px`;                             // Write all
});

```
