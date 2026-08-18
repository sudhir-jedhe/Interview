# Output: `fetch` resolves even on a 404

```js
async function getData() {
  const res = await fetch("/nonexistent-endpoint-404");
  console.log("fetch resolved, status:", res.status);
  console.log(res.ok);
}
getData();
```

**Answer:**
```
fetch resolved, status: 404
false
```

**Why:** `fetch` only rejects on network-level failures (DNS failure, no connectivity, CORS block). An HTTP 404 or 500 response is still a "successful" fetch as far as the promise is concerned — it resolves normally with a `Response` object whose `.ok` is `false` for any non-2xx status. Forgetting to check `res.ok` is a very common bug.
