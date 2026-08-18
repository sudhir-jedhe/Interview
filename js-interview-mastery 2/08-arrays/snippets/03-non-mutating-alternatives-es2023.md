# Snippet: non-mutating alternatives (ES2023)

```js
const original = [3, 1, 2];
const sortedCopy = original.toSorted();
console.log(original);   // [3, 1, 2] — untouched
console.log(sortedCopy); // [1, 2, 3]
```

`toSorted()` returns a new sorted array without touching `original` at all — the modern, immutability-friendly counterpart to `sort()`.
