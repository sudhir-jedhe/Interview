# Child Processes & Clustering — Process Managers (PM2)

## Why hand-rolled `cluster` isn't the whole story

Hand-rolling `cluster.fork()` restart logic works but misses production concerns PM2 handles for free: zero-downtime reloads (start new workers, wait for them to be ready, then kill old ones — no dropped connections during a deploy), automatic restart on crash with backoff, centralized log capture, and a CLI/API for monitoring. Conceptually PM2 is the same primary/worker model as `cluster`, just operationalized.

```bash
# Hand-rolled cluster: you own restart logic, log redirection, deploy strategy
node cluster.js

# PM2: same underlying model, batteries included
pm2 start server.js -i max   # one worker per CPU core
pm2 reload server             # zero-downtime reload
pm2 logs                      # centralized log tailing
pm2 monit                     # live CPU/memory dashboard
```

## Hand-rolled `cluster` vs PM2

| Aspect | Hand-rolled cluster | PM2 |
|---|---|---|
| Auto-restart on crash | Manual (`cluster.on('exit', ...)`) | Built-in, with backoff |
| Zero-downtime deploy | Must implement graceful worker replacement yourself | `pm2 reload` handles it out of the box |
| Log management | Manual (redirect stdout/stderr yourself) | Centralized log files + rotation |
| Monitoring/CLI | None | `pm2 monit`, `pm2 status`, web dashboard option |

For a quick script or when you want full control, hand-rolled `cluster` is fine. For production services, a process manager saves you from re-implementing restart policies, graceful reloads, and log rotation that have already been solved. The common mistake is shipping hand-rolled cluster code to production without an exit handler that re-forks — a single crashed worker silently reduces your capacity until someone notices.
