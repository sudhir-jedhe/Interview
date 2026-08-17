# Scenario Questions: Objects & Prototypes

## 1. Immutable configuration object

You're building a config loader that reads a JSON file into a JS object at startup. You want to guarantee that no part of the app can accidentally mutate the config at runtime, including nested sections like `config.database.pool`. How would you implement this, and what's the catch with the obvious one-line solution?

**Approach:** `Object.freeze(config)` alone only protects the top level — `config.database.pool.max = 999` would still succeed because `database` and `pool` are separate, unfrozen objects. You need a recursive deep-freeze:

```js
function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach((key) => {
    const value = obj[key];
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}

const config = deepFreeze({ database: { pool: { max: 10 } } });
config.database.pool.max = 999; // fails silently (or throws in strict mode)
console.log(config.database.pool.max); // 10
```

Edge cases: watch out for circular references causing infinite recursion (guard with a `WeakSet` of visited objects if the data might be cyclic), and remember `deepFreeze` doesn't stop `Array` methods that don't mutate in place — filtering/mapping still works fine, it's only in-place mutation that's blocked.

## 2. Building a case-insensitive property store without prototype pollution risk

You need a small in-memory key-value store where keys are arbitrary user-supplied strings (could be `"toString"`, `"__proto__"`, `"constructor"`, anything). Using a plain `{}` risks either colliding with inherited properties or, worse, letting a malicious key like `"__proto__"` pollute `Object.prototype`. How do you build this safely?

**Approach:** The safest simple option is `Object.create(null)` for the backing store — it has no prototype, so there is no `__proto__` accessor to hijack and no inherited method names to collide with:

```js
function createStore() {
  const store = Object.create(null);
  return {
    set(key, value) { store[key] = value; },
    get(key) { return store[key]; },
    has(key) { return Object.prototype.hasOwnProperty.call(store, key); },
  };
}

const s = createStore();
s.set("__proto__", "harmless string");
console.log(s.get("__proto__")); // "harmless string", no prototype pollution
```

An alternative is using a `Map`, which sidesteps the whole prototype-key problem entirely and is generally preferred for dynamic key sets in modern code — mention both, but `Object.create(null)` is the direct answer to "fix the object approach."

## 3. Detecting whether two "equal-looking" objects share mutable state

Your team has a bug where updating one object in a list also silently changes another. You suspect a shallow clone was used somewhere it shouldn't have been. How would you track this down and what would the fix look like?

**Approach:** First, verify the hypothesis by reference-comparing nested fields, not the top-level objects:

```js
function findSharedRefs(a, b, path = "") {
  if (a === b && typeof a === "object" && a !== null) {
    console.log("Shared reference at:", path || "(root)");
    return;
  }
  if (typeof a === "object" && a && typeof b === "object" && b) {
    for (const key of Object.keys(a)) {
      if (key in b) findSharedRefs(a[key], b[key], `${path}.${key}`);
    }
  }
}
```

Once located, the fix is almost always replacing `{ ...original }` (or `Object.assign({}, original)`) with `structuredClone(original)` at the point where independent copies are actually required, or restructuring the code so updates go through an immutable-update pattern (`{ ...original, nested: { ...original.nested, field: newValue } }`) instead of relying on a full deep clone every time, which can be wasteful for large objects.

## 4. Implementing a lightweight inheritance-based plugin system without classes

You're writing a small library where plugins should inherit shared default behavior but override specific methods, and you want to avoid the `class` syntax to keep bundle size minimal and stay closer to the metal. How do you do this with prototypes directly, and what would you watch out for?

**Approach:** Use `Object.create` to build the chain explicitly, and factory functions to construct instances:

```js
const basePlugin = {
  init() { console.log(`${this.name} initialized`); },
  run() { console.log(`${this.name} running default behavior`); },
};

function createPlugin(name, overrides = {}) {
  const plugin = Object.create(basePlugin, {
    name: { value: name, enumerable: true },
  });
  return Object.assign(plugin, overrides);
}

const logger = createPlugin("logger", {
  run() { console.log(`${this.name} writing logs`); },
});

logger.init(); // "logger initialized" (inherited)
logger.run();  // "logger writing logs" (own override)
```

Watch out for: `Object.assign(plugin, overrides)` copies overrides as *own* properties, so `hasOwnProperty` checks and `JSON.stringify` will include them but not the inherited `init`/`run` — that asymmetry can surprise consumers who serialize plugin objects expecting to see all behavior.
