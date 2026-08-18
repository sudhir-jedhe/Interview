# Interview Q&A: Performance Techniques

**Q: What is memoization, and what's the risk of using it carelessly?**
Memoization caches the output of a function keyed by its input, so repeated calls with the same arguments skip recomputation and return the cached result. Used carelessly — with an unbounded cache and no eviction — it turns a CPU optimization into a memory leak, since every unique input ever seen is retained forever; it can also produce stale/incorrect results if applied to a function that isn't actually pure.

**Q: Give a practical example of avoiding unnecessary allocation in a hot path, and explain when it's actually worth doing.**
In a loop processing large data on every animation frame, chaining `.map().filter()` allocates a full intermediate array on every call; replacing it with a single manual loop that both transforms and filters in one pass avoids that extra allocation. This kind of optimization is only worth the added complexity after profiling identifies the loop as an actual bottleneck — applying it preemptively across a codebase usually just hurts readability for no measurable benefit.
