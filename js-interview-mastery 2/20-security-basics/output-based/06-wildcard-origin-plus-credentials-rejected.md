# Output: Wildcard origin combined with credentials is rejected by the browser

```js
// Server response header:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Credentials: true

fetch("https://api.example.com/private", { credentials: "include" })
  .then(res => res.json())
  .catch(err => console.log("failed:", err.message));
```

**Answer:**
```
failed: Failed to fetch
```

**Why:** The CORS spec explicitly forbids combining a wildcard `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true` — browsers reject this combination outright and refuse to expose the response, regardless of what the server intended, because a wildcard-plus-credentials combo would let literally any site read a user's authenticated data. This is a deliberate browser-enforced safety rule, not a server misconfiguration the browser tries to work around.
