# Snippet: Demonstrating event-loop blocking vs an async alternative

```js
const start = Date.now();
setTimeout(() => console.log('timer fired after', Date.now() - start, 'ms'), 0);

// synchronous busy-loop delays the timer above from firing on schedule
let x = 0;
for (let i = 0; i < 2e9; i++) x += i;
console.log('busy loop finished after', Date.now() - start, 'ms');
```

**Explanation:** Even though the `setTimeout` requests a 0ms delay, its callback can't run until the current synchronous call stack finishes — the busy loop occupies that stack for several seconds, so `'timer fired after ...'` logs only after `'busy loop finished after ...'`, and the reported delay is far larger than the requested 0ms. This demonstrates why "0ms" timers are never actually immediate; they're scheduled, not preemptive.
