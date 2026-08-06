Here's my take: `Object.preventExtensions()`, `Object.seal()`, and `Object.freeze()` are JavaScript's built-in immutability levels, arranged from **least strict to most strict**.

Here is how they stack up side-by-side:

---

## 1. Quick Comparison Matrix

| Action                                   | `preventExtensions()` | `seal()` | `freeze()` |
| ---------------------------------------- | --------------------- | -------- | ---------- |
| **Add** new properties                   | ❌ No                  | ❌ No     | ❌ No       |
| **Delete** existing properties           | ✅ Yes                 | ❌ No     | ❌ No       |
| **Reconfigure** properties (descriptors) | ✅ Yes                 | ❌ No     | ❌ No       |
| **Modify values** of existing properties | ✅ Yes                 | ✅ Yes    | ❌ No       |

---

## 2. Deep-Dive Breakdown

### A. `Object.preventExtensions(obj)`

> *"No new properties allowed, but anything already here is fair game."*

* **Prevents:** Adding new properties.
* **Allows:** Updating property values, deleting properties, reconfiguring property descriptors (`configurable: true` remains unchanged).

```javascript
const user = { name: "Alice", age: 25 };
Object.preventExtensions(user);

user.role = "Admin";  // ❌ Fails (ignored in non-strict, throws TypeError in strict mode)
user.age = 26;        // ✅ Works!
delete user.name;     // ✅ Works! (user is now { age: 26 })

console.log(Object.isExtensible(user)); // false

```

---

### B. `Object.seal(obj)`

> *"The structure is locked. No adding, no deleting, no reconfiguring — but values can still change."*

* **Prevents:** Adding new properties, deleting properties, or changing descriptor configurations.
* **Under the Hood:** Runs `preventExtensions()` AND sets `configurable: false` on all existing properties.
* **Allows:** Modifying existing writable property values.

```javascript
const user = { name: "Alice", age: 25 };
Object.seal(user);

user.role = "Admin";  // ❌ Fails
delete user.name;     // ❌ Fails
user.age = 26;        // ✅ Works!

console.log(Object.isSealed(user)); // true

```

---

### C. `Object.freeze(obj)`

> *"Completely immutable top-level snapshot. Read-only."*

* **Prevents:** Adding, deleting, reconfiguring, or modifying existing property values.
* **Under the Hood:** Runs `seal()` AND sets `writable: false` on all existing properties.
* **Allows:** Reading properties only.

```javascript
const user = { name: "Alice", age: 25 };
Object.freeze(user);

user.role = "Admin";  // ❌ Fails
delete user.name;     // ❌ Fails
user.age = 26;        // ❌ Fails

console.log(Object.isFrozen(user)); // true

```

---

## 3. Important Caveat: Shallow Immutability

> All three methods perform **shallow** operations. They only affect top-level properties.

If an object contains nested objects or arrays, those nested references are **not** sealed or frozen unless you recursively apply the method to them (a "deep freeze").

```javascript
const config = {
  theme: "dark",
  settings: { notifications: true } // Nested object
};

Object.freeze(config);

config.theme = "light";                  // ❌ Fails (top-level property)
config.settings.notifications = false;   // ⚠️ WORKS! (nested property is still mutable)

```

To achieve true deep immutability, you can use a recursive function or libraries like **Immer**:

```javascript
function deepFreeze(obj) {
  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && obj[prop] !== null) {
      deepFreeze(obj[prop]);
    }
  });
  return Object.freeze(obj);
}

```

---

Here's my take: `Object.preventExtensions()`, `Object.seal()`, and `Object.freeze()` interact with prototype inheritance and prototype pollution in specific ways, and knowing these mechanics is essential for preventing security exploits.

---

## 1. Prototype Inheritance vs. Freezing/Sealing

The most critical rule to understand is that **all three methods operate shallowly**. They lock down the *own properties* and the *prototype reference* of an object, but they **do not automatically protect the object's prototype chain**.

### A. Freezing the Prototype Reference (Reassignment)

When you call `preventExtensions()`, `seal()`, or `freeze()` on an object, JavaScript sets its internal `[[IsExtensible]]` slot to `false`. This means **you can no longer reassign its internal prototype**:

