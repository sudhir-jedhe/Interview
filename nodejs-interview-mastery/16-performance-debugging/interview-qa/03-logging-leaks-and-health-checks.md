# Interview Q&A: Logging, Leak Warnings, and Health Checks

**Q: Why does `EventEmitter` warn after 10 listeners are added to the same event?**

It's a built-in leak-detection heuristic — accumulating more than 10 listeners on one event is rarely intentional and is a common symptom of a subscribe function being called repeatedly (e.g., once per request) without a matching unsubscribe. The `MaxListenersExceededWarning` is just a warning, not an error (the listeners still work), but in a long-running server it's often the first visible hint that closures — and whatever memory they reference — are silently accumulating.

**Q: Why doesn't `console.log` scale to production logging?**

It's synchronous when stdout is redirected to a file or pipe (the common case in production), which means under high log volume it can itself become a throughput bottleneck on the request path. It also has no levels, structure, or filtering — every call prints unconditionally as a free-form string, which log aggregation tools can't efficiently index or query and which gives you no way to dial verbosity per environment without editing code. A structured logger (`pino`, `winston`) fixes all three: async-friendly output, JSON fields aggregators can query, and level-based filtering that skips serialization entirely for suppressed levels.

**Q: What's the difference between a liveness check and a readiness check?**

A liveness check answers "is this process alive and not deadlocked" — it should be nearly free and dependency-free, and failing it should trigger a restart. A readiness check answers "can this instance actually serve traffic right now" — it's the right place to verify dependencies like a database connection, and failing it should just pull the instance out of load-balancer rotation, not restart it. Conflating the two (checking the database inside a liveness probe) means a transient DB blip can trigger a fleet-wide restart storm that doesn't fix the DB and makes the outage worse.
