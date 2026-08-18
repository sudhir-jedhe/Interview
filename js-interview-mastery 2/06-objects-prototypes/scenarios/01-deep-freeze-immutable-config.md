# Scenario: immutable configuration object

**Prompt:** You're building a config loader that reads a JSON file into a JS object at startup. You want to guarantee that no part of the app can accidentally mutate the config at runtime, including nested sections like `config.database.pool`. How would you implement this, and what's the catch with the obvious one-line solution?

**Approach:** `Object.freeze(config)` alone only protects the top level — `config.database.pool.max = 999` would still succeed because `database` and `pool` are separate, unfrozen objects. You need a recursive deep-freeze:

```js
function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach((key) => {
    const value = obj[key];
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}

const config = deepFreeze({ database: { pool: { max: 10 } } });
config.database.pool.max = 999; // fails silently (or throws in strict mode)
console.log(config.database.pool.max); // 10
```

Edge cases: watch out for circular references causing infinite recursion (guard with a `WeakSet` of visited objects if the data might be cyclic), and remember `deepFreeze` doesn't stop `Array` methods that don't mutate in place — filtering/mapping still works fine, it's only in-place mutation that's blocked.
