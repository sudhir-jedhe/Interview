# Headers Worth Understanding

- `Content-Type` — tells the client how to interpret the body (`application/json`, `text/html`, etc.). Get it wrong and clients mis-parse the response.
- `Content-Length` — byte length of the body; required for the client to know when the response is complete if not using chunked encoding. Node sets this automatically for you in many cases, or you can set it explicitly if you know the exact size upfront.
- `Connection: keep-alive` — reuses the underlying TCP connection for multiple requests instead of opening a new one each time, reducing latency. Node's HTTP server enables keep-alive by default since Node 8+ via `Agent` on the client side and automatic handling server-side.

Setting the wrong `Content-Length` is a subtle bug source: too small truncates the response as far as the client is concerned; too large makes the client hang waiting for bytes that will never arrive. When you don't know the length upfront (e.g., a streamed response), omit it and let Node fall back to chunked transfer encoding instead of guessing.
