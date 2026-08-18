# Scenario: A drop-in analytics library that must not leak globals

**You're building a small analytics library that other teams will drop into their pages via a `<script>` tag. It needs to track events internally without leaking any variables into the global scope, and expose only a `track()` and `flush()` method.**

**Approach:**
This is a textbook module pattern use case: since it's loaded via a plain `<script>` tag (no bundler/module system guaranteed), an IIFE keeps all internal state and helper functions out of the global scope, exposing only the intended API on a single global namespace object.

```js
var Analytics = (function () {
  const queue = [];
  const MAX_BATCH = 20;

  function send(events) {
    // internal helper -- not exposed
    navigator.sendBeacon("/collect", JSON.stringify(events));
  }

  return {
    track(eventName, data) {
      queue.push({ eventName, data, ts: Date.now() });
      if (queue.length >= MAX_BATCH) this.flush();
    },
    flush() {
      if (queue.length === 0) return;
      send(queue.splice(0, queue.length));
    },
  };
})();

Analytics.track("page_view", { path: "/home" });
window.addEventListener("beforeunload", () => Analytics.flush());
```
