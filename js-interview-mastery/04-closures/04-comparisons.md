# Closures — Comparisons

## Closures via `var` vs `let` in Loops

| Aspect | `var` in a loop | `let` in a loop |
|---|---|---|
| Binding per iteration | One shared binding across the whole loop | A fresh binding created for each iteration |
| Closures capture | The same final value for every callback | Each callback's own snapshot of that iteration's value |
| Fix needed for per-iteration capture? | Yes — requires an IIFE or explicit extra variable | No — works correctly out of the box |

Prefer `let` for any loop variable used inside a closure (callback, `setTimeout`, event handler). The common mistake is reflexively using `var` from habit and being surprised every closure reports the same final value.

## Module Pattern (Closures) vs ES Classes for Private State

| Aspect | Closures / Module Pattern | ES Classes with `#privateFields` |
|---|---|---|
| Privacy enforcement | True privacy — no syntax exists to reach the captured variable from outside | True privacy — enforced by the `#` syntax at the language level |
| Syntax overhead | A factory function returning an object of closures | Native class syntax, feels more like a "class" in other languages |
| Shared "instance" methods | Each object gets its own copies of the returned functions (higher memory per instance) | Methods live once on the prototype, shared across all instances |
| Inheritance | Awkward — no built-in mechanism, must be manually composed | Natural — `extends`, `super` |

Use the closure/module pattern for one-off factories, simple encapsulated utilities, or when you specifically don't need inheritance. Use classes with private fields when you need many instances (to avoid duplicating methods per instance) or need inheritance. The common mistake is defaulting to the closure pattern for something that will have hundreds of instances, unknowingly duplicating every method function per object instead of sharing them via the prototype.

## Closures vs Global Variables for Shared State

| Aspect | Closures | Global Variables |
|---|---|---|
| Visibility | Only accessible through whatever the closure explicitly exposes | Accessible and mutable from literally anywhere |
| Collision risk | None — each closure's variables are isolated | High — any code can read or overwrite a global |
| Debuggability | State changes are traceable to specific functions that can mutate it | Any code anywhere could be the source of a mutation, harder to trace |

Use closures whenever state should be scoped to a specific piece of functionality rather than the whole program. Use (sparingly) module-scoped variables or a proper state-management structure for genuinely app-wide state. The common mistake is reaching for global variables for convenience, which as an app grows becomes very hard to reason about since any file could be mutating that state.

## Memoization via Closure vs Recomputing Every Call

| Aspect | Memoized (closure-cached) | Recomputed every call |
|---|---|---|
| Speed on repeated calls with same input | Fast after first call — cache hit | Same cost every time |
| Memory cost | Grows with number of unique inputs cached | None beyond the call itself |
| Correctness risk | Stale cache if the underlying data changes but the input key doesn't | Always reflects current state |

Use memoization for expensive, pure (deterministic, side-effect-free) computations repeatedly called with a limited set of inputs. Avoid it for functions whose output can change for the same input over time (e.g. depends on external mutable state), or for cheap functions where caching overhead exceeds the savings. The common mistake is memoizing a function that isn't actually pure, silently serving stale results.
