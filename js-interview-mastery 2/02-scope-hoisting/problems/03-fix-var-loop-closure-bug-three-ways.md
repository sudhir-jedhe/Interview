# Problem: Fix the Classic `for (var i...)` Loop Closure Bug Three Different Ways

## Problem Statement

Given the buggy code below, where every scheduled callback logs the same final value instead of its own loop index, fix it using three different, independently valid techniques: `let`, an IIFE, and `.bind()`.

```js
// Buggy version — logs '3', '3', '3'
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

## Requirements

- All three fixes must log `0`, `1`, `2` (in some order, since `setTimeout` ordering isn't guaranteed to be perfectly synchronous across ticks, but each fix must independently give each callback its own captured value).
- Each fix must be explained: *why* it isolates the value per iteration.
- At least one fix must not rely on `let`/block scoping at all (for environments restricted to ES5, or for interview questions that explicitly ask for a non-`let` answer).

## Approach

The root cause is always the same: `var i` is one single, function/global-scoped binding shared by every iteration, so every closure over `i` reads whichever value `i` holds by the time the closure actually runs — which is always `3`, since the loop finishes synchronously before any `setTimeout` callback fires. Each fix works by giving every iteration its own independent variable instead of one shared one.

## Solution

### Fix 1 — `let` (new binding per iteration, built into the language)

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log('let:', i);
  }, 0);
}
// let: 0
// let: 1
// let: 2
```

`let` is special-cased for `for` loops in the spec: each iteration gets a fresh binding of the loop variable, copied forward from the previous iteration's value at the start of each pass. Every closure created inside the loop body therefore closes over a distinct `i`.

### Fix 2 — IIFE (create a new function scope, and thus a new variable, per iteration)

```js
for (var i = 0; i < 3; i++) {
  (function (capturedI) {
    setTimeout(function () {
      console.log('iife:', capturedI);
    }, 0);
  })(i);
}
// iife: 0
// iife: 1
// iife: 2
```

The IIFE runs immediately on every iteration, receiving the *current* value of `i` as its own parameter `capturedI` — function parameters are a fresh binding on every call, exactly like `let`. The `setTimeout` callback closes over `capturedI` (unique per IIFE call), not the shared loop `i`.

### Fix 3 — `.bind()` (partially apply the current value as a bound argument)

```js
for (var i = 0; i < 3; i++) {
  setTimeout(
    function (n) {
      console.log('bind:', n);
    }.bind(null, i), // pre-fills the first argument with i's CURRENT value at bind time
    0
  );
}
// bind: 0
// bind: 1
// bind: 2
```

`.bind(null, i)` creates a new function with `i`'s value *at the moment `.bind()` is called* permanently baked in as the first argument — `bind` evaluates `i` immediately, copying its current value into the bound function, rather than closing over the live variable. Since `.bind()` runs fresh on every loop iteration (it's inside the loop body), each resulting bound function captures that iteration's value independently, the same way the IIFE parameter does.

**Common thread across all three fixes:** each one replaces "many closures sharing one live variable" with "each closure getting its own independent value," just via three different mechanisms — a language-level fresh binding (`let`), a fresh function-call parameter (IIFE), and a pre-applied argument value (`bind`).
