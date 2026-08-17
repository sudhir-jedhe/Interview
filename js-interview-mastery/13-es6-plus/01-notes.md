# Notes: ES6+ Features

## Quick recaps (deep dives live elsewhere)

`let`/`const` are block-scoped (unlike `var`'s function scoping) and live in the "temporal dead zone" until their declaration line executes — see the scope & hoisting topic for the full mechanics. Arrow functions have no own `this`/`arguments`/`super` and can't be used as constructors — see the functions & `this` topic. Optional chaining (`?.`) and nullish coalescing (`??`) short-circuit on `null`/`undefined` — see the operators & coercion topic for exact precedence rules and gotchas with `||`.

## Template literals and tagged templates

Template literals (backticks) support interpolation and multi-line strings without escape characters:

```js
const name = 'Ada';
console.log(`Hello, ${name}!
Welcome.`);
```

A **tagged template** passes the literal's pieces to a function instead of just producing a string — the function receives an array of the literal string chunks plus the interpolated values as separate arguments:

```js
function highlight(strings, ...values) {
  return strings.reduce((acc, str, i) => `${acc}${str}${values[i] ? `[${values[i]}]` : ''}`, '');
}
console.log(highlight`Score: ${42} out of ${100}`);
// Score: [42] out of [100]
```
This underlies libraries like `styled-components` (CSS-in-JS) and safe SQL-templating utilities.

## Default parameters

```js
function greet(name = 'stranger') {
  return `Hi, ${name}`;
}
greet();        // "Hi, stranger"
greet(undefined); // "Hi, stranger" — same as omitting it
greet(null);     // "Hi, null" — null is a real value, no default applied
```

## ES Modules

`export`/`import` is the standardized module system (as opposed to Node's older CommonJS `require`/`module.exports`). You can have any number of **named exports** plus at most **one default export** per module:

```js
// math.js
export const PI = 3.14159;
export function square(x) { return x * x; }
export default function add(a, b) { return a + b; }

// main.js
import add, { PI, square } from './math.js';
```

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
(CommonJS's `module.exports` copies primitive values at require-time, so it does not exhibit this live-binding behavior for primitives.)

## `Symbol`

`Symbol()` creates a unique, primitive value guaranteed not to collide with any other symbol, even one created with the identical description string. Symbols are most commonly used as object keys to avoid property name collisions (including with keys from libraries/future spec additions) and to define "hidden" metadata properties that don't show up in `for-in`, `Object.keys()`, or `JSON.stringify()`:

```js
const id = Symbol('id');
const obj = { [id]: 123, name: 'visible' };
console.log(Object.keys(obj)); // [ 'name' ] — symbol key is skipped
console.log(obj[id]);          // 123
```

## `Map` vs. object, `Set` vs. array

`Map` allows **any value** (including objects and functions) as a key, preserves insertion order, and has an accurate `.size` — plain objects coerce non-symbol keys to strings and require manual `Object.keys(obj).length` for a count. `Set` stores unique values with fast `.has()` lookup — arrays require a linear `.includes()` scan and manual dedup logic. Use `Map`/`Set` when keys aren't simple strings, when insertion order and size matter cleanly, or when you're frequently adding/removing entries; use plain objects/arrays for simple, JSON-serializable data.

## Generators in depth

`yield*` delegates iteration to another iterable/generator, flattening it into the outer sequence:

```js
function* inner() { yield 2; yield 3; }
function* outer() {
  yield 1;
  yield* inner();
  yield 4;
}
console.log([...outer()]); // [1, 2, 3, 4]
```
Generators are the natural tool for **lazy sequences** — values are computed only as they're pulled, which is essential for infinite or expensive-to-compute sequences (see the loops & iterators topic for the full iterator protocol).

## Newer additions worth knowing

- `arr.at(-1)` — negative indexing, cleaner than `arr[arr.length - 1]`.
- `Object.hasOwn(obj, key)` — safer replacement for `obj.hasOwnProperty(key)` (works even if `obj` has no prototype, e.g. `Object.create(null)`).
- `structuredClone(obj)` — a built-in true deep clone (handles circular references, `Map`, `Set`, dates; does not clone functions or DOM nodes).
- Top-level `await` — inside an ES module (not inside a regular script or a function), you can `await` directly at the module's top level without wrapping in an `async function`.
