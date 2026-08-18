# .on() vs .once()

| Aspect | .on() | .once() |
|---|---|---|
| Fires | Every time the event is emitted | Only the first time, then auto-removes |
| Use case | Ongoing subscriptions (data, tick, log) | One-shot lifecycle events (ready, connect, close) |
| Manual cleanup needed | Yes, call `.off()` when done | No, self-cleans |

Use `.once()` whenever you're waiting for a single occurrence (e.g., "server started"), since it prevents accidental duplicate handling and avoids manual cleanup. The common mistake is using `.on()` for one-time setup events and then leaking listeners across repeated calls to the same setup logic.

Both register listeners into the same underlying listener list and fire in registration order relative to each other — `.once()` is not special-cased to run before or after `.on()` listeners, it just removes itself immediately after its first invocation.
