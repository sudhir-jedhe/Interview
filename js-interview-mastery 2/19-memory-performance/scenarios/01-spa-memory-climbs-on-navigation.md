# Scenario: SPA memory usage climbs steadily on every navigation

**Your single-page app's memory usage climbs steadily every time the user navigates between pages, even though each "page" component is supposed to unmount cleanly. How do you find and fix this?**

**Approach:**
This is the classic SPA leak pattern: components attach event listeners, timers, or subscriptions on mount but never clean them up on unmount, so each navigation leaves behind live references that keep the old component's entire tree in memory. Use browser DevTools' heap snapshot comparison (take a snapshot, navigate away and back several times, take another snapshot, diff them) to spot growing detached DOM trees or accumulating listener counts. The fix is disciplined teardown: every `addEventListener`, `setInterval`, and subscription created during mount must have a matching removal during unmount.

```js
function mountWidget(root) {
  const onResize = () => updateLayout();
  window.addEventListener("resize", onResize);

  const intervalId = setInterval(pollStatus, 5000);

  const unsubscribe = store.subscribe(onStateChange);

  // Teardown function -- MUST be called when the component unmounts
  return function unmount() {
    window.removeEventListener("resize", onResize);
    clearInterval(intervalId);
    unsubscribe();
  };
}
```

See `../problems/01-memory-leak-and-fix.md` for a minimal reproduction of exactly this pattern (an interval-based leak) and its fix.
