# Design Patterns & Polyfills

This topic covers the small set of JavaScript design patterns that come up constantly in real codebases and interviews — module, singleton, observer/pub-sub, and factory — along with debounce/throttle as practical rate-limiting patterns. It also covers writing polyfills, which is one of the most common "prove you understand the language" interview exercises: reimplementing `Array.prototype.map`, `Array.prototype.reduce`, and `Promise.all` from scratch teaches you exactly how those built-ins behave under the hood, including their edge cases. The goal isn't memorizing these implementations verbatim but understanding the general skill of decomposing a spec into code.

What's covered:
- Module pattern (IIFE + closures for private state)
- Singleton pattern
- Observer/pub-sub pattern (minimal event emitter implementation)
- Factory pattern
- Debounce and throttle: full implementations and the difference between them
- Polyfills for `Array.prototype.map`, `Array.prototype.reduce`, `Promise.all`
- The general approach to writing any polyfill from a spec

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
