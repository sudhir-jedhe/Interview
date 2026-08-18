# Output: A generator's `return` stops spread before later yields

```js
function* gen() {
  yield 1;
  yield 2;
  return 3;
  yield 4;
}
console.log([...gen()]);
```

**Answer:** `[ 1, 2 ]`

**Why:** Spread (and `for-of`) keeps pulling values via `next()` only while `done` is `false`. The `return 3` statement produces `{ value: 3, done: true }` — spread stops there because `done` is `true`, so the returned value `3` is discarded and `yield 4` (unreachable code after `return`) never executes.
