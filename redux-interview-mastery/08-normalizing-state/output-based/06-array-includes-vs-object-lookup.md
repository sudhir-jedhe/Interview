## Which of these two selectors is O(1) and which is O(n)? What logs, and why does it matter at scale?

```javascript
const state = {
  favoritePostIds: ['p1', 'p2', 'p3'], // array
  posts: {
    byId: { p1: {}, p2: {}, p3: {} },
    allIds: ['p1', 'p2', 'p3'],
  },
};

function isFavoriteArray(state, postId) {
  return state.favoritePostIds.includes(postId);
}

function isFavoriteSet(favoriteIdSet, postId) {
  return favoriteIdSet.has(postId);
}

const favoriteIdSet = new Set(state.favoritePostIds);

console.log(isFavoriteArray(state, 'p3'));
console.log(isFavoriteSet(favoriteIdSet, 'p3'));
```

**Answer:** Both log `true`. The difference is entirely about time complexity, not output.

**Why:** `Array.prototype.includes` is O(n) — it scans from the start until it finds a match (or reaches the end). `Set.prototype.has` is O(1) average case, backed by a hash table. For a handful of favorites this difference is invisible. It stops being invisible the moment you call `isFavoriteArray` inside a `.map()` over a large post list to decide whether to render a filled or outline star icon: rendering N posts, each doing an O(n) scan through the favorites array, is O(n·m) total, and it re-runs on every render unless memoized. This is the same underlying lesson as normalizing entities into a `byId` object instead of scanning an array with `.find()` — anywhere you do repeated "does X exist in this collection" checks, prefer an object (or `Set`, for ID-only membership with no associated data) over an array, and build that object/Set once (e.g., in a memoized selector) rather than reconstructing it inside a render loop.
