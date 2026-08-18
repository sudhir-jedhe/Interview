# Snippet: non-enumerable properties are invisible to common iteration

```js
const obj = { visible: 1 };
Object.defineProperty(obj, "hidden", { value: 2, enumerable: false });

console.log(Object.keys(obj));    // ["visible"]
console.log(JSON.stringify(obj)); // {"visible":1}
console.log(obj.hidden);          // 2 (still directly accessible)
```

`enumerable: false` doesn't hide a property from direct access — `obj.hidden` still works — it only excludes it from enumeration APIs like `Object.keys`, `for...in`, spread, and `JSON.stringify`.
