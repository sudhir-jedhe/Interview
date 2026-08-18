# Snippet: Demonstrating (and fixing) an unbounded-array memory leak

```js
class BoundedLog {
  constructor(max = 1000) {
    this.items = [];
    this.max = max;
  }
  push(item) {
    this.items.push(item);
    if (this.items.length > this.max) this.items.shift(); // caps growth
  }
}
const log = new BoundedLog(3);
[1, 2, 3, 4, 5].forEach((n) => log.push(n));
console.log(log.items); // [3, 4, 5] — old entries evicted, not leaked
```

**Explanation:** `BoundedLog` wraps a plain array but enforces a maximum size by evicting the oldest entry (`shift()`) whenever a push exceeds `max`. Unlike a plain array pushed to without limit, memory usage here plateaus regardless of how many total items are ever pushed over the object's lifetime — the fix for the classic "growing global array" leak pattern.
