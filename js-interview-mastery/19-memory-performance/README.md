# Memory & Performance

This topic covers how JavaScript manages memory automatically via garbage collection, and the ways developers accidentally defeat that automation and cause memory leaks — forgotten timers, detached DOM nodes, accidental globals, and unbounded caches. It also covers closures as a double-edged sword: the same mechanism that makes private state possible can also silently pin large objects in memory for the lifetime of a callback. Finally, it covers practical performance techniques (memoization, avoiding allocation in hot paths) and `WeakMap`/`WeakSet`, which exist specifically to let you associate data with objects without preventing those objects from being collected.

What's covered:
- Garbage collection: reachability and mark-and-sweep, conceptually
- Common memory leak sources: timers/intervals, detached DOM nodes, accidental globals, unbounded caches/listeners
- How closures can accidentally retain large objects
- Memoization as a performance technique
- Debounce/throttle as performance techniques (cross-reference `../18-design-patterns-polyfills/`)
- Avoiding unnecessary allocation in hot paths
- `WeakMap`/`WeakSet` and why they don't prevent garbage collection of their keys

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
