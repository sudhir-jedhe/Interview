**You're building a caching layer that maps arbitrary request objects (not strings) to cached responses, and needs cached entries to be automatically evicted once nothing else references the request object. Plain objects can't use object keys meaningfully — what data structure solves this, and what's the garbage-collection subtlety?**

**Approach:**
A plain object coerces any non-symbol key to a string, so distinct request objects would collide under `"[object Object]"`. `Map` correctly supports object identity as keys:

```js
const cache = new Map();
function getCached(requestObj, computeFn) {
  if (!cache.has(requestObj)) {
    cache.set(requestObj, computeFn(requestObj));
  }
  return cache.get(requestObj);
}
```
But a regular `Map` holds a **strong reference** to its keys — as long as the `Map` exists, the request objects (and their cached values) can never be garbage collected, even if nothing else in the app references them anymore, causing a memory leak. For exactly this eviction-on-no-references scenario, use `WeakMap` instead: it holds weak references to its keys, so once a request object has no other references, both the key and its cached value become eligible for garbage collection automatically. The trade-off is `WeakMap` isn't iterable and has no `.size`, since its contents can vanish at any time.
