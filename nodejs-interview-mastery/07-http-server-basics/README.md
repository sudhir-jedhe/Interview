# HTTP Server Basics

Before reaching for Express, every Node engineer should understand how to build a server directly on the `http` module — it demystifies what frameworks are actually doing underneath and is a favorite interview probe for "do you understand Node fundamentals." This topic covers `createServer`, the `req`/`res` objects (including that `req` is itself a readable stream), manual routing by parsing URL and method, response methods like `writeHead`/`end`/streaming, the HTTP status codes worth knowing cold, and handling different content types including manual JSON body parsing.

## Structure

- **theory/** — Concept-by-concept notes: request/response lifecycle, manual routing, status codes & redirects, headers, and body parsing/streaming.
- **snippets/** — One focused, runnable code example per file, each with its explanation.
- **output-based/** — "What does this log?" questions covering `res.end()` timing, streaming quirks, and header/status behavior.
- **scenarios/** — Real-world engineering scenarios (zero-framework microservices, large uploads, SSE, error-code redesign) with a worked approach.
- **interview-qa/** — Q&A pairs grouped into request/response basics, status codes, and body parsing/streaming/performance.
- **problems/** — Hands-on implementation problems (static file server, JSON body-parsing middleware, a router with path params) with full worked solutions.
- **projects/tiny-static-server/** — A real, runnable multi-file CLI project: a dependency-free static file server with directory listing and correct MIME types.
- **assets/** — Placeholder for original images/PDFs; see `assets/README.md`.

## What's covered

- `http.createServer`, the request/response lifecycle, req as a readable stream
- Manual routing by parsing `req.url` and `req.method`
- Response methods: `res.writeHead`, `res.end`, streaming a response body
- HTTP status codes worth memorizing and when to use each
- Headers: Content-Type, Content-Length, keep-alive
- Manual JSON body parsing vs framework-provided parsing
- Hands-on: a static file server, a JSON body-parsing middleware, a path-param-aware router, and a full runnable CLI project

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
