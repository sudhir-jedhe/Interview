# JS Interview Mastery

A single, well-structured repository for learning JavaScript and preparing for interviews: notes, runnable snippets, output-based ("what does this log?") questions, side-by-side comparisons, scenario-based questions, and classic interview Q&A — organized by topic instead of dumped into one giant file.

This repo is meant to be the **one place you review before an interview.**

## Why this structure

Most people collect JS interview prep as a pile of random markdown files or a single 500-question doc. That's hard to review selectively. Here, every topic gets the same six-document shape, so you always know where to look:

| File | What it's for |
|---|---|
| `README.md` | Quick summary of the topic + links to your original notes on this subject |
| `01-notes.md` | Core concept explanation — the "textbook" version |
| `02-snippets.md` | Small, runnable code snippets illustrating the concept |
| `03-output-based-questions.md` | "What does this code log?" — trains you to trace execution |
| `04-comparisons.md` | X vs Y tables (e.g. `var` vs `let` vs `const`, `map` vs `forEach`) |
| `05-scenario-questions.md` | Real-world "how would you..." problems, not trivia |
| `06-interview-questions.md` | Classic Q&A you'll actually get asked, with model answers |

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
| 14 | Asynchronous JS (Callbacks, Promises, Async/Await) | [`14-async-js`](./14-async-js) |
| 15 | Event Loop & Concurrency Model | [`15-event-loop`](./15-event-loop) |
| 16 | Error Handling | [`16-error-handling`](./16-error-handling) |
| 17 | DOM, Events & Browser APIs | [`17-dom-events-browser-apis`](./17-dom-events-browser-apis) |
| 18 | Design Patterns & Polyfills | [`18-design-patterns-polyfills`](./18-design-patterns-polyfills) |
| 19 | Memory Management & Performance | [`19-memory-performance`](./19-memory-performance) |
| 20 | Security Basics (XSS, CSRF, CORS) | [`20-security-basics`](./20-security-basics) |

See [`STUDY-PLAN.md`](./STUDY-PLAN.md) for a suggested order and pacing, and [`SOURCE-MAP.md`](./SOURCE-MAP.md) for where each topic's material was pulled from in your existing `js_polyfills` notes.

## How to use this repo

1. **Learning a topic for the first time** — read `01-notes.md`, then run the snippets in `02-snippets.md` yourself (don't just read them).
2. **Weekly review** — skim `04-comparisons.md` and `06-interview-questions.md` across all topics; these are the highest-density review material.
3. **The night before an interview** — do `03-output-based-questions.md` and `05-scenario-questions.md` only. If you can answer those cold, you're ready.
4. **Adding new material** — when you learn something new, put it in the matching file type, not a new random file. Keeps the repo searchable.

## Conventions

- Every code snippet is meant to be pasted into a browser console or Node REPL and actually run.
- Output-based questions always give the answer *and* the reasoning, not just the answer.
- Comparisons are tables first, prose second.
- Scenario questions describe a real situation (a bug, a feature request, a performance problem) — not "define X."
