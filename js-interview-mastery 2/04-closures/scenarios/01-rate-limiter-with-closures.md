# Building a Rate Limiter with Closures

**Scenario:** You need to implement a rate limiter that only allows a wrapped function to be called once every N milliseconds — calls within the cooldown window should be silently ignored (not queued, unlike debounce/throttle-with-trailing-call). How would you build it using closures?

**Approach:**

```js
function rateLimit(fn, intervalMs) {
  let lastCallTime = 0; // captured in closure, persists across every call to the returned function
  return function(...args) {
    const now = Date.now();
    if (now - lastCallTime >= intervalMs) {
      lastCallTime = now;
      return fn.apply(this, args);
    }
    // silently ignored — outside the allowed window
  };
}

const logAction = rateLimit((action) => console.log('action:', action), 1000);
logAction('click'); // runs immediately
logAction('click'); // ignored, called too soon
setTimeout(() => logAction('click'), 1100); // runs, 1100ms later
```

The closure over `lastCallTime` is what makes this work — it's private state shared across every invocation of the wrapped function, invisible and untouchable from outside. Edge cases to consider: `this` must be forwarded with `apply(this, args)` in case the wrapped function is used as an object method; if the rate limiter needs to be reset externally (e.g. for testing), you'd need to expose an additional method on the returned function (e.g. `wrapped.reset = () => { lastCallTime = 0; }`), which is easy to add since it's just another closure over the same variable.
