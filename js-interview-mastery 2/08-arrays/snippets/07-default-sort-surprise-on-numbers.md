# Snippet: default sort surprise on numbers

```js
console.log([10, 1, 2].sort());               // [1, 10, 2] — lexicographic!
console.log([10, 1, 2].sort((a, b) => a - b)); // [1, 2, 10] — numeric, correct
```

Without a comparator, `sort()` stringifies elements and compares them character by character, which produces `[1, 10, 2]` instead of numeric order — always pass `(a, b) => a - b` for numeric sorting.
