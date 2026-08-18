# ES Modules

`export`/`import` is the standardized module system (as opposed to Node's older CommonJS `require`/`module.exports`). You can have any number of **named exports** plus at most **one default export** per module:

```js
// math.js
export const PI = 3.14159;
export function square(x) { return x * x; }
export default function add(a, b) { return a + b; }

// main.js
import add, { PI, square } from './math.js';
```

## Live bindings — the most important detail

A crucial and frequently-tested detail: ES module bindings are **live**, not copied snapshots. If a module updates an exported variable, every importer sees the new value:

```js
// counter.js
export let count = 0;
export function increment() { count++; }

// main.js
import { count, increment } from './counter.js';
console.log(count); // 0
increment();
console.log(count); // 1 — the imported binding tracks the live value
```

The importer cannot itself reassign the binding — only the exporting module can change it. Attempting `count = 5` from `main.js` throws a `TypeError`.

(CommonJS's `module.exports` copies primitive values at require-time, so it does not exhibit this live-binding behavior for primitives — see the comparison table below.)

## Named export vs. default export

| Aspect | Named Export | Default Export |
|---|---|---|
| Count per module | Any number | At most one |
| Import syntax | `import { name } from '...'` (name must match) | `import anyName from '...'` (importer chooses the name) |
| Renaming | `import { name as alias }` | Naturally renameable, no special syntax |
| Tooling/refactor safety | Easier for IDEs to auto-import/rename correctly | Harder to trace — the imported name is arbitrary at each call site |

Prefer named exports for anything with multiple related exports from one module (utility libraries) since it improves tree-shaking and auto-import tooling; default exports suit modules that expose exactly one primary thing (a single component/class). A common mistake is mixing many default exports across a codebase, making it hard to `grep` for usages since each importer can name the import differently.

## ES Modules vs. CommonJS (`module.exports`)

| Aspect | ES Modules (`import`/`export`) | CommonJS (`require`/`module.exports`) |
|---|---|---|
| Binding semantics | Live, read-only references | Value copied at require-time (for primitives) |
| Loading | Static — resolved at parse time, enables tree-shaking | Dynamic — resolved at runtime, anywhere in code |
| Top-level `await` | Supported | Not supported |
| Browser support | Native (`<script type="module">`) | Requires a bundler |
| File extension convention | `.mjs`, or `.js` with `"type": "module"` in `package.json` | `.cjs`, or plain `.js` by default in Node |

The most common bug this causes: a teammate exposes `module.exports = { count }` from a CommonJS module and expects consumers to see later updates to `count` — they won't, because the value was copied at the moment `module.exports` was assigned. The fix in CommonJS is to expose a getter function (`module.exports = { getCount: () => count }`) rather than the raw value, forcing consumers to always re-read the current value instead of relying on a stale copy.

## Top-level `await`

Inside an ES module (not inside a regular script or a function), you can `await` directly at the module's top level without wrapping in an `async function`:

```js
// config.mjs
const response = await fetch('/config.json');
export const config = await response.json();
```

This only works in a module context — a regular `<script>` or a CommonJS file cannot use `await` outside an `async function`.
