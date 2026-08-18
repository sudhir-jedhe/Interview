# Problem: Implement a generator `take(iterable, n)` that lazily yields the first n items

Implement `take(iterable, n)` as a generator function that yields only the first `n` items of any iterable — critically, one that must work correctly on infinite iterables without ever trying to materialize the whole sequence first.

## Requirements

- `[...take([1, 2, 3, 4, 5], 3)]` → `[1, 2, 3]`
- Must work on an infinite generator (e.g. natural numbers) without hanging.
- If the source iterable has fewer than `n` items, `take` should just yield whatever is available and stop (no error, no padding).
- Should not pull more values from the source than strictly necessary (laziness matters, not just correctness).

## Solution

```js
function* take(iterable, n) {
  if (n <= 0) return;
  let count = 0;
  for (const value of iterable) {
    yield value;
    count++;
    if (count >= n) return;
  }
}

// Finite source, n within bounds
console.log([...take([1, 2, 3, 4, 5], 3)]); // [1, 2, 3]

// Finite source, n exceeds available items
console.log([...take([1, 2], 5)]); // [1, 2] — no error, no padding

// Infinite source — this is the real test
function* naturals() {
  let i = 1;
  while (true) yield i++;
}
console.log([...take(naturals(), 5)]); // [1, 2, 3, 4, 5]

// Proving laziness: the source is never asked for more than n values
function* loggingSource() {
  let i = 1;
  while (true) {
    console.log(`producing ${i}`);
    yield i++;
  }
}
console.log([...take(loggingSource(), 3)]);
// producing 1
// producing 2
// producing 3
// [1, 2, 3]     <- "producing 4" is NEVER logged
```

## Why it works

`take` is itself a generator, so calling `take(iterable, n)` doesn't run any code immediately — it returns a paused generator object, exactly like any other `function*`. The `for...of` loop inside pulls one value at a time from the *source* iterable by calling its `next()` internally; each pulled value is immediately `yield`ed back out to whoever is consuming `take`'s own iterator (e.g. the spread operator). The moment `count` reaches `n`, an explicit `return` inside the generator both stops the `for...of` loop over the source **and** marks `take`'s own iterator as `done: true` — critically, `return` here means the source iterable is never asked for a value beyond the `n`th one, which is what makes this safe on an infinite generator.

This is the same mechanism `Array.prototype.slice` cannot offer for a lazy sequence: `[...infiniteIterable].slice(0, n)` would first try to fully spread the infinite iterable into an array (hanging forever), whereas `take`'s generator-based, pull-based approach only ever computes exactly as many values as are actually consumed.

## Edge cases worth testing

```js
console.log([...take([1, 2, 3], 0)]);  // [] — n = 0 yields nothing, source untouched
console.log([...take([1, 2, 3], -1)]); // [] — negative n treated the same as 0, no error
console.log([...take("hello", 3)]);    // ['h', 'e', 'l'] — works on any iterable, not just arrays/generators
```
