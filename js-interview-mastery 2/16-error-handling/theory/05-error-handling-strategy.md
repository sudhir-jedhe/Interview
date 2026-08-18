# Fail-Fast vs. Graceful Degradation

Fail-fast means throwing immediately when an invariant is violated (e.g., invalid config at startup) so bugs surface loudly and early, rather than corrupting data silently. Graceful degradation means catching an error and falling back to a safe default (e.g., render cached data if a network call fails) so the user isn't blocked by a non-critical failure. The right choice depends on blast radius: fail fast for programmer errors and unrecoverable state, degrade gracefully for expected, recoverable failures like a flaky network request.

## Swallowing vs. rethrowing vs. a global handler

| Aspect | Swallow (log & continue) | Rethrow | Global handler (`window.onerror` / `unhandledrejection`) |
|---|---|---|---|
| Use case | Expected, recoverable failure (e.g., optional feature fails) | Partial handling (logging) but caller needs to know too | Last-resort logging/reporting, not primary control flow |
| Risk | Hides real bugs if overused | Requires every caller up the chain to also handle it | Too late to recover cleanly; app may be in a bad state |
| Granularity | Fine-grained, local | Fine-grained, but propagates | Coarse-grained, app-wide |

Swallowing errors indiscriminately is the most common anti-pattern — an empty `catch {}` block turns a loud bug into a silent, hard-to-diagnose one. Reserve swallowing for failures you've deliberately decided are non-critical.

## Choosing per situation

- **Fail fast**: invalid configuration at startup, a violated internal invariant (e.g., a required argument is `undefined` where it never should be), corrupted local state.
- **Graceful degradation**: a non-critical third-party widget fails to load, a cache-miss falls back to a slower path, a flaky network request that has a sensible retry or fallback UI (see `scenarios/01-fetch-with-retry-and-fallback.md`).
- **Rethrow with added context**: a low-level function catches an error only to log/annotate it, then rethrows (ideally using `{ cause }`) so a higher-level caller that actually knows how to recover still gets the chance to.
