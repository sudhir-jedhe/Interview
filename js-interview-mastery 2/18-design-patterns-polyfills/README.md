# Design Patterns & Polyfills

This topic covers the small set of JavaScript design patterns that come up constantly in real codebases and interviews — module, singleton, observer/pub-sub, and factory — along with debounce/throttle as practical rate-limiting patterns. It also covers writing polyfills, which is one of the most common "prove you understand the language" interview exercises: reimplementing `Array.prototype.map`, `Array.prototype.filter`, `Array.prototype.reduce`, and `Promise.all` from scratch teaches you exactly how those built-ins behave under the hood, including their edge cases. The goal isn't memorizing these implementations verbatim but understanding the general skill of decomposing a spec into code.

What's covered:
- Module pattern (IIFE + closures for private state)
- Singleton pattern
- Observer/pub-sub pattern (minimal event emitter implementation)
- Factory pattern
- Debounce and throttle: full implementations and the difference between them
- Polyfills for `Array.prototype.map`, `Array.prototype.filter`, `Array.prototype.reduce`, `Promise.all`
- The general approach to writing any polyfill from a spec

## Structure

- `theory/` — concept notes: module, singleton, observer/pub-sub, factory patterns, debounce/throttle, and the general polyfill-writing approach.
- `snippets/` — one runnable snippet per file.
- `output-based/` — one "what does this log" question per file, with the answer and reasoning.
- `scenarios/` — one real-world scenario per file, with an approach and code.
- `interview-qa/` — Q&A grouped into themed files (patterns, debounce/throttle, polyfills).
- `problems/` — hands-on "implement X" challenges with full solutions: module/singleton/observer worked examples, `map`/`filter`/`Promise.all` polyfills, a shape factory function.
- `from-your-notes/` — your original raw notes for this topic, untouched.
- `assets/` — placeholder for images/PDFs from your original notes.

This topic pairs with `../14-async-js/`'s async-task-queue project — no standalone `projects/` folder here.

> Looking for your original notes on this? See `../SOURCE-MAP.md` and `from-your-notes/` in this folder.
