# Error Handling

Errors are how JavaScript signals that something went wrong, and handling them well is what separates code that fails loudly and predictably from code that fails silently and mysteriously in production. This topic covers the mechanics of `try/catch/finally`, how to model your own error types with custom `Error` subclasses, and — critically — why synchronous error handling patterns don't automatically work across async boundaries like `setTimeout` or unhandled promise rejections. You'll also see how the runtime gives you a last line of defense through global handlers, and how to think about the tradeoff between failing fast and degrading gracefully.

What's covered:
- `try/catch/finally` mechanics, including `return` inside `try` and how `finally` still runs
- Throwing and catching custom `Error` subclasses
- The `Error` object: `message`, `name`, `stack`
- Error propagation through async code: `setTimeout`, promises, `async/await`
- Unhandled promise rejections and why `try/catch` can't catch async callback errors
- Global error handlers: `window.onerror`, `unhandledrejection`, Node's `process.on('uncaughtException')`
- Fail-fast vs. graceful degradation as a design choice

## Folder structure
- `theory/` — concept-split reference notes (try/catch/finally mechanics, custom error subclasses, async error propagation, global handlers, fail-fast vs. graceful degradation)
- `snippets/` — one focused runnable snippet per file
- `output-based/` — one "predict the output" question per file, with the answer and reasoning
- `scenarios/` — one real-world design scenario per file, with a worked approach
- `interview-qa/` — quickfire Q&A grouped by theme
- `problems/` — hands-on "implement X" challenges with full solutions (a custom `AppError` hierarchy with status codes, a Go-style `safeAsync` tuple wrapper, global unhandled-rejection/uncaught-exception handlers)
- `assets/` — placeholder for images/PDFs from your original notes

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
