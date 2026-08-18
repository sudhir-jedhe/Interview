# `Symbol`

`Symbol()` creates a unique, primitive value guaranteed not to collide with any other symbol, even one created with the identical description string. Symbols are most commonly used as object keys to avoid property name collisions (including with keys from libraries/future spec additions) and to define "hidden" metadata properties that don't show up in `for-in`, `Object.keys()`, or `JSON.stringify()`:

```js
const id = Symbol('id');
const obj = { [id]: 123, name: 'visible' };
console.log(Object.keys(obj)); // [ 'name' ] — symbol key is skipped
console.log(obj[id]);          // 123
console.log(JSON.stringify(obj)); // {"name":"visible"}
```

## Uniqueness, not string identity

The description passed to `Symbol()` is purely for debugging/display (`symbol.toString()` / `symbol.description`) — it plays no role in equality:

```js
const s1 = Symbol('id');
const s2 = Symbol('id');
console.log(s1 === s2); // false — always a brand-new value
```

## Well-known symbols

The language itself uses symbols for extensibility hooks, the most important being `Symbol.iterator` — the property an object must implement to be usable with `for-of` and the spread operator (see the loops & iterators topic for the full iterator protocol). Plain objects don't have this by default:

```js
const obj = {};
console.log(obj[Symbol.iterator]); // undefined — objects aren't iterable by default
```

## Registry symbols (`Symbol.for`)

`Symbol()` always creates a new symbol, but `Symbol.for(key)` looks up (or creates) a symbol in a **global registry** keyed by string — calling it twice with the same key returns the *same* symbol, which is useful when independent parts of an app (or separate bundles) need to agree on one shared symbol without importing a module reference:

```js
const a = Symbol.for('app.eventBus');
const b = Symbol.for('app.eventBus');
console.log(a === b); // true — same registry entry
```

## Why use a symbol as a key instead of a string

- Guaranteed collision-proof, even against keys added later by other code sharing the same object.
- Automatically excluded from `for-in`, `Object.keys()`, `Object.entries()`, and `JSON.stringify()` — useful for attaching metadata that shouldn't leak into normal enumeration or serialization.
- Still accessible intentionally via `Object.getOwnPropertySymbols(obj)` — symbols are not truly private, just non-enumerable by default mechanisms.
