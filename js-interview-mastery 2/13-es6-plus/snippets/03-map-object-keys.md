# Map accepts object keys; plain objects cannot

```js
const objKey = { id: 1 };
const map = new Map();
map.set(objKey, 'metadata');
console.log(map.get(objKey));
console.log(map.get({ id: 1 })); // different object reference
// metadata
// undefined
```

`Map` keys are compared by identity (like `===`, with the `NaN` exception — see the output-based question on `Map` and `NaN`), so a structurally identical but distinct object never matches an existing key. A plain object couldn't even attempt this — any non-string key would be coerced to the string `"[object Object]"`, causing silent collisions between different object keys.
