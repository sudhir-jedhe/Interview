# flat / flatMap

`flat(depth = 1)` flattens nested arrays by the given depth (`Infinity` for fully flat). `flatMap` is `map` immediately followed by `flat(1)` — commonly used when a mapping callback might produce zero, one, or many results per input.

```js
[[1, [2]], [3]].flat();             // [1, [2], 3]
[[1, [2]], [3]].flat(Infinity);     // [1, 2, 3]
[1, 2, 3].flatMap((n) => [n, n * 10]); // [1, 10, 2, 20, 3, 30]
```

```js
console.log([1, [2, [3, [4]]]].flat());  // [1, 2, [3, [4]]]
console.log([1, [2, [3, [4]]]].flat(2)); // [1, 2, 3, [4]]
```

`flat()` defaults to depth `1`, flattening only one level of nesting, so the innermost `[3, [4]]` stays nested inside the second-level array. `flat(2)` flattens two levels, unwrapping one more layer and exposing `3` while leaving `[4]` (three levels deep) still wrapped.

## flatMap edge case: what gets flattened depends on what the callback returns

```js
const nested = [[1, 2], [3, 4]];
console.log(nested.flatMap((pair) => pair));   // [1, 2, 3, 4]
console.log(nested.flatMap((pair) => [pair])); // [[1, 2], [3, 4]]
```

In the first case, mapping to `pair` (already an array) and flattening one level unwraps each pair directly into the top level. In the second case, mapping to `[pair]` wraps each pair in an *extra* array, so flattening by one level only removes that extra wrapper, leaving the original pairs intact and still nested.

## Comparison table

| Aspect | `flat(depth)` | `flatMap(fn)` |
|---|---|---|
| Purpose | Flatten an already-nested array | Map then flatten one level, in one pass |
| Depth control | Any depth, including `Infinity` | Always exactly depth `1` |
| Performance | One pass over existing structure | Single pass instead of `.map().flat()` (two passes) |

Use `flat` when you already have nested data and just need to unwrap it. Use `flatMap` when your mapping function itself produces arrays (e.g., splitting one input into multiple outputs) — it's more efficient and more idiomatic than chaining `.map(...).flat()`. The common mistake is reaching for `flatMap` when you need more than one level of flattening — it can't go deeper than 1, you'd need `.map(fn).flat(depth)` instead. See `../problems/02-flatten.md` for a hand-written `flatten(arr, depth)` implementation that doesn't rely on the built-in `.flat()` at all.
