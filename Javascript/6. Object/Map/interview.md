Your definition is concise and accurate. To make this answer complete for a technical interview, here is a breakdown highlighting the specific operational differences, API constraints, and practical use cases of a `WeakMap` versus a standard `Map`.

---

### Core Differences Matrix

| Feature                     | `Map`                                                                                                     | `WeakMap`                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Allowed Key Types**       | Any JavaScript type (Primitives, Objects, Functions)                                                      | **Objects and Symbols only**                                            |
| **Reference Type**          | **Strong** references to keys                                                                             | **Weak** references to keys                                             |
| **Garbage Collection (GC)** | Keeps key objects alive in memory indefinitely                                                            | Allows key objects to be garbage-collected if no other references exist |
| **Iterability**             | Fully iterable (`for...of`, `.keys()`, `.values()`, `.entries()`)                                         | **Non-iterable** (No loops or iteration methods)                        |
| **Size Knowledge**          | Has a `.size` property                                                                                    | **No `.size` property**                                                 |
| **Supported Methods**       | `.set()`, `.get()`, `.has()`, `.delete()`, `.clear()`, `.keys()`, `.values()`, `.entries()`, `.forEach()` | **Only 4 methods:** `.set()`, `.get()`, `.has()`, `.delete()`           |

---

### Code Comparison

#### 1. Regular `Map` (Prevents Garbage Collection)

```javascript
let user = { name: "Alice" };
const userMap = new Map();

userMap.set(user, "Active User Data");

// Clear our primary reference to the object
user = null;

// RESULT: The object { name: "Alice" } CANNOT be freed by Garbage Collection.
// The Map holds a STRONG reference to it.
console.log(userMap.size); // 1

```

#### 2. `WeakMap` (Allows Garbage Collection)

```javascript
let user = { name: "Alice" };
const userWeakMap = new WeakMap();

userWeakMap.set(user, "Active User Data");

// Clear our primary reference to the object
user = null;

// RESULT: The object { name: "Alice" } has no remaining strong references.
// The Garbage Collector automatically sweeps the object AND its entry in userWeakMap.

```

---

### Why Can't You Iterate Over a `WeakMap`?

Because garbage collection runs non-deterministically in the background, the list of keys inside a `WeakMap` can change at any moment depending on when the V8 engine performs memory sweeping.

Exposing iteration methods (`.keys()`, `.forEach()`) or a `.size` property would introduce non-deterministic bugs into JavaScript applications.

---

### Common Use Cases for `WeakMap`

1. **Attaching Metadata to DOM Elements:** Storing component state or configuration for a DOM node without preventing the node from being cleaned up when removed from the DOM tree.
2. **Private Class Data:** Storing private instance variables mapped to `this`.
3. **Caching / Memoization:** Caching expensive calculations derived from object parameters without creating memory leaks.
