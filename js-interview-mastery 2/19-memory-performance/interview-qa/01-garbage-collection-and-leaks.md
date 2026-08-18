# Interview Q&A: Garbage Collection & Memory Leaks

**Q: How does JavaScript's garbage collector decide what to free?**
It's based on reachability, not reference counting: starting from a set of "roots" (global scope, currently executing function's locals, the call stack), the engine walks every chain of references and marks everything it can reach as alive. Anything left unmarked after that walk — meaning nothing reachable from a root points to it, even indirectly through cycles — is swept and its memory reclaimed. This is why circular references between two otherwise-unreachable objects are still collected correctly.

**Q: Name four common sources of memory leaks in JavaScript applications.**
Forgotten timers/intervals whose callbacks close over large data and are never cleared; detached DOM nodes still referenced by a JS variable after being removed from the page; accidental global variables from missing declaration keywords in non-strict code; and unbounded caches or event listeners that accumulate over a long-running session without any removal/eviction logic.

**Q: Can removing a DOM node with `.remove()` cause a memory leak?**
Yes, if a JavaScript variable, closure, or data structure still holds a reference to that node after removal. The DOM removal alone doesn't make the node eligible for garbage collection — reachability from a GC root is what matters, and a lingering JS reference keeps the detached node (and its entire subtree) alive in memory even though it's invisible on the page.

**Q: How can a closure accidentally cause a memory leak?**
A closure keeps its entire enclosing lexical scope reachable for as long as the closure itself is reachable, so if that scope contains a large object and the closure is retained somewhere long-lived (like an event listener or interval callback that's never removed), the large object stays in memory even after the code that "needed" it has logically finished. Modern engines like V8 optimize to retain only variables actually referenced by the inner function, but this isn't a language guarantee, and closures that do reference derived large data will still retain it.

**Q: What's an accidental global variable, and how do you prevent it?**
It happens when you assign to an identifier without declaring it with `let`/`const`/`var`, which in non-strict mode silently creates a property on the global object instead of throwing an error. `"use strict"` (or writing code as ES modules, which are strict by default) turns this into a `ReferenceError` at the point of the mistake, catching it immediately instead of letting it leak silently.

**Q: What's the general strategy for debugging a memory leak in a browser app?**
Use DevTools' Memory panel to take heap snapshots at two points that should have equivalent memory usage (e.g., before and after repeatedly performing an action that should be fully reversible, like opening/closing a modal), then use the snapshot comparison view to see what object types grew and trace their retaining paths back to what's holding them alive. Detached DOM node counts and growing closure/listener counts in the diff are the most common smoking guns.
