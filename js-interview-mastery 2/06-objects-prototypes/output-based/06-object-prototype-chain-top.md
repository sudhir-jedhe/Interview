# Output: the top of the prototype chain

```js
console.log(Object.getPrototypeOf({}) === Object.prototype);
console.log(Object.getPrototypeOf(Object.prototype));
console.log(typeof Object.prototype.__proto__);
```

**Answer:** `true`, `null`, `"object"`

**Why:** A plain object literal's prototype is `Object.prototype`. `Object.prototype` itself sits at the top of the chain, so its own prototype is `null`. `typeof null` is `"object"` (a famous JS quirk), which is what makes the third line's output `"object"` rather than `"null"` — that's the classic `typeof null` bug reappearing in a prototype context.
