# Problem: Implement a `bindContext` Polyfill (Rebuild `Function.prototype.bind`)

## Problem Statement

Reimplement `Function.prototype.bind` from scratch as `Function.prototype.myBind`, focused specifically on correct `this` resolution: the returned function must always invoke the original with the bound `this`, regardless of how the *returned* function is later called (as a plain call, as a method, via `call`/`apply`, or even via `new`).

This is deliberately narrower in scope than a full call/apply/bind polyfill suite (see the dedicated call/apply/bind topic for `myCall`/`myApply`) — the focus here is purely on getting the four `this`-binding rules to compose correctly through a bound function.

## Requirements

- `fn.myBind(thisArg, ...boundArgs)` returns a new function.
- Calling the returned function invokes `fn` with `this` set to `thisArg`, regardless of how the returned function itself is called (plain call, method call, or with its own `call`/`apply`/`bind`) — bound `this` always wins except for one case below.
- Additional arguments passed at bind time (`boundArgs`) are prepended to any arguments passed at call time (partial application).
- If the bound function is called with `new`, `new` binding must take priority over the bound `this` — the newly constructed object becomes `this` instead, matching real `bind()` behavior (a bound function used as a constructor still constructs a new instance of the original function, not an instance bound to `thisArg`).

## Approach

Store `fn`, `thisArg`, and `boundArgs` in the closure of the returned function. Inside that returned function, detect whether it's being invoked as a constructor (`this instanceof boundFn`, checked *before* deciding which `this` to use) — if so, ignore the bound `thisArg` and let `this` be the new object `new` already created, but still run the original `fn`'s logic against it. Otherwise, call `fn` via `.apply(thisArg, boundArgs.concat(callArgs))`.

## Solution

```js
Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const originalFn = this; // the function myBind was called on, e.g. fn.myBind(...)

  if (typeof originalFn !== 'function') {
    throw new TypeError('myBind must be called on a function');
  }

  function boundFn(...callArgs) {
    // If `boundFn` is invoked with `new`, `this` inside here is the freshly
    // created object `new` set up (because `new boundFn()` triggers boundFn's
    // own [[Construct]] behavior on this inner function) — `new` binding must
    // win over the bound thisArg in that case, matching real bind() semantics.
    const isNewCall = this instanceof boundFn;
    const effectiveThis = isNewCall ? this : thisArg;

    return originalFn.apply(effectiveThis, [...boundArgs, ...callArgs]);
  }

  // Preserve the prototype chain so `new boundFn()` produces an object that is
  // still `instanceof originalFn`, and so `instanceof boundFn` works above.
  if (originalFn.prototype) {
    boundFn.prototype = Object.create(originalFn.prototype);
  }

  return boundFn;
};

// --- verification ---

// 1. Basic explicit binding, unaffected by how the bound function is later called.
function whoAmI() { return this.name; }
const person = { name: 'Grace' };
const boundWhoAmI = whoAmI.myBind(person);
console.log(boundWhoAmI());                 // 'Grace' — plain call, bound this wins
console.log(boundWhoAmI.call({ name: 'X' })); // 'Grace' — .call() cannot override a bound this

// 2. Partial application via boundArgs.
function add(a, b, c) { return a + b + c; }
const add10 = add.myBind(null, 10);
console.log(add10(5, 2)); // 17 — 10 (bound) + 5 + 2 (call-time)

// 3. `new` binding overrides the bound thisArg.
function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.myBind({ ignored: true }, 1); // bound thisArg should be ignored under `new`
const p = new BoundPoint(2);
console.log(p.x, p.y);                // 1 2 — bound arg (x=1) + call-time arg (y=2)
console.log(p instanceof Point);      // true — prototype chain preserved
console.log(p instanceof BoundPoint); // true
```

**Why this works:** the `this instanceof boundFn` check inside `boundFn` is the crux of the whole polyfill — when `new boundFn(...)` runs, the engine internally creates a new object whose prototype is `boundFn.prototype` and calls `boundFn` with `this` set to that object, which makes `this instanceof boundFn` true precisely in the `new`-call case, letting us detect it and fall back to the real `this` instead of the bound one. Copying `originalFn.prototype` onto `boundFn.prototype` via `Object.create` (rather than direct assignment) avoids the bound function and the original function sharing the exact same prototype object, matching the real spec's behavior and keeping `instanceof` checks against the *original* constructor correct too.
