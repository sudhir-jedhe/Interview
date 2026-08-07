You're correct in your understanding of `Object.seal` and `Object.freeze`. These are two different methods in JavaScript for managing object immutability, and they each have different effects on the object they are applied to.

### **Object.seal()**

`Object.seal()` allows you to **modify existing properties** (if they are writable) but **prevents the addition of new properties** and **deletion of existing properties**. It marks all existing properties as **non-configurable**, which means their configuration cannot be changed (like making them writable or configurable), but their values can still be modified if they are writable.

#### Key characteristics of `Object.seal()`

1. **Can modify existing property values** if the property is writable.
2. **Cannot add new properties** to the object.
3. **Cannot delete properties** from the object.
4. **Existing properties become non-configurable**, but their values remain mutable if they are writable.

Here's an example:

```javascript
const obj = {
  prop: 42
};

Object.seal(obj); // Seal the object

obj.prop = 33; // Modify the value of the existing property
console.log(obj.prop); // 33

delete obj.prop; // Try to delete the property (not allowed when sealed)
console.log(obj.prop); // 33
```

In this case, `obj.prop` was successfully updated, but you can't delete it after the object is sealed.

---

### **Object.freeze()**

`Object.freeze()` makes an object **immutable** by not allowing the **modification** of existing properties, **addition of new properties**, or **deletion of properties**. It marks the properties as **non-writable** and **non-configurable**.

#### Key characteristics of `Object.freeze()`

1. **Cannot modify existing property values** — they are frozen.
2. **Cannot add new properties** to the object.
3. **Cannot delete properties** from the object.
4. **Makes all properties non-writable** and **non-configurable**.

Here's an example:

```javascript
const obj = {
  prop: 42
};

Object.freeze(obj); // Freeze the object

obj.prop = 33; // Try to modify the value of the existing property (not allowed)
console.log(obj.prop); // 42

delete obj.prop; // Try to delete the property (not allowed when frozen)
console.log(obj.prop); // 42
```

In this case, `obj.prop` cannot be changed or deleted, and the object is now completely frozen.

---

### **Difference Between `Object.seal()` and `Object.freeze()`**

| **Behavior**                         | **Object.seal()**                              | **Object.freeze()**                               |
| ------------------------------------ | ---------------------------------------------- | ------------------------------------------------- |
| **Add new properties**               | Not allowed                                    | Not allowed                                       |
| **Delete properties**                | Not allowed                                    | Not allowed                                       |
| **Modify property values**           | Allowed if the property is writable            | Not allowed                                       |
| **Make properties non-writable**     | No (only makes them non-configurable)          | Yes, makes them non-writable and non-configurable |
| **Make properties non-configurable** | Yes (properties can't be redefined or removed) | Yes (properties can't be redefined or removed)    |

### Summary

- **`Object.seal()`**: Seals the object so no new properties can be added, and no existing properties can be deleted. Existing properties can still be modified if they are writable. It only makes properties **non-configurable**.
  
- **`Object.freeze()`**: Freezes the object so no new properties can be added, and no existing properties can be modified or deleted. It makes all properties **non-writable** and **non-configurable**.

### Example Showing Both in Action

```javascript
const obj = {
  name: "John",
  age: 30
};

Object.seal(obj);
obj.name = "Jane"; // Allowed
obj.address = "USA"; // Not allowed
delete obj.age; // Not allowed
console.log(obj); // { name: "Jane", age: 30 }

Object.freeze(obj);
obj.name = "Mike"; // Not allowed
console.log(obj); // { name: "Jane", age: 30 }
```

In this example, after sealing the object:

- You can modify `obj.name` to "Jane".
- You can't add `obj.address` or delete `obj.age`.

After freezing the object:

- You can't modify `obj.name` to "Mike", and no changes can be made.

---

### **Deep Freezing/Sealing**

If you need to deeply freeze or seal all nested objects, you'd need to write a custom function that iterates over all properties and applies `Object.freeze` or `Object.seal` recursively.

For instance:

