# Output: `var` in a setTimeout loop

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Answer:** `3 3 3`

**Why:** `var` is function-scoped, not block-scoped, so all three `setTimeout` callbacks close over the *same* `i` variable. By the time any callback runs (after the synchronous loop finishes), `i` has already reached `3`. This is the textbook reason `let` is preferred in loops.
