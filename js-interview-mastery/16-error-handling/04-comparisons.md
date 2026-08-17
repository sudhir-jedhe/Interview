# Comparisons: Error Handling

## `throw` a string vs. `throw` an `Error` object

| Aspect | `throw "message"` | `throw new Error("message")` |
|---|---|---|
| Stack trace | None | Has `.stack` for debugging |
| Type identification | Impossible to `instanceof` check | `instanceof Error` / custom subclass checks work |
| Tooling support | Debuggers/loggers often assume Error objects | First-class support everywhere (Sentry, console, etc.) |
| Convention | Non-idiomatic, avoid | Idiomatic in virtually all JS codebases |

Always throw `Error` (or a subclass), never a bare string or plain object. The most common mistake is throwing a string for a "quick" error and later needing a stack trace or type check that isn't there.

## `try/catch` around sync code vs. around `await`

| Aspect | `try/catch` around sync throw | `try/catch` around `await somePromise` |
|---|---|---|
| What it catches | Synchronous exceptions on the current call stack | Rejections of the awaited promise, converted to a throw |
| Timing | Immediate | Only after the promise settles (later event loop turn) |
| Catches `setTimeout` callback throws? | No | No (unless the callback itself is wrapped) |
| Requires | Nothing special | Function must be `async`; `await` must be used, not just calling the async function |

The common mistake is assuming `try/catch` around a function *call* automatically protects against errors that occur inside a `setTimeout`, event handler, or unawaited promise fired from within that function — it does not, because those run outside the synchronous stack frame the `try` is watching.

## `catch (e) {}` (swallow) vs. rethrow vs. global handler

| Aspect | Swallow (log & continue) | Rethrow | Global handler (`window.onerror` / `unhandledrejection`) |
|---|---|---|---|
| Use case | Expected, recoverable failure (e.g., optional feature fails) | Partial handling (logging) but caller needs to know too | Last-resort logging/reporting, not primary control flow |
| Risk | Hides real bugs if overused | Requires every caller up the chain to also handle it | Too late to recover cleanly; app may be in a bad state |
| Granularity | Fine-grained, local | Fine-grained, but propagates | Coarse-grained, app-wide |

Swallowing errors indiscriminately is the most common anti-pattern — an empty `catch {}` block turns a loud bug into a silent, hard-to-diagnose one. Reserve swallowing for failures you've deliberately decided are non-critical.

## `finally` vs. code placed after the `try/catch` block

| Aspect | `finally` block | Code after `try/catch` |
|---|---|---|
| Runs if `try`/`catch` returns early | Yes, always | No — a `return` skips it |
| Runs if an error propagates uncaught (no matching `catch`) | Yes | No — execution has already left the function |
| Typical use | Cleanup: closing files, releasing locks, hiding spinners | Normal continuation logic |

The mistake people make is putting cleanup logic after the `try/catch` instead of in `finally`, then being surprised the cleanup doesn't run when an early `return` or uncaught rethrow exits the function before reaching that code.
