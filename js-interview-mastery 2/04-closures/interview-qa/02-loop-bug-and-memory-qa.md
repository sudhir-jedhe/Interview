# Interview Q&A — The Loop Bug and Memory

**Q: Why does `for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }` log `3, 3, 3` instead of `0, 1, 2`?**
`var` creates a single, function-scoped (in this case, effectively global) binding for `i`, shared by every iteration of the loop. All three arrow functions close over that same `i`. Since the timeouts fire only after the loop has fully finished (synchronous code always runs first), by the time any callback executes, `i` holds its final post-loop value, `3`.

**Q: How does switching to `let` fix that loop bug?**
`let` is block-scoped and, specifically for `for` loops, the spec defines that each iteration gets its own fresh binding of the loop variable, initialized from the previous iteration's value. Each closure created inside the loop body therefore captures its own distinct `i`, so the callbacks log `0`, `1`, `2` as expected.

**Q: How would you fix the same bug without using `let`, e.g. in an environment restricted to ES5?**
Wrap the loop body in an IIFE that takes the current value of `i` as a parameter, creating a new function scope — and thus a new closure — for each iteration: `(function(n) { setTimeout(() => console.log(n), 0); })(i);`. The parameter `n` is a fresh, independent variable per IIFE call, isolating each callback's captured value.

**Q: Can closures cause memory leaks? How?**
Yes. Since a closure keeps its captured variables alive as long as the closure itself is reachable, a long-lived closure (e.g. attached as a persistent event listener or stored in a global cache) that references a large object will keep that entire object in memory, even if only a small piece of it is actually used. This becomes a leak if the closure is never released (e.g. the listener is never removed) while the app continues running.
