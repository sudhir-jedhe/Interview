# Node.js Interview Mastery

Companion repo to `js-interview-mastery` and `react-interview-mastery`, but built with a deeper, "enterprise-scale" folder shape so it can keep growing without becoming one giant file per topic.

## Structure — every topic is a folder of folders

Instead of 6 flat files per topic, each topic here is its own mini-repo:

```
<topic>/
  README.md          — index for this topic
  theory/             — concept explanations, one focused file per sub-concept
  snippets/           — small runnable code examples, one file per snippet
  output-based/       — "what does this log?" questions, one file per question
  scenarios/          — real-world "how would you handle X" problems, one file per scenario
  interview-qa/       — classic recall-style Q&A, grouped into a few themed files
  problems/           — hands-on "implement X from scratch" coding challenges
  projects/           — small, real, runnable multi-file projects (only where it made sense)
  assets/             — your original images/PDFs on this topic, copied in
  from-your-notes/    — your original standalone notes that matched this topic, copied in as-is
```

This means you can keep adding new snippets, questions, or problems to any topic forever without any single file becoming unmanageable — just drop a new numbered file in the right subfolder.

## Topics

| # | Topic | Folder |
|---|---|---|
| 01 | Node.js Runtime & Event Loop | [`01-nodejs-runtime-event-loop`](./01-nodejs-runtime-event-loop) |
| 02 | Modules (CommonJS vs ESM) | [`02-modules-commonjs-esm`](./02-modules-commonjs-esm) |
| 03 | NPM & Package Management | [`03-npm-package-management`](./03-npm-package-management) |
| 04 | File System & Streams | [`04-filesystem-streams`](./04-filesystem-streams) |
| 05 | Buffers | [`05-buffers`](./05-buffers) |
| 06 | Events & EventEmitter | [`06-events-eventemitter`](./06-events-eventemitter) |
| 07 | HTTP Server Basics | [`07-http-server-basics`](./07-http-server-basics) |
| 08 | Express Fundamentals | [`08-express-fundamentals`](./08-express-fundamentals) |
| 09 | REST API Design | [`09-rest-api-design`](./09-rest-api-design) |
| 10 | Async & Error Handling | [`10-async-error-handling`](./10-async-error-handling) |
| 11 | Middleware & Auth (JWT, sessions) | [`11-middleware-auth`](./11-middleware-auth) |
| 12 | Databases & ORMs | [`12-databases-orms`](./12-databases-orms) |
| 13 | Child Processes & Clustering | [`13-child-processes-clustering`](./13-child-processes-clustering) |
| 14 | Environment & Config | [`14-environment-config`](./14-environment-config) |
| 15 | Security Basics | [`15-security-basics`](./15-security-basics) |
| 16 | Performance & Debugging | [`16-performance-debugging`](./16-performance-debugging) |

## Projects worth running

A few topics include a real, multi-file, runnable project under `projects/` — these are the closest thing to take-home assignments:

- `04-filesystem-streams/projects/log-tailer/` — a `tail -f`-style CLI built on `fs.watch` + streams
- `07-http-server-basics/projects/tiny-static-server/` — a static file server built on raw `http` + `fs`
- `08-express-fundamentals/projects/mini-express-api/` — a small Express app with routing, middleware, and centralized error handling
- `09-rest-api-design/projects/todo-rest-api/` — a REST API for a todo list with validation and consistent error responses
- `11-middleware-auth/projects/auth-demo/` — a login/protected-route demo with JWT + bcrypt
- `13-child-processes-clustering/projects/clustered-server/` — a clustered HTTP server demonstrating multi-worker scaling

See [`STUDY-PLAN.md`](./STUDY-PLAN.md) for a suggested order and [`SOURCE-MAP.md`](./SOURCE-MAP.md) for how this maps to your existing `js_polyfills/Node JS` notes.

**Prerequisite:** solid core JavaScript (async/await, the event loop, closures) — see `js-interview-mastery` first if you haven't already.
