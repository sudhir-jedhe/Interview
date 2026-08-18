# Problem: implement myMap, myFilter, and myReduce from scratch

This trio is one of the most commonly asked JavaScript interview exercises — it tests whether you understand callback signatures (`element, index, array`), how sparse arrays should be handled, and `reduce`'s trickiest edge case: an accumulator-less call.

## Requirements

Implement `Array.prototype.myMap`, `Array.prototype.myFilter`, and `Array.prototype.myReduce` so they behave like the native versions, including:

- Calling the callback with `(element, index, array)`, and optionally accepting a `thisArg` for `myMap`/`myFilter`.
- Skipping holes in sparse arrays, matching native behavior.
- `myReduce` supporting both the "with initial value" and "without initial value" call signatures, throwing on an empty array with no initial value (matching native `TypeError: Reduce of empty array with no initial value`).

## Full solution

```js
Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }
  const result = new Array(this.length); // preserves sparse-array length/shape
  for (let i = 0; i < this.length; i++) {
    if (!(i in this)) continue; // skip holes, matching native map's behavior
    result[i] = callback.call(thisArg, this[i], i, this);
  }
  return result;
};

Array.prototype.myFilter = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (!(i in this)) continue; // skip holes
    if (callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

Array.prototype.myReduce = function (callback, ...initialValueArg) {
  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }

  const hasInitialValue = initialValueArg.length > 0;
  let accumulator = hasInitialValue ? initialValueArg[0] : undefined;
  let startIndex = 0;
  let foundStart = hasInitialValue;

  if (!hasInitialValue) {
    // Find the first non-hole element to seed the accumulator, per spec.
    for (let i = 0; i < this.length; i++) {
      if (i in this) {
        accumulator = this[i];
        startIndex = i + 1;
        foundStart = true;
        break;
      }
    }
    if (!foundStart) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
  }

  for (let i = startIndex; i < this.length; i++) {
    if (!(i in this)) continue; // skip holes
    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};
```

## Verifying it works

```js
console.log([1, 2, 3].myMap((n) => n * 2));               // [2, 4, 6]
console.log([1, 2, 3, 4].myFilter((n) => n % 2 === 0));    // [2, 4]
console.log([1, 2, 3].myReduce((acc, n) => acc + n, 0));   // 6
console.log([1, 2, 3].myReduce((acc, n) => acc + n));      // 6 — no initial value, seeds from first element

try {
  [].myReduce((acc, n) => acc + n); // no initial value AND empty array
} catch (e) {
  console.log(e.message); // "Reduce of empty array with no initial value"
}

// Sparse array handling
const sparse = [1, , 3];
console.log(sparse.myMap((n) => n * 10)); // [10, <1 empty item>, 30]

// thisArg support
const context = { multiplier: 10 };
console.log([1, 2, 3].myMap(function (n) { return n * this.multiplier; }, context)); // [10, 20, 30]
```

## Key implementation notes

- **Hole skipping** uses `i in this` rather than checking `this[i] !== undefined`, since a hole and a stored `undefined` are different things (see the sparse-arrays theory file) — `in` correctly distinguishes them.
- **`myReduce`'s no-initial-value case** is the trickiest part: the spec says to use the first element as the initial accumulator and start iterating from the second, but "first element" means the first *non-hole* element, and if the array has no elements at all (or is entirely holes), it must throw rather than silently returning `undefined`.
- **`new Array(this.length)`** in `myMap` preserves the output array's length and sparse shape even before any assignment happens, matching how native `map` produces a same-length (possibly still-sparse) result.
- All three are commonly asked as a set because `filter` and `reduce` can technically be implemented in terms of a manual loop that mirrors `map`'s structure — interviewers use this to see whether you handle the edge cases consistently across all three, not just get the happy path right once.
