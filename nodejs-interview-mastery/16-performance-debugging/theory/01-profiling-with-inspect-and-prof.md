# Performance & Debugging — Profiling with `--inspect` and `--prof`

## Profiling with `--inspect` and Chrome DevTools

Running `node --inspect server.js` opens a debugging WebSocket that Chrome DevTools (via `chrome://inspect`) or VS Code can attach to, giving you breakpoints, a live call stack, and a **CPU profiler** you can start/stop while the app runs. This is the go-to tool for "why is this endpoint slow" — record a profile while hitting the slow route, then look at the flame chart for functions consuming disproportionate self-time.

```bash
node --inspect server.js
# then open chrome://inspect in Chrome, click "inspect" under Remote Target
```

For production, `--inspect` binds to localhost by default (safe), but never expose the inspector port publicly — it grants full remote code execution to anyone who can reach it.

## `node --prof` — offline profiling without a debugger

An alternative, script-friendly profiler is `node --prof`, which writes a V8 tick log to disk without needing DevTools attached — useful for profiling short-lived scripts or CI environments where attaching a debugger isn't practical:

```bash
node --prof app.js
node --prof-process isolate-0x*-v8.log > processed.txt
```

## `--inspect` vs `node --prof`

| Aspect | `--inspect` + DevTools | `node --prof` |
|---|---|---|
| Interaction | Live, interactive (breakpoints, real-time CPU/memory profiling) | Offline — writes a tick log you process afterward |
| Best for | Debugging a running server, exploring a specific slow request interactively | Profiling short-lived scripts, CI environments, or when you can't attach a debugger |
| Output | Flame charts, heap snapshots, in-browser UI | A text log processed via `--prof-process` into a summary |
| Setup overhead | Requires Chrome/VS Code attached | Just a CLI flag, no attachment needed |

Use `--inspect` for interactive investigation of a running process (most common case in day-to-day debugging); use `--prof` when you need a profile from an environment without a debugger UI, like a CI job or a headless server you can SSH into but not forward DevTools to. The common mistake is leaving `--inspect` bound to a non-localhost interface in production, which exposes full remote debugging (including code execution) to anyone who can reach that port.
