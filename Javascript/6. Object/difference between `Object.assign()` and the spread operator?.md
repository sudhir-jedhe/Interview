Both **`Object.assign()`** and the **spread operator (`...`)** perform shallow copying and merging of objects in JavaScript. While they achieve similar results in many everyday scenarios, they have important structural, functional, and engine-level differences.

---

## 1. Quick Comparison Matrix

| Feature                       | `Object.assign()`                                              | Spread Operator (`...`)                      |
| ----------------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| **Syntax Type**               | Static method call (`Object.assign(target, ...sources)`)       | Native language operator (`{ ...obj }`)      |
| **Mutation Behavior**         | **Mutates** the target object (first argument)                 | **Always returns a new object**              |
| **Triggers Setters?**         | ✅ **Yes** (uses `[[Set]]` internal method)                     | ❌ **No** (uses `[[DefineOwnProperty]]`)      |
| **Null / Undefined Handling** | Throws `TypeError` if **target** is `null`/`undefined`         | Safely ignores `null`/`undefined`            |
| **Prototype Retention**       | Can assign properties directly to an existing prototype/object | Operates strictly on object literal creation |
| **Introduced In**             | ES6 (`ES2015`)                                                 | ES9 (`ES2018` for object rest/spread)        |

---

## 2. Key Differences in Detail

### Difference 1: Target Object Mutation

`Object.assign()` copies properties into its **first argument** (the target) and mutates it in place. To avoid mutating an existing object, you must pass a empty object literal `{}` as the first parameter.

The spread operator **always creates a new object instance**, making accidental mutation impossible.

```javascript
const original = { a: 1 };

// --- Object.assign() Mutates Target ---
const target = { b: 2 };
const resultAssign = Object.assign(target, original);

console.log(target);       // { b: 2, a: 1 } ⚠️ 'target' was mutated!
console.log(resultAssign === target); // true (Same object reference)

// --- Spread Operator Creates New Object ---
const objA = { a: 1 };
const objB = { b: 2 };
const resultSpread = { ...objB, ...objA };

console.log(objB);         // { b: 2 } ✅ Unmutated
console.log(resultSpread === objB);   // false (New object reference)

```

---

### Difference 2: Triggering Setters vs. Defining Properties

This is the most critical technical difference under the hood:

* **`Object.assign()` uses Assignment (`[[Set]]`):** When assigning properties to the target object, it invokes any existing **setters** defined on the target or its prototype chain.
* **Spread uses Property Definition (`[[DefineOwnProperty]]`):** It defines new properties directly on the result object, **ignoring existing setters**.

```javascript
const targetWithSetter = {
  set a(val) {
    console.log(`Setter called with value: ${val}`);
  }
};

// 1. Object.assign triggers the setter on the target object:
Object.assign(targetWithSetter, { a: 100 });
// Logs: "Setter called with value: 100"

// 2. Spread creates a new definition and completely overrides/bypasses setters:
const spreadResult = { ...targetWithSetter, a: 100 };
// No setter log! 'spreadResult' gets a plain property 'a: 100'

```

---

### Difference 3: Handling `null` and `undefined`

* **`Object.assign()`** throws a `TypeError` if the **first argument (target)** is `null` or `undefined`.
* **Spread operator** safely evaluates `null` and `undefined` as empty objects without throwing errors.

```javascript
// --- Object.assign() ---
Object.assign(null, { a: 1 }); 
// ❌ TypeError: Cannot convert undefined or null to object

Object.assign({}, null, undefined, { a: 1 }); 
// ✅ Works fine for source arguments (ignores null/undefined) -> { a: 1 }

// --- Spread Operator ---
const result = { ...null, ...undefined, a: 1 }; 
// ✅ Works safely -> { a: 1 }

```

---

### Similarity: Both Perform Shallow Copies Only

Neither method recursively deep-copies nested objects. If an object property contains an array or another object, both copy only the **memory reference**.

```javascript
const original = { user: { name: "Alice" } };

const assignCopy = Object.assign({}, original);
const spreadCopy = { ...original };

// Mutating a nested property affects all shallow copies:
assignCopy.user.name = "Bob";

console.log(original.user.name); // "Bob"
console.log(spreadCopy.user.name); // "Bob"

```

---

## Summary Decision Rule

* **Use the Spread Operator (`...`)** as your default choice for merging or copying objects. Its syntax is cleaner, safer against accidental mutation, handles `null`/`undefined` gracefully, and avoids setter side effects.
* **Use `Object.assign()**` when you specifically want to **mutate an existing target object in place** (e.g., updating a class instance or extending a prototype object).

This breakdown accurately highlights the core structural and runtime distinctions between `Object.assign()` and object spread (`...`).

Here are two technical details that complement what you've documented:

### 1. Prototype Property Access on Sources

While spread bypasses setters on the *target*, both methods invoke **getters** when reading from source objects. However, their lookup mechanisms differ slightly when reading non-own properties:

* **Spread (`...`)** uses the `[[GetOwnProperty]]` internal method followed by `[[Get]]`. It reads enumerable own properties directly from source objects.
* **`Object.assign()`** retrieves enumerable own properties via `Object.keys()` / `Reflect.ownKeys()` and invokes the `[[Get]]` operation on the source object, which triggers getter functions on the source's prototype chain if the property isn't directly on the instance.

### 2. Symbol and Enumerable Property Handling

Both methods treat non-enumerable properties and `Symbol` keys identically:

* Non-enumerable properties are **ignored** by both.
* Enumerable `Symbol` properties are **copied** by both (`Object.getOwnPropertySymbols()` behavior).

```javascript
const sym = Symbol("id");
const obj = { [sym]: 123 };
Object.defineProperty(obj, "hidden", { value: 456, enumerable: false });

console.log({ ...obj });            // { [Symbol(id)]: 123 }
console.log(Object.assign({}, obj)); // { [Symbol(id)]: 123 }

```

---

### When to prefer `structuredClone()` over both

Since both perform shallow copies, any requirement for deep copying nested objects or preserving data types like `Map`, `Set`, `Date`, or `ArrayBuffer` without external libraries is best handled via the global `structuredClone()` API (supported in all modern JS runtimes).
