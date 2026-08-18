# Output-Based: computed config is a snapshot, not a live reference

```js
function getConfig() {
  return {
    debug: process.env.DEBUG === 'true',
  };
}
const config = getConfig();
process.env.DEBUG = 'true';
console.log(config.debug);
```

**Answer:** `false`

**Why:** `getConfig()` read `process.env.DEBUG` and computed a plain boolean *at call time*, before `DEBUG` was set to `'true'`. The resulting `config` object holds a snapshot value, not a live reference back to `process.env` — mutating `process.env` afterward has no effect on already-computed config objects.
