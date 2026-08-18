# Interview Q&A: array-likes and conversions

**Q: What's an array-like object, and how do you convert one to a real array?**
An array-like object has a numeric `.length` property and indexed properties (`0`, `1`, `2`, ...) but doesn't have any `Array.prototype` methods — classic examples are the `arguments` object inside a non-arrow function, and a DOM `NodeList`/`HTMLCollection`. You convert it to a real array with `Array.from(arrayLike)` or, if it's also iterable, the spread operator `[...arrayLike]`.

**Q: What's the difference between `Array(3)` and `Array.of(3)`?**
`Array(3)` invoked with a single numeric argument creates a sparse array with `length` 3 and no actual elements (holes), which behaves surprisingly with methods like `map`/`forEach` that skip holes entirely. `Array.of(3)` treats its argument literally as an element, producing `[3]`, a one-element array — `Array.of` exists specifically to avoid `Array()`'s special-cased single-number behavior.

**Q: How would you check if a value is a real array versus an array-like object?**
Use `Array.isArray(value)`. It correctly returns `false` for array-like objects (like `arguments` or a `NodeList`) even though they have a `.length` and numeric indices, because they aren't actual `Array` instances — `typeof` is useless here since it returns `"object"` for both real arrays and array-likes.

**Q: What does `concat` do that spread doesn't, and vice versa?**
Both are non-mutating ways to combine arrays and produce broadly similar results for simple cases, but `concat` automatically flattens one level of any array arguments passed to it (`[1].concat([2,3])` → `[1,2,3]`) while treating non-array arguments as single items, whereas spread (`[...a, ...b]`) requires you to explicitly spread each array you want flattened — spread is generally preferred today for readability and consistency with object spread syntax.
