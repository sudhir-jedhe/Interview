# Generators: Iterators Made Easy

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

## Hand-written iterator vs. generator function

| Aspect | Manual `Symbol.iterator` object | Generator function (`function*`) |
|---|---|---|
| Boilerplate | Must manually track state and return `{ value, done }` | State is implicit; `yield` handles pausing/resuming |
| Readability | Verbose for anything non-trivial | Reads like a normal loop/function |
| Two-way communication | Not built in | `next(value)` can pass values back into the generator |
| When to use | Rarely, for very specific low-level control | Default choice for building custom iterables |

For almost all real-world custom iterables, prefer a generator — it's far less error-prone than hand-tracking `done`/`value` state. The manual approach is worth knowing for interviews (to demonstrate you understand the protocol underneath) but is rarely the pragmatic production choice.
