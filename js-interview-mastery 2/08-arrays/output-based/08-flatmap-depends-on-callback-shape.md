# Output: flatMap's result depends on what the callback returns

```js
const nested = [[1, 2], [3, 4]];
console.log(nested.flatMap((pair) => pair));
console.log(nested.flatMap((pair) => [pair]));
```

**Answer:** `[1, 2, 3, 4]` then `[[1, 2], [3, 4]]`

**Why:** `flatMap` is `map` followed by `flat(1)`. In the first case, mapping to `pair` (already an array) and flattening one level unwraps each pair directly into the top level. In the second case, mapping to `[pair]` wraps each pair in an *extra* array, so flattening by one level only removes that extra wrapper, leaving the original pairs intact and still nested.
