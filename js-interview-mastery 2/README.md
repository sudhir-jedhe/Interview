# JS Interview Mastery

A single, well-structured repository for learning JavaScript and preparing for interviews — organized by topic, and each topic is a folder of folders so it can keep growing without any single file becoming unmanageable.

This repo is meant to be the **one place you review before an interview.**

## Structure — every topic is a folder of folders

```
<topic>/
  README.md          — index for this topic
  from-your-notes/    — your original standalone notes that matched this topic, copied in as-is (only present where applicable)
  theory/             — concept explanations, one focused file per sub-concept
  snippets/           — small runnable code examples, one file per snippet
  output-based/       — "what does this log?" questions, one file per question
  scenarios/          — real-world "how would you handle X" problems, one file per scenario
  interview-qa/       — classic recall-style Q&A, grouped into a few themed files
  problems/           — hands-on "implement X from scratch" coding challenges
  projects/           — small, real, runnable projects (only where it made sense: `14-async-js`, `17-dom-events-browser-apis`)
  assets/             — your original images/PDFs on this topic (populated as you add them — see SOURCE-MAP.md)
```

## Topics

| # | Topic | Folder |
|---|---|---|
| 01 | JS Basics & Data Types | [`01-js-basics-data-types`](./01-js-basics-data-types) |
| 02 | Scope & Hoisting | [`02-scope-hoisting`](./02-scope-hoisting) |
| 03 | Functions & `this` | [`03-functions-this`](./03-functions-this) |
| 04 | Closures | [`04-closures`](./04-closures) |
| 05 | `call`, `apply` & `bind` | [`05-call-apply-bind`](./05-call-apply-bind) |
| 06 | Objects & Prototypes | [`06-objects-prototypes`](./06-objects-prototypes) |
| 07 | Classes & OOP | [`07-classes-oop`](./07-classes-oop) |
| 08 | Arrays | [`08-arrays`](./08-arrays) |
| 09 | Strings, Numbers & Math | [`09-strings-numbers-math`](./09-strings-numbers-math) |
| 10 | Operators & Type Coercion | [`10-operators-coercion`](./10-operators-coercion) |
| 11 | Destructuring, Spread & Rest | [`11-destructuring-spread-rest`](./11-destructuring-spread-rest) |
| 12 | Loops & Iterators | [`12-loops-iterators`](./12-loops-iterators) |
| 13 | ES6+ Features | [`13-es6-plus`](./13-es6-plus) |
| 14 | Asynchronous JS | [`14-async-js`](./14-async-js) |
| 15 | Event Loop & Concurrency | [`15-event-loop`](./15-event-loop) |
| 16 | Error Handling | [`16-error-handling`](./16-error-handling) |
| 17 | DOM, Events & Browser APIs | [`17-dom-events-browser-apis`](./17-dom-events-browser-apis) |
| 18 | Design Patterns & Polyfills | [`18-design-patterns-polyfills`](./18-design-patterns-polyfills) |
| 19 | Memory Management & Performance | [`19-memory-performance`](./19-memory-performance) |
| 20 | Security Basics (XSS, CSRF, CORS) | [`20-security-basics`](./20-security-basics) |

## Projects worth running

- `14-async-js/projects/async-task-queue/` — a Promise-based task queue with a concurrency limit
- `17-dom-events-browser-apis/projects/typeahead-search/` — a debounced typeahead/autocomplete with keyboard nav

See [`STUDY-PLAN.md`](./STUDY-PLAN.md) for a suggested order and [`SOURCE-MAP.md`](./SOURCE-MAP.md) for where material was pulled from your existing `js_polyfills` notes.

## How to use this repo

1. **Learning a topic for the first time** — read `theory/`, then run the code in `snippets/` yourself.
2. **Weekly review** — skim `interview-qa/` across all topics; highest-density review material.
3. **The night before an interview** — do `output-based/` and `scenarios/` only, plus `problems/` if you have time.
4. **Adding new material** — drop a new numbered file in the matching subfolder. The structure is built to keep growing without becoming unmanageable.
