## Diagnosing Progressive Slowdown in Web Applications

When an application becomes noticeably slower **every time you visit or navigate back to a page**, it is a textbook symptom of **memory leaks**, **dangling event listeners**, or **uncleaned state mounting issues**. Each visit compounds the problem by leaving behind lingering garbage in memory.

---

### Key Causes of Progressive Page Slowdown

* **1. Uncleansed Event Listeners, Timers, and Subscriptions (Memory Leaks)**
* **The Issue:** When a component mounts, it might attach a global event listener (`window.addEventListener('resize', ...)`), start a timer (`setInterval`), or subscribe to a data stream (RxJS, WebSockets).
* **Why it slows down:** If the component unmounts *without* cleaning these up (`removeEventListener`, `clearInterval`, `unsubscribe`), they persist in memory. Worse, if you visit the page 5 times, you now have 5 duplicate sets of timers and listeners running simultaneously in the background, fighting for CPU cycles.

* **2. Uncontrolled State Growth and Caching**
* **The Issue:** Storing large lists, historical data, or cached responses in a global state store (Redux, Zustand, Context) or local storage without pagination or eviction policies.
* **Why it slows down:** The state object grows exponentially larger with each visit, forcing the browser to allocate more memory and slowing down serialization, diffing algorithms, and rendering loops.

* **3. Duplicate API Calls and Missing Cache Invalidation**
* **The Issue:** Fetching heavy data sets fresh on every single page mount without caching or proper request memoization.
* **Why it slows down:** Floods the network tab, blocks the main thread with parsing large JSON payloads, and frequently triggers cascading re-renders.

* **4. Heavy Computation and Unoptimized Re-renders**
* **The Issue:** Running expensive computations (e.g., heavy array filtering, sorting, or data transformation) directly inside the render path or component body without memoization (`useMemo`, `useCallback`).
* **Why it slows down:** Every re-render forces the browser to recalculate layout and styles, locking up the JavaScript execution thread.

* **5. Detached DOM Nodes**
* **The Issue:** JavaScript references pointing to DOM elements that have been removed from the page layout.
* **Why it slows down:** The garbage collector cannot free up the memory because a hidden reference still points to those nodes, causing memory consumption to balloon steadily over time.

---

### How to Debug and Fix It

1. **Memory Profiling:** Open Chrome DevTools, go to the **Memory** tab, and take a **Heap Snapshot** before visiting the page, and another snapshot after visiting and leaving the page a few times. Look for detached DOM trees or constructor names piling up.
2. **Performance Profiling:** Record a timeline in the **Performance** tab while interacting with the page to spot long tasks and excessive garbage collection (GC) pauses.
3. **Strict Lifecycle Cleanup:** Ensure all `useEffect` hooks in React (or equivalent lifecycle hooks in other frameworks) return a cleanup function to dispose of subscriptions, timers, and event listeners.
