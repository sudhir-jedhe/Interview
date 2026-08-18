# `target` and `lib`: What APIs TypeScript Assumes Exist

`target` and `lib` are two of the most misunderstood `tsconfig.json` options because they sound related to bundling or transpilation output quality, but their actual job is narrower: they control **what JavaScript syntax gets downleveled** and **what global APIs the type checker assumes are available** at runtime, respectively.

## `target`: syntax downleveling

`target` tells the TypeScript compiler which ECMAScript version to emit. If you write modern syntax (optional chaining, class fields, async generators) and set `target: "ES2017"`, the compiler transforms that syntax into equivalent ES2017-compatible code — for example, downleveling `async`/`await` into generator-based polyfilled code on very old targets, or leaving it untouched on newer ones.

```json
{ "compilerOptions": { "target": "ES2020" } }
```

This matters for interview purposes mainly because of a common gotcha: **`target` also implicitly sets a default `lib`**. If you set `target: "ES5"` and don't separately specify `lib`, TypeScript assumes only ES5-level global APIs exist — no `Promise`, no `Array.prototype.includes`, no `Map`/`Set` — and using them produces `Cannot find name 'Promise'` type errors, even though your actual JS runtime (a modern browser or Node) fully supports them.

## `lib`: what globals the type checker knows about

`lib` is a list of ambient type declaration files to include — it does *not* polyfill anything at runtime, it only tells the *type checker* what's assumed to exist so you get proper autocomplete and error checking for those APIs.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

- `"ES2020"` (or any ES version) — enables typings for that version's built-ins: `Promise`, `Array` methods, `Object.fromEntries`, etc.
- `"DOM"` — enables typings for browser globals: `window`, `document`, `fetch`, `HTMLElement`, and so on. Required for any frontend code; omit it for a pure Node backend where those globals don't exist (or you'd get false-positive autocomplete for APIs that will crash at runtime).
- `"DOM.Iterable"` — adds iterator support to DOM collections like `NodeList`, enabling `for...of` over `document.querySelectorAll(...)`.

## Common gotcha: target/lib mismatch

Setting `target: "ES5"` while writing `for (const x of someIterable)` or using `async`/`await` doesn't fail — TypeScript downlevels the syntax. But if you *also* forget to add the right `lib` entries for features you use (like `Symbol.iterator`-based iteration needing `lib: ["ES2015"]` or higher), you'll get confusing errors about missing global types even though the syntax itself compiles fine. `target` and `lib` are independent knobs: one controls output syntax, the other controls the assumed global type surface, and mismatching them is a frequent source of "why is this failing to compile when the code looks completely normal" bug reports.

## Practical guidance

For most modern projects (Node 18+, evergreen browsers), set `target` to a recent ES version (`ES2020`/`ES2022`) so minimal downleveling work happens, and set `lib` explicitly rather than relying on the `target`-implied default — this makes intent clear and avoids surprises when `target` changes later for build-performance or output-size reasons but `lib` should stay the same (or vice versa).
