# Sparse arrays and sort gotchas

## Sparse arrays

Sparse arrays have "holes" (missing indices) rather than actual `undefined` values — `map`/`forEach`/`filter` skip holes entirely, but `for` loops and `.length` still see them.

```js
const arr = [1, , 3]; // note the elided middle element — a real hole, not a stored undefined
console.log(arr.length);                              // 3
console.log(arr.map((n) => n * 2));                   // [2, <1 empty item>, 6]
arr.forEach((n) => console.log("visited", n));        // only "visited 1" and "visited 3" — the hole is never visited
```

`.length` counts holes (it's `3`). But iteration methods like `map` and `forEach` explicitly skip holes — `map` preserves the hole in its output rather than computing a value for it, and `forEach`'s callback is simply never invoked for that index. This is a common source of "why didn't my callback run for every index" confusion.

## Default sort() is lexicographic, not numeric

`sort()` without a comparator converts elements to strings and sorts lexicographically, which infamously breaks numeric expectations:

```js
console.log([10, 1, 21, 2].sort());              // [1, 10, 2, 21] — lexicographic!
console.log([10, 1, 21, 2].sort((a, b) => a - b)); // [1, 2, 10, 21] — numeric, correct
```

`"1" < "10" < "2" < "21"` because `"1"` is a prefix of `"10"` (shorter strings with matching prefixes sort first), and `"2"` comes after `"1..."` strings but before `"21"`. Always pass a comparator (`(a, b) => a - b`) for numeric sorting.

## sort() is guaranteed stable

As of ES2019, the spec requires `sort` to be stable, meaning elements that compare as equal retain their original relative order. This matters for multi-key sorting: you can sort by a secondary key first, then sort by the primary key, and ties on the primary key will still preserve the secondary-key ordering.

## Array(n) vs Array.of and holes together

```js
console.log(Array(3));          // [ <3 empty items> ] — sparse, no real values
console.log(Array(3).fill(0));  // [0, 0, 0] — fill() writes a real value into every hole
console.log(Array.of(3));       // [3] — a single-element array containing the number 3
```

`Array(n)` with a single numeric argument produces holes, not `undefined` values — `.fill()` is the standard fix when you need `n` real, iterable values (e.g., before `.map()`-ing over a fresh sequence).
