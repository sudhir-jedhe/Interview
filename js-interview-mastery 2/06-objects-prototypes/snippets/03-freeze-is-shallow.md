# Snippet: freeze is shallow

```js
const config = Object.freeze({ retries: 3, limits: { max: 10 } });
config.retries = 99;
config.limits.max = 9999;
console.log(config.retries, config.limits.max); // 3 9999
```

`Object.freeze` only locks the top-level properties of the object it's called on. `config.limits` is a separate, un-frozen object, so its own properties remain fully mutable.
