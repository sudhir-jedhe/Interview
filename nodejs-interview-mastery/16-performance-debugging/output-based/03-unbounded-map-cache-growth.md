# Output-Based: an unbounded `Map` cache grows without limit

```js
const cache = new Map();
function getUser(id) {
  if (!cache.has(id)) cache.set(id, { id, loadedAt: Date.now() });
  return cache.get(id);
}
for (let i = 0; i < 1_000_000; i++) getUser(i);
console.log(cache.size);
```

**Answer:** `1000000`

**Why:** Every distinct `id` creates a new, never-evicted entry — this is exactly the unbounded-cache leak pattern. In a real server handling requests with ever-changing IDs (user IDs, session tokens, request-scoped keys), this `Map` grows without bound for the lifetime of the process, eventually exhausting available memory.
