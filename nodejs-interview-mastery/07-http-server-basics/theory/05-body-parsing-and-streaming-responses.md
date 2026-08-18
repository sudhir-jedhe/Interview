# Body Parsing and Streaming Responses

## Manual JSON body parsing

Without a framework, parsing a JSON body means manually collecting stream chunks, concatenating, and calling `JSON.parse`:

```js
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}
```

This is precisely what `express.json()` automates for you — plus size limits, content-type checking, and error handling. Understanding the manual version is what lets you debug body-parsing issues (wrong `Content-Type`, missing body, oversized payloads) when the framework abstraction leaks. See `problems/02-json-body-parsing-middleware.md` for a hardened, standalone version with a size limit.

## Manual JSON body parsing vs framework body-parsing (e.g., express.json())

| Aspect | Manual (raw http) | Framework middleware |
|---|---|---|
| Size limits | You must implement them yourself | Built-in, configurable (`limit` option) |
| Content-Type checking | Manual `if` check needed | Automatically skips non-matching content types |
| Error handling | You write try/catch around `JSON.parse` | Middleware emits a catchable error automatically |

Use manual parsing when building minimal services with no framework dependency, or when you need full control over streaming/validation; use framework middleware for anything production-facing, since it handles edge cases (oversized payloads, malformed JSON, wrong content-type) you'd otherwise have to reimplement. The common mistake in manual parsing is omitting a body-size limit, which leaves the server vulnerable to memory-exhaustion attacks from unbounded request bodies.

## res.write() streaming vs buffering the full body then res.end(data)

| Aspect | write() streaming | Buffer then end(data) |
|---|---|---|
| Memory usage | Low, constant regardless of payload size | Proportional to full payload size |
| Time to first byte | Client starts receiving data immediately | Client waits until the whole payload is ready |
| Complexity | Slightly more code, must manage backpressure | Simpler, one call |

Stream large or slow-to-generate responses (file downloads, long reports, server-sent events); buffer-and-send for small, fast responses (typical JSON API replies) where the complexity isn't worth it. The common mistake is loading an entire large file into memory with `fs.readFile` and passing it to `res.end()` instead of `fs.createReadStream(...).pipe(res)`, which risks memory blowups under concurrent large downloads.
