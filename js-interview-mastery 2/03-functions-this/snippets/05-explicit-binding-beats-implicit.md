# Precedence: Explicit Binding Beats Implicit Binding

```js
function show() { return this.label; }
const objA = { label: 'A', show };
const objB = { label: 'B' };
console.log(objA.show.call(objB)); // 'B' — .call() wins over the implicit objA context
```
