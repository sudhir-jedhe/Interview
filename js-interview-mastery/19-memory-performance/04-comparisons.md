# Comparisons: Memory & Performance

## `Map`/`Set` vs. `WeakMap`/`WeakSet`

| Aspect | `Map` / `Set` | `WeakMap` / `WeakSet` |
|---|---|---|
| Reference strength to keys/values | Strong — prevents garbage collection | Weak — does not prevent garbage collection |
| Iterable / has `.size` | Yes | No |
| Key types allowed | Any value | Objects only (and registered symbols), no primitives |
| Typical use | General-purpose collections you need to inspect/iterate | Attaching private metadata to objects (e.g., DOM nodes) without leaking |

Use `WeakMap`/`WeakSet` specifically when the key's lifetime should be controlled by the rest of your program, not by the map itself — e.g., caching computed data per DOM node. The common mistake is using a regular `Map` for this and creating a slow, silent memory leak because entries are never removed even after their key object is otherwise gone.

## Memoization vs. debounce/throttle

| Aspect | Memoization | Debounce / throttle |
|---|---|---|
| Optimizes | Redundant *identical* calls (same input, pure function) | Call *frequency* over time, regardless of input |
| Mechanism | Cache keyed by arguments | Delay/rate-limit execution via timers |
| Requires purity | Yes — same input must always produce same output | No — works with any function, including side effects |
| Risk | Unbounded cache growth (a memory leak) | Missed calls if not configured for the right trailing/leading behavior |

Use memoization for expensive pure computations called repeatedly with overlapping arguments (e.g., Fibonacci, parsing the same config twice). Use debounce/throttle for taming *event frequency*, not computation cost. The common mistake is memoizing a function that isn't actually pure (e.g., one that reads mutable external state), which produces stale, incorrect cached results.

## Mark-and-sweep vs. manual memory management (conceptual)

| Aspect | Mark-and-sweep (JS's GC) | Manual management (e.g., C's `malloc`/`free`) |
|---|---|---|
| Who decides when memory is freed | The engine, automatically, on its own schedule | The developer, explicitly |
| Risk of use-after-free bugs | Effectively impossible | A common, serious bug class |
| Risk of leaks | Still possible (unintended references) | Also possible (forgetting to free) |
| Predictability of timing | Non-deterministic — you can't know exactly when collection runs | Deterministic — happens exactly when you call free |

JS developers don't choose *when* memory is freed, but they still control *whether* it can be freed at all, by managing references. The common misconception is thinking `= null` "frees memory" immediately — it only removes one reference; the object is freed later, by the GC, only once it becomes fully unreachable.

## Detached DOM node leak vs. normal DOM node removal

| Aspect | `node.remove()` with no lingering JS reference | `node.remove()` with a JS variable/closure still holding it |
|---|---|---|
| Eligible for garbage collection | Yes, immediately (once removed and unreferenced) | No — stays in memory as long as the reference exists |
| Visible on the page | No | No |
| Common cause | Clean removal, e.g., in a component's teardown logic | Caching a node reference (for performance) and forgetting to clear it |

Removing a node from the DOM does not, by itself, make it eligible for garbage collection — reachability is what matters, not DOM attachment. The common mistake is caching references to DOM nodes for quick re-access and never nulling them out (or removing associated event listeners) after the node is torn down.
