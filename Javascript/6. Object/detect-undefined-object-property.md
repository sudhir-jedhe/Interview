### Understanding the Difference Between `undefined` and Non-Existent Properties in JavaScript

In JavaScript, the way to check if a property exists or if its value is `undefined` can sometimes lead to ambiguity. The issue arises because a property that exists on an object can have a value of `undefined`, but you also have properties that are not defined at all (i.e., they don't exist on the object).

Let’s break down the different cases in your example:

### 1. **Checking for `undefined` Values**

Consider the following example:

```javascript
const obj = { prop: undefined };

console.log(obj.prop === undefined);  // true
console.log(typeof obj.prop === 'undefined');  // true
```

**Explanation**:

- `obj.prop === undefined` checks if the property `prop` is explicitly assigned the value `undefined`. In this case, the value is `undefined`, so this comparison returns `true`.
- `typeof obj.prop === 'undefined'` checks the type of `obj.prop`, which is `undefined`. Since `obj.prop` is explicitly set to `undefined`, this also returns `true`.

Both checks confirm that the property `prop` exists, but its value is `undefined`.

### 2. **Checking for Non-Existent Properties**

If a property does not exist on the object, the result is slightly different:

```javascript
console.log(obj.porp === undefined);  // true
console.log(typeof obj.porp === 'undefined');  // true
```

**Explanation**:

- `obj.porp === undefined` returns `true` because `porp` is not a property of `obj`, so JavaScript implicitly considers it `undefined`. This is due to the fact that accessing a non-existent property on an object will return `undefined`.
- `typeof obj.porp === 'undefined'` also returns `true` for the same reason: the property `porp` doesn't exist, and `typeof` a non-existent property also evaluates to `'undefined'`.

So, both checks return `true`, but this could be confusing because it might seem like the property exists, but it’s actually non-existent on the object.

### 3. **Using `Object.prototype.hasOwnProperty()`**

To avoid ambiguity and accurately determine whether a property exists, it is recommended to use `Object.prototype.hasOwnProperty()`:

```javascript
const hasUndefinedProperty = (obj, prop) =>
  obj.hasOwnProperty(prop) && obj[prop] === undefined;

const obj = { prop: undefined };

console.log(hasUndefinedProperty(obj, 'prop'));  // true
console.log(hasUndefinedProperty(obj, 'porp'));  // false
```

**Explanation**:

- **`obj.hasOwnProperty(prop)`** checks if the `prop` is **actually a property** on the object `obj` (it checks if the property exists directly on the object and is not inherited from the prototype).
- **`obj[prop] === undefined`** checks if the value of the property is `undefined`.

Together, these checks ensure that:

1. The property `prop` **exists** on the object.
2. The property `prop` has the value `undefined`.

Thus, the `hasUndefinedProperty` function will:

- Return `true` if the property exists and its value is `undefined`.
- Return `false` if the property doesn’t exist on the object.

### Example Breakdown

```javascript
const obj = { prop: undefined };

console.log(hasUndefinedProperty(obj, 'prop'));  // true
console.log(hasUndefinedProperty(obj, 'porp'));  // false
```

- **For `obj.prop`**: The property `prop` exists on `obj`, and its value is explicitly set to `undefined`. Therefore, `hasUndefinedProperty(obj, 'prop')` returns `true`.
- **For `obj.porp`**: The property `porp` does not exist on `obj`, so `hasUndefinedProperty(obj, 'porp')` returns `false`.

### Why Use `hasOwnProperty()`?

Using `hasOwnProperty()` helps distinguish between properties that are explicitly set to `undefined` and properties that do not exist at all. This can be critical in situations where you want to handle both cases differently.

### Summary

- **`obj[prop] === undefined`** checks if the property is either undefined or non-existent.
- **`typeof obj[prop] === 'undefined'`** behaves the same as the first check for non-existent properties.
- **`hasOwnProperty()`** is useful for checking whether a property exists directly on the object, preventing confusion between properties that are explicitly set to `undefined` and those that don't exist on the object at all.

This is an excellent breakdown of a classic JavaScript edge case that causes subtle bugs in data transformation, configuration parsing, and API response handling.

A few modern additions and edge-case caveats will make this guide production-grade:

### 1. Modern Alternative: `Object.hasOwn()` (ES2022)

While `obj.hasOwnProperty(prop)` works, `Object.hasOwn(obj, prop)` is the modern standard across Node.js and browsers because it fixes two critical safety flaws with `hasOwnProperty`:

```js
// ❌ FAILS: Object created without prototype
const nullObj = Object.create(null);
nullObj.prop = undefined;
// nullObj.hasOwnProperty("prop"); // TypeError: nullObj.hasOwnProperty is not a function

// ❌ FAILS: Overridden property
const riskyObj = { hasOwnProperty: () => false, prop: undefined };
// riskyObj.hasOwnProperty("prop"); // Returns false!

// ✅ SAFE & MODERN (ES2022)
Object.hasOwn(nullObj, "prop"); // true
Object.hasOwn(riskyObj, "prop"); // true

```

---

### 2. The `in` Operator vs. `hasOwnProperty` / `hasOwn`

It's worth highlighting the distinction between prototype chain checking and own-property checking:

```js
const parent = { inherited: undefined };
const child = Object.create(parent);
child.own = undefined;

// 'in' checks the object AND its prototype chain
"inherited" in child; // true
"own" in child;       // true

// 'hasOwn' checks ONLY direct properties
Object.hasOwn(child, "inherited"); // false
Object.hasOwn(child, "own");       // true

```

---

### Updated Helper Function

Refactoring your helper using ES2022 features:

```js
const hasExplicitUndefined = (obj, prop) =>
  Object.hasOwn(obj, prop) && obj[prop] === undefined;

const user = { role: undefined };

console.log(hasExplicitUndefined(user, "role")); // true
console.log(hasExplicitUndefined(user, "age"));  // false

```

---

### Comparison Summary Matrix

| Approach                          | Inherited Properties? | Prototype-Safe?              | Distinguishes `undefined` vs Non-Existent? |
| --------------------------------- | --------------------- | ---------------------------- | ------------------------------------------ |
| `obj.prop === undefined`          | Checks prototype      | Yes                          | ❌ No                                       |
| `typeof obj.prop === 'undefined'` | Checks prototype      | Yes                          | ❌ No                                       |
| `'prop' in obj`                   | Checks prototype      | Yes                          | ✅ Yes                                      |
| `obj.hasOwnProperty('prop')`      | Direct only           | ❌ No (`Object.create(null)`) | ✅ Yes                                      |
| `Object.hasOwn(obj, 'prop')`      | Direct only           | ✅ Yes                        | ✅ Yes                                      |

This is an excellent breakdown of a classic JavaScript edge case that causes subtle bugs in data transformation, configuration parsing, and API response handling.

A few modern additions and edge-case caveats will make this guide production-grade:

### 1. Modern Alternative: `Object.hasOwn()` (ES2022)

While `obj.hasOwnProperty(prop)` works, `Object.hasOwn(obj, prop)` is the modern standard across Node.js and browsers because it fixes two critical safety flaws with `hasOwnProperty`:

```js
// ❌ FAILS: Object created without prototype
const nullObj = Object.create(null);
nullObj.prop = undefined;
// nullObj.hasOwnProperty("prop"); // TypeError: nullObj.hasOwnProperty is not a function

// ❌ FAILS: Overridden property
const riskyObj = { hasOwnProperty: () => false, prop: undefined };
// riskyObj.hasOwnProperty("prop"); // Returns false!

// ✅ SAFE & MODERN (ES2022)
Object.hasOwn(nullObj, "prop"); // true
Object.hasOwn(riskyObj, "prop"); // true

```

---

### 2. The `in` Operator vs. `hasOwnProperty` / `hasOwn`

It's worth highlighting the distinction between prototype chain checking and own-property checking:

```js
const parent = { inherited: undefined };
const child = Object.create(parent);
child.own = undefined;

// 'in' checks the object AND its prototype chain
"inherited" in child; // true
"own" in child;       // true

// 'hasOwn' checks ONLY direct properties
Object.hasOwn(child, "inherited"); // false
Object.hasOwn(child, "own");       // true

```

---

### Updated Helper Function

Refactoring your helper using ES2022 features:

```js
const hasExplicitUndefined = (obj, prop) =>
  Object.hasOwn(obj, prop) && obj[prop] === undefined;

const user = { role: undefined };

console.log(hasExplicitUndefined(user, "role")); // true
console.log(hasExplicitUndefined(user, "age"));  // false

```

---

### Comparison Summary Matrix

| Approach                          | Inherited Properties? | Prototype-Safe?              | Distinguishes `undefined` vs Non-Existent? |
| --------------------------------- | --------------------- | ---------------------------- | ------------------------------------------ |
| `obj.prop === undefined`          | Checks prototype      | Yes                          | ❌ No                                       |
| `typeof obj.prop === 'undefined'` | Checks prototype      | Yes                          | ❌ No                                       |
| `'prop' in obj`                   | Checks prototype      | Yes                          | ✅ Yes                                      |
| `obj.hasOwnProperty('prop')`      | Direct only           | ❌ No (`Object.create(null)`) | ✅ Yes                                      |
| `Object.hasOwn(obj, 'prop')`      | Direct only           | ✅ Yes                        | ✅ Yes                                      |

`JSON.stringify()` handles `undefined`, missing properties, and `null` in markedly different ways depending on whether the target is an **object**, an **array**, or a **standalone value**.

---

### Key Rules at a Glance

1. **`null` values are preserved:** Any property explicitly set to `null` is serialized as `"null"`.
2. **`undefined` properties on objects are omitted:** Object keys whose values are `undefined` (or missing entirely) are omitted from the output JSON string.
3. **`undefined` elements in arrays are converted to `null`:** Arrays maintain their indexed positions, so `undefined` items are stringified as `"null"`.
4. **Standalone `undefined` returns `undefined`:** Passing `undefined` directly to `JSON.stringify()` returns `undefined` (unquoted, the primitive value), not a string.

---

### 1. Behavior inside Objects

When serializing plain objects, `JSON.stringify()` strips out keys that evaluate to `undefined` or functions, while retaining keys set to `null`. Missing keys are naturally non-existent in the output.

```javascript
const obj = {
  a: "hello",
  b: null,        // Included as null
  c: undefined,   // OMITTED completely
                  // d (missing property) is OMITTED completely
};

console.log(JSON.stringify(obj));
// Output: '{"a":"hello","b":null}'

```

- **`obj.c === undefined`** $\rightarrow$ Key `"c"` is dropped.
- **Missing `obj.d**` $\rightarrow$ Key `"d"` is dropped.
- **`obj.b === null`** $\rightarrow$ Key `"b"` becomes `"b":null`.

---

### 2. Behavior inside Arrays

In arrays, item indices must be preserved. Converting `undefined` to nothing would alter the length and shift subsequent indices, so `JSON.stringify()` coerces `undefined` (and missing sparse array elements) into `null`.

```javascript
const arr = [
  "hello",
  null,
  undefined, // Converted to null
  ,          // Sparse / empty slot (missing element, converted to null)
];

console.log(JSON.stringify(arr));
// Output: '["hello",null,null,null]'

```

---

### 3. Standalone Values

When passed directly (outside of an object or array):

```javascript
console.log(JSON.stringify(null));      // '"null"' (string)
console.log(JSON.stringify(undefined)); // undefined (primitive undefined, NOT a string)

```

---

### Summary Comparison Table

| Context           | Property/Value set to `null` | Property set to `undefined` | Missing / Omitted Property |
| ----------------- | ---------------------------- | --------------------------- | -------------------------- |
| **Object Key**    | `"key": null`                | Omitted completely          | Omitted completely         |
| **Array Element** | `null`                       | `null`                      | `null`                     |
| **Standalone**    | `"null"`                     | `undefined` *(unquoted)*    | N/A                        |

---

### Common Edge Cases & Workarounds

#### 1. Preserving `undefined` keys in objects using a Replacer

If you need to preserve keys set to `undefined` as `null` in an object instead of omitting them, use the custom replacer function parameter:

```javascript
const obj = { a: "test", b: undefined };

const jsonString = JSON.stringify(obj, (key, value) => 
  value === undefined ? null : value
);

console.log(jsonString);
// Output: '{"a":"test","b":null}'

```

#### 2. Loss of Data in React/State Management

A common anti-pattern for deep cloning objects is `JSON.parse(JSON.stringify(obj))`. Because `JSON.stringify` drops `undefined` properties, deep-cloning with this method will delete any fields that were set to `undefined`:

```javascript
const user = { name: "Sudhir", role: undefined };

const clone = JSON.parse(JSON.stringify(user));
console.log(clone); // { name: "Sudhir" } -> role property was lost!

// Modern fix: use structuredClone instead
const safeClone = structuredClone(user);
console.log(safeClone); // { name: "Sudhir", role: undefined }

```

How does JSON.stringify handle Symbols, functions, NaN, and BigInt values in JavaScript?

`JSON.stringify()` handles `undefined`, missing properties, and `null` in markedly different ways depending on whether the target is an **object**, an **array**, or a **standalone value**.

---

### Key Rules at a Glance

1. **`null` values are preserved:** Any property explicitly set to `null` is serialized as `"null"`.
2. **`undefined` properties on objects are omitted:** Object keys whose values are `undefined` (or missing entirely) are omitted from the output JSON string.
3. **`undefined` elements in arrays are converted to `null`:** Arrays maintain their indexed positions, so `undefined` items are stringified as `"null"`.
4. **Standalone `undefined` returns `undefined`:** Passing `undefined` directly to `JSON.stringify()` returns `undefined` (unquoted, the primitive value), not a string.

---

### 1. Behavior inside Objects

When serializing plain objects, `JSON.stringify()` strips out keys that evaluate to `undefined` or functions, while retaining keys set to `null`. Missing keys are naturally non-existent in the output.

```javascript
const obj = {
  a: "hello",
  b: null,        // Included as null
  c: undefined,   // OMITTED completely
                  // d (missing property) is OMITTED completely
};

console.log(JSON.stringify(obj));
// Output: '{"a":"hello","b":null}'

```

- **`obj.c === undefined`** $\rightarrow$ Key `"c"` is dropped.
- **Missing `obj.d**` $\rightarrow$ Key `"d"` is dropped.
- **`obj.b === null`** $\rightarrow$ Key `"b"` becomes `"b":null`.

---

### 2. Behavior inside Arrays

In arrays, item indices must be preserved. Converting `undefined` to nothing would alter the length and shift subsequent indices, so `JSON.stringify()` coerces `undefined` (and missing sparse array elements) into `null`.

```javascript
const arr = [
  "hello",
  null,
  undefined, // Converted to null
  ,          // Sparse / empty slot (missing element, converted to null)
];

console.log(JSON.stringify(arr));
// Output: '["hello",null,null,null]'

```

---

### 3. Standalone Values

When passed directly (outside of an object or array):

```javascript
console.log(JSON.stringify(null));      // '"null"' (string)
console.log(JSON.stringify(undefined)); // undefined (primitive undefined, NOT a string)

```

---

### Summary Comparison Table

| Context           | Property/Value set to `null` | Property set to `undefined` | Missing / Omitted Property |
| ----------------- | ---------------------------- | --------------------------- | -------------------------- |
| **Object Key**    | `"key": null`                | Omitted completely          | Omitted completely         |
| **Array Element** | `null`                       | `null`                      | `null`                     |
| **Standalone**    | `"null"`                     | `undefined` *(unquoted)*    | N/A                        |

---

### Common Edge Cases & Workarounds

#### 1. Preserving `undefined` keys in objects using a Replacer

If you need to preserve keys set to `undefined` as `null` in an object instead of omitting them, use the custom replacer function parameter:

```javascript
const obj = { a: "test", b: undefined };

const jsonString = JSON.stringify(obj, (key, value) => 
  value === undefined ? null : value
);

console.log(jsonString);
// Output: '{"a":"test","b":null}'

```

#### 2. Loss of Data in React/State Management

A common anti-pattern for deep cloning objects is `JSON.parse(JSON.stringify(obj))`. Because `JSON.stringify` drops `undefined` properties, deep-cloning with this method will delete any fields that were set to `undefined`:

```javascript
const user = { name: "Sudhir", role: undefined };

const clone = JSON.parse(JSON.stringify(user));
console.log(clone); // { name: "Sudhir" } -> role property was lost!

// Modern fix: use structuredClone instead
const safeClone = structuredClone(user);
console.log(safeClone); // { name: "Sudhir", role: undefined }

```

How do property descriptors like enumerable and configurable affect property checking methods in JavaScript?

Property descriptors—specifically **`enumerable`** and **`configurable`**—fundamentally change how property access, enumeration, and existence checks behave in JavaScript.

---

### Core Definitions

When defining a property via `Object.defineProperty()`, defaults for new flags are `false`:

- **`enumerable`**: Determines whether the property shows up during iteration (`for...in`, `Object.keys()`).
- **`configurable`**: Determines whether the property descriptor can be changed or if the property can be deleted with `delete`.

```javascript
const obj = {};

Object.defineProperty(obj, 'hidden', {
  value: 42,
  enumerable: false,
  configurable: true,
});

Object.defineProperty(obj, 'locked', {
  value: 99,
  enumerable: true,
  configurable: false,
});

```

---

### 1. How `enumerable` Affects Property Methods

Setting `enumerable: false` **hides** the property from iteration and enumeration methods, but **does not affect** direct existence checks (`in`, `Object.hasOwn()`).

| Method / Operator                          | Sees `enumerable: false`? | Notes                                              |
| ------------------------------------------ | ------------------------- | -------------------------------------------------- |
| **`in` operator**                          | **Yes**                   | Checks existence, ignores enumerability            |
| **`Object.hasOwn()` / `hasOwnProperty()**` | **Yes**                   | Checks existence, ignores enumerability            |
| **`obj.prop !== undefined`**               | **Yes**                   | Property is accessible directly                    |
| **`for...in` loop**                        | **No**                    | Skips non-enumerable properties                    |
| **`Object.keys()`**                        | **No**                    | Skips non-enumerable properties                    |
| **`Object.values()` / `Object.entries()**` | **No**                    | Skips non-enumerable properties                    |
| **`Object.getOwnPropertyNames()`**         | **Yes**                   | Returns ALL own property names (enumerable or not) |
| **`Object.assign()` / Spread (`...`)**     | **No**                    | Copies ONLY own enumerable properties              |
| **`JSON.stringify()`**                     | **No**                    | Ignores non-enumerable properties                  |

#### Code Example: Enumerable vs. Non-Enumerable

```javascript
const user = {};

Object.defineProperty(user, 'id', { value: 101, enumerable: false });
Object.defineProperty(user, 'name', { value: 'Sudhir', enumerable: true });

// Direct checks SEE non-enumerable properties:
console.log('id' in user);                  // true
console.log(Object.hasOwn(user, 'id'));     // true
console.log(user.id);                        // 101

// Iteration methods SKIP non-enumerable properties:
console.log(Object.keys(user));             // ['name']
console.log({ ...user });                   // { name: 'Sudhir' }

// Special method to list non-enumerable properties:
console.log(Object.getOwnPropertyNames(user)); // ['id', 'name']

```

---

### 2. How `configurable` Affects Property Methods

Setting `configurable: false` prevents:

1. Deleting the property via `delete obj.prop`.
2. Changing descriptor attributes (e.g., converting non-enumerable to enumerable).
3. Changing property type (e.g., data property to accessor getter/setter).

It **does not hide** the property from existence checks or loops.

| Action / Method               | Effect when `configurable: false`                                            |
| ----------------------------- | ---------------------------------------------------------------------------- |
| **`delete obj.prop`**         | Fails silently (returns `false`), or throws `TypeError` in strict mode       |
| **`Object.defineProperty()`** | Throws `TypeError` if trying to alter attributes (e.g., change `enumerable`) |
| **`in` / `Object.hasOwn()**`  | Unaffected (returns `true`)                                                  |
| **`Object.keys()`**           | Unaffected (determined solely by `enumerable`)                               |

#### Code Example: Deletion & Descriptor Changes

```javascript
'use strict';

const config = {};

Object.defineProperty(config, 'apiKey', {
  value: 'secret123',
  enumerable: true,
  configurable: false, // Cannot be deleted or reconfigured
});

// 1. Direct checks work normally:
console.log(Object.hasOwn(config, 'apiKey')); // true

// 2. Deletion fails in strict mode:
try {
  delete config.apiKey; 
} catch (e) {
  console.log(e.message); // Cannot delete property 'apiKey' of #<Object>
}

// 3. Re-definition fails:
try {
  Object.defineProperty(config, 'apiKey', { enumerable: false });
} catch (e) {
  console.log(e.message); // Cannot redefine property: apiKey
}

```

> **Exception for `writable**`: If `configurable: false`, you can still change `value` if `writable: true`. You can also flip `writable` from `true` to `false`, but not `false` to `true`.

---

### Comprehensive Method Summary Matrix

Here is how every common property reflection method handles `enumerable` and `configurable`:

```javascript
const demo = {};

Object.defineProperty(demo, 'secret', {
  value: 42,
  enumerable: false,
  configurable: false
});

```

| Method                                   | Behavior on `demo.secret`                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `'secret' in demo`                       | `true`                                                                               |
| `Object.hasOwn(demo, 'secret')`          | `true`                                                                               |
| `Object.keys(demo)`                      | `[]` *(ignored because non-enumerable)*                                              |
| `Object.getOwnPropertyNames(demo)`       | `['secret']` *(lists all own properties)*                                            |
| `Object.getOwnPropertyDescriptors(demo)` | `{ secret: { value: 42, writable: false, enumerable: false, configurable: false } }` |
| `Reflect.ownKeys(demo)`                  | `['secret']` *(lists all string & symbol keys regardless of descriptors)*            |

How do Object.freeze, Object.seal, and Object.preventExtensions modify property descriptors under the hood?

In JavaScript, `Object.preventExtensions()`, `Object.seal()`, and `Object.freeze()` are three levels of immutability. Under the hood, they work by directly mutating internal object flags (like `[[Extensible]]`) and flipping property descriptors (`configurable` and `writable`) for all own properties.

---

### The Three Levels of Object Restriction

```
                     Increasing Immutability  --->
  ┌────────────────────────┬────────────────────────┬────────────────────────┐
  │  preventExtensions()   │        seal()          │        freeze()        │
  ├────────────────────────┼────────────────────────┼────────────────────────┤
  │ Prevent NEW properties │ Prevent NEW properties │ Prevent NEW properties │
  │                        │ Prevent DELETIONS      │ Prevent DELETIONS      │
  │                        │                        │ Prevent MODIFICATIONS  │
  └────────────────────────┴────────────────────────┴────────────────────────┘

```

---

### 1. `Object.preventExtensions(obj)` (Level 1: Shallow Non-Extensible)

#### Under the Hood

1. Sets the internal slot **`[[Extensible]]`** of the object to `false`.
2. **Does NOT modify existing property descriptors.** `configurable`, `writable`, and `enumerable` remain unchanged.

#### Behavioral Effect

- **Cannot add** new properties.
- **Can delete** existing properties (because `configurable` is still `true`).
- **Can modify** existing values (because `writable` is still `true`).

```javascript
const obj = { name: "Sudhir", age: 30 };
Object.preventExtensions(obj);

// Descriptors REMAIN UNCHANGED:
console.log(Object.getOwnPropertyDescriptor(obj, "name"));
// { value: "Sudhir", writable: true, enumerable: true, configurable: true }

delete obj.age;      // ✅ Allowed (configurable is still true)
obj.name = "Rahul";  // ✅ Allowed (writable is still true)
obj.city = "Pune";   // ❌ TypeError in strict mode (cannot extend)

```

---

### 2. `Object.seal(obj)` (Level 2: Sealed)

#### Under the Hood

1. Sets **`[[Extensible]]`** to `false` (invokes `preventExtensions`).
2. Iterates over all own property keys and sets **`configurable: false`** on every property descriptor.
3. Does **NOT** change `writable`.

#### Behavioral Effect

- **Cannot add** new properties.
- **Cannot delete** existing properties (because `configurable` is now `false`).
- **Cannot reconfigure** descriptors (e.g., cannot flip `enumerable`).
- **Can modify** existing values (because `writable` remains `true`).

```javascript
const obj = { name: "Sudhir", age: 30 };
Object.seal(obj);

// Descriptors updated: configurable becomes FALSE
console.log(Object.getOwnPropertyDescriptor(obj, "name"));
// { value: "Sudhir", writable: true, enumerable: true, configurable: false }

obj.name = "Rahul";  // ✅ Allowed (writable is still true)
delete obj.age;      // ❌ TypeError in strict mode (configurable is false)

```

---

### 3. `Object.freeze(obj)` (Level 3: Fully Frozen)

#### Under the Hood

1. Sets **`[[Extensible]]`** to `false`.
2. Iterates over all own property keys and sets **`configurable: false`** on every property descriptor.
3. Sets **`writable: false`** on all **data properties** (properties with standard values).

> **Note on Accessor Properties (Getters/Setters):** `freeze()` sets `configurable: false` on getters/setters, but accessors do not have a `writable` attribute, so their getter/setter functions cannot be swapped out.

#### Behavioral Effect

- **Cannot add** new properties.
- **Cannot delete** existing properties.
- **Cannot reconfigure** existing properties.
- **Cannot modify** values (read-only object).

```javascript
const obj = { name: "Sudhir", age: 30 };
Object.freeze(obj);

// Descriptors updated: BOTH configurable and writable become FALSE
console.log(Object.getOwnPropertyDescriptor(obj, "name"));
// { value: "Sudhir", writable: false, enumerable: true, configurable: false }

obj.name = "Rahul";  // ❌ TypeError in strict mode (writable is false)
delete obj.age;      // ❌ TypeError in strict mode (configurable is false)

```

---

### Descriptor Matrix Comparison

Assume an object `{ prop: "value" }` created with standard defaults (`writable: true`, `enumerable: true`, `configurable: true`).

| Property / Feature          | Unrestricted | `preventExtensions()` | `seal()`    | `freeze()`  |
| --------------------------- | ------------ | --------------------- | ----------- | ----------- |
| Internal `[[Extensible]]`   | `true`       | **`false`**           | **`false`** | **`false`** |
| Descriptor `configurable`   | `true`       | `true`                | **`false`** | **`false`** |
| Descriptor `writable`       | `true`       | `true`                | `true`      | **`false`** |
| **Add new properties?**     | ✅            | ❌                     | ❌           | ❌           |
| **Delete properties?**      | ✅            | ✅                     | ❌           | ❌           |
| **Modify property value?**  | ✅            | ✅                     | ✅           | ❌           |
| **Reconfigure descriptor?** | ✅            | ✅                     | ❌           | ❌           |

---

### Crucial Caveats & Interview Edge Cases

#### 1. All three methods are Shallow

Nested objects inside a frozen object remain mutable unless recursively frozen:

```javascript
const user = Object.freeze({
  name: "Sudhir",
  address: { city: "Pune" } // Nested object is NOT automatically frozen!
});

user.address.city = "Mumbai"; // ✅ Works! user.address is still mutable

```

To achieve deep immutability, you must implement a recursive freeze helper:

```javascript
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      obj[prop] !== null &&
      (typeof obj[prop] === "object" || typeof obj[prop] === "function") &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
}

```

#### 2. Predicate Inspection Methods

JavaScript provides three corresponding predicate methods to check these states:

```javascript
Object.isExtensible(obj); // Returns false if preventExtensions, seal, or freeze was applied
Object.isSealed(obj);     // Returns true if !isExtensible AND all descriptors have configurable: false
Object.isFrozen(obj);     // Returns true if !isExtensible AND all data descriptors have configurable: false & writable: false

```
