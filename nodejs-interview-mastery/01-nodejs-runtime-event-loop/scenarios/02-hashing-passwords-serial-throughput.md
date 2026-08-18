# You Need to Hash 10,000 Passwords on Startup and It's Taking Forever, Seemingly Serially

You call `crypto.pbkdf2` in a loop for 10,000 items and notice they don't all run concurrently — throughput plateaus.

**Approach:** `pbkdf2` (async form) runs on the libuv thread pool, whose default size is 4 — only 4 can run truly concurrently regardless of how many you kick off. Increase `UV_THREADPOOL_SIZE` (must be set as an env var before the process starts, since libuv reads it once at init):

```bash
UV_THREADPOOL_SIZE=16 node server.js
```

```js
process.env.UV_THREADPOOL_SIZE = 16; // must be set before requiring modules that init libuv — put at the very top of the entry file, or prefer the env var approach above
```

Also batch work rather than firing all 10,000 at once to avoid saturating memory, and monitor actual throughput gains — beyond the number of physical cores, adding threads gives diminishing returns. See `../theory/01-v8-libuv-architecture.md` for how the thread pool works, and `../snippets/05-threadpool-concurrent-fs-calls.md` for a minimal reproduction of the default-4 bottleneck.
