# Output: A generator's body only runs lazily, on each `next()` call

```js
function* range() {
  console.log('start');
  yield 1;
  console.log('middle');
  yield 2;
  console.log('end');
}
const it = range();
console.log('created');
console.log(it.next().value);
console.log(it.next().value);
```

**Answer:**
```
created
start
1
middle
2
```

**Why:** Calling a generator function does **not** run any of its body — it only creates a paused iterator object (hence `"created"` logs first with no `"start"`). Code runs only up to the next `yield` each time `next()` is called: the first `next()` runs `"start"` then pauses at `yield 1`; the second `next()` resumes after that yield, runs `"middle"`, and pauses at `yield 2`.
