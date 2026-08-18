# Interview Q&A: searching and transforming

**Q: What's the difference between `find`/`findIndex` and `filter`?**
`find` and `findIndex` return the first matching element (or its index) and stop iterating as soon as a match is found. `filter` always iterates the entire array and returns a new array of *all* matches. Use `find` when you expect/need at most one result and want early termination for performance; use `filter` when you need every match.

**Q: What does `flatMap` do differently from `map().flat()`?**
Functionally they're equivalent for depth `1`, but `flatMap` does it in a single pass instead of two separate array allocations, so it's more efficient. It cannot flatten beyond one level though — if your mapping function nests arrays more than one level deep, you still need `.map(fn).flat(depth)`.
