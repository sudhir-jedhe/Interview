# Interview Q&A — Core Mechanics

**Q: What is EventEmitter and why is it central to Node.js?**
`EventEmitter` (from the built-in `events` module) is a class implementing the observer/pub-sub pattern: objects can emit named events, and listeners can subscribe to them. It's central because most of Node's core async APIs — streams, `http.Server`, `net.Socket`, `process` — are built by extending `EventEmitter`, making it the common vocabulary for "things that happen over an object's lifetime."

**Q: Is `emit()` synchronous or asynchronous?**
Synchronous. Calling `emitter.emit('event', ...args)` immediately and synchronously invokes every registered listener for that event, in registration order, within the same call stack — before `emit()` returns. It does not schedule listeners on the microtask or macrotask queue itself, even if the listeners themselves happen to be async functions.

**Q: What's the difference between `.on()` and `.once()`?**
`.on()` registers a listener that fires every time the event is emitted, indefinitely, until explicitly removed. `.once()` registers a listener that fires only on the first emission and then automatically removes itself — useful for one-time lifecycle events like `'connect'` or `'ready'`.

**Q: If a listener throws synchronously during `emit()`, what happens to the remaining listeners?**
If the listener throws and nothing catches it, the exception propagates up through `emit()` immediately — any listeners registered after the one that threw are **not** called, since the synchronous call stack unwinds at the throw point. This is another reason to wrap risky listener logic in try/catch internally rather than letting it escape.
