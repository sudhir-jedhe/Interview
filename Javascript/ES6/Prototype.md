In JavaScript, **everything except primitives is an object** (or can behave like one), and every object has an internal link to another object called its **Prototype**.

JavaScript does not use traditional class-based inheritance like Java or C++. Instead, it uses **Prototypal Inheritance**: objects inherit properties and methods directly from other objects through a chain of references called the **Prototype Chain**.

---

## 1. The Core Mechanics: `prototype` vs `__proto__`

The most common point of confusion in JavaScript is the difference between the `.prototype` property and the `[[Prototype]]` internal link (`__proto__`).

* **`[[Prototype]]` (accessible via `Object.getPrototypeOf()` or `__proto__`):**
This is the actual internal link every object holds pointing to its parent prototype object. When you read a property on an object, JS follows this link.
* **`.prototype` Property:**
This is a property that exists **only on functions** (regular functions and ES6 classes). It defines what `[[Prototype]]` will be assigned to any new instances created when that function is invoked with the `new` keyword.

```
┌───────────────────────────┐                   ┌───────────────────────────────┐
│   Constructor Function    │                   │   Constructor.prototype       │
│   function User(name) {}  │ ────────────────► │   { constructor: User, ... }  │
└───────────────────────────┘    .prototype     └───────────────────────────────┘
                                                        ▲
                                                        │
                                                        │ internal [[Prototype]] link
                                                        │ (__proto__)
                                                        │
                                                ┌───────┴───────────────────────┐
                                                │   Instance Object             │
                                                │   const alice = new User()    │
                                                └───────────────────────────────┘

```

---

## 2. Memory Diagram: The Prototype Chain

When you create an instance `alice` from a constructor `User`, V8 allocates memory structures as follows:

```
[ MEMORY HEAP ]

  1. Instance Object (alice)
     ┌──────────────────────────────────┐
     │ name: "Alice"                    │
     │ [[Prototype]] (__proto__) ──────┼───────┐
     └──────────────────────────────────┘       │
                                                │ (points to)
  2. User.prototype Object                      │
     ┌──────────────────────────────────◄───────┘
     │ constructor: User                │
     │ sayHello: function() { ... }     │
     │ [[Prototype]] (__proto__) ──────┼───────┐
     └──────────────────────────────────┘       │
                                                │ (points to)
  3. Object.prototype (Top of normal chain)    │
     ┌──────────────────────────────────◄───────┘
     │ toString: function() { ... }     │
     │ hasOwnProperty: function() { ...}│
     │ [[Prototype]] (__proto__) ──────┼───────┐
     └──────────────────────────────────┘       │
                                                │
  4. End of Chain                               ▼
     null

```

### Property Lookup Walkthrough

When you execute `alice.sayHello()`:

1. **Check `alice`:** Does `alice` have an own property named `sayHello`? $\rightarrow$ **No.**
2. **Follow `__proto__` to `User.prototype`:** Does `User.prototype` have `sayHello`? $\rightarrow$ **Yes!** Execute function.

When you execute `alice.toString()`:

1. **Check `alice`:** No.
2. **Follow `__proto__` to `User.prototype`:** No.
3. **Follow `__proto__` to `Object.prototype`:** **Found!** Execute `Object.prototype.toString()`.

When you execute `alice.nonExistentProperty`:

1. Checks `alice` $\rightarrow$ `User.prototype` $\rightarrow$ `Object.prototype` $\rightarrow$ `null`.
2. Reaches `null` (end of chain) and returns **`undefined`**.

---

## 3. Code Example: Prototypal Inheritance in Action

### A. Creating Prototypes with Constructor Functions

```javascript
// 1. Constructor Function
function User(name, role) {
  // Own properties (stored directly on every instance)
  this.name = name;
  this.role = role;
}

// 2. Attach shared methods to User.prototype (Memory Efficient!)
User.prototype.getDetails = function () {
  return `${this.name} is a ${this.role}`;
};

const alice = new User('Alice', 'Admin');
const bob = new User('Bob', 'Developer');

// Both instances share the exact same function reference in memory:
console.log(alice.getDetails === bob.getDetails); // true

// Checking own vs inherited properties:
console.log(alice.hasOwnProperty('name'));       // true  (Own property)
console.log(alice.hasOwnProperty('getDetails')); // false (Inherited from prototype)

```

---

### B. Pure Prototypal Inheritance with `Object.create()`

`Object.create(proto)` allows you to create a new object directly linked to an existing object without using constructor functions or `new`:

```javascript
// Base prototype object
const animalActions = {
  eat() {
    return `${this.name} is eating.`;
  }
};

// Create 'dog' with 'animalActions' as its prototype
const dog = Object.create(animalActions);
dog.name = 'Rex';

console.log(dog.eat()); // "Rex is eating."
console.log(Object.getPrototypeOf(dog) === animalActions); // true

```

---

## 4. Property Shadowing

When you assign a property to an object that has the same name as a property on its prototype, the property is written directly to the instance. It **shadows** (overrides) the prototype property without modifying the prototype itself.

```javascript
function Config() {}
Config.prototype.theme = 'light'; // Default on prototype

const userConfig = new Config();

console.log(userConfig.theme); // "light" (from prototype)

// Shadowing the property:
userConfig.theme = 'dark'; // Writes 'theme' directly to userConfig instance!

console.log(userConfig.theme); // "dark" (from own property)
console.log(Config.prototype.theme); // "light" (Prototype remains untouched!)

// Deleting own property un-shadows the prototype value:
delete userConfig.theme;
console.log(userConfig.theme); // "light" (falls back to prototype again)

```

---

## 5. Performance Considerations in V8

1. **Long Prototype Chains Impact Speed:** Deeply nested prototype chains require more pointer hops during property lookup. Reading non-existent properties on deep chains forces the engine to traverse all the way to `null`.
2. **Avoid Modifying `__proto__` / `Object.setPrototypeOf()`:** Mutating an object's prototype after creation de-optimizes V8 JIT code by breaking **Inline Caches (IC)** and forcing objects into slow dictionary mode. Always create objects with their intended prototype using `Object.create()` or `new`.

---

## Summary Checklist

| Concept                           | Description                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **`[[Prototype]]` / `__proto__**` | The actual pointer link inside an object pointing to its parent prototype.                                                           |
| **`.prototype`**                  | A property on functions used as a template blueprint for instances created via `new`.                                                |
| **Prototype Chain**               | The linked list of objects (`instance` $\rightarrow$ `Constructor.prototype` $\rightarrow$ `Object.prototype` $\rightarrow$ `null`). |
| **`Object.create(obj)`**          | Creates a fresh object whose `[[Prototype]]` points directly to `obj`.                                                               |
