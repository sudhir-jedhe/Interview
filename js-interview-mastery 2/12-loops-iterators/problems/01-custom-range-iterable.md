# Problem: Implement a custom iterable `range(start, end)` object

Implement a `range(start, end)` function that returns an object implementing `Symbol.iterator`, so the result is directly usable in a `for-of` loop, with spread, and with destructuring — without using a generator function (to demonstrate you understand the raw iterator protocol underneath).

## Requirements

- `range(1, 5)` should yield `1, 2, 3, 4, 5` (inclusive on both ends) when iterated.
- Must work with `for-of`, `[...range(1, 5)]`, and `Array.from(range(1, 5))`.
- Each call to `range(...)[Symbol.iterator]()` should produce an independent iterator (so the same range object can be iterated multiple times, or iterated concurrently, without shared/corrupted state).

## Solution

```js
function range(start, end, step = 1) {
  return {
    [Symbol.iterator]() {
      let current = start;
      return {
        next() {
          if (current > end) {
            return { value: undefined, done: true };
          }
          const value = current;
          current += step;
          return { value, done: false };
        },
      };
    },
  };
}

// for-of
for (const n of range(1, 5)) {
  console.log(n); // 1 2 3 4 5
}

// spread
console.log([...range(1, 5)]); // [1, 2, 3, 4, 5]

// Array.from
console.log(Array.from(range(1, 5))); // [1, 2, 3, 4, 5]

// destructuring
const [first, second] = range(10, 20);
console.log(first, second); // 10 11

// custom step
console.log([...range(0, 10, 2)]); // [0, 2, 4, 6, 8, 10]
```

## Why it works

`range` returns a plain object whose `[Symbol.iterator]` method — the well-known-symbol hook every iterable must implement — is called automatically by `for-of`, spread, destructuring, and `Array.from` alike. Each call to that method creates and returns a **fresh** `{ next }` iterator object with its own private `current` variable captured in a closure, which is exactly why iterating the same `range(1, 5)` object twice (or via two separate `for-of` loops) works correctly and independently: nothing about the position of one iteration is shared with another, since `[Symbol.iterator]()` is invoked fresh each time a new iteration starts.

`next()` follows the protocol precisely: it returns `{ value, done: false }` while there's more to give, then permanently returns `{ value: undefined, done: true }` once exhausted — every consumer of the protocol (`for-of`'s desugared loop, spread, `Array.from`) checks exactly this `done` flag to know when to stop calling `next()` again.

## Edge cases worth testing

```js
console.log([...range(5, 1)]);   // [] — start already past end, zero iterations, no error
console.log([...range(3, 3)]);   // [3] — single-element range, inclusive on both ends

const r = range(1, 3);
console.log([...r], [...r]);     // [1,2,3] [1,2,3] — iterating the same range object twice both work independently
```
