# Output: detaching a method vs binding it

```js
const obj = {
  value: 10,
  getValue: function() { return this.value; }
};
const unbound = obj.getValue;
const bound = obj.getValue.bind(obj);
console.log(unbound());
console.log(bound());
```

**Answer:** (non-strict) `undefined` then `10`

**Why:** `unbound` is called as a plain function reference — no object precedes the call, so default binding applies and `this` is the global object (or `undefined` in strict mode, which would throw instead when reading `.value`). `bound` was explicitly bound to `obj` via `.bind(obj)`, so it always resolves `this.value` to `obj`'s `10`, regardless of how it's later called.
