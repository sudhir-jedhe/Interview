Here is the English translation of the explanation on Short Polling, its optimization techniques, and the production-grade code example:

---

# Short Polling in Front-End System Design: Concepts, Optimization, and Implementation

**Short Polling** is one of the simplest and most traditional techniques for acquiring real-time data updates. In this approach, the front-end application sends repeated API requests to the server at fixed time intervals to check if new data is available.

---

## 1. How Short Polling Works

1. The client (browser) sends an HTTP GET request to the server.
2. The server responds immediately (without holding the connection open) with the current dataset.
3. The client sets a timer (`setInterval` or `setTimeout`), and after the designated interval (e.g., every 5 seconds), the process repeats.

### When to Use Short Polling

* When data does not change extremely fast (e.g., dashboard statistics, weather updates, or basic order status tracking).
* When setting up WebSockets or Server-Sent Events (SSE) adds unnecessary server complexity or infrastructure overhead.

---

## 2. Best Practices for Optimizing Short Polling

Using a naive `setInterval` can lead to issues like request stacking or network congestion if responses take longer than the interval. To build an optimized polling engine:

1. **Use `setTimeout` Instead of `setInterval`:** Schedule the next poll *only after* the previous request has fully completed (whether successfully or with an error). This prevents **request overlapping / race conditions**.
2. **Leverage the Page Visibility API:** Pause polling when the user minimizes the browser window or switches to a different tab, conserving battery, CPU, and bandwidth.
3. **Adaptive / Exponential Backoff (Optional):** If consecutive polls return identical data (no state changes), gradually increase the polling interval to reduce server load.

---

## 3. Code Example: Optimized Short Polling Manager (Vanilla TypeScript / JavaScript)

Here is a production-grade short polling class that incorporates **Page Visibility awareness** and **request overlap prevention**:

```typescript
class ShortPollingManager {
  private timerId: number | null = null;
  private isFetching = false;

  constructor(
    private fetchUrl: string,
    private intervalMs: number = 5000,
    private onDataUpdate: (data: any) => void,
    private onError: (error: any) => void
  ) {
    // Listen to tab visibility changes to pause/resume polling intelligently
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
  }

  public start(): void {
    if (this.timerId !== null) return;
    this.poll();
  }

  private async poll(): void {
    // Do not poll if the document/tab is hidden
    if (document.hidden) {
      this.scheduleNextPoll();
      return;
    }

    // Skip this cycle if a fetch is already in flight (prevent overlapping)
    if (this.isFetching) {
      this.scheduleNextPoll();
      return;
    }

    this.isFetching = true;

    try {
      const response = await fetch(this.fetchUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      this.onDataUpdate(data); // Pass fresh data to UI handler
    } catch (error) {
      this.onError(error);
    } finally {
      this.isFetching = false;
      this.scheduleNextPoll(); // Schedule next execution loop
    }
  }

  private scheduleNextPoll(): void {
    // Using setTimeout recursively is safer than setInterval
    this.timerId = window.setTimeout(() => this.poll(), this.intervalMs);
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Clear active timers when user navigates away from tab
      if (this.timerId !== null) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    } else {
      // Immediately fetch fresh data and resume polling when user returns
      this.poll();
    }
  }

  public stop(): void {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    document.removeEventListener('visibilitychange', () => this.handleVisibilityChange());
  }
}

// --- Usage Example ---
const stockPoller = new ShortPollingManager(
  'https://api.example.com/live-stocks',
  4000, // Poll every 4 seconds
  (newData) => {
    console.log('Latest stock data received:', newData);
  },
  (err) => {
    console.error('Polling error:', err);
  }
);

// Start polling
stockPoller.start();

// Stop polling when component unmounts or view changes
// stockPoller.stop();

```
