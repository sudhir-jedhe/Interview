# Output: Object spread shallow copy exposes nested mutation

```js
const nested = { info: { score: 10 } };
const copy = { ...nested };
copy.info.score = 99;
console.log(nested.info.score);
```

**Answer:** `99`

**Why:** Object spread only performs a shallow copy — it copies the top-level `info` key's *value*, which is a reference to the same inner object. Both `nested.info` and `copy.info` point to the same object in memory, so mutating one is visible through the other.
