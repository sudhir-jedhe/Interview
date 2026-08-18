# Output: Deleting from a Set during forEach

```js
const set = new Set([1, 2, 3]);
set.forEach(v => {
  if (v === 2) set.delete(2);
  console.log(v);
});
```

**Answer:** `1 2 3`

**Why:** `Set.prototype.forEach` visits elements in insertion order and takes a live snapshot as it goes; deleting the *current* element being visited doesn't retroactively skip it (it was already being processed) and doesn't remove already-scheduled-to-be-visited elements that came after it in insertion order — `3` was already positioned after `2` and is unaffected by `2`'s removal.
