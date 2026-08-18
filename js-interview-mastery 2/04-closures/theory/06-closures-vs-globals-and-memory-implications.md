# Closures vs Global Variables, and Memory Implications

## Closures vs global variables for shared state

| Aspect | Closures | Global Variables |
|---|---|---|
| Visibility | Only accessible through whatever the closure explicitly exposes | Accessible and mutable from literally anywhere |
| Collision risk | None — each closure's variables are isolated | High — any code can read or overwrite a global |
| Debuggability | State changes are traceable to specific functions that can mutate it | Any code anywhere could be the source of a mutation, harder to trace |

Use closures whenever state should be scoped to a specific piece of functionality rather than the whole program. Use (sparingly) module-scoped variables or a proper state-management structure for genuinely app-wide state. The common mistake is reaching for global variables for convenience, which as an app grows becomes very hard to reason about since any file could be mutating that state.

## Memory implications (brief)

Because a closure keeps its captured variables alive, closures can prevent garbage collection of data you no longer need — for example, capturing a large object just to read one small property from it keeps the whole object in memory for as long as the closure exists. This is a real, common source of memory leaks in long-lived closures (event listeners, timers, caches that never evict). The full mechanics of the JS memory model and GC are covered in the dedicated memory & performance topic — for now, the key takeaway is: closures are powerful specifically because they extend a variable's lifetime, and that same power is exactly what can cause memory to be retained longer than intended.