```javascript
const parentA = { role: "admin" };
const parentB = { role: "user" };

const child = Object.create(parentA);
Object.freeze(child);

// ❌ Fails! Throws TypeError in strict mode because the object is non-extensible
Object.setPrototypeOf(child, parentB); 

// ❌ Fails! Changing __proto__ accessor also fails
child.__proto__ = parentB; 

```

### B. The Prototype Leakage Trap (Upward Mutation)

Even if `child` is completely frozen via `Object.freeze()`, its prototype (`parentA`) **remains fully mutable** unless `parentA` was also frozen:

```javascript
const parent = { greet: () => "Hello" };
const child = Object.create(parent);

Object.freeze(child); // Locks 'child'

// ⚠️ WORKS! Modifying the prototype affects the frozen child!
parent.greet = () => "Hacked!";
console.log(child.greet()); // "Hacked!"

// ⚠️ WORKS! Adding properties to the prototype leaks through
parent.isPolluted = true;
console.log(child.isPolluted); // true

```

---

## 2. Prototype Pollution Attacks

Prototype pollution occurs when an attacker modifies a shared prototype (most commonly `Object.prototype`). Because almost all objects inherit from `Object.prototype`, polluting it injects properties into every object across the runtime.

### How the 3 Integrity Methods Defense-in-Depth against Pollution

| Defense Method                               | Prevents New Prototype Props? | Prevents Modifying Existing Prototype Props? | Safe as Defense? |
| -------------------------------------------- | ----------------------------- | -------------------------------------------- | ---------------- |
| `Object.preventExtensions(Object.prototype)` | ✅ Yes                         | ❌ No                                         | ⚠️ Partial        |
| `Object.seal(Object.prototype)`              | ✅ Yes                         | ❌ No                                         | ⚠️ Partial        |
| `Object.freeze(Object.prototype)`            | ✅ Yes                         | ✅ Yes                                        | 🟢 **Strongest**  |

#### Why `Object.seal()` is insufficient for Prototype Pollution

If you only seal `Object.prototype`, an attacker cannot *add* new properties (like `__proto__.isAdmin = true`), **but they can still overwrite existing built-in properties** like `toString`, `valueOf`, or `constructor` to cause Denial of Service (DoS) or alter execution flows:

```javascript
Object.seal(Object.prototype);

// ❌ Prevented (Cannot add new properties)
Object.prototype.newProp = "test"; // Fails / ignored

// ⚠️ ALLOWED! (Can still overwrite existing properties because they are writable)
Object.prototype.toString = () => "pawned"; 

```

#### Why `Object.freeze(Object.prototype)` is the Standard Mitigation

Freezing `Object.prototype` makes all properties non-writable and non-configurable, preventing both additions and modifications:

```javascript
// Run once at application startup
Object.freeze(Object.prototype);

const user = {};
// Attacker tries recursive merge:
user.__proto__.isAdmin = true; 

console.log(Object.prototype.isAdmin); // undefined (Attack neutralized!)

```

---

## 3. Deep-Freeze Defense Implementation

Because `Object.freeze()` is shallow, protecting an inheritance hierarchy requires recursively freezing the target object **and every link in its prototype chain**:

```javascript
function deepFreezeWithPrototypes(obj) {
  // Prevent infinite loops on null prototypes
  if (obj === null || typeof obj !== 'object') return obj;

  // 1. Freeze own properties (recursively)
  Object.getOwnPropertyNames(obj).forEach((name) => {
    const prop = obj[name];
    if (prop && typeof prop === 'object') {
      deepFreezeWithPrototypes(prop);
    }
  });

  // 2. Walk up and freeze the prototype
  const proto = Object.getPrototypeOf(obj);
  if (proto && proto !== Object.prototype) {
    deepFreezeWithPrototypes(proto);
  }

  // 3. Freeze the object itself
  return Object.freeze(obj);
}

```

---

## The Verdict

* **`preventExtensions` / `seal` / `freeze**` prevent `Object.setPrototypeOf()` or `__proto__` reassignment on the target object.
* They **do not** prevent an attacker from modifying or reading properties further up the prototype chain unless those prototypes are also frozen.
* **`Object.freeze(Object.prototype)`** is a powerful global defense against prototype pollution, whereas `Object.seal()` leaves existing standard methods vulnerable to property overrides.

