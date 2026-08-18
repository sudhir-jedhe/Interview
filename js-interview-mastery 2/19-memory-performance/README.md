# Memory & Performance

This topic covers how JavaScript manages memory automatically via garbage collection, and the ways developers accidentally defeat that automation and cause memory leaks — forgotten timers, detached DOM nodes, accidental globals, and unbounded caches. It also covers closures as a double-edged sword: the same mechanism that makes private state possible can also silently pin large objects in memory for the lifetime of a callback. Finally, it covers practical performance techniques (memoization, avoiding allocation in hot paths) and `WeakMap`/`WeakSet`, which exist specifically to let you associate data with objects without preventing those objects from being collected.

What's covered:
- Garbage collection: reachability and mark-and-sweep, conceptually
- Common memory leak sources: timers/intervals, detached DOM nodes, accidental globals, unbounded caches/listeners
- How closures can accidentally retain large objects
- Memoization as a performance technique
- Debounce/throttle as performance techniques (cross-reference `../18-design-patterns-polyfills/`)
- Avoiding unnecessary allocation in hot paths
- `WeakMap`/`WeakSet` and why they don't prevent garbage collection of their keys

## Structure

- `theory/` — concept notes: GC/reachability, common leak sources, closures retaining large objects, memoization, WeakMap/WeakSet, avoiding allocation in hot paths.
- `snippets/` — one runnable snippet per file.
- `output-based/` — one "what does this log" question per file, with the answer and reasoning.
- `scenarios/` — one real-world scenario per file, with an approach and code.
- `interview-qa/` — Q&A grouped into themed files (garbage collection & leaks, WeakMap/WeakSet, performance techniques).
- `problems/` — hands-on "implement X" challenges with full solutions: a deliberate memory leak and its fix, a memoization cache with LRU-ish eviction, a WeakMap-based metadata cache.
- `from-your-notes/` — your original raw notes for this topic, untouched.
- `assets/` — placeholder for images/PDFs from your original notes.

No standalone `projects/` folder for this topic.

> Looking for your original notes on this? See `../SOURCE-MAP.md` and `from-your-notes/` in this folder.
