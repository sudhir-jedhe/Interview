Explain how Object.getOwnPropertyNames, Object.getOwnPropertySymbols, and Reflect.ownKeys work in JavaScript.

When inspecting properties on a JavaScript object, standard utilities like `Object.keys()` or `for...in` loops only return **enumerable string keys**. They miss non-enumerable properties (like internal flags or hidden methods) and **Symbol keys** (used for unique property identifiers and metadata).

To perform a complete inspection of an object's own properties without walking up the prototype chain, JavaScript provides three lower-level reflection methods: **`Object.getOwnPropertyNames()`**, **`Object.getOwnPropertySymbols()`**, and **`Reflect.ownKeys()`**.

---

## Quick Comparison Matrix

| Method                                  | Returns String Keys? | Returns Symbol Keys? | Enumerable Properties | Non-Enumerable Properties | Checks Prototype Chain? |
| --------------------------------------- | -------------------- | -------------------- | --------------------- | ------------------------- | ----------------------- |
| **`Object.getOwnPropertyNames(obj)`**   | ✅ **Yes**            | ❌ No                 | ✅ Included            | ✅ Included                | ❌ No                    |
| **`Object.getOwnPropertySymbols(obj)`** | ❌ No                 | ✅ **Yes**            | ✅ Included            | ✅ Included                | ❌ No                    |
| **`Reflect.ownKeys(obj)`**              | ✅ **Yes**            | ✅ **Yes**            | ✅ Included            | ✅ Included                | ❌ No                    |

---

## 1. `Object.getOwnPropertyNames(obj)`

`Object.getOwnPropertyNames()` returns an array of **all string-keyed property names** belonging directly to an object, **regardless of whether they are enumerable**.

### Key Behaviors

* **Includes Non-Enumerables:** Returns hidden properties created via `Object.defineProperty()` where `enumerable: false`.
* **Ignores Symbols:** Symbol-keyed properties are completely ignored.
* **Ignores Prototype:** Does not traverse up the prototype chain.

```javascript
const idSymbol = Symbol('id');

const user = {
  name: 'Alice',       // Enumerable String
  [idSymbol]: 1001     // Symbol
};

// Define a non-enumerable string property
Object.defineProperty(user, 'role', {
  value: 'Admin',
  enumerable: false
});

console.log(Object.keys(user));
// Output: ['name'] (Object.keys skips non-enumerable 'role' & symbol 'idSymbol')

console.log(Object.getOwnPropertyNames(user));
// Output: ['name', 'role'] (Includes non-enumerable 'role', skips symbol)

```

---

## 2. `Object.getOwnPropertySymbols(obj)`

Symbols were introduced in ES6 to create unique, non-colliding property keys. Because standard string-based reflection tools ignore Symbols by design, `Object.getOwnPropertySymbols()` exists specifically to locate **all Symbol-keyed properties** on an object.

### Key Behaviors

* **Symbol Keys Only:** Returns an array containing **only** Symbol primitives used as keys on the object.
* **Includes Non-Enumerable Symbols:** Returns both enumerable and non-enumerable Symbol properties.
* **Ignores String Keys:** String keys are completely excluded.

```javascript
const SECRET_KEY = Symbol('secret');
const PUBLIC_KEY = Symbol('public');

const app = {
  appName: 'Dashboard',
  [PUBLIC_KEY]: 'public-token'
};

Object.defineProperty(app, SECRET_KEY, {
  value: 'super-secret-token',
  enumerable: false
});

console.log(Object.getOwnPropertySymbols(app));
// Output: [ Symbol(public), Symbol(secret) ]

```

---

## 3. `Reflect.ownKeys(obj)` (The Universal Inspector)

Introduced in ES6 alongside the `Reflect` API, `Reflect.ownKeys()` is equivalent to combining `Object.getOwnPropertyNames()` and `Object.getOwnPropertySymbols()`.

It returns an array of **ALL own property keys** on an object—string keys, symbol keys, enumerable, and non-enumerable alike.

$$\text{Reflect.ownKeys}(obj) = \text{Object.getOwnPropertyNames}(obj) + \text{Object.getOwnPropertySymbols}(obj)$$

### Deterministic Determinant Key Ordering

`Reflect.ownKeys()` follows the strict **OwnPropertyKeys** specification order defined in ECMAScript:

1. **Integer Indices:** Ascending numeric keys (e.g., `"0"`, `"1"`, `"2"`).
2. **String Keys:** Remaining string keys in chronological insertion order.
3. **Symbol Keys:** Symbol keys in chronological insertion order.

```javascript
const sym = Symbol('mySymbol');

const complexObj = {
  "b": "string B",
  [sym]: "symbol value",
  "10": "numeric 10",
  "a": "string A",
  "2": "numeric 2"
};

Object.defineProperty(complexObj, 'hiddenProp', {
  value: 'hidden',
  enumerable: false
});

console.log(Reflect.ownKeys(complexObj));
// Output: [ '2', '10', 'b', 'a', 'hiddenProp', Symbol(mySymbol) ]
//         └─ Integer ─┘  └── Strings (In order) ──┘  └─ Symbol ─┘

```

---

## 4. Practical Example: Deep Object Cloning / Serialization

`JSON.stringify()` and `Object.assign()` skip non-enumerable properties and custom Symbols. To build a robust utility that copies **every single property descriptor** from a source object to a target object, use `Reflect.ownKeys()`:

```javascript
function completeClone(source) {
  const clone = Object.create(Object.getPrototypeOf(source));

  // Reflect.ownKeys ensures we get String, Symbol, Enumerable, and Non-enumerable keys!
  Reflect.ownKeys(source).forEach((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(source, key);
    Object.defineProperty(clone, key, descriptor);
  });

  return clone;
}

// Testing the clone:
const original = { visible: true };
const secretSym = Symbol('secret');

Object.defineProperty(original, secretSym, {
  value: 'top-secret',
  enumerable: false,
  writable: false
});

const cloned = completeClone(original);

console.log(cloned.visible); // true
console.log(Reflect.getOwnPropertyDescriptor(cloned, secretSym));
// Output: { value: 'top-secret', writable: false, enumerable: false, configurable: true }

```

---

## Summary Cheat Sheet

| Task                                                                 | Recommended Utility                     |
| -------------------------------------------------------------------- | --------------------------------------- |
| Get standard, user-visible string keys                               | **`Object.keys(obj)`**                  |
| Get ALL string keys (including hidden/internal ones)                 | **`Object.getOwnPropertyNames(obj)`**   |
| Find hidden Symbol keys on an object                                 | **`Object.getOwnPropertySymbols(obj)`** |
| Get 100% of an object's own keys for cloning, proxying, or debugging | **`Reflect.ownKeys(obj)`**              |
