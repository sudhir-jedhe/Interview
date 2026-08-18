```js
const obj = Object.create(null);
obj.a = 1;
console.log(obj.hasOwnProperty('a'));
```
**Answer:** `TypeError: obj.hasOwnProperty is not a function`
**Why:** `Object.create(null)` creates an object with **no prototype at all** — not even `Object.prototype` — so it has no inherited `hasOwnProperty` method. This is exactly why `Object.hasOwn(obj, 'a')` (a static method, not looked up on the object's own prototype chain) is the safer, modern replacement: `Object.hasOwn(obj, 'a')` would correctly return `true` here.
