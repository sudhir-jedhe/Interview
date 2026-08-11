When a web application becomes progressively slower after running for several hours, it is a textbook symptom of a **memory leak**.

Over time, unused objects, detached DOM nodes, and closures accumulate in heap memory. As available memory shrinks, the JavaScript engine's **Garbage Collector (GC)** has to work harder and run more frequently, blocking the main thread and causing noticeable lag, stuttering, and eventual browser crashes.

Here is a breakdown of the specific causes you mentioned, along with how they manifest in modern applications.

---

### 1. Uncleared Intervals and Timeouts (`setInterval` / `setTimeout`)

* **The Cause:** If you start an interval (e.g., polling an API every 5 seconds) inside a component or page view, but fail to clear it when the component unmounts or the user navigates away, the interval continues running in the background forever.
* **Why it leaks:** The callback function passed to `setInterval` forms a **closure** over the component's scope. Because the interval is active, the garbage collector cannot clean up the closure, the variables it references, or the DOM nodes attached to them. Every time a user navigates to that page and leaves, *another* ghost interval spawns, compounding memory usage exponentially.
* **The Fix:** Always clear intervals and timeouts in cleanup functions (e.g., `clearInterval` inside a React `useEffect` cleanup return).

### 2. Unremoved Event Listeners

* **The Cause:** Adding global event listeners to `window`, `document`, or parent elements (like `window.addEventListener('resize', handleResize)`) without removing them when the component unmounts.
* **Why it leaks:** The global object (`window`) maintains a strong reference to the listener function. Because the listener function retains a reference to the component scope where it was created, the entire component and its child DOM tree remain anchored in memory, unable to be garbage-collected.
* **The Fix:** Explicitly remove event listeners during unmount using `removeEventListener` with the exact same reference handler.

### 3. Retained Object References (Unbounded Caches, Global State, and Closures)

* **The Cause:** Storing data in growing global arrays, maps, or objects without a cleanup or eviction strategy (e.g., an analytics event queue, a custom global caching layer, or an undo/redo history stack that keeps growing infinitely).
* **Why it leaks:** If references to objects are held in a global scope or a long-lived parent structure, the Garbage Collector assumes they are still needed.
* **Detached DOM Nodes:** A common variant of this is holding a reference to a DOM element in a JavaScript variable even after it has been removed from the document body. The element stays in memory as a "detached DOM tree."
* **The Fix:** Implement cache size limits (like LRU caches), clear out arrays when they are no longer needed, and avoid accidental global variables (e.g., assigning a value without `const`, `let`, or `var`, which implicitly attaches it to `window`).

---

### How to Diagnose and Prove It in an Interview

If asked how you would investigate this bug in a real-world scenario, outline this workflow:

1. **Chrome DevTools Performance Monitor:** Open the Performance Monitor tab to watch CPU usage and **JS Heap Size** over time. If the heap size climbs steadily and never drops back down after garbage collection pulses, you have a confirmed memory leak.
2. **Heap Snapshots:** Take a **Heap Snapshot** when the app loads, navigate through various pages/features a few times, and take a second snapshot. Compare them using the **"Objects allocated between Snapshot 1 and 2"** view or filter by **"Detached Elements"** to pinpoint exactly which classes, components, or event listeners are lingering in memory.
