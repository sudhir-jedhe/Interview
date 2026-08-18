# Output-Based: `process.argv` indices

```js
// launched as: node app.js --port=4000 production
console.log(process.argv[0].includes('node'));
console.log(process.argv[2]);
console.log(process.argv[3]);
```

**Answer:** `true`, `--port=4000`, `production`

**Why:** `process.argv[0]` is always the path to the Node binary, `process.argv[1]` is the script path, and real CLI arguments start at index 2 — in the order they were passed, unparsed (Node doesn't split `--port=4000` into a key/value automatically; that's on you or a CLI-parsing library).
