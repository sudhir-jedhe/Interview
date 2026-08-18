# DOM, Events & Browser APIs

This topic covers how JavaScript interacts with the browser: selecting and mutating DOM nodes, the two-phase event system (capturing then bubbling) and why it enables patterns like event delegation, and the trio of methods (`preventDefault`, `stopPropagation`, `stopImmediatePropagation`) that control default behavior and propagation independently. It also covers a handful of Web APIs that come up constantly in real apps and interviews: `fetch`, storage APIs, `IntersectionObserver`, and the debounce/throttle patterns used to tame high-frequency events. Everything here is browser-specific — none of it exists in a plain Node REPL unless noted.

What's covered:
- Selecting/creating/modifying DOM nodes: `querySelector`, `createElement`, `textContent` vs `innerHTML` and XSS risk
- Event bubbling vs. capturing, and `addEventListener`'s `capture` option
- Event delegation: attaching one listener to a parent instead of many to children
- `preventDefault` vs `stopPropagation` vs `stopImmediatePropagation`
- Common Web APIs: `fetch`, `localStorage`/`sessionStorage`, `IntersectionObserver`
- Implementing debounce and throttle for scroll/resize/input handlers

## Structure

- `theory/` — concept notes: DOM selection/mutation, event propagation, event delegation, event control methods, common Web APIs, debounce/throttle.
- `snippets/` — one runnable snippet per file.
- `output-based/` — one "what does this log" question per file, with the answer and reasoning.
- `scenarios/` — one real-world scenario per file, with an approach and code.
- `interview-qa/` — Q&A grouped into themed files (DOM rendering & security, events & listeners, Web APIs & rate-limiting).
- `problems/` — hands-on "implement X" challenges with full solutions: event delegation for a dynamic list, debounce + throttle from scratch, a custom event system.
- `projects/typeahead-search/` — a full runnable browser project: a debounced typeahead/autocomplete search box with keyboard navigation.
- `from-your-notes/` — your original raw notes for this topic, untouched.
- `assets/` — placeholder for images/PDFs from your original notes.

> Looking for your original notes on this? See `../SOURCE-MAP.md` and `from-your-notes/` in this folder.
