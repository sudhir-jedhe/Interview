# Objects & Prototypes

JavaScript objects are dynamic property bags backed by an internal prototype link, and almost every "advanced" object behavior in the language — inheritance, immutability, cloning — is really about controlling that link and the metadata attached to each property. This topic covers how objects are created and shaped, how property descriptors let you fine-tune writability and visibility, how the prototype chain resolves property lookups, and the different (and often confused) ways JavaScript exposes that chain to you. It also covers the practical, everyday problem of copying objects correctly, since shallow vs. deep cloning bugs are one of the most common sources of subtle state-mutation bugs in real applications.

What's covered:
- Object literals, property descriptors (`writable`/`enumerable`/`configurable`), and `Object.defineProperty`
- `Object.freeze` vs `Object.seal` vs `Object.preventExtensions`
- The prototype chain and how property lookup traverses it
- `__proto__` vs `Object.getPrototypeOf`/`setPrototypeOf` vs a constructor's `.prototype`
- `Object.create(null)` and dictionary-style objects
- `hasOwnProperty` vs the `in` operator
- Shallow vs deep cloning: spread, `Object.assign`, `structuredClone`, and JSON tricks

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
