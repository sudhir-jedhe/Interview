# The Classic `var` Loop Bug

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs: 3, 3, 3
```

Because `var` is function-scoped (here, effectively global), there's only **one** `i` shared by all three timeout callbacks. By the time any callback runs (after the loop finishes and the call stack clears), `i` is `3`. Switching to `let` fixes this because `let` creates a **new binding of `i` for each loop iteration**, so each closure captures its own distinct `i`:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// logs: 0, 1, 2
```

This bug shows up constantly in real code — registering event handlers in a loop, building an array of callbacks, or scheduling deferred work per item. For three different ways to fix it (including approaches that don't rely on `let`), see `../problems/03-fix-var-loop-closure-bug-three-ways.md`.
