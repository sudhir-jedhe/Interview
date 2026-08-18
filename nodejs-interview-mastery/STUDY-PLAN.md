# Suggested Study Plan

4 weeks, ~45-60 min/day. Within each topic, go `theory/` → `snippets/` → `output-based/` → `scenarios/` → `problems/` → (if present) `projects/` → `interview-qa/` as a quick final review.

## Week 1 — Runtime fundamentals
- Day 1–2: `01-nodejs-runtime-event-loop` (the single most-tested Node topic — don't rush)
- Day 3: `02-modules-commonjs-esm`
- Day 4: `03-npm-package-management`
- Day 5–6: `04-filesystem-streams` (do the `log-tailer` project)
- Day 7: `05-buffers`

## Week 2 — Building servers
- Day 1: `06-events-eventemitter`
- Day 2–3: `07-http-server-basics` (do the `tiny-static-server` project)
- Day 4–5: `08-express-fundamentals` (do the `mini-express-api` project)
- Day 6–7: `09-rest-api-design` (do the `todo-rest-api` project)

## Week 3 — Correctness & security
- Day 1–2: `10-async-error-handling`
- Day 3–4: `11-middleware-auth` (do the `auth-demo` project)
- Day 5–6: `12-databases-orms`
- Day 7: `15-security-basics`

## Week 4 — Scaling & operating
- Day 1–2: `13-child-processes-clustering` (do the `clustered-server` project)
- Day 3: `14-environment-config`
- Day 4–5: `16-performance-debugging`
- Day 6–7: Full review — every `interview-qa/` folder + every `scenarios/` folder

## Interview-week fast pass

1. `output-based/` for topics 01, 07, 08, 10 (event loop timing, middleware order, async error propagation — the most commonly probed)
2. `scenarios/` for topics 09, 11, 13, 16 (API design, auth, scaling, debugging — the "tell me how you'd handle..." questions)
3. Every `problems/` folder if you have time — "implement X from scratch" is extremely common for Node roles specifically (EventEmitter, JWT verification, a rate limiter, a connection pool)
