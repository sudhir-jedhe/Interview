# Re-throwing after partial handling (logging + rethrow)

```js
function parseConfig(json) {
  try {
    return JSON.parse(json);
  } catch (err) {
    console.log("logging for diagnostics:", err.message);
    throw new Error("Invalid config file", { cause: err }); // Error cause chaining (ES2022)
  }
}

try {
  parseConfig("{ bad json");
} catch (e) {
  console.log(e.message, "->", e.cause.message);
  // "Invalid config file" -> "Unexpected token b in JSON at position 2" (message varies by engine)
}
```

The `{ cause: err }` option preserves a reference to the original low-level error while the caller sees a clearer, higher-level message — useful for logging the full chain without losing the root cause.
