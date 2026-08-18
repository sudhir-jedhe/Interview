# Strings never mutate in place

```js
const name = "alice";
name.toUpperCase();
console.log(name);                // "alice" — return value ignored, original untouched
console.log(name.toUpperCase());  // "ALICE" — new string returned
```
