# Notes: Loops & Iterators

## The classic loops

`for` gives you explicit control over initialization, condition, and increment — best when you need the index itself:

```js
for (let i = 0; i < 3; i++) {
  console.log(i); // 0 1 2
}
```

`while` and `do-while` are condition-driven rather than counter-driven. The difference between them is when the condition is checked: `while` checks *before* the first iteration, `do-while` checks *after*, so a `do-while` body always runs at least once even if the condition is false from the start:

```js
let n = 5;
do {
  console.log(n); // 5 — runs once even though condition is already false
} while (n < 3);
```

## `for-in`: enumerates keys

`for-in` iterates over the **enumerable property keys** of an object — including keys inherited via the prototype chain. This is its most misunderstood behavior:

```js
const parent = { inherited: true };
const child = Object.create(parent);
child.own = 1;

for (const key in child) {
  console.log(key); // "own" then "inherited"
}
```

Using `for-in` on **arrays** is a well-known anti-pattern: it iterates indices as strings, includes any enumerable properties someone attached to the array (or its prototype), and gives no guarantee about numeric ordering across engines for non-standard cases. Always prefer `for-of`, `.forEach`, or a classic `for` loop for arrays. If you must use `for-in` on an object, guard with `Object.hasOwn(obj, key)` (or the older `obj.hasOwnProperty(key)`) to skip inherited keys.

## `for-of`: iterates values via the iterator protocol

`for-of` works on any **iterable** — arrays, strings, `Map`, `Set`, `NodeList`, generators — and yields *values*, not keys/indices:

```js
for (const char of 'abc') {
  console.log(char); // a b c
}
```

Plain objects (`{}`) are **not** iterable by default, so `for-of` on a plain object throws `TypeError: obj is not iterable`. This is the flip side of `for-in`'s behavior and a frequent interview trap: know which loop works on which kind of thing.

## `break`, `continue`, and labels

`break` exits the nearest enclosing loop entirely; `continue` skips to the next iteration. A **label** lets you target an outer loop from inside a nested one:

```js
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer; // skips to next i, not just next j
    console.log(i, j);
  }
}
```

## The iterable protocol

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

## Generators: iterators made easy

Writing the `next()` state machine by hand is tedious. A **generator function** (`function*`) does it for you — calling it returns an iterator, and each `yield` pauses execution and produces one value:

```js
function* range(from, to) {
  for (let i = from; i <= to; i++) {
    yield i;
  }
}

for (const n of range(1, 3)) console.log(n); // 1 2 3
```

A generator object is itself iterable (it has `Symbol.iterator` returning itself), which is why you can `for-of` over it, spread it, or destructure it directly. This makes generators the go-to tool for implementing custom iterables without hand-rolling the protocol.
