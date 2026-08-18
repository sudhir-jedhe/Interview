# Problem: Demonstrate and Fix a Circular-require() Bug

## Problem statement

Two modules, `userService.cjs` and `orderService.cjs`, each need to call functions from the other (a user service needs to look up a user's order count; an order service needs to look up the order's owning user). Written naively, this circular dependency causes one of the two modules to receive `undefined` for functions it expects to exist. Demonstrate the bug, then fix it.

## The buggy version

```js
// userService.cjs
const orderService = require('./orderService.cjs');

function getUserSummary(userId) {
  const orderCount = orderService.countOrdersForUser(userId); // may be undefined!
  return { userId, orderCount: orderCount(userId) };
}

module.exports = { getUserSummary };

// orderService.cjs
const userService = require('./userService.cjs'); // <-- circular require back to userService

function countOrdersForUser(userId) {
  return 3; // pretend DB lookup
}

function getOrderOwner(orderId) {
  return userService.getUserSummary(42); // this line is fine, ran after userService finished
}

module.exports = { countOrdersForUser, getOrderOwner };

// main.cjs
const { getUserSummary } = require('./userService.cjs');
console.log(getUserSummary(1));
```

**What actually happens:** `main.cjs` requires `userService.cjs` first. `userService.cjs` immediately requires `orderService.cjs` before it has set `module.exports = { getUserSummary }`. `orderService.cjs` then requires `userService.cjs` back — but since `userService.cjs` is mid-execution and hasn't reached its `module.exports = ...` line yet, Node returns userService's *current, still-empty* `module.exports` (`{}`) to `orderService.cjs`. So `orderService.cjs`'s `userService` variable is `{}` at the time it's captured — `userService.getUserSummary` is `undefined` inside `orderService.cjs`, even though it looks like it should exist.

In this specific example the crash shows up differently: `orderService.cjs` finishes loading and exports `{ countOrdersForUser, getOrderOwner }` successfully back to `userService.cjs`. But `orderService.countOrdersForUser(userId)` returns `3` (a number), and then the buggy code does `orderCount(userId)` — treating the number as a function — which throws `TypeError: orderCount is not a function`. This particular bug is a copy-paste artifact layered on top of the circular-require confusion, illustrating how circular requires make code harder to reason about even when the immediate crash isn't `undefined` itself.

## The fix

The general fix for circular requires is to **avoid capturing the required module's exports at require-time** when a cycle is possible — instead, require lazily (inside the function body, not at module top level) so that by the time the function actually runs, both modules have finished loading and their exports are complete:

```js
// userService.cjs (fixed)
function getUserSummary(userId) {
  const orderService = require('./orderService.cjs'); // lazy require -- runs on call, not on module load
  const orderCount = orderService.countOrdersForUser(userId);
  return { userId, orderCount };
}

module.exports = { getUserSummary };

// orderService.cjs (fixed)
function countOrdersForUser(userId) {
  return 3;
}

function getOrderOwner(orderId) {
  const userService = require('./userService.cjs'); // lazy require
  return userService.getUserSummary(42);
}

module.exports = { countOrdersForUser, getOrderOwner };
```

By the time `getUserSummary` or `getOrderOwner` is actually *called* (as opposed to when the module is first *loaded*), both `require.cache` entries are fully populated, since module loading (top-level code) has finished for both files before any application code starts calling functions. `require()` is cheap on a cache hit (just an object lookup), so moving it inside the function body has negligible performance cost and eliminates the cycle-timing bug entirely.

**Better structural fix:** where possible, extract the genuinely shared logic both services need into a third module that neither depends on the other for, removing the cycle altogether rather than working around its timing — circular dependencies are usually a sign of a missing abstraction. See `../theory/02-module-caching-and-circular-requires.md` for the underlying caching mechanism this bug depends on.
