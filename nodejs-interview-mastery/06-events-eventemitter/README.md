# Events & EventEmitter

`EventEmitter` is the foundational pattern underlying almost all of Node's async APIs — streams, the HTTP module, process signals, and countless third-party libraries all extend it. Understanding its mechanics deeply — synchronous emission, listener ordering, the special-cased `'error'` event, and memory-leak warnings — is essential both for debugging real Node applications and for interviews, since it's one of the most commonly probed "do you actually understand Node" topics. This topic walks through the API surface, the subtle synchronous-vs-asynchronous behavior that surprises newcomers, and how to build your own pub/sub system on top of it.

## Structure

- **theory/** — Concept-by-concept notes: fundamentals & the core API, synchronous emission semantics, on vs once, the special 'error' event, memory leaks/MaxListeners, and pub/sub vs Promises.
- **snippets/** — One focused, runnable code example per file, each with its explanation.
- **output-based/** — "What does this log?" questions covering emission order, async listeners, re-entrant emits, and listener limits.
- **scenarios/** — Real-world engineering scenarios (job queues, listener leaks, high-fanout chat rooms, pub/sub buses) with a worked approach.
- **interview-qa/** — Q&A pairs grouped into core mechanics, error handling/leaks, and listener management/async patterns.
- **problems/** — Hands-on implementation problems (build your own EventEmitter, a namespaced pub/sub bus, fix a real listener leak) with full worked solutions.
- **assets/** — Placeholder for original images/PDFs; see `assets/README.md`.

## What's covered

- EventEmitter as the base class for streams, HTTP, and more
- `.on`/`.once`/`.emit`/`.off` mechanics and listener ordering
- Why `emit()` is synchronous, and why that matters
- The special `'error'` event and unhandled-error crashes
- `MaxListenersExceededWarning` and memory leak causes
- Building a simple pub/sub system with EventEmitter
- Hands-on: implementing your own EventEmitter, a wildcard-capable pub/sub bus, and diagnosing/fixing a real listener leak

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
