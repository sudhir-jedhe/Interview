# Interview Q&A — Body Parsing, Streaming, and Performance

**Q: How do you stream a large file as an HTTP response instead of loading it fully into memory?**
Use `fs.createReadStream(path).pipe(res)`. `pipe` automatically handles backpressure, only reading more of the file as the client's socket buffer has room, keeping memory usage constant regardless of file size — unlike `fs.readFile` + `res.end(data)`, which loads the entire file into memory first.

**Q: What is the purpose of the `Content-Length` header, and what happens if it's wrong?**
It tells the client exactly how many bytes to expect in the response body, so the client knows when the response is complete. If it's set incorrectly (too small), the client may truncate the response; if too large, the client may hang waiting for bytes that never arrive. When you don't know the length upfront (e.g., streaming), Node/HTTP falls back to chunked transfer encoding instead.

**Q: What is HTTP keep-alive and why does it matter for performance?**
Keep-alive reuses a single TCP connection across multiple HTTP requests instead of opening a new TCP handshake (and TLS handshake, if HTTPS) per request. This significantly reduces latency and CPU overhead for clients making many requests to the same server, which is why Node's `http.Agent` and modern browsers enable it by default.

**Q: How do you manually parse a JSON request body without a framework, and what's the correct sequence of stream events?**
Collect body chunks on the `'data'` event, concatenate them, and only call `JSON.parse` once the `'end'` event fires (signaling the full body has arrived). You should also handle the `'error'` event on `req` in case the connection drops mid-body.
```js
let body = '';
req.on('data', (c) => (body += c));
req.on('end', () => JSON.parse(body));
```

**Q: What's the risk of manually parsing request bodies without a size limit?**
An attacker (or a buggy client) can send an arbitrarily large body, and since you're accumulating it entirely in memory before parsing, this can exhaust server memory — a denial-of-service vector. Production code should track accumulated size and abort/reject (`req.destroy()`, respond 413) once a configured limit is exceeded, which is exactly what `express.json({ limit: '1mb' })` does for you.
