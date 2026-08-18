# Snippet: Parsing `process.argv` manually (no dependencies)

```js
// Usage: node this-file.js --name Alice --port 4000
const args = process.argv.slice(2);
const parsed = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].slice(2);
    parsed[key] = args[i + 1];
    i++;
  }
}
console.log(parsed); // { name: 'Alice', port: '4000' }
```

**Explanation:** `process.argv.slice(2)` drops the Node executable path and script path, leaving just the user-supplied arguments. This loop handles the common `--flag value` pattern by consuming two array entries per flag; it doesn't handle `--flag=value` syntax, short aliases, or boolean flags with no value — which is exactly the kind of edge case a real CLI library (`commander`, `yargs`) handles for you.
