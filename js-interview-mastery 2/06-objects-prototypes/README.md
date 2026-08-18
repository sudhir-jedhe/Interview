# Objects & Prototypes

JavaScript objects are dynamic property bags backed by an internal prototype link, and almost every "advanced" object behavior in the language — inheritance, immutability, cloning — is really about controlling that link and the metadata attached to each property. This topic covers how objects are created and shaped, how property descriptors let you fine-tune writability and visibility, how the prototype chain resolves property lookups, and the different (and often confused) ways JavaScript exposes that chain to you. It also covers the practical, everyday problem of copying objects correctly, since shallow vs. deep cloning bugs are one of the most common sources of subtle state-mutation bugs in real applications.

### Structure

- `from-your-notes/` — original standalone notes (Maps, Meta Programming, Proxy, Reflect, key-collision merging) — untouched, kept as-is.
- `theory/` — concept write-ups: property descriptors, freeze/seal/preventExtensions, the prototype chain and the three ways to access it, own vs inherited properties, and cloning.
- `snippets/` — one short runnable example per file.
- `output-based/` — "what does this log?" questions with full explanations.
- `scenarios/` — realistic problems (deep-freezing config, a pollution-safe key-value store, tracking down shared mutable state, a prototype-based plugin system) with worked solutions.
- `interview-qa/` — Q&A grouped into property descriptors/immutability, prototype chain fundamentals, property access patterns, and cloning/merging.
- `problems/` — hands-on implementation challenges with full solutions: an `Object.create` polyfill, a from-scratch deep-clone function, and an `Object.assign` polyfill.
- `assets/` — placeholder for supporting images/PDFs from original notes.

**What's covered:**
- Object literals, property descriptors (`writable`/`enumerable`/`configurable`), and `Object.defineProperty`
- `Object.freeze` vs `Object.seal` vs `Object.preventExtensions`
- The prototype chain and how property lookup traverses it
- `__proto__` vs `Object.getPrototypeOf`/`setPrototypeOf` vs a constructor's `.prototype`
- `Object.create(null)` and dictionary-style objects
- `hasOwnProperty` vs the `in` operator, and `Object.hasOwn`
- Shallow vs deep cloning: spread, `Object.assign`, `structuredClone`, and JSON tricks
- Building `Object.create`, a deep-clone function, and an `Object.assign` polyfill from scratch

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
