# Interview Q&A: Loop Control Flow

**Q: What's the difference between `break` and `continue`?**
`break` immediately terminates the nearest enclosing loop (or `switch`), and execution continues after the loop. `continue` skips the rest of the current iteration's body and jumps straight to the next iteration's condition check (or update expression, in a `for` loop) — the loop itself keeps running.

**Q: When would you use a labeled loop?**
When you need `break` or `continue` to affect an *outer* loop from within a nested loop — unlabeled `break`/`continue` only ever targets the innermost enclosing loop. A label (`outer: for (...) { for (...) { break outer; } }`) lets you name the outer loop and target it explicitly, avoiding a manual flag-variable workaround.

**Q: Why does `for (var i ...) { setTimeout(() => console.log(i)) }` log the final value repeatedly, but `let` fixes it?**
`var` is function-scoped, so there's only one `i` shared by every closure created inside the loop body; by the time the deferred callbacks run, the loop has finished and `i` holds its final value. `let` creates a fresh binding of `i` for *each* loop iteration, so each closure captures its own distinct snapshot of `i` at that iteration.

**Q: What's the difference between `Array.prototype.forEach` and `for-of` for looping arrays?**
`forEach` is a higher-order function that takes a callback and has no way to `break` or `continue` early (though `return` inside the callback just skips to the next callback invocation, mimicking `continue`) — you'd need to throw or use `.some()`/`.every()` as a workaround to exit early. `for-of` is a genuine loop statement, so `break` and `continue` (including labeled versions) work naturally.
