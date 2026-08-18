# bind vs arrow functions vs currying

Two comparisons that are frequently confused with explicit binding.

## Explicit binding (call/apply/bind) vs arrow function lexical `this`

| Aspect | `call` / `apply` / `bind` | Arrow function |
|---|---|---|
| Can set `this` explicitly? | Yes — that's their entire purpose | No — `this` is fixed to the enclosing lexical scope at definition time |
| Effect of calling `.call()`/`.bind()` on it | Changes `this` for that invocation/permanently | No effect — the `thisArg` argument is silently ignored |
| Where each is more appropriate | Regular functions needing dynamic or explicit `this` control | Callbacks that should transparently inherit the surrounding `this` |

Use explicit binding when you need to actively control or override `this` on a function that would otherwise use one of the other binding rules (default, implicit, or `new`). Use arrow functions when you want a callback to simply "not have its own `this`" and transparently use whatever the surrounding code's `this` already is.

```js
const obj = {
  label: 'obj',
  regular: function () { return this.label; },
  arrow: () => { return this?.label; }, // lexical `this`, not `obj`
};
console.log(obj.regular.call({ label: 'override' })); // 'override' — call works
console.log(obj.arrow.call({ label: 'override' }));   // whatever the outer `this` was — unaffected
```

The common mistake is trying to `.bind()` an arrow function to change its `this` — it compiles and runs without error, but has no effect, which can be a confusing silent failure since nothing warns you.

## bind (partial application) vs currying

| Aspect | `bind` for partial application | Currying |
|---|---|---|
| Mechanism | Native `Function.prototype.bind`, pre-fills leading arguments | Manually written nested functions, each taking one argument |
| `this` handling | Explicitly sets/locks `this` as part of the same call | Typically ignores `this` entirely (usually used with pure functions) |
| Flexibility | Fixed number of pre-filled args per `bind` call | Naturally composes one argument at a time, arbitrary depth |
| Call shape | `boundFn(remainingArgs...)` — still takes the rest all at once | `curriedFn(a)(b)(c)` — one argument per call |

Use `bind` for quick, one-off partial application, especially when `this` also needs to be controlled. Use currying (or a curry utility) when building composable, chainable, `this`-independent functional pipelines.

```js
function add3(a, b, c) { return a + b + c; }

// bind-based partial application
const addBound = add3.bind(null, 1);
console.log(addBound(2, 3)); // 6 — remaining args (2, 3) supplied together

// curried version
const curriedAdd3 = (a) => (b) => (c) => a + b + c;
console.log(curriedAdd3(1)(2)(3)); // 6 — one argument per call
```

The common mistake is conflating the two: `bind`-based partial application still produces a normal function expecting the rest of the arguments at once, whereas curried functions expect arguments one at a time across separate calls.
