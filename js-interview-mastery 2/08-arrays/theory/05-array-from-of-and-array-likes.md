# Array.from / Array.of, and array-like objects

`Array.from(arrayLikeOrIterable, mapFn?)` builds a real array from anything iterable (strings, `Set`, `Map`) or array-like (has a `.length` and indexed properties, like `arguments` or a DOM `NodeList`). `Array.of(...)` builds an array from its arguments directly, sidestepping the `Array(n)` single-number-argument quirk.

```js
function sum() { return Array.from(arguments).reduce((a, b) => a + b, 0); }
sum(1, 2, 3); // 6

Array(3);     // [ <3 empty items> ] — a sparse array of length 3!
Array.of(3);  // [3] — what most people actually expect
```

```js
function collectArgs() { return Array.from(arguments); }
console.log(collectArgs(1, 2, 3)); // [1, 2, 3]

const withMap = Array.from({ length: 3 }, (_, i) => i * 2);
console.log(withMap); // [0, 2, 4]
```

`Array.from`'s optional second argument is a mapping function applied to each element during construction — equivalent to `Array.from(x).map(fn)` but done in a single pass, and notably it works even on a plain `{ length: n }` object with no actual indexed values, which is a common trick for generating a sequence of `n` computed values.

## What counts as an array-like object

An array-like object has a numeric `.length` property and indexed properties (`0`, `1`, `2`, ...) but doesn't have any `Array.prototype` methods — classic examples are the `arguments` object inside a non-arrow function, and a DOM `NodeList`/`HTMLCollection`. You convert one to a real array with `Array.from(arrayLike)` or, if it's also iterable (as `NodeList` is, but `arguments` and plain array-likes aren't guaranteed to be), the spread operator `[...arrayLike]`.

## Array(3) vs Array.of(3)

`Array(n)` invoked with a single numeric argument creates a sparse array with `length` `n` and no actual elements (holes), which behaves surprisingly with methods like `map`/`forEach` that skip holes entirely (see `06-sparse-arrays-and-sort-gotchas.md`). `Array.of(3)` treats its argument literally as an element, producing `[3]`, a one-element array — `Array.of` exists specifically to avoid `Array()`'s special-cased single-number behavior.

```js
console.log(Array(3));         // [ <3 empty items> ]
console.log(Array(3).fill(0)); // [0, 0, 0]
console.log(Array.of(3));      // [3]
```

## Checking real array vs array-like

```js
function example() {
  console.log(Array.isArray(arguments)); // false — array-like, not a real Array
  console.log(Array.isArray([1, 2, 3])); // true
}
```

Use `Array.isArray(value)` to correctly distinguish real arrays from array-like objects — `typeof` is useless here since it returns `"object"` for both real arrays and array-likes.

## concat vs spread for combining arrays

Both are non-mutating ways to combine arrays and produce broadly similar results for simple cases, but `concat` automatically flattens one level of any array arguments passed to it (`[1].concat([2,3])` → `[1,2,3]`) while treating non-array arguments as single items, whereas spread (`[...a, ...b]`) requires you to explicitly spread each array you want flattened — spread is generally preferred today for readability and consistency with object spread syntax.
