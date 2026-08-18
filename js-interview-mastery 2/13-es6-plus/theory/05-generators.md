# Generators in Depth

A generator function (`function*`) returns an **iterator** that produces values lazily, one at a time, pausing at each `yield` until the next value is pulled:

```js
function* counter() {
  yield 1;
  yield 2;
  yield 3;
}
const it = counter();
console.log(it.next()); // { value: 1, done: false }
console.log(it.next()); // { value: 2, done: false }
console.log([...counter()]); // [1, 2, 3] — generators are iterable
```

## Two-way communication with `.next(value)`

The value passed into `next(v)` becomes the result of the *previous* `yield` expression when execution resumes — not the value of the yield about to happen:

```js
function* gen() {
  const x = yield 1;
  const y = yield x + 1;
  return x + y;
}
const it = gen();
console.log(it.next());   // { value: 1, done: false }  — runs to the first yield
console.log(it.next(10)); // { value: 11, done: false } — x = 10, yields x + 1
console.log(it.next(20)); // { value: 30, done: true }  — y = 20, returns x + y
```

## `yield*` delegation

`yield*` delegates iteration to another iterable/generator, flattening it into the outer sequence:

```js
function* inner() { yield 2; yield 3; }
function* outer() {
  yield 1;
  yield* inner();
  yield 4;
}
console.log([...outer()]); // [1, 2, 3, 4]
```

`yield*` also forwards the delegate's `return` value as the result of the `yield*` expression itself, which is how generators compose without manually looping and re-yielding.

## Lazy sequences

Generators are the natural tool for **lazy sequences** — values are computed only as they're pulled, which is essential for infinite or expensive-to-compute sequences:

```js
function* naturals() {
  let n = 1;
  while (true) yield n++;
}
function take(iterable, count) {
  const result = [];
  const it = iterable[Symbol.iterator]();
  for (let i = 0; i < count; i++) {
    const { value, done } = it.next();
    if (done) break;
    result.push(value);
  }
  return result;
}
console.log(take(naturals(), 5)); // [1, 2, 3, 4, 5]
```

Because nothing is computed until `.next()` is called, an infinite generator never blocks or exhausts memory — the consumer decides how much to pull (see the loops & iterators topic for the full iterator protocol this relies on, and `problems/` in this topic for a full worked infinite-Fibonacci example).
