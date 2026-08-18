# Template Literals Evaluate Expressions

Not just variable interpolation — any valid expression can go inside `${}`.

```js
const price = 19.999;
const qty = 3;
console.log(`Total: $${(price * qty).toFixed(2)}`);
// 'Total: $59.997' -> toFixed(2) rounds -> 'Total: $60.00'
```
