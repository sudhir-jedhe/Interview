# Problem: Manually implement what `for...of` desugars to, using the iterator protocol directly

Implement `manualForOf(iterable, callback)` that reproduces `for...of`'s behavior by hand, calling `[Symbol.iterator]()` and then `.next()` explicitly — to prove you understand exactly what the loop is doing under the hood, including `break`-equivalent early exit and proper iterator cleanup via `.return()`.

## Requirements

- `manualForOf([1, 2, 3], (v) => console.log(v))` should behave like `for (const v of [1, 2, 3]) console.log(v)`.
- Support early exit: if `callback` returns the special value `STOP`, stop iterating — equivalent to `break`.
- On early exit, call the iterator's `.return()` method if it exists, exactly like the real `for...of` does when a loop is broken out of early (this matters for iterables that hold resources, like a generator with a `finally` block, or a file-reading iterator that needs to close a handle).

## Solution

```js
const STOP = Symbol('stop');

function manualForOf(iterable, callback) {
  const iterator = iterable[Symbol.iterator](); // step 1: get the iterator

  while (true) {
    const { value, done } = iterator.next();      // step 2: pull the next value
    if (done) break;                                // step 3: stop when done is true

    const result = callback(value);
    if (result === STOP) {
      // step 4: "break" equivalent — must call .return() for cleanup, if the
      // iterator supports it, exactly like the real for...of spec requires
      if (typeof iterator.return === 'function') {
        iterator.return();
      }
      break;
    }
  }
}

// Basic behavior, matches for-of
manualForOf([1, 2, 3], (v) => console.log(v));
// 1 2 3

// Early exit (the STOP sentinel plays the role of `break`)
manualForOf([1, 2, 3, 4, 5], (v) => {
  console.log(v);
  if (v === 3) return STOP;
});
// 1 2 3   (4 and 5 never visited)

// Proving .return() is called on early exit, using a generator with `finally`
function* withCleanup() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } finally {
    console.log('cleanup ran');
  }
}
manualForOf(withCleanup(), (v) => {
  console.log(v);
  if (v === 2) return STOP;
});
// 1
// 2
// cleanup ran    <- proves .return() was actually invoked, running the generator's finally block
```

## Why it works

This is a direct, literal implementation of what the spec says `for...of` does internally: call `[Symbol.iterator]()` once to get an iterator, then repeatedly call `.next()`, using the returned `done` flag to know when to stop — exactly the loop shape every consumer of the iterator protocol (spread, destructuring, `Array.from`) shares, just with different things done with each `value`.

The `.return()` call on early exit is the detail most hand-rolled "fake for-of" implementations miss, and it's the actual reason real `for...of` supports resource cleanup: when you `break` out of a real `for...of` loop early, the engine automatically calls `.return()` on the iterator if the method exists, which is precisely why a generator's `finally` block runs even if you only consume part of it before breaking. The `if (typeof iterator.return === 'function')` guard mirrors the spec's own conditional check, since not every iterator implements `.return()` (a plain array's default iterator doesn't need it, since there's no external resource to release, though it does happen to have one) — calling it unconditionally without the guard would throw on iterators that never defined it.

## Edge cases worth testing

```js
manualForOf([], (v) => console.log(v)); // logs nothing — empty iterable, done is true immediately

manualForOf('ab', (v) => console.log(v)); // a b — works on any iterable, not just arrays

// Callback that never returns STOP behaves like an un-broken for-of, running to completion
manualForOf([1, 2, 3], (v) => console.log(v * 10)); // 10 20 30
```
