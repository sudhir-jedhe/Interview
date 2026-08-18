**Your team's design system library exposes a `debounce(fn, delay)` utility, but someone implemented it using `Promise.resolve().then()` chains instead of `setTimeout`, trying to "avoid timers." A bug report says debounced search-input handlers fire far too eagerly, effectively not debouncing at all under rapid typing. What went wrong?**

**Approach:**
The bug is a fundamental misunderstanding: microtasks are not a substitute for timers, because they don't provide any actual *time delay* — they only defer execution until the current synchronous code and prior microtasks finish, which for rapid consecutive keystrokes (each its own synchronous event handler call) could resolve in the same "tick" essentially back-to-back, providing no meaningful debounce window at all.

```js
// BROKEN "debounce" — doesn't actually wait for a pause in activity
function brokenDebounce(fn) {
  let pending;
  return (...args) => {
    pending = args;
    Promise.resolve().then(() => fn(...pending)); // fires almost immediately, every keystroke
  };
}

// CORRECT — uses a real timer that gets reset on every call
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```
The correct implementation relies on `setTimeout`'s actual wall-clock delay combined with `clearTimeout` to reset that delay on every new call — a genuinely asynchronous macrotask timer, not a same-tick microtask, is required to create a real "wait for a pause" behavior.
