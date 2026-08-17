# Source Map — where this content came from / what's still in your old notes

Your `js_polyfills/Javascript` folder already has an enormous amount of material (2,000+ files once you go a few levels deep) — you'd already built most of a curriculum, just not in one consistently-shaped structure. Rather than blindly copying thousands of files (including huge PDFs and screenshots) into this repo, this map does two things:

1. **Physically copied**: ~36 of your clearly topic-specific standalone `.md` files were copied as-is into the matching new topic folder, under a `from-your-notes/` subfolder. Nothing was deleted or modified in your original folder.
2. **Mapped, not copied**: your deep, already-well-organized numbered folders (`1. Introduction` through `13. Problems`, plus dozens of subject folders like `Fetch API`, `storage`, `prototype`, etc.) are listed below so you know exactly where to look when a topic here needs more depth than what's in `01-notes.md`/`02-snippets.md`. These often contain hundreds of nested files (individual coding problems, output screenshots, etc.) that are worth skimming manually rather than dumping in bulk.

All paths below are relative to `js_polyfills/Javascript/`.

| New topic | Copied into `from-your-notes/` | Also check in your old notes |
|---|---|---|
| `01-js-basics-data-types` | — | `1. Introduction/`, `3. Data Type/` (has a `Coercion/` subfolder), `premitive/` (boolean, difference, null, number, undefined) |
| `02-scope-hoisting` | JavaScript Scope.md, JavaScript var let and const.md | `2. Variable Scope & Hoisting/` (has an `Output/` subfolder — good output-based material), `Strict mode/` |
| `03-functions-this` | — | `5. Function/` (arrowFunction, first class function, higher order function, IIFE, pure function, unary function), `this/` |
| `04-closures` | — | `10. Closures/Closure/` |
| `05-call-apply-bind` | — | `3. call apply bind/` (has `apply/`, `bind/`, `call/` subfolders) |
| `06-objects-prototypes` | How do I convert JS objects into Maps.md, JavaScript Meta Programming.md, JavaScript Proxy.md, JavaScript Reflect.md, What happen if the keys are same.md | `6. Object/` (deepClone, deepEqual, deepMerge, immutabilityHelper, chaining, compact, Map/, Weak Map/), `prototype/` |
| `07-classes-oop` | OOP Concepts in JavaScript.md, SOLID in JavaScript.md | `class/` |
| `08-arrays` | map vs filter.md | `7. Array/` (has an `Array Methods/` subfolder with ~20 individual method folders: append, at, clone, concat, fill, filter, forEach, map, pop, push, reduce, reduceRight, toReversed, toString, transpose, unique, unShift, plus `interview/`, `Problems/`), `13. Problems/array/` |
| `09-strings-numbers-math` | JavaScript Temporal.md | `8. Number/`, `8. String/`, `Math/`, `Date/`, `13. Problems/number/`, `13. Problems/string/` |
| `10-operators-coercion` | Nullish coalescing.md | `11. Operators/` (has an `equality/` subfolder with a `difference/` note — likely your `==` vs `===` deep dive), `3. Data Type/Coercion/`, `Conversion/`, `Operator/` |
| `11-destructuring-spread-rest` | — | `Destructuring/`, `Default Parameter/` |
| `12-loops-iterators` | How do you iterate over object properties and array items.md | `Loops/`, `5. Function/JS Loops/` |
| `13-es6-plus` | JavaScript module system.md, Map.md | `ES6/` (Generators, Iterables, Iterators, Symbol), `modules/`, `JavaScript Maps/`, `JavaScript JSON/` |
| `14-async-js` | Promises vs setTimeout.md | `9. Asynchronous/` (asyncAwait/, promises/), `12. Promises/` |
| `15-event-loop` | — | `4. EventLoop/`, `JS Engine/`, `setinterval_setTimeOut/`, `Timeouts/` |
| `16-error-handling` | — | `Error/` |
| `17-dom-events-browser-apis` | JavaScript HTML DOM (Collections/Elements/Navigation/Node Lists).md, JavaScript Validation API.md, JavaScript Window (BOM/History/Location/Navigator/Screen).md, Web History API.md, indexDB.md, localStorageWithExpiry.md, logout.md, logoutFromCrossTab.md | `events/` (diference, eventFlow, mouseEvents, server-sent-event), `Fetch API/` + `JavaScript Fetch API/` (huge — API batching, caching, retries, rate limiting), `storage/` (cookie, indexDB, localStorage, sessionStorage, storage event), `Web Component/`, `Web Geolocation API/`, `Web Socket/`, `Web Storage/`, `web worker/`, `service worker/`, `Axios/`, `CORS/` |
| `18-design-patterns-polyfills` | LazyMan.md, lazyChain.md, Modular Pattern in js.md | `Polyfils/` (your existing polyfill collection — worth merging with `06-interview-questions.md`'s polyfill answers), `Architecture/`, `12.Output/tryCatch/` |
| `19-memory-performance` | Memory Leakage.md, Tree Shaking.md | `Web Performance/` |
| `20-security-basics` | — | `Web Security/`, `CORS/` |
| *(general / cross-topic)* | quirk Output.md → `_bonus-source-material/` | `12.Output/` (output-based questions folder), `13. Problems/` (array/number/object/string coding problems), `Interview/allQuiz.md` (from your top-level `Interview/` folder), `interview repo.md`, `inteview11.md`, `top-javascript-interview-questions-main/` (looks like a clone of the popular sudheerj/lydiahallie-style interview question repos — great cross-reference for `06-interview-questions.md` files), `Usecase /` (scenario-style material) |

## What wasn't touched

Your `js_polyfills` folder also has large non-JS-fundamentals sections (React, Next.js, Node.js, Redux, TypeScript, System Design, DSA/Algorithm, Databases, DevOps, etc.) — those are out of scope for this specific "core JavaScript" repo and were left exactly where they are. If you want a matching structure for React or Node interview prep, that's a good follow-up repo built the same way.

## Suggested next pass (manual, when you have time)

The most valuable thing to do by hand: open `7. Array/Array Methods/`, `Fetch API/` + `JavaScript Fetch API/`, and `Polyfils/` — these three are your deepest, most interview-relevant folders and weren't fully absorbed here. Skim each subfolder and paste anything good directly into the matching `02-snippets.md` or `06-interview-questions.md` in this repo.
