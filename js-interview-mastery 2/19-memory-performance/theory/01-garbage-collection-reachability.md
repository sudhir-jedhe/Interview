# Garbage Collection: Reachability and Mark-and-Sweep

JavaScript manages memory automatically — you never explicitly free objects. The engine decides what memory to reclaim based on **reachability**: a value is reachable if it's referenced, directly or through a chain of references, from a "root" (global object, currently executing function's local variables, or the call stack). If nothing reaches an object anymore, it's eligible for collection.

The dominant algorithm is **mark-and-sweep**: periodically, the engine starts from the roots, walks every reachable reference and marks each object it finds, then sweeps through memory and frees everything left unmarked. This correctly handles circular references (two objects referencing each other but unreachable from any root are both collected) — something older reference-counting garbage collectors got wrong.

```js
let obj = { data: "big payload" };
obj = null; // the object is now unreachable (assuming nothing else references it)
// The engine will eventually reclaim its memory -- you cannot force this or predict exactly when.
```

You never call anything like `free(obj)` — you simply stop referencing it, and the GC does the rest, on its own schedule, not synchronously.

## Mark-and-sweep vs. manual memory management (conceptual)

| Aspect | Mark-and-sweep (JS's GC) | Manual management (e.g., C's `malloc`/`free`) |
|---|---|---|
| Who decides when memory is freed | The engine, automatically, on its own schedule | The developer, explicitly |
| Risk of use-after-free bugs | Effectively impossible | A common, serious bug class |
| Risk of leaks | Still possible (unintended references) | Also possible (forgetting to free) |
| Predictability of timing | Non-deterministic — you can't know exactly when collection runs | Deterministic — happens exactly when you call free |

JS developers don't choose *when* memory is freed, but they still control *whether* it can be freed at all, by managing references. The common misconception is thinking `= null` "frees memory" immediately — it only removes one reference; the object is freed later, by the GC, only once it becomes fully unreachable.
