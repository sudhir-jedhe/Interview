In JavaScript, both **Map** and **WeakMap** store key-value pairs, but **WeakMap** is specifically designed to allow garbage collection of its keys, preventing memory leaks when working with objects or functions.

Here is the direct comparison:

---

| Feature                | Map (`new Map()`)                                                                                             | WeakMap (`new WeakMap()`)                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Allowed Key Types**  | **Any type** (primitives, objects, functions).                                                                | **Objects and non-registered Symbols only** (primitives like numbers or strings are forbidden).                    |
| **Garbage Collection** | Keeps **strong references** to keys. Keys are not garbage collected even if references elsewhere are removed. | Holds **weak references** to keys. If a key object has no other references, it is automatically garbage-collected. |
| **Iterable?**          | **Yes.** Supports `for...of`, `.keys()`, `.values()`, `.entries()`, `.forEach()`.                             | **No.** Cannot be iterated over.                                                                                   |
| **Size & Clear**       | Has `.size` property and `.clear()` method.                                                                   | **No `.size` property** and **no `.clear()` method**.                                                              |
| **Supported Methods**  | `.set()`, `.get()`, `.has()`, `.delete()`, `.clear()`, `.keys()`, `.values()`, `.entries()`, `.forEach()`.    | Strictly `.set()`, `.get()`, `.has()`, `.delete()`.                                                                |

---

## 1. The Core Difference: Garbage Collection

### With `Map` (Strong Reference)

The key object remains in memory because `map` holds onto it, creating a memory leak unless explicitly deleted.

```javascript
let user = { name: "Alex" };
const map = new Map();

map.set(user, "user data");

user = null; // Remove original reference

// `user` is NOT garbage collected! It is still held inside `map`:
console.log(map.size); // 1
console.log(Array.from(map.keys())); // [{ name: "Alex" }]
```

### With `WeakMap` (Weak Reference)

When the original reference is removed, the key is automatically garbage-collected and removed from the WeakMap behind the scenes.

```javascript
let user = { name: "Alex" };
const weakMap = new WeakMap();

weakMap.set(user, "user data");

user = null; // Remove original reference

// `user` is now eligible for garbage collection!
// The entry in weakMap will automatically disappear once GC runs.
```

---

## 2. Practical Use Cases for WeakMap

Because you cannot iterate over a `WeakMap` or check its `.size`, its primary purpose is attaching **private data or metadata** to objects managed elsewhere in your application.

### Use Case A: Caching / Memoization (Without Memory Leaks)

Storing calculated results for DOM elements or complex objects. Once the object is destroyed, the cache entry cleans itself up automatically.

```javascript
const cache = new WeakMap();

function processDOMElement(element) {
  if (cache.has(element)) {
    return cache.get(element);
  }

  const result = { width: element.clientWidth, height: element.clientHeight }; // Heavy computation
  cache.set(element, result);
  return result;
}
```

### Use Case B: Private Data in Classes (Before Native `#private`)

Encapsulating truly private instance data without exposing internal properties on `this`.

```javascript
const privateProps = new WeakMap();

class User {
  constructor(name, secretToken) {
    // Store secretToken inside WeakMap keyed by `this`
    privateProps.set(this, { secretToken });
    this.name = name;
  }

  getSecret() {
    return privateProps.get(this).secretToken;
  }
}

let user = new User("Alex", "A123-B456");
console.log(user.secretToken); // undefined (Private!)
console.log(user.getSecret()); // "A123-B456"

user = null; // When instance is destroyed, privateProps entry is auto-garbage collected
```

---

## Summary: When Should You Use Which?

- Use **`Map`** when you need a general-purpose key-value lookup, need to store primitive keys (numbers, strings), need to iterate over keys/values, or need to know how many items are stored (`.size`).
- Use **`WeakMap`** when keys are **strictly objects/symbols**, and you want entries to be automatically deleted when the key object is removed or garbage-collected elsewhere in your code (e.g., DOM node metadata, event listener cleanup, object caching).
