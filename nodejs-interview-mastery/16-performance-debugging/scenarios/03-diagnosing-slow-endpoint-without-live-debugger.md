# Scenario: You need to find why a specific production endpoint is slow, but you can't attach a live debugger

A specific endpoint is reported as slow in production (p99 latency far above other routes), but the environment is a headless container with no way to forward a Chrome DevTools connection, and you don't want to risk exposing an inspector port on a live service.

**Approach:** Use `node --prof` to capture a CPU profile to disk without needing any live debugger attachment, then process it offline. Reproduce the load against a staging instance running the same code with the flag enabled (or, if safe, a canary instance in production):

```bash
node --prof server.js
# drive representative load against the slow endpoint (e.g. with autocannon or k6)
# then stop the process — this writes isolate-0x*-v8.log to the working directory

node --prof-process isolate-0x*-v8.log > processed.txt
```

`processed.txt` contains a "Summary" section (ticks by category: JS, C++, GC, etc.) and a "Bottom up (heavy) profile" that shows which functions consumed the most time, including their callers. A high percentage of ticks in `GC` often points to excessive allocation (e.g., rebuilding large objects/arrays per request) rather than raw compute cost — a different fix (reduce allocations, reuse buffers) than a hot inefficient loop would need.

For an even faster iteration loop, tools like `clinic.js` (`clinic doctor -- node server.js`) wrap this same `--prof`-style profiling with an automated diagnosis (recommending whether the bottleneck looks like I/O, event-loop blocking, or GC pressure) and produce an interactive flame graph without manually running `--prof-process`.
