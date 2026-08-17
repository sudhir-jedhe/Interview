# Functions & `this` — Scenario Questions

### 1. You have a class-based React-style component (or any class with methods) where you pass `this.handleClick` as a callback to an event listener, and inside the method `this` is `undefined`. How do you fix it, and what are three different valid approaches?

**Approach:** The problem is that passing `this.handleClick` as a bare function reference detaches it from `this` — by the time the event fires and calls it, there's no implicit binding, so `this` defaults to `undefined` (strict mode, which class bodies always use).

```js
class Toggle {
  constructor() {
    this.on = false;
    // Fix 1: bind in the constructor
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.on = !this.on;
    console.log(this.on);
  }
}
const t = new Toggle();
button.addEventListener('click', t.handleClick); // works — bound in constructor
```

**Fix 2 — class field arrow function** (auto-binds per instance, no constructor code needed):

```js
class Toggle2 {
  on = false;
  handleClick = () => {
    this.on = !this.on;
    console.log(this.on);
  };
}
```

**Fix 3 — wrap in an arrow function at the call site** (no change to the class needed, but re-binds on every render/registration, which matters in frameworks that re-run render functions):

```js
button.addEventListener('click', () => t.handleClick());
```

Tradeoffs: constructor `.bind()` and class fields both create a new function per instance (memory cost scales with instance count, but that's usually negligible); the call-site arrow wrapper is convenient but, in UI frameworks, creates a new function identity on every render, which can defeat referential-equality optimizations (e.g. `React.memo`). For most real code, class field arrow functions are the cleanest default.

---

### 2. You're writing a small utility that needs to work with both array-like objects (like `arguments` or a DOM `NodeList`) and needs a consistent way to control what `this` refers to when calling a callback the caller supplies (mimicking `Array.prototype.forEach`'s `thisArg` parameter). How would you design it?

**Approach:** Accept an optional `thisArg` and use `call` to explicitly set `this` for each invocation of the callback, exactly like the built-in array methods do:

```js
function myForEach(arrayLike, callback, thisArg) {
  for (let i = 0; i < arrayLike.length; i++) {
    callback.call(thisArg, arrayLike[i], i, arrayLike);
  }
}

const logger = {
  prefix: '[LOG]',
  print(item) {
    console.log(this.prefix, item);
  }
};

myForEach(['a', 'b', 'c'], logger.print, logger);
// '[LOG] a', '[LOG] b', '[LOG] c' — this.prefix resolves correctly because we used call()
```

This mirrors how `Array.prototype.forEach(callback, thisArg)` actually works internally. The key design decision is using `callback.call(thisArg, ...)` rather than just `callback(...)`, since a bare call would default-bind `this`, breaking any object-method callback the caller passes in. This also composes correctly with arrow function callbacks — since arrow functions ignore `thisArg` entirely (they already have lexical `this`), passing `thisArg` alongside an arrow callback simply has no effect, which matches the native array method behavior exactly.

---

### 3. A junior engineer converts an object literal's methods from `function` to arrow functions across the codebase "for consistency," and now several object methods silently break (`this.someProperty` becomes `undefined`). How do you explain the root cause and set a team guideline?

**Approach:** Arrow functions have no `this` of their own — they capture whatever `this` was in scope at the point the arrow function was *defined*, not where it's called. For an object literal's method, that enclosing scope is usually the module or file's top level, not the object itself.

```js
// Broken:
const api = {
  baseUrl: 'https://api.example.com',
  getUrl: (path) => `${this.baseUrl}${path}`, // `this` here is NOT `api`
};
console.log(api.getUrl('/users')); // 'undefined/users'

// Correct:
const api2 = {
  baseUrl: 'https://api.example.com',
  getUrl(path) { return `${this.baseUrl}${path}`; }, // shorthand method syntax, proper `this`
};
console.log(api2.getUrl('/users')); // 'https://api.example.com/users'
```

Team guideline: use regular functions (or ES6 method shorthand) for any object or class method that needs to reference `this` as the object/instance itself. Reserve arrow functions for (a) callbacks nested inside a method where you deliberately want to inherit the outer `this`, and (b) standalone functions/utilities that don't use `this` at all. "Arrow functions everywhere" is not a safe blanket rule — it's specifically wrong for object/class methods.

---

### 4. You need to write a `once(fn)` utility that ensures a given function only ever executes a single time, no matter how many times it's called afterward, and that it correctly preserves whatever `this` and arguments it's called with on that first (and only) real invocation. How would you implement it, and what edge cases matter?

**Approach:**

```js
function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args); // preserve caller's `this` and all arguments
    }
    return result;
  };
}

const initialize = once(function(config) {
  console.log('initializing with', config, 'this:', this?.name);
  return 'done';
});

const app = { name: 'MyApp' };
console.log(initialize.call(app, { debug: true })); // logs once, returns 'done'
console.log(initialize.call(app, { debug: false })); // no log, still returns 'done' from cache
```

This must be a regular function expression, not an arrow function, for the returned wrapper — an arrow function can't receive a dynamic `this` via `call`/`apply`, so it couldn't correctly forward the caller's context. Edge cases: (1) the return value of the *first* call must be cached and returned on subsequent calls, not `undefined`, since callers may rely on the result; (2) if `fn` throws on its first invocation, decide deliberately whether "called" should still become `true` (typically yes, to avoid retry storms) or whether you want a "retry until success" variant instead — that's a different utility; (3) `apply(this, args)` (not `call`) is used because `args` is already an array from the rest parameter, and `apply` accepts arguments as an array directly.
