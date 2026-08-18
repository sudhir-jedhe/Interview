# node_modules Walk-Up Resolution with a Nested Override

```
/project/node_modules/left-pad@1.0.0
/project/packages/api/node_modules/left-pad@2.0.0
/project/packages/api/src/index.js  -- require('left-pad')
```

Which version of `left-pad` does `index.js` get?

**Answer:** `2.0.0`

**Why:** Node's resolution algorithm starts at the requiring file's directory and walks **upward**, using the first matching `node_modules/left-pad` it finds. Since `packages/api/node_modules/left-pad` exists closer to `index.js` than the root-level one, it's found and used first — the root-level copy is never even checked.
