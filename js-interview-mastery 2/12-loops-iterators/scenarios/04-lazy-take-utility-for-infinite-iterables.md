# Scenario: A lazy `take(iterable, n)` utility for possibly-infinite iterables

You want to build a lazy `take(iterable, n)` utility that returns the first `n` values from any iterable (array, Set, generator, even an infinite generator) without consuming more than necessary. How would generators make this trivial, and why would a naive array-based approach fail on infinite sequences?

**Approach:**
```js
function* take(iterable, n) {
  let count = 0;
  for (const value of iterable) {
    if (count >= n) return;
    yield value;
    count++;
  }
}

function* naturals() {
  let i = 1;
  while (true) yield i++;
}

console.log([...take(naturals(), 5)]);
// [ 1, 2, 3, 4, 5 ]
```
A naive approach like `[...iterable].slice(0, n)` would fail catastrophically on `naturals()` because the spread operator tries to fully exhaust the iterable *before* slicing — since `naturals()` never terminates, this would hang forever (or crash with an out-of-memory error). The generator-based `take` avoids this by pulling values one at a time via `for-of`'s internal `next()` calls and explicitly `return`ing (which signals the outer generator to also stop) as soon as `n` values have been yielded — nothing beyond the `n`th value of the source iterable is ever computed.
