# Snippet: Object.create(null) has no inherited methods

```js
const dict = Object.create(null);
dict.toString = "not a function anymore, just a key";
console.log(dict.toString);            // "not a function anymore, just a key"
console.log(Object.prototype.toString.call(dict)); // "[object Object]"
```

`dict` has no `[[Prototype]]` at all, so there's no inherited `.toString` to shadow — assigning `dict.toString` is just an ordinary own-property assignment with no naming conflict. To use the real `Object.prototype.toString` on it, you have to borrow it explicitly via `call`.
