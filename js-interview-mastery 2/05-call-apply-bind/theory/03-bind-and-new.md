# How bind interacts with new

A subtlety real `bind` handles that's easy to miss: if a bound function is later called with `new`, the explicitly bound `this` is **ignored**, and the newly constructed object is used instead. `new`-binding takes precedence over any prior explicit binding.

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}
const BoundPoint = Point.bind(null, 5);
const p = new BoundPoint(10);
console.log(p.x, p.y); // 5 10
```

`Point.bind(null, 5)` pre-fills the first argument (`x = 5`) and would normally lock `this` to `null` — but per spec, when a bound function is invoked with `new`, the bound `this` value is ignored and `new` constructs a fresh object as usual. The pre-bound argument (`5`) still applies, so `x` is `5`, and the remaining argument passed to `new BoundPoint(10)` fills `y`, giving `10`.

## Why this matters for a hand-written polyfill

A naive `myBind` implementation (see `theory/02-bind-fundamentals.md` and `problems/`) that always does `originalFn.apply(thisArg, args)` does **not** reproduce this behavior — `apply` has no way to know whether the resulting function is later invoked with `new`. A spec-accurate polyfill needs to detect the `new` case (usually by checking whether the function was invoked via `new`, e.g. with `new.target` or a prototype-chain / `instanceof` check inside the returned function) and fall back to normal constructor behavior — running the original function with a freshly-created object as `this` — instead of forcing `thisArg`. See `problems/01-polyfills-mycall-myapply-mybind.md` for a complete implementation that handles this.

## Related: what happens with a non-strict null/undefined this

```js
function logThis() { console.log(this); }
const boundLog = logThis.bind(undefined);
boundLog();
```

In strict-mode code, `this` inside `logThis` is exactly `undefined`, matching what was bound. In non-strict/sloppy-mode code, however, real `bind` applies the same fallback ordinary sloppy-mode calls use: if the bound `thisArg` is `null` or `undefined`, the engine substitutes the global object (`window`/`globalThis`) instead. So the same snippet can print `undefined` or the global object depending on whether the surrounding code is strict.
