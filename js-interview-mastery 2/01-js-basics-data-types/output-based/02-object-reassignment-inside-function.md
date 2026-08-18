# Reassigning an Object Parameter Inside a Function

```js
let x = { val: 10 };
function update(obj) {
  obj = { val: 20 };
}
update(x);
console.log(x.val);
```

**Answer:** `10`

**Why:** `obj` receives a copy of the reference to `x`'s object. Reassigning `obj` inside the function points the local variable at a brand-new object — it does not change what `x` points to. Only mutating a property on the shared object (e.g. `obj.val = 20`) would be visible outside the function.
