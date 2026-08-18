# Nested + renamed object destructuring with defaults

```js
const response = { data: { user: { name: 'Zoe' } }, status: 200 };
const { data: { user: { name, email = 'n/a' } }, status: code } = response;
console.log(name, email, code);
// Zoe n/a 200
```
