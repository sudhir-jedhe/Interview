# The Iterable Protocol

An object is **iterable** if it implements a method at the well-known symbol `Symbol.iterator`, which must return an **iterator** — an object with a `next()` method that returns `{ value, done }` pairs:

```js
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};

console.log([...range]); // [1, 2, 3]
for (const n of range) console.log(n); // 1 2 3
```

Anything that implements this protocol automatically works with `for-of`, spread (`...`), destructuring, and `Array.from`.

An **iterable** is an object with a `[Symbol.iterator]()` method that *produces* an iterator when called. An **iterator** is the object actually returned — it has a `next()` method that you call repeatedly to walk through values. Arrays are iterable (calling `arr[Symbol.iterator]()` gives you a fresh iterator), but the iterator itself is a separate, stateful object tracking position — this distinction matters because a single iterable can produce multiple independent iterators, each with their own progress through the sequence.
