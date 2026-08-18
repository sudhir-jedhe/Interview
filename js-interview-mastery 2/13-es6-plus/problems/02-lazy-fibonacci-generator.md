# Problem: Lazy Infinite Sequence with Generators

**Goal:** Implement an infinite Fibonacci sequence generator, plus a generic `take(iterable, n)` helper to pull a finite number of values from any (possibly infinite) iterable.

## Implementation

```js
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

function take(iterable, n) {
  const result = [];
  const it = iterable[Symbol.iterator]();
  for (let i = 0; i < n; i++) {
    const { value, done } = it.next();
    if (done) break;
    result.push(value);
  }
  return result;
}

console.log(take(fibonacci(), 10));
// [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## Why this works without ever running out of memory or time

`fibonacci()` never terminates on its own (`while (true)`), but nothing is computed until `.next()` is explicitly called. `take` calls `.next()` exactly `n` times and then simply stops asking — the generator's execution is suspended at its current `yield`, holding just `a` and `b` in memory, not any prior history. This is the core benefit of lazy sequences: you can express "the sequence of all Fibonacci numbers" as a single generator and let each consumer decide how much of it they actually need.

## A generic lazy `map`/`filter` on top of it

Because generators are iterable, ordinary generator composition lets you build lazy pipelines without ever materializing an intermediate array:

```js
function* mapIter(iterable, fn) {
  for (const value of iterable) yield fn(value);
}
function* filterIter(iterable, predicate) {
  for (const value of iterable) if (predicate(value)) yield value;
}

const evenFibsDoubled = mapIter(
  filterIter(fibonacci(), (n) => n % 2 === 0),
  (n) => n * 2
);
console.log(take(evenFibsDoubled, 5));
// [0, 4, 16, 68, 288]
```

Each value flows through `filterIter` then `mapIter` one at a time, on demand — no intermediate array is ever built, and the pipeline works correctly even though the underlying `fibonacci()` source is infinite.
