# Interview Questions: Memory & Performance

**Q: How does JavaScript's garbage collector decide what to free?**
It's based on reachability, not reference counting: starting from a set of "roots" (global scope, currently executing function's locals, the call stack), the engine walks every chain of references and marks everything it can reach as alive. Anything left unmarked after that walk — meaning nothing reachable from a root points to it, even indirectly through cycles — is swept and its memory reclaimed. This is why circular references between two otherwise-unreachable objects are still collected correctly.

**Q: Name four common sources of memory leaks in JavaScript applications.**
Forgotten timers/intervals whose callbacks close over large data and are never cleared; detached DOM nodes still referenced by a JS variable after being removed from the page; accidental global variables from missing declaration keywords in non-strict code; and unbounded caches or event listeners that accumulate over a long-running session without any removal/eviction logic.

**Q: Can removing a DOM node with `.remove()` cause a memory leak?**
Yes, if a JavaScript variable, closure, or data structure still holds a reference to that node after removal. The DOM removal alone doesn't make the node eligible for garbage collection — reachability from a GC root is what matters, and a lingering JS reference keeps the detached node (and its entire subtree) alive in memory even though it's invisible on the page.

**Q: What's the difference between `Map` and `WeakMap`?**
`Map` holds strong references to its keys, so entries — and the objects used as keys — are never garbage collected while the `Map` itself is reachable, and it supports iteration and a `.size` property. `WeakMap` holds only weak references to its (object-only) keys, so an entry is automatically removed once its key becomes otherwise unreachable, which is exactly why it deliberately doesn't support iteration or `.size` — its contents can change at any time outside your control.

**Q: Why would you choose a `WeakMap` over a plain object or `Map` for caching per-object metadata?**
Because a `WeakMap` doesn't prevent the key object from being garbage collected — once the object is no longer referenced elsewhere, both it and its associated metadata entry are freed automatically. A plain object or `Map` would keep the key (and everything it references) alive indefinitely as long as the cache itself exists, which is a leak if the cache outlives the objects it's tracking.

**Q: How can a closure accidentally cause a memory leak?**
A closure keeps its entire enclosing lexical scope reachable for as long as the closure itself is reachable, so if that scope contains a large object and the closure is retained somewhere long-lived (like an event listener or interval callback that's never removed), the large object stays in memory even after the code that "needed" it has logically finished. Modern engines like V8 optimize to retain only variables actually referenced by the inner function, but this isn't a language guarantee, and closures that do reference derived large data will still retain it.

**Q: What is memoization, and what's the risk of using it carelessly?**
Memoization caches the output of a function keyed by its input, so repeated calls with the same arguments skip recomputation and return the cached result. Used carelessly — with an unbounded cache and no eviction — it turns a CPU optimization into a memory leak, since every unique input ever seen is retained forever; it can also produce stale/incorrect results if applied to a function that isn't actually pure.

**Q: What's an accidental global variable, and how do you prevent it?**
It happens when you assign to an identifier without declaring it with `let`/`const`/`var`, which in non-strict mode silently creates a property on the global object instead of throwing an error. `"use strict"` (or writing code as ES modules, which are strict by default) turns this into a `ReferenceError` at the point of the mistake, catching it immediately instead of letting it leak silently.

**Q: What's the general strategy for debugging a memory leak in a browser app?**
Use DevTools' Memory panel to take heap snapshots at two points that should have equivalent memory usage (e.g., before and after repeatedly performing an action that should be fully reversible, like opening/closing a modal), then use the snapshot comparison view to see what object types grew and trace their retaining paths back to what's holding them alive. Detached DOM node counts and growing closure/listener counts in the diff are the most common smoking guns.

**Q: Why does `WeakSet`/`WeakMap` not support iteration?**
Because their contents can be silently removed by garbage collection at any moment outside the program's control, so the size and membership at any instant aren't deterministic or observable in a stable way. Allowing iteration would expose collection timing (an implementation detail the spec explicitly wants to keep unobservable), so the language omits `Symbol.iterator` and `.size` from both entirely.

**Q: Give a practical example of avoiding unnecessary allocation in a hot path, and explain when it's actually worth doing.**
In a loop processing large data on every animation frame, chaining `.map().filter()` allocates a full intermediate array on every call; replacing it with a single manual loop that both transforms and filters in one pass avoids that extra allocation. This kind of optimization is only worth the added complexity after profiling identifies the loop as an actual bottleneck — applying it preemptively across a codebase usually just hurts readability for no measurable benefit.
