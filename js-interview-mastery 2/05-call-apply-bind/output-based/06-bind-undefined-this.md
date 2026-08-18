# Output: binding this to undefined

```js
function logThis() { console.log(this); }
const boundLog = logThis.bind(undefined);
boundLog();
```

**Answer:** In strict mode: `undefined`. In non-strict/sloppy mode: the global object (`window`/`globalThis`).

**Why:** `bind(undefined)` explicitly sets the bound `this` to `undefined`. In strict-mode code, that's exactly what `this` will be inside `logThis` when called. However, per spec, non-strict functions apply a fallback: if the bound `thisArg` is `null` or `undefined`, the engine substitutes the global object instead (mirroring the default-binding rule for ordinary sloppy-mode calls) — so in a plain, non-strict script, you'd actually see the global object, not `undefined`.
