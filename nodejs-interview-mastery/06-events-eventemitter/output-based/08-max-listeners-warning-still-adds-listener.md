# MaxListenersExceededWarning Is a Warning, Not a Hard Limit

```js
const { EventEmitter } = require('events');
const ee = new EventEmitter();
for (let i = 0; i < 11; i++) {
  ee.on('data', () => {});
}
console.log(ee.listenerCount('data'));
```

**Answer:** Logs a `MaxListenersExceededWarning` to stderr, then logs `11`.

**Why:** The default max listeners per event is 10. Adding the 11th listener triggers the warning as a diagnostic (not an error — the listener is still added and the emitter still functions), which is why `listenerCount` correctly reports `11`.