```javascript
function deepSeal(obj) {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = obj[prop];
    if (value && typeof value === "object") {
      deepSeal(value); // Recursively seal nested objects
    }
  });
  return Object.seal(obj); // Seal the current object
}

const nestedObj = {
  name: "John",
  nested: {
    age: 30,
    address: {
      city: "New York"
    }
  }
};

deepSeal(nestedObj);
nestedObj.nested.age = 31; // Allowed (can modify existing properties)
nestedObj.nested.newProp = "Hello"; // Not allowed
nestedObj.nested.address.city = "Los Angeles"; // Allowed
delete nestedObj.nested.address.city; // Not allowed

console.log(nestedObj);
```

This custom `deepSeal` function ensures that all nested objects are also sealed. Similarly, you could use `Object.freeze()` in the same way to achieve deep freezing.

---

### Conclusion

- **`Object.seal()`**: Prevents adding new properties or deleting existing ones, but allows modifying the values of writable properties.
- **`Object.freeze()`**: Prevents adding new properties, deleting existing ones, and modifying the values of existing properties. It makes the object fully immutable.

Which one to use depends on whether you want to allow modifications to the values of properties or not.

Here is a breakdown of technical nuances, edge cases, and potential bugs present in the examples above.

---

## Technical Comparison & Critical Edge Cases

### 1. `Object.preventExtensions()` vs. `seal()` vs. `freeze()`

Immutability in JavaScript sits on a three-tier spectrum:

| Method                           | Add Properties | Delete Properties | Reconfigure Descriptors | Modify Values       |
| -------------------------------- | -------------- | ----------------- | ----------------------- | ------------------- |
| **`Object.preventExtensions()`** | ❌ No           | ✅ Yes             | ✅ Yes                   | ✅ Yes               |
| **`Object.seal()`**              | ❌ No           | ❌ No              | ❌ No                    | ✅ Yes (if writable) |
| **`Object.freeze()`**            | ❌ No           | ❌ No              | ❌ No                    | ❌ No                |

### 2. Strict Mode Behavior

In sloppy mode, assigning new properties or modifying frozen fields **fails silently**. In **strict mode** (`"use strict";`), these actions throw explicit `TypeError` exceptions.

```javascript
"use strict";
const obj = Object.freeze({ x: 10 });

obj.x = 20; 
// TypeError: Cannot assign to read only property 'x' of object '#<Object>'

```

### 3. Shallow Nature & Prototype Pollution

Both `Object.freeze()` and `Object.seal()` operate **shallowly**.

- **Nested Mutations:** Modifying nested sub-objects in a frozen object works unless deep-frozen:

```javascript
const user = Object.freeze({ details: { name: "John" } });
user.details.name = "Jane"; // Works! The `details` reference is fixed, but the object itself is mutable.

```

- **Prototype Mutability:** Freezing an object prevents property additions/modifications on the object itself, but **modifying its prototype** still affects inherited properties:

```javascript
const obj = Object.freeze({});
Object.getPrototypeOf(obj).polluted = true;
console.log(obj.polluted); // true

```

---

## Bugs & Edge Cases in the `deepSeal` Implementation

The custom `deepSeal` function provided in your example has three edge cases that can crash or cause unintended loops in real applications:

### Issue A: Circular Reference Stack Overflow

If an object points to itself, recursive implementations hit an infinite loop:

```javascript
const circular = { a: 1 };
circular.self = circular;

deepSeal(circular); // RangeError: Maximum call stack size exceeded

```

### Issue B: Traversing Non-Plain Objects (Functions, Dates, Sets)

Functions, RegExps, dates, and maps are typeof `"object"` or `"function"`, but attempting to recursively iterate over their internal properties can cause runtime bugs or fail on non-configurable properties.

### Issue C: Ignores Symbol Properties

`Object.getOwnPropertyNames(obj)` only returns string keys. Symbol keys (e.g., `obj[Symbol('key')]`) bypass `deepSeal`. Using `Reflect.ownKeys(obj)` handles both strings and symbols.

---

## Production-Ready `deepFreeze` Implementation

Here is a robust version handling circular references using a `WeakSet`, symbol properties, and non-plain object values:

```javascript
function deepFreeze(obj, visited = new WeakSet()) {
  // Guard against non-objects and null
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return obj;
  }

  // Prevent infinite cycles on circular structures
  if (visited.has(obj)) {
    return obj;
  }
  visited.add(obj);

  // Retrieve string AND symbol keys
  const keys = Reflect.ownKeys(obj);

  for (const key of keys) {
    const value = obj[key];
    
    // Recursively freeze nested objects/functions
    if (value && (typeof value === "object" || typeof value === "function")) {
      deepFreeze(value, visited);
    }
  }

  return Object.freeze(obj);
}

```

