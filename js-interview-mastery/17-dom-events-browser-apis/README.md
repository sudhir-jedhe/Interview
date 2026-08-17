# DOM, Events & Browser APIs

This topic covers how JavaScript interacts with the browser: selecting and mutating DOM nodes, the two-phase event system (capturing then bubbling) and why it enables patterns like event delegation, and the trio of methods (`preventDefault`, `stopPropagation`, `stopImmediatePropagation`) that control default behavior and propagation independently. It also covers a handful of Web APIs that come up constantly in real apps and interviews: `fetch`, storage APIs, `IntersectionObserver`, and the debounce/throttle patterns used to tame high-frequency events. Everything here is browser-specific — none of it exists in a plain Node REPL unless noted.

What's covered:
- Selecting/creating/modifying DOM nodes: `querySelector`, `createElement`, `textContent` vs `innerHTML` and XSS risk
- Event bubbling vs. capturing, and `addEventListener`'s `capture` option
- Event delegation: attaching one listener to a parent instead of many to children
- `preventDefault` vs `stopPropagation` vs `stopImmediatePropagation`
- Common Web APIs: `fetch`, `localStorage`/`sessionStorage`, `IntersectionObserver`
- Implementing debounce and throttle for scroll/resize/input handlers

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
