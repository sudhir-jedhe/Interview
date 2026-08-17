# call, apply, bind — Output-Based Questions

```js
function show() { return this.x; }
const a = { x: 1 };
const b = { x: 2 };
const boundToA = show.bind(a);
console.log(boundToA.bind(b)());
```
**Answer:** `1`

**Why:** `bind` locks `this` the moment it's called; a bound function's `this` cannot be re-bound by a subsequent `.bind()` call. `boundToA.bind(b)` returns yet another wrapper function, but the underlying `this` remains `a` because the original `show.bind(a)` already permanently fixed it.

---

```js
const obj = {
  value: 10,
  getValue: function() { return this.value; }
};
const unbound = obj.getValue;
const bound = obj.getValue.bind(obj);
console.log(unbound());
console.log(bound());
```
**Answer:** (non-strict) `undefined` then `10`

**Why:** `unbound` is called as a plain function reference — no object precedes the call, so default binding applies and `this` is the global object (or `undefined` in strict mode, which would throw instead). `bound` was explicitly bound to `obj` via `.bind(obj)`, so it always resolves `this.value` to `obj`'s `10`, regardless of how it's later called.

---

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.bind(null, 5);
const p = new BoundPoint(10);
console.log(p.x, p.y);
```
**Answer:** `5 10`

**Why:** `Point.bind(null, 5)` pre-fills the first argument (`x = 5`) and would normally lock `this` to `null` — but per spec, when a bound function is invoked with `new`, the bound `this` value is ignored, and `new` constructs a fresh object as usual. The pre-bound argument (`5`) still applies, so `x` is `5`, and the remaining argument passed to `new BoundPoint(10)` fills `y`, giving `10`.

---

```js
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
const context = { name: 'Lee' };
console.log(greet.call(context, 'Hey'));
console.log(greet.apply(context, ['Hey']));
try {
  console.log(greet.apply(context, 'Hey'));
} catch (e) {
  console.log(e.constructor.name);
}
```
**Answer:** `'Hey, Lee'`, `'Hey, Lee'`, `'TypeError'`

**Why:** `call` and `apply` produce the same result when given equivalent arguments (`call` listed individually, `apply` as an array). But `apply`'s second argument must be `null`, `undefined`, or an object (an array or array-like) — internally it calls `CreateListFromArrayLike` on that argument, which requires an object type and throws `TypeError` for a primitive string like `'Hey'`. The fix would be wrapping it in an array: `greet.apply(context, ['Hey'])`.

---

```js
const numbers = [5, 1, 9, 3];
console.log(Math.max.apply(Math, numbers));
console.log(Math.max.call(Math, numbers));
```
**Answer:** `9` then `NaN`

**Why:** `apply` correctly spreads the array `numbers` into individual arguments for `Math.max`, so it compares `5, 1, 9, 3` and returns `9`. `call` passes `numbers` as a single argument (not spread), so `Math.max` is effectively called with one argument — the array itself — which coerces to `NaN` when compared numerically, since an array of multiple numbers doesn't convert cleanly to a single number.

---

```js
function logThis() { console.log(this); }
const boundLog = logThis.bind(undefined);
boundLog();
```
**Answer:** In strict mode: `undefined`. In non-strict/sloppy mode: the global object (`window`/`globalThis`)

**Why:** `bind(undefined)` explicitly sets the bound `this` to `undefined`. In strict-mode code, that's exactly what `this` will be inside `logThis` when called. However, per spec, non-strict functions apply a fallback: if the bound `thisArg` is `null` or `undefined`, the engine substitutes the global object instead (mirroring the default-binding rule for ordinary sloppy-mode calls) — so in a plain, non-strict script, you'd actually see the global object, not `undefined`.