How do Object.isFrozen(), Object.isSealed(), and Object.isExtensible() work to inspect object states?

JavaScript provides three static inspection methods on `Object` to check an object's level of mutability: **`Object.isExtensible()`**, **`Object.isSealed()`**, and **`Object.isFrozen()`**.

These methods form a strict hierarchy of immutability verification.

---

## 1. `Object.isExtensible(obj)`

Checks whether **new properties can be added** to an object.

- **Default return:** `true` for standard objects.
- **Returns `false` if:**
- `Object.preventExtensions(obj)` was called on it.
- `Object.seal(obj)` was called on it.
- `Object.freeze(obj)` was called on it.

```javascript
const obj = { name: "Alice" };

console.log(Object.isExtensible(obj)); // true

Object.preventExtensions(obj);
console.log(Object.isExtensible(obj)); // false

```

---

## 2. `Object.isSealed(obj)`

Checks whether an object is **sealed**. An object is sealed if:

1. It is **non-extensible** (`Object.isExtensible(obj) === false`).
2. **All** existing properties are **non-configurable** (`configurable: false`), meaning properties cannot be deleted or reconfigured using `Object.defineProperty()`.

- **Note:** `Object.isSealed()` checks property descriptors dynamically. An object does **not** need to be explicitly passed through `Object.seal()` to return `true`—if you manually make all properties non-configurable and prevent extension, it will return `true`.

```javascript
const obj = { age: 30 };

console.log(Object.isSealed(obj)); // false

Object.seal(obj);
console.log(Object.isSealed(obj)); // true
console.log(Object.isExtensible(obj)); // false (sealing prevents extension)

```

### Empty Object Edge Case

An empty non-extensible object has no properties to check for `configurable: false`. Thus, it is automatically considered sealed:

```javascript
const emptyObj = {};
Object.preventExtensions(emptyObj);

console.log(Object.isSealed(emptyObj)); // true

```

---

## 3. `Object.isFrozen(obj)`

Checks whether an object is **completely immutable**. An object is frozen if:

1. It is **sealed** (`Object.isSealed(obj) === true`).
2. **All** data properties are **non-writable** (`writable: false`).
3. Accessor properties (getters/setters) are unaffected by `writable`, but must still be non-configurable.

```javascript
const obj = { role: "Admin" };

console.log(Object.isFrozen(obj)); // false

Object.freeze(obj);
console.log(Object.isFrozen(obj)); // true
console.log(Object.isSealed(obj)); // true (freezing automatically seals)
console.log(Object.isExtensible(obj)); // false

```

---

## Summary Matrix & Inheritance Trait

Each tighter immutability level implies the levels below it:

$$\text{Frozen} \implies \text{Sealed} \implies \text{Non-Extensible}$$

| Method Called on Object      | `isExtensible()` | `isSealed()` | `isFrozen()` |
| ---------------------------- | ---------------- | ------------ | ------------ |
| *Standard Object*            | `true`           | `false`      | `false`      |
| `Object.preventExtensions()` | `false`          | `false`*     | `false`*     |
| `Object.seal()`              | `false`          | `true`       | `false`*     |
| `Object.freeze()`            | `false`          | `true`       | `true`       |

** Assuming the object has at least one configurable/writable data property.*

---

## Essential Nuances

### 1. Behavior with Non-Object Arguments (ES6+)

In ES5, passing a non-object primitive (like a string or number) to these methods threw a `TypeError`. In ES6+, primitives are treated as if they are non-extensible, frozen, and sealed objects:

```javascript
Object.isExtensible(42); // false
Object.isSealed("hello"); // true
Object.isFrozen(true);    // true

```

### 2. Shallow Inspection Only

Just like `Object.freeze()` and `Object.seal()`, these inspection methods **only evaluate top-level properties**. They do not check if nested child objects are sealed or frozen:

```javascript
const parent = Object.freeze({
  child: { status: "active" }
});

console.log(Object.isFrozen(parent));        // true
console.log(Object.isFrozen(parent.child));  // false

```
