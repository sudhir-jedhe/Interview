# Interview Questions: Arrays

**Q: Which common array methods mutate the original array?**
`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, and `copyWithin` all mutate in place. Everything else commonly used (`map`, `filter`, `slice`, `concat`, `reduce`, `flat`, `flatMap`) returns a new array or value without touching the original. ES2023 added non-mutating counterparts for the mutating ones — `toSorted`, `toReversed`, `toSpliced`, and `with`.

**Q: What's the difference between `slice` and `splice`?**
`slice(start, end)` is non-mutating — it returns a shallow copy of a portion of the array without touching the original. `splice(start, deleteCount, ...items)` is mutating — it removes and/or inserts elements directly in the original array and returns the removed elements. They're easy to confuse by name; a good mnemonic is "splice changes, slice copies."

**Q: Explain the return-value difference between `map`, `forEach`, and `reduce`.**
`map` returns a new array of the same length, one transformed value per input element. `forEach` always returns `undefined` — it exists purely for side effects. `reduce` returns whatever the accumulator ends up being, which can be a number, string, object, array, or anything else, making it the general-purpose tool when the output shape doesn't match "one value per input."

**Q: Why does `[10, 1, 2].sort()` not return `[1, 2, 10]`?**
Because `sort()` without a comparator function converts every element to a string and compares them lexicographically (Unicode code point order), not numerically. `"10"` sorts before `"2"` because `"1"` is a lower code point than `"2"` at the first character. To sort numbers correctly you must pass an explicit comparator: `.sort((a, b) => a - b)`.

**Q: What's the difference between `find`/`findIndex` and `filter`?**
`find` and `findIndex` return the first matching element (or its index) and stop iterating as soon as a match is found. `filter` always iterates the entire array and returns a new array of *all* matches. Use `find` when you expect/need at most one result and want early termination for performance; use `filter` when you need every match.

**Q: What does `flatMap` do differently from `map().flat()`?**
Functionally they're equivalent for depth `1`, but `flatMap` does it in a single pass instead of two separate array allocations, so it's more efficient. It cannot flatten beyond one level though — if your mapping function nests arrays more than one level deep, you still need `.map(fn).flat(depth)`.

**Q: What's an array-like object, and how do you convert one to a real array?**
An array-like object has a numeric `.length` property and indexed properties (`0`, `1`, `2`, ...) but doesn't have any `Array.prototype` methods — classic examples are the `arguments` object inside a non-arrow function, and a DOM `NodeList`/`HTMLCollection`. You convert it to a real array with `Array.from(arrayLike)` or, if it's also iterable, the spread operator `[...arrayLike]`.

**Q: What's the difference between `Array(3)` and `Array.of(3)`?**
`Array(3)` invoked with a single numeric argument creates a sparse array with `length` 3 and no actual elements (holes), which behaves surprisingly with methods like `map`/`forEach` that skip holes entirely. `Array.of(3)` treats its argument literally as an element, producing `[3]`, a one-element array — `Array.of` exists specifically to avoid `Array()`'s special-cased single-number behavior.

**Q: What is a sparse array and how does it affect iteration?**
A sparse array has "holes" — indices with no actual stored value, as opposed to indices explicitly set to `undefined`. `.length` still accounts for holes, and a plain `for` loop or `.length` access sees them, but higher-order methods like `map`, `forEach`, `filter`, and `reduce` all skip holes without invoking the callback for them, which is a common source of "why didn't my callback run for every index" confusion.

**Q: Is `Array.prototype.sort` stable in modern JavaScript?**
Yes — as of ES2019, the spec requires `sort` to be stable, meaning elements that compare as equal retain their original relative order. This matters for multi-key sorting: you can sort by a secondary key first, then sort by the primary key, and ties on the primary key will still preserve the secondary-key ordering.

**Q: How would you check if a value is a real array versus an array-like object?**
Use `Array.isArray(value)`. It correctly returns `false` for array-like objects (like `arguments` or a `NodeList`) even though they have a `.length` and numeric indices, because they aren't actual `Array` instances — `typeof` is useless here since it returns `"object"` for both real arrays and array-likes.

**Q: What does `concat` do that spread doesn't, and vice versa?**
Both are non-mutating ways to combine arrays and produce broadly similar results for simple cases, but `concat` automatically flattens one level of any array arguments passed to it (`[1].concat([2,3])` → `[1,2,3]`) while treating non-array arguments as single items, whereas spread (`[...a, ...b]`) requires you to explicitly spread each array you want flattened — spread is generally preferred today for readability and consistency with object spread syntax.