Here is a curated set of **Staff/Senior level interview questions** specifically focused on `Object.freeze`, `Object.seal`, `Object.preventExtensions`, prototype inheritance, and prototype pollution.

---

## 1. Conceptual & Deep Dive Questions

### Q1: What happens under the hood when you call `Object.freeze(obj)` vs `Object.seal(obj)` at the property descriptor level?

Both methods set the internal `[[IsExtensible]]` slot of the object to `false` (preventing new properties from being added and preventing prototype reassignment via `Object.setPrototypeOf`).

* **`Object.seal()`** loops through all *own* existing properties and sets `configurable: false` on their property descriptors. This prevents deleting properties or changing their descriptors.
* **`Object.freeze()`** does everything `Object.seal()` does, **plus** it loops through all *own* existing properties and sets `writable: false`. This makes existing property values read-only (unless they are getters/setters).

---

### Q2: Is an object frozen with `Object.freeze()` truly 100% immutable? What are the exceptions or edge cases?

No, `Object.freeze()` is **shallow** and has three major mutability leaks:

1. **Nested Objects:** Properties holding references to nested objects/arrays remain mutable unless explicitly frozen.
2. **Prototype Modifications:** The target object's prototype chain (`obj.__proto__`) remains mutable if it wasn't frozen separately. An attacker can add/modify properties on the prototype, affecting the frozen child object.
3. **Getters & Setters:** If a frozen object has an accessor descriptor (`get`/`set`), calling a setter can still mutate internal/external state:

```js
let secret = 10;
const frozen = Object.freeze({
  get val() { return secret; },
  set val(v) { secret = v; } // Mutates state outside the object!
});
frozen.val = 20; // 'secret' is now 20!

```

---

### Q3: Why is `Object.seal(Object.prototype)` insufficient to prevent prototype pollution compared to `Object.freeze(Object.prototype)`?

`Object.seal()` sets `configurable: false` and `[[IsExtensible]] = false`, which prevents attackers from **adding** new properties to `Object.prototype` (e.g., `Object.prototype.isAdmin = true`).

However, `Object.seal()` leaves existing properties as `writable: true`. An attacker could still overwrite core built-in methods like `Object.prototype.toString` or `Object.prototype.valueOf`, causing Denial of Service (DoS) or manipulating logic flows. `Object.freeze()` sets `writable: false`, locking down both additions and overrides.

---

## 2. Output Prediction / Coding Challenges

### Q4: What will be logged in strict mode?

```js
"use strict";

const parent = { role: "guest" };
const child = Object.create(parent);

Object.freeze(child);

parent.role = "admin";
console.log(child.role);

Object.setPrototypeOf(child, { role: "superuser" });

```

1. `console.log(child.role)` outputs **`"admin"`**. Modifying the unfrozen `parent` updates the prototype chain, which `child` inherits from.
2. `Object.setPrototypeOf(...)` throws a **`TypeError: #<Object> is not extensible`**. Freezing `child` locks its internal `[[IsExtensible]]` slot, preventing prototype reassignment.

---

### Q5: Write a production-grade `deepFreeze` function that safely handles circular references and prototype chains

```js
function deepFreeze(obj, visited = new WeakSet()) {
  // Base case: primitives and null/undefined
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle circular references
  if (visited.has(obj)) {
    return obj;
  }
  visited.add(obj);

  // Freeze all own property values recursively
  Reflect.ownKeys(obj).forEach((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    if (descriptor && (descriptor.value || descriptor.get)) {
      deepFreeze(descriptor.value, visited);
    }
  });

  // Freeze prototype if it exists and isn't Object.prototype
  const proto = Object.getPrototypeOf(obj);
  if (proto && proto !== Object.prototype) {
    deepFreeze(proto, visited);
  }

  return Object.freeze(obj);
}

```

---

## 3. System Design & Architecture Questions

### Q6: In modern React state management (Redux, Zustand), why is `Object.freeze` rarely used in production, and what is used instead?

