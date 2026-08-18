# Interview Q&A: WeakMap & WeakSet

**Q: What's the difference between `Map` and `WeakMap`?**
`Map` holds strong references to its keys, so entries — and the objects used as keys — are never garbage collected while the `Map` itself is reachable, and it supports iteration and a `.size` property. `WeakMap` holds only weak references to its (object-only) keys, so an entry is automatically removed once its key becomes otherwise unreachable, which is exactly why it deliberately doesn't support iteration or `.size` — its contents can change at any time outside your control.

**Q: Why would you choose a `WeakMap` over a plain object or `Map` for caching per-object metadata?**
Because a `WeakMap` doesn't prevent the key object from being garbage collected — once the object is no longer referenced elsewhere, both it and its associated metadata entry are freed automatically. A plain object or `Map` would keep the key (and everything it references) alive indefinitely as long as the cache itself exists, which is a leak if the cache outlives the objects it's tracking.

**Q: Why does `WeakSet`/`WeakMap` not support iteration?**
Because their contents can be silently removed by garbage collection at any moment outside the program's control, so the size and membership at any instant aren't deterministic or observable in a stable way. Allowing iteration would expose collection timing (an implementation detail the spec explicitly wants to keep unobservable), so the language omits `Symbol.iterator` and `.size` from both entirely.
