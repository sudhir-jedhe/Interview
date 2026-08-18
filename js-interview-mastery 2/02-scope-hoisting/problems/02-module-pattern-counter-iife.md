# Problem: Module-Pattern Counter Using an IIFE

## Problem Statement

Implement a counter module using the classic module pattern: an Immediately Invoked Function Expression (IIFE) that creates a private scope, holds a `count` variable that cannot be accessed or mutated directly from outside, and returns a small public API (`increment`, `decrement`, `reset`, `getCount`).

## Requirements

- `count` must not be reachable from outside the module in any way (no `counter.count`, no `counter._count`, nothing).
- `increment()`/`decrement()` mutate the private `count` and return the new value.
- `reset()` sets `count` back to its original starting value.
- `getCount()` returns the current value without mutating it.
- Explain *why* the scope chain is what keeps `count` private — not just that it "works."

## Approach

Wrap the module body in `(function() { ... })()` so it runs once, immediately, and produces a single object. The returned object's methods are defined *inside* that IIFE's function scope, so each of them forms a closure over the IIFE's local variables — including `count`. Nothing outside the IIFE has a scope-chain path to `count`; the only way to affect it is through the methods the module chooses to expose.

## Solution

```js
const counterModule = (function (startingValue) {
  // `count` and `initial` live only in this IIFE's function scope.
  // The scope chain of anything defined OUTSIDE this IIFE has no link to it —
  // there is no lexical path from the global scope down into this function's
  // local variables, since scope in JS only flows outward (inner sees outer,
  // never the reverse). That's the entire mechanism keeping `count` private.
  let count = startingValue;
  const initial = startingValue;

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    reset() {
      count = initial;
      return count;
    },
    getCount() {
      return count;
    },
  };
})(0); // IIFE runs immediately with startingValue = 0

module.exports = { counterModule };

// --- verification ---
console.log(counterModule.getCount()); // 0
console.log(counterModule.increment()); // 1
console.log(counterModule.increment()); // 2
console.log(counterModule.decrement()); // 1
console.log(counterModule.reset());     // 0
console.log(counterModule.count);       // undefined — no such property was ever exposed
```

**Why this works — the scope chain explanation:** each of `increment`, `decrement`, `reset`, and `getCount` is a function *literally written inside* the IIFE's body, so when the JS engine resolves `count` inside any of them, it walks the scope chain: method's own scope (empty) → IIFE's scope (finds `count`) → done. Code outside the IIFE has a completely different scope chain — global scope → (nothing else) — that never passes through the IIFE's local scope, because scope chains are built from where code is *written*, not from any runtime relationship between objects. The returned object is just a plain object with function properties; the privacy isn't an object feature at all, it's purely a byproduct of lexical scoping. This is the same mechanism that powers closures generally (see the dedicated closures topic), applied specifically via an IIFE to run the "factory" exactly once.
