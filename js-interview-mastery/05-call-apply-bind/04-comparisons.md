# call, apply, bind — Comparisons

## `call` vs `apply`

| Aspect | `call` | `apply` |
|---|---|---|
| Invocation | Immediate | Immediate |
| Argument format | Comma-separated, listed individually | Single array (or array-like) |
| Syntax | `fn.call(thisArg, a, b, c)` | `fn.apply(thisArg, [a, b, c])` |
| Best when | You know the exact arguments ahead of time | Your arguments already exist as an array, or the count is dynamic |

Use `call` when writing out arguments literally is natural (a fixed, known argument list). Use `apply` when you already have an array of arguments, such as forwarding `arguments` or spreading a dynamically-built list. The common mistake is passing a non-array (or non-array-like) second argument to `apply`, which throws a `TypeError` — always wrap arguments in an array, or use the modern spread-operator equivalent (`fn(...argsArray)`) which sidesteps this entirely.

## `call`/`apply` vs `bind`

| Aspect | `call` / `apply` | `bind` |
|---|---|---|
| Invocation | Runs the function immediately | Does NOT run it — returns a new function |
| Return value | Whatever the function returns | A new, permanently-bound function reference |
| Reusability | One-time call | Reusable function you can call later, any number of times |
| Typical use | One-off invocation with a specific `this` | Fixing `this` for a callback, partial application |

Use `call`/`apply` for a single, immediate invocation with a controlled `this`. Use `bind` when you need to hand off a function reference (to `setTimeout`, an event listener, `.then()`, etc.) and want its `this` locked in ahead of time. The common mistake is calling `bind()` and expecting it to execute the function right away — it doesn't; you get back a function you still have to call.

## Explicit Binding (`call`/`apply`/`bind`) vs Arrow Function Lexical `this`

| Aspect | `call` / `apply` / `bind` | Arrow function |
|---|---|---|
| Can set `this` explicitly? | Yes — that's their entire purpose | No — `this` is fixed to the enclosing lexical scope at definition time |
| Effect of calling `.call()`/`.bind()` on it | Changes `this` for that invocation/permanently | No effect — the `thisArg` argument is silently ignored |
| Where each is more appropriate | Regular functions needing dynamic or explicit `this` control | Callbacks that should transparently inherit the surrounding `this` |

Use explicit binding when you need to actively control or override `this` on a function that would otherwise use one of the other three binding rules. Use arrow functions when you want a callback to simply "not have its own `this`" and transparently use whatever the surrounding code's `this` already is. The common mistake is trying to `.bind()` an arrow function to change its `this` — it compiles and runs without error, but has no effect, which can be a confusing silent failure.

## `bind` (Partial Application) vs Currying

| Aspect | `bind` for partial application | Currying |
|---|---|---|
| Mechanism | Native `Function.prototype.bind`, pre-fills leading arguments | Manually written nested functions, each taking one argument |
| `this` handling | Explicitly sets/locks `this` as part of the same call | Typically ignores `this` entirely (usually used with pure functions) |
| Flexibility | Fixed number of pre-filled args per `bind` call | Naturally composes one argument at a time, arbitrary depth |

Use `bind` for quick, one-off partial application, especially when `this` also needs to be controlled. Use currying (or a curry utility) when building composable, chainable, `this`-independent functional pipelines. The common mistake is conflating the two — `bind`-based partial application still produces a normal function expecting the rest of the arguments at once, whereas curried functions expect arguments one at a time across separate calls (`fn(a)(b)(c)` vs `boundFn(b, c)`).
