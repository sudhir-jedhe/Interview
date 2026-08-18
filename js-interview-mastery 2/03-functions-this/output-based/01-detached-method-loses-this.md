# A Detached Method Loses Its `this`

```js
const obj = {
  name: 'Box',
  getName: function() {
    return this.name;
  }
};
const fn = obj.getName;
console.log(obj.getName());
console.log(fn());
```

**Answer:** `'Box'` then (non-strict) `undefined`, or a `TypeError` in strict mode

**Why:** `obj.getName()` is a method call, so implicit binding applies and `this` is `obj`. `fn()` is called as a plain, detached function reference — no object precedes the call — so it falls back to default binding: `this` is the global object in non-strict mode (where `this.name` is `undefined`), or `undefined` itself in strict mode, in which case accessing `this.name` throws `TypeError: Cannot read properties of undefined`.
