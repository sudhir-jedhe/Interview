# A Nested Arrow Function Inherits `this` From Its Enclosing Regular Function

```js
const obj = {
  value: 1,
  getValue: function() {
    return (() => this.value)();
  }
};
console.log(obj.getValue());
```

**Answer:** `1`

**Why:** The inner arrow function has no `this` of its own, so it looks up `this` in its enclosing scope — the `getValue` function. Since `getValue` is called as `obj.getValue()`, implicit binding makes `this` equal to `obj` inside `getValue`, and the arrow function inherits that same `this`, correctly resolving `this.value` to `1`.
