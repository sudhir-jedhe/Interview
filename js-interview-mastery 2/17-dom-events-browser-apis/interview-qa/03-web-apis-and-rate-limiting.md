# Interview Q&A: Web APIs & Rate-Limiting Patterns

**Q: Does `fetch()` reject on a 404 or 500 response?**
No. `fetch` only rejects on network-level failures — DNS errors, no connectivity, CORS blocking, aborted requests. Any HTTP response, including 4xx/5xx status codes, resolves the promise normally; you must check `response.ok` (or `response.status`) yourself to detect an HTTP-level failure.

**Q: What's the difference between `localStorage` and `sessionStorage`?**
Both store string key-value pairs scoped to the origin, but `localStorage` persists indefinitely across browser restarts and tabs, while `sessionStorage` is scoped to a single tab and clears when that tab closes. Neither is synchronous-network-safe for large data — both operate on the main thread and have a size limit (roughly 5–10MB depending on browser).

**Q: What problem does `IntersectionObserver` solve, and what did people use before it?**
It efficiently detects when an element enters or exits the viewport (or another ancestor) without the performance cost of polling scroll position and calling `getBoundingClientRect()` on every `scroll` event. Before it existed, developers commonly used throttled scroll listeners combined with manual bounding-rect math, which was more CPU-intensive and janky, especially on mobile.

**Q: What's the difference between debounce and throttle?**
Debounce delays execution until a burst of calls has stopped for a specified period, collapsing rapid repeated triggers into a single call at the end. Throttle guarantees execution happens at most once per fixed time window while events keep firing, giving a steady cadence of calls throughout continuous activity rather than waiting for it to stop.

**Q: Write a basic debounce function.**
```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```
Each call clears any pending timer and schedules a new one; `fn` only actually runs once no new call arrives within `delay` milliseconds of the previous one.
