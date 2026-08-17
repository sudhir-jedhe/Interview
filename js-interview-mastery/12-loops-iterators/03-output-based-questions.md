# Output-Based Questions: Loops & Iterators

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
**Answer:** `3 3 3`
**Why:** `var` is function-scoped, not block-scoped, so all three `setTimeout` callbacks close over the *same* `i` variable. By the time any callback runs (after the synchronous loop finishes), `i` has already reached `3`. This is the textbook reason `let` is preferred in loops.

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
**Answer:** `0 1 2`
**Why:** `let` is block-scoped, and critically, the `for` loop creates a **new binding of `i` for each iteration**. Each callback closes over its own separate `i`, so the captured values are `0`, `1`, `2` respectively.

```js
const obj = { a: 1, b: 2 };
for (const key of obj) {
  console.log(key);
}
```
**Answer:** `TypeError: obj is not iterable`
**Why:** Plain objects do not implement `Symbol.iterator` by default, so `for-of` cannot be used on them directly — only `for-in` (or `Object.keys/values/entries` combined with a different loop) works on plain objects. Reaching for `for-of` on `{}` is one of the most common beginner mistakes.

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

```js
let result = '';
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 2) break outer;
    result += `${i}${j} `;
  }
}
console.log(result);
```
**Answer:** `00 01 `
**Why:** `break outer` (labeled break) exits the outer loop entirely, not just the inner one. On `i=0, j=0` and `i=0, j=1` the condition is false and the string accumulates; the moment `j` reaches `2` (still with `i=0`), the labeled break terminates both loops immediately, so `i` never reaches `1`.

```js
const arr = [10, 20, 30];
arr.extra = 'bonus';
for (const val of arr) {
  console.log(val);
}
```
**Answer:** `10 20 30`
**Why:** `for-of` on an array uses the array's iterator, which only walks numeric indices `0` through `length - 1` — it completely ignores any extra non-index properties attached to the array object, unlike `for-in`, which would have also logged `"extra"`.

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

```js
const set = new Set([1, 2, 3]);
set.forEach(v => {
  if (v === 2) set.delete(2);
  console.log(v);
});
```
**Answer:** `1 2 3`
**Why:** `Set.prototype.forEach` visits elements in insertion order and takes a live snapshot as it goes; deleting the *current* element being visited doesn't retroactively skip it (it was already being processed) and doesn't remove already-scheduled-to-be-visited elements that came after it in insertion order — `3` was already positioned after `2` and is unaffected by `2`'s removal.
