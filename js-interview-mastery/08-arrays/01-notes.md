# Notes: Arrays

## Mutating vs non-mutating methods

This is the single most important distinction for avoiding array-related bugs. Mutating methods change the array in place and often return something other than the new array (frequently the removed element(s) or the new length). Non-mutating methods leave the original untouched and return a new array.

```js
const original = [3, 1, 2];

const pushResult = original.push(4);   // mutates original, returns new length
console.log(original, pushResult);     // [3,1,2,4] 4

const sorted = [...original].sort();   // copy first, then mutate the copy
console.log(original, sorted);         // [3,1,2,4] [1,2,3,4]
```

`sort()` and `reverse()` are the most commonly forgotten mutators — they look like they "produce" a new array because you usually chain or log the result, but they mutate the receiver and return a reference to that same array. Modern engines added `toSorted()`, `toReversed()`, `toSpliced()`, and `with()` (ES2023) as the non-mutating counterparts, which is now the preferred way to avoid accidental shared-state mutation.

## map vs forEach vs reduce

`map` transforms each element and returns a **new array** of the same length — use it when you want a parallel transformed collection. `forEach` runs a callback for its side effects and always returns `undefined` — use it when you're not building anything, just iterating (logging, pushing into an external structure, DOM updates). `reduce` folds the array down to a single accumulated value of any shape (number, object, array) — use it when the result isn't naturally "one output per input."

```js
const nums = [1, 2, 3];
console.log(nums.map((n) => n * 2));               // [2, 4, 6]
console.log(nums.forEach((n) => n * 2));            // undefined — return value is discarded
console.log(nums.reduce((acc, n) => acc + n, 0));   // 6
```

A common mistake is using `map` purely for side effects and throwing away the returned array — that works but wastes an allocation and confuses readers; `forEach` (or a plain `for...of`) signals intent better.

## find/findIndex/some/every

`find` returns the first matching **element** (or `undefined`); `findIndex` returns its **index** (or `-1`). `some` returns a boolean — true if at least one element passes; `every` returns true only if all elements pass. All four short-circuit, stopping as soon as the answer is determined.

```js
const users = [{ id: 1, active: false }, { id: 2, active: true }];
users.find((u) => u.active);        // { id: 2, active: true }
users.some((u) => u.active);        // true
users.every((u) => u.active);       // false
```

## flat/flatMap

`flat(depth = 1)` flattens nested arrays by the given depth (`Infinity` for fully flat). `flatMap` is `map` immediately followed by `flat(1)` — commonly used when a mapping callback might produce zero, one, or many results per input.

```js
[[1, [2]], [3]].flat();            // [1, [2], 3]
[[1, [2]], [3]].flat(Infinity);    // [1, 2, 3]
[1, 2, 3].flatMap((n) => [n, n * 10]); // [1, 10, 2, 20, 3, 30]
```

## Array.from / Array.of, and array-likes

`Array.from(arrayLikeOrIterable, mapFn?)` builds a real array from anything iterable (strings, `Set`, `Map`) or array-like (has a `.length` and indexed properties, like `arguments` or a DOM `NodeList`). `Array.of(...)` builds an array from its arguments directly, sidestepping the `Array(n)` single-number-argument quirk.

```js
function sum() { return Array.from(arguments).reduce((a, b) => a + b, 0); }
sum(1, 2, 3); // 6

Array(3);        // [ <3 empty items> ] — a sparse array of length 3!
Array.of(3);     // [3] — what most people actually expect
```

## Sparse arrays and sort gotchas

Sparse arrays have "holes" (missing indices) rather than actual `undefined` values — `map`/`forEach`/`filter` skip holes entirely, but `for` loops and `.length` still see them. `sort()` without a comparator converts elements to strings and sorts lexicographically, which infamously breaks numeric expectations: `[10, 1, 2].sort()` gives `[1, 10, 2]` because `"10" < "2"` as strings. Always pass a comparator (`(a, b) => a - b`) for numeric sorting.