* **Performance:** Deep-freezing state objects recursively on every action/reducer dispatch adds significant runtime overhead ($O(N)$ traversal over entire state trees), causing micro-stutters and frame drops.
* **Alternative:** In production, developers use **Structural Sharing** via libraries like **Immer** (which uses `Proxy` objects to freeze only modified drafts in development) or native **`Object.assign` / Spread operators (`...`)**. Redux Toolkit enables `deepFreeze` automatically **only in development mode** via its `immutableCheckMiddleware`.

Here is a set of **Output Prediction Questions** covering `this`, `Object.freeze`, `Object.seal`, `Object.preventExtensions`, and prototype inheritance.

---

### Question 1: Method Assignment vs Freezing

```javascript
const user = {
  name: "Alice",
  getName: function () {
    return this.name;
  },
};

Object.freeze(user);

const getBoundName = user.getName;
console.log(getBoundName());

user.getName = function () {
  return "Bob";
};
console.log(user.getName());

```

```
undefined
Alice

```

**Explanation:**

1. `getBoundName` stores a reference to the `getName` function. When called as `getBoundName()`, it is executed as a standalone function, so `this` defaults to `window` (or `global`), where `name` is `undefined`.
2. `user.getName` cannot be reassigned to return `"Bob"` because `user` is frozen. The assignment fails silently (in non-strict mode), so calling `user.getName()` still returns `"Alice"`.

---

### Question 2: Prototype Mutation on Frozen Objects

```javascript
const proto = { role: "user" };
const obj = Object.create(proto);
obj.id = 1;

Object.freeze(obj);

proto.role = "admin";
console.log(obj.role);

delete obj.id;
console.log(obj.id);

```

```
admin
1

```

**Explanation:**

1. `Object.freeze(obj)` only freezes `obj`'s **own properties**. It does not freeze `proto`. Modifying `proto.role` works, and `obj.role` reads from the prototype chain, logging `"admin"`.
2. `delete obj.id` fails silently because `obj` is frozen (`configurable: false`). The property remains, so `obj.id` logs `1`.

---

### Question 3: Sealing vs Modifying Properties

```javascript
const config = {
  theme: "dark",
  settings: {
    notifications: true,
  },
};

Object.seal(config);

config.theme = "light";
config.fontSize = "16px";
config.settings.notifications = false;

console.log(config.theme);
console.log(config.fontSize);
console.log(config.settings.notifications);

```

```
light
undefined
false

```

**Explanation:**

1. `Object.seal()` allows modifying *existing* property values, so `config.theme = "light"` works.
2. It prevents adding *new* properties, so `config.fontSize` is ignored and remains `undefined`.
3. `Object.seal()` is shallow, so `config.settings` is not sealed. Modifying `notifications` inside `settings` works.

---

### Question 4: Nested Arrow Functions & `this`

```javascript
const obj = {
  val: 42,
  getVal: function () {
    const arrow1 = () => {
      const arrow2 = () => this.val;
      return arrow2();
    };
    return arrow1();
  },
};

const fn = obj.getVal;

console.log(obj.getVal());
console.log(fn());

```

```
42
undefined

```

**Explanation:**

1. Arrow functions inherit `this` from their outer function scope at the time they are invoked.
2. `obj.getVal()` sets `getVal`'s `this` to `obj`. `arrow1` and `arrow2` both inherit `this = obj`, returning `42`.
3. `fn()` executes `getVal` as a standalone function call, so `getVal`'s `this` becomes `undefined` (or global). The nested arrow functions inherit that global `this`, returning `undefined`.

---

### Question 5: `preventExtensions` with Getters and Setters

```javascript
let secret = "initial";

const obj = {
  get data() {
    return secret;
  },
  set data(val) {
    secret = val;
  },
};

Object.preventExtensions(obj);

obj.data = "updated";
obj.newProp = "test";

console.log(obj.data);
console.log(obj.newProp);

```

```
updated
undefined

```

**Explanation:**

1. `Object.preventExtensions()` prevents adding *new* properties (`newProp` is ignored).
2. However, setting an existing property that has a setter calls the setter method. It mutates external state (`secret`), so `obj.data` returns `"updated"`.
