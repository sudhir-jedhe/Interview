# Problem: implement flatten(arr, depth) without Array.prototype.flat

## Requirements

Write `flatten(arr, depth = 1)` that flattens nested arrays up to `depth` levels deep, matching the semantics of the native `.flat()`:

- `depth = 1` (the default) flattens exactly one level.
- `depth = Infinity` fully flattens, regardless of how deeply nested the input is.
- `depth = 0` returns a shallow copy with no flattening at all.
- Non-array elements at any level are left untouched.

## Full solution

```js
function flatten(arr, depth = 1) {
  if (!Array.isArray(arr)) {
    throw new TypeError("flatten expects an array");
  }

  // depth <= 0 means "don't flatten" — still return a shallow copy, matching .flat(0)
  if (depth <= 0) {
    return arr.slice();
  }

  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      // Recurse with one less depth remaining; spread the flattened sub-result
      // in, rather than pushing the whole array, to actually unwrap it.
      result.push(...flatten(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}
```

## Verifying it works

```js
console.log(flatten([1, [2, [3, [4]]]]));           // [1, 2, [3, [4]]]        — default depth 1
console.log(flatten([1, [2, [3, [4]]]], 2));         // [1, 2, 3, [4]]          — depth 2
console.log(flatten([1, [2, [3, [4]]]], Infinity));  // [1, 2, 3, 4]            — fully flat

console.log(flatten([1, [2, 3], [4, [5, 6]]], 0));   // [1, [2, 3], [4, [5, 6]]] — depth 0, unchanged
console.log(flatten([]));                            // []
console.log(flatten([1, 2, 3]));                     // [1, 2, 3] — no nesting, no-op
```

## Iterative alternative (avoids recursion depth limits on very deep input)

```js
function flattenIterative(arr, depth = 1) {
  let result = arr.slice();
  let currentDepth = 0;

  while (currentDepth < depth && result.some(Array.isArray)) {
    result = result.reduce(
      (acc, item) => acc.concat(Array.isArray(item) ? item : [item]),
      []
    );
    currentDepth++;
  }
  return result;
}

console.log(flattenIterative([1, [2, [3, [4]]]], Infinity)); // [1, 2, 3, 4]
```

The iterative version flattens one full level at a time across the *entire* array per pass, stopping early once nothing left is an array (useful when `depth` is `Infinity` but the actual nesting is shallow) or once `depth` passes have been done — trading a bit of extra bookkeeping for avoiding deep call stacks on pathologically deeply-nested input.

## Key implementation notes

- **`depth - 1` on each recursive call** is what makes depth-limiting work: at `depth = 1`, nested arrays get unwrapped once (`push(...flatten(item, 0))`, which — since `depth - 1 = 0` — just returns a shallow copy of `item` without recursing further, correctly stopping at one level.
- **Spreading (`push(...flatten(item, depth - 1))`) rather than pushing the recursive result as-is** is what actually merges the nested elements into the parent array instead of leaving them wrapped.
- `Infinity - 1` in JavaScript is still `Infinity`, so passing `Infinity` as the depth naturally recurses until there's nothing left to flatten, without needing a special-cased branch.
