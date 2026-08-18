# The Classic Loop Bug, Explained via Closures

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs: 3, 3, 3
```

All three arrow functions close over the *same* `i`, because `var` creates one binding shared across the whole loop. By the time the callbacks run, the loop has finished and `i` is `3`. Two fixes: use `let` (creates a distinct binding, and thus a distinct closure, per iteration), or wrap the loop body in an IIFE that captures the current value as a new local variable each iteration.

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0, 1, 2 — each closure has its own i
}
```

A third fix (`.bind()`) and a fuller breakdown of all three approaches side by side lives in the scope/hoisting topic's `problems/03-fix-var-loop-closure-bug-three-ways.md`.

## Closures via `var` vs `let` in loops

| Aspect | `var` in a loop | `let` in a loop |
|---|---|---|
| Binding per iteration | One shared binding across the whole loop | A fresh binding created for each iteration |
| Closures capture | The same final value for every callback | Each callback's own snapshot of that iteration's value |
| Fix needed for per-iteration capture? | Yes — requires an IIFE or explicit extra variable | No — works correctly out of the box |

Prefer `let` for any loop variable used inside a closure (callback, `setTimeout`, event handler). The common mistake is reflexively using `var` from habit and being surprised every closure reports the same final value.
