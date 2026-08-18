# Performance & Debugging — Health Check Endpoints

## Liveness vs readiness

A health check endpoint (`GET /health`) should be fast, side-effect-free, and reflect whether the process can actually serve traffic — not just "is the process running." A common split: **liveness** (is the process alive and not deadlocked — restart if this fails) vs **readiness** (can it currently serve traffic — e.g., is its DB connection up — remove from load balancer rotation if this fails, but don't necessarily restart). Avoid doing expensive work (full DB queries, calling downstream services) in a liveness check — that couples your process's basic health to a dependency's availability and can cause cascading restarts.

## Liveness checks vs readiness checks

| Aspect | Liveness (`/healthz`) | Readiness (`/readyz`) |
|---|---|---|
| Question answered | "Is the process alive/not deadlocked?" | "Can it currently serve traffic?" |
| Typical failure action | Restart the process/container | Remove from load balancer rotation, don't restart |
| What it should check | Almost nothing — just that the process responds | Downstream dependencies (DB connection, cache availability) |

Keep liveness checks trivially cheap and dependency-free — coupling it to a downstream service means a DB outage triggers a restart storm across every instance simultaneously, which doesn't fix the DB and adds restart churn on top. Readiness checks are the right place to verify dependencies, since failing readiness just pulls that instance out of rotation until the dependency recovers. The common mistake is using the same endpoint for both purposes and having it check the database — turning a transient DB blip into a full fleet restart.
