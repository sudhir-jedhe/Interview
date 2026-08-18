# Clustered Server Demo

A minimal clustered HTTP server demonstrating the `cluster` module: the primary process forks one worker per CPU core, each worker runs an independent HTTP server on the same port, and the primary automatically restarts any worker that dies.

## Files

- `cluster.js` — the entry point. Runs in the primary process, forks workers, and re-forks on `exit`.
- `server.js` — the actual HTTP server logic, run once inside each worker process.
- `package.json` — `npm start` runs `cluster.js`.

## How to run

```bash
npm start
# or: node cluster.js
```

You should see one log line per CPU core as workers come online, e.g. on a 4-core machine:

```
[primary 12345] starting 4 workers on port 3000
[primary] worker 12346 is online
[primary] worker 12347 is online
[primary] worker 12348 is online
[primary] worker 12349 is online
[worker 12346] listening on :3000
[worker 12347] listening on :3000
[worker 12348] listening on :3000
[worker 12349] listening on :3000
```

## How to verify multiple workers are actually handling requests

1. **Hit the root endpoint repeatedly** and watch `handledByPid` change across requests, proving the OS/Node scheduler is distributing connections across different worker processes rather than one worker handling everything:

   ```bash
   for i in $(seq 1 10); do curl -s http://localhost:3000/ | node -e "process.stdin.resume(); process.stdin.on('data', d => console.log(JSON.parse(d).handledByPid))"; done
   ```

   Or more simply, just repeat:

   ```bash
   curl -s http://localhost:3000/
   curl -s http://localhost:3000/
   curl -s http://localhost:3000/
   ```

   and compare the `handledByPid` field across responses — with more than one core available, you should see multiple distinct PIDs appear across enough requests.

2. **Check `requestsHandledByThisWorker`** in the response — each worker keeps its own independent counter (no shared memory between cluster workers), so you'll see the count reset per worker rather than incrementing as one global total. This is a concrete illustration of why cross-worker state needs an external store (Redis, a database) rather than an in-process variable.

3. **Verify auto-restart** by killing a worker's underlying request handling on purpose:

   ```bash
   curl -s http://localhost:3000/crash
   ```

   Watch the terminal running `npm start` — you'll see that worker log an exit, followed immediately by the primary forking a fresh replacement worker. A follow-up request to `/health` or `/` will succeed again (served by a different, or the newly-restarted, worker), confirming the cluster is self-healing.

4. **Check `/health`** for a lightweight liveness-style check that returns the responding worker's PID without doing any real work:

   ```bash
   curl -s http://localhost:3000/health
   ```

## Notes

- This demo has no shared state store — it's intentionally minimal to focus on the clustering mechanics. A real production service using `cluster` for a stateful API (sessions, rate limits, caches) needs Redis or a database for anything that must be consistent across workers.
- For production deployments, consider a process manager like PM2 (`pm2 start server.js -i max`) instead of hand-rolling `cluster.js` — it adds zero-downtime reloads, log aggregation, and monitoring on top of the same underlying model shown here.
