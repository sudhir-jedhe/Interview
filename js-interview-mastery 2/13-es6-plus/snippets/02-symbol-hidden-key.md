# Symbol as a collision-proof object key, invisible to normal enumeration

```js
const secret = Symbol('secret');
const config = { host: 'localhost', [secret]: 'do-not-log-me' };
console.log(JSON.stringify(config));
// {"host":"localhost"}
```

The symbol-keyed property is skipped by `JSON.stringify`, `Object.keys()`, and `for-in` — it's still accessible directly via `config[secret]` or `Object.getOwnPropertySymbols(config)`, just excluded from default enumeration.
