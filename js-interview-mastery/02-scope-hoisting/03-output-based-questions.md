# Scope & Hoisting — Output-Based Questions

```js
console.log(a);
var a = 1;
console.log(a);
```
**Answer:** `undefined` then `1`

**Why:** During the creation phase, `var a` is hoisted to the top of its scope and initialized to `undefined`. The assignment `a = 1` only happens when execution reaches that line, so the first log sees the hoisted-but-unassigned value.

---

```js
function test() {
  console.log(x);
  let x = 5;
}
test();
```
**Answer:** `ReferenceError: Cannot access 'x' before initialization`

**Why:** `let` declarations are hoisted to the top of their block but not initialized — they remain in the Temporal Dead Zone until the declaration line executes. Reading `x` before that line throws, rather than returning `undefined`.

---

```js
var i;
for (i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
console.log('loop done');
```
**Answer:** `'loop done'` then `3`, `3`, `3`

**Why:** The synchronous code (the `for` loop and the final `console.log`) all runs first, finishing the loop with `i` at `3`. The `setTimeout` callbacks are queued but only run after the call stack clears, by which point they all close over the same single `i`, now `3`.

---

```js
function outer() {
  console.log(typeof inner);
  function inner() {}
}
outer();
```
**Answer:** `'function'`

**Why:** Function declarations are hoisted completely — both their name and body — to the top of the enclosing scope, before any code executes. So `inner` is already a fully-defined function by the time `typeof inner` runs, regardless of where the declaration appears in the source.

---

```js
if (true) {
  function greet() { console.log('hi'); }
}
console.log(typeof greet);
```
**Answer:** `'function'` in non-strict/sloppy mode (most REPLs/Node scripts), though behavior technically varies by environment

**Why:** Function declarations inside blocks are a historically messy area of the spec. In modern engines running non-strict code, block-scoped function declarations are hoisted to the function/global scope as a legacy compatibility behavior ("Annex B"), so `greet` is visible outside the `if` block. In strict mode (`'use strict'`, or inside ES modules/classes), the function is properly block-scoped and this would log `'undefined'` instead. This inconsistency is exactly why relying on function declarations inside blocks is discouraged — use a `let`/`const` function expression instead for predictable scoping.

---

```js
let x = 'outer';
{
  console.log(x);
  let x = 'inner';
}
```
**Answer:** `ReferenceError: Cannot access 'x' before initialization`

**Why:** Even though an outer `x` exists, the inner block declares its own `x` with `let`, which shadows the outer one for the entire block — including before its own declaration line. Because the inner `x` is in the TDZ from the start of the block, referencing the identifier `x` inside the block hits the TDZ, not the outer variable.

---

```js
const arr = [];
for (var i = 0; i < 3; i++) {
  arr.push(function() { return i; });
}
console.log(arr.map(fn => fn()));
```
**Answer:** `[3, 3, 3]`

**Why:** All three functions close over the same function-scoped `i` (because `var` doesn't create a new binding per iteration). By the time any of them is called, the loop has finished and `i` is `3`.

---

```js
function scopeTest() {
  var a = 'function var';
  if (true) {
    var a = 'block var';
    console.log(a);
  }
  console.log(a);
}
scopeTest();
```
**Answer:** `'block var'` then `'block var'`

**Why:** Both `var a` declarations refer to the exact same function-scoped variable — there is no block scoping for `var`, so the second declaration simply reassigns the same binding created by the first. There's only ever one `a` in this function, and its final value after the `if` block runs is `'block var'`.
