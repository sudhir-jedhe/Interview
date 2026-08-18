# Output-Based: `NODE_ENV` mutation timing

```js
console.log(process.env.NODE_ENV);
process.env.NODE_ENV = 'production';
console.log(process.env.NODE_ENV);
// require('express') app somewhere already configured before this point
```

**Answer:** Prints whatever `NODE_ENV` was at launch (often `undefined` if unset), then `production`.

**Why:** `process.env` is a mutable object at runtime — changing it later in the script does affect subsequent reads of `process.env.NODE_ENV` in your own code. However, if some other module (like Express's app setup) already read and cached `NODE_ENV`-dependent behavior *before* this reassignment, that earlier decision won't retroactively change — order of initialization matters.
