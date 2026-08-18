# map vs forEach vs reduce

`map` transforms each element and returns a **new array** of the same length — use it when you want a parallel transformed collection. `forEach` runs a callback for its side effects and always returns `undefined` — use it when you're not building anything, just iterating (logging, pushing into an external structure, DOM updates). `reduce` folds the array down to a single accumulated value of any shape (number, object, array) — use it when the result isn't naturally "one output per input."

```js
const nums = [1, 2, 3];
console.log(nums.map((n) => n * 2));             // [2, 4, 6]
console.log(nums.forEach((n) => n * 2));         // undefined — return value is discarded
console.log(nums.reduce((acc, n) => acc + n, 0)); // 6
```

A common mistake is using `map` purely for side effects and throwing away the returned array — that works but wastes an allocation and confuses readers; `forEach` (or a plain `for...of`) signals intent better. The reverse mistake — expecting `forEach` to hand back a transformed array — is equally common and always yields `undefined`.

## reduce building something other than a number

`reduce`'s real power is that the accumulator can be any shape:

```js
const words = ["apple", "banana", "apple", "cherry"];
const counts = words.reduce((acc, word) => {
  acc[word] = (acc[word] ?? 0) + 1;
  return acc;
}, {});
console.log(counts); // { apple: 2, banana: 1, cherry: 1 }
```

## map never skips or filters — every input slot gets an output slot

```js
const arr = [1, 2, 3];
const result = arr.map((n) => {
  if (n === 2) return;
  return n * 10;
});
console.log(result); // [10, undefined, 30]
```

`map` always produces an array of the same length as the input, one output slot per input element — it does not skip or omit elements when the callback returns `undefined`. It's not a filtering operation; an explicit `return;` (or falling off the end of the function) just puts `undefined` in that slot rather than removing it. Use `filter` (possibly chained after `map`) if you actually want to remove entries.

## Comparison table

| Aspect | `map` | `forEach` | `reduce` |
|---|---|---|---|
| Return value | New array, same length | `undefined` | Any accumulated value |
| Typical use | Transform each element 1:1 | Side effects (logging, DOM updates) | Fold to a single value (sum, object, grouped data) |
| Chainable | Yes | No (returns `undefined`) | Depends on what it returns |

Use `map` when you want a same-length transformed array, `forEach` when you're just iterating for side effects and don't need a return value, and `reduce` when the desired output isn't naturally one-per-input (totals, grouping, deduplication).
