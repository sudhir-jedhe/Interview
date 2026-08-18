# Arrow Function Inherits `this` Lexically, Ignoring Call Site

```js
const obj = {
  value: 42,
  regular: function() { return this.value; },
  arrow: () => this?.value // `this` here is whatever enclosing scope had (often undefined at top level)
};
console.log(obj.regular()); // 42
console.log(obj.arrow());   // undefined — arrow ignored `obj` entirely
```
