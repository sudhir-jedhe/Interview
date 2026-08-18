# Output: `let` in a setTimeout loop

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

**Answer:** `0 1 2`

**Why:** `let` is block-scoped, and critically, the `for` loop creates a **new binding of `i` for each iteration**. Each callback closes over its own separate `i`, so the captured values are `0`, `1`, `2` respectively.
