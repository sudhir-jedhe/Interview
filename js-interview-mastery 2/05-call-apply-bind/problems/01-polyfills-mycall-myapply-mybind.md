# Problem: implement myCall, myApply, and myBind from scratch

This is one of the most commonly asked JavaScript interview exercises — it directly tests whether you understand `this` binding, closures, argument handling, and how `new` interacts with functions, rather than just knowing the APIs exist.

## Requirements

Implement `Function.prototype.myCall`, `Function.prototype.myApply`, and `Function.prototype.myBind` so they behave like the native versions:

- `myCall(thisArg, ...args)` — invoke the function immediately with `this` set to `thisArg` and `args` passed individually.
- `myApply(thisArg, argsArray)` — invoke the function immediately with `this` set to `thisArg` and arguments taken from `argsArray`.
- `myBind(thisArg, ...boundArgs)` — return a new function with `this` permanently fixed to `thisArg` (unless later called with `new`, in which case `new` wins) and `boundArgs` pre-filled.

## Full solution

```js
Function.prototype.myCall = function (thisArg, ...args) {
  // `this` here is the function myCall was invoked on, e.g. fn.myCall(...)
  const context = (thisArg === null || thisArg === undefined) ? globalThis : Object(thisArg);
  const fnKey = Symbol('fn');
  context[fnKey] = this;
  const result = context[fnKey](...args);
  delete context[fnKey];
  return result;
};

Function.prototype.myApply = function (thisArg, argsArray) {
  const context = (thisArg === null || thisArg === undefined) ? globalThis : Object(thisArg);
  const fnKey = Symbol('fn');
  context[fnKey] = this;
  const args = argsArray === null || argsArray === undefined ? [] : argsArray;
  if (!Array.isArray(args) && typeof args.length !== 'number') {
    throw new TypeError('CreateListFromArrayLike called on non-object');
  }
  const result = context[fnKey](...args);
  delete context[fnKey];
  return result;
};

Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const originalFn = this;
  if (typeof originalFn !== 'function') {
    throw new TypeError('Bind must be called on a function');
  }

  function boundFn(...callArgs) {
    // If invoked via `new`, `this` inside boundFn is a fresh object whose
    // prototype chain already includes boundFn.prototype (see below) —
    // `new` binding must win over the explicit thisArg in that case.
    const isNewCall = this instanceof boundFn;
    return originalFn.apply(
      isNewCall ? this : thisArg,
      [...boundArgs, ...callArgs]
    );
  }

  // Preserve the prototype chain so `new boundFn()` produces an object that
  // is still `instanceof originalFn`, and so boundFn.prototype methods (if any
  // were expected) still resolve correctly.
  if (originalFn.prototype) {
    boundFn.prototype = Object.create(originalFn.prototype);
  }

  return boundFn;
};
```

## Verifying it works

```js
// myCall
function introduce(greeting) { return `${greeting}, ${this.name}`; }
console.log(introduce.myCall({ name: 'Kai' }, 'Hi')); // 'Hi, Kai'

// myApply
console.log(introduce.myApply({ name: 'Mo' }, ['Hey'])); // 'Hey, Mo'

// myBind — basic
const bound = introduce.myBind({ name: 'Ada' });
console.log(bound('Hello')); // 'Hello, Ada'

// myBind — partial application
function add(a, b, c) { return a + b + c; }
const add5 = add.myBind(null, 5);
console.log(add5(10, 20)); // 35

// myBind — respecting `new`
function Point(x, y) { this.x = x; this.y = y; }
const BoundPoint = Point.myBind(null, 5);
const p = new BoundPoint(10);
console.log(p.x, p.y);                 // 5 10
console.log(p instanceof Point);       // true — prototype chain preserved
```

## Key implementation notes

- **`myCall`/`myApply`** use the classic "attach the function as a temporary method, then call it" trick: since `obj.method()` implicitly sets `this` to `obj`, temporarily assigning the target function onto `context` and invoking it that way is how `this` gets set without using the real `call`/`apply`. A `Symbol` key avoids clobbering any real property on `context`.
- **Boxing primitives:** if `thisArg` is a primitive (e.g. a number), `Object(thisArg)` boxes it so a property can be attached — mirroring how non-strict `this` coercion works natively.
- **`myBind` and `new`:** the returned `boundFn` checks `this instanceof boundFn` to detect a `new` call. When true, `this` is a freshly constructed object (because `new` was used on `boundFn`), so that object — not `thisArg` — must be used, and the constructor's own logic still runs via `originalFn.apply(this, ...)`. Setting `boundFn.prototype = Object.create(originalFn.prototype)` makes `instanceof` checks and any prototype methods resolve correctly on objects built through the bound constructor.
- All three are commonly asked as a set precisely because they build on each other — `myBind`'s cleanest implementation typically reuses `apply` internally.
