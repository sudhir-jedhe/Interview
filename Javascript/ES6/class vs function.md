In JavaScript, **ES6 Classes are syntactic sugar over traditional constructor functions and prototype-based inheritance**.

Under the hood, both systems rely on the exact same prototype mechanism (`Constructor.prototype` and `__proto__`). However, ES6 classes add strict engine-level checks, altered execution rules, and syntactic protections that make them far safer and more structured than raw constructor functions.

---

## Direct Comparison Matrix

| Feature / Behavior           | Traditional Constructor Function                                                        | ES6 Class                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Underlying Mechanism**     | Prototypes (`Constructor.prototype`)                                                    | Prototypes (`Constructor.prototype`)                                                |
| **Invocation Without `new**` | ⚠️ Runs as normal function (`this` defaults to `window`/`undefined` unless guarded)      | ❌ **Throws `TypeError**` (`Class constructor cannot be invoked without 'new'`)      |
| **Hoisting Behavior**        | Fully hoisted (can be instantiated before definition in file)                           | Hoisted into **Temporal Dead Zone (TDZ)** (Throws `ReferenceError` if called early) |
| **Strict Mode**              | Opt-in per function or file (`'use strict'`)                                            | **Enforced automatically** (Body is always in strict mode)                          |
| **Method Enumerability**     | Methods on `prototype` are **enumerable** (`for...in` / `Object.keys()` will list them) | Methods on `prototype` are **non-enumerable** by default                            |
| **Inheritance Mechanics**    | Manual prototype linking (`Object.create()`, setting `.constructor`)                    | Clean native `extends` keyword and mandatory `super()` call                         |

---

## 1. Invocation Protection (The `[[IsClassConstructor]]` Internal Slot)

### Traditional Function

A traditional constructor function is just a standard function object. If you forget the `new` keyword, JavaScript executes it as a standard function call, corrupting global scope variables or throwing unexpected `TypeError`s:

```javascript
function UserFunc(name) {
  this.name = name; // In non-strict mode, sets window.name!
}

const user1 = UserFunc('Alice'); 
console.log(user1); // undefined
console.log(window.name); // "Alice" (Polluted global scope!)

```

### ES6 Class

When V8/JS engines parse an ES6 `class`, its internal function object is tagged with a hidden internal slot called **`[[IsClassConstructor]]: true`**.

When invoked, the engine checks for `[[IsClassConstructor]]`:

* If called with `new` $\rightarrow$ Proceeds with execution.
* If called directly (`UserClass()`) $\rightarrow$ Throws `TypeError: Class constructor UserClass cannot be invoked without 'new'`.

```javascript
class UserClass {
  constructor(name) {
    this.name = name;
  }
}

const user2 = UserClass('Bob'); 
// ❌ TypeError: Class constructor UserClass cannot be invoked without 'new'

```

---

## 2. Method Enumerability on Prototypes

When methods are added to a prototype manually versus inside a class body, their internal **property descriptor attributes** differ.

### Traditional Function (Enumerable Methods)

```javascript
function PersonFunc(name) {
  this.name = name;
}
PersonFunc.prototype.sayHello = function() {};

const p1 = new PersonFunc('Alice');

// Prototype methods show up in loops!
for (let key in p1) {
  console.log(key); // Outputs: "name", AND "sayHello"
}

```

### ES6 Class (Non-Enumerable Methods)

Methods defined inside an ES6 class body are automatically configured with `enumerable: false` on the prototype object descriptor:

```javascript
class PersonClass {
  constructor(name) {
    this.name = name;
  }
  sayHello() {} // Enumerable is set to false automatically
}

const p2 = new PersonClass('Bob');

for (let key in p2) {
  console.log(key); // Outputs ONLY: "name" ("sayHello" is hidden!)
}

```

---

## 3. How Inheritance Works Under the Hood

To inherit from another constructor in traditional JS, you had to manually reset prototype chains and repair the `.constructor` reference. ES6 `extends` automates this cleanly.

### Traditional Inheritance (Manual Prototype Wiring)

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.eat = function() { console.log('eating'); };

function Dog(name, breed) {
  // 1. Call parent constructor with 'this'
  Animal.call(this, name); 
  this.breed = breed;
}

// 2. Link prototype chain
Dog.prototype = Object.create(Animal.prototype);

// 3. Repair broken constructor reference
Dog.prototype.constructor = Dog; 

```

### ES6 Class Inheritance (`extends` + `super()`)

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() { console.log('eating'); }
}

class Dog extends Animal {
  constructor(name, breed) {
    // 1. MUST call super() before accessing 'this'!
    super(name); 
    this.breed = breed;
  }
}

```

#### What `extends` Does Under the Hood

When `class Dog extends Animal` runs, the engine executes two prototype links automatically:

1. **Instance Prototype Link:** Sets `Dog.prototype.__proto__ = Animal.prototype` (so instances inherit methods like `eat()`).
2. **Static Prototype Link:** Sets `Dog.__proto__ = Animal` (so static methods on `Animal` are inherited by `Dog`).

---

## 4. `super()` and Instance Construction Order

In traditional constructor inheritance (`Animal.call(this, name)`), the **child constructor creates the `this` object first**, and then passes it to the parent constructor to populate.

In ES6 `class` inheritance with `extends`:

1. The **parent constructor is responsible for creating the initial `this` object**.
2. Calling `super()` invokes the parent constructor, instantiates `this`, and returns it to the child constructor.
3. Because `this` does not exist until `super()` finishes, accessing `this` before calling `super()` in a child class throws a `ReferenceError` (the `this` binding is in the Temporal Dead Zone).

```javascript
class Parent {}

class Child extends Parent {
  constructor() {
    // console.log(this); // ❌ ReferenceError: Must call super constructor before accessing 'this'
    super();
    console.log(this); // ✅ Works! 'this' has been initialized by super()
  }
}

```

---

## Summary Mental Model

Think of an ES6 class as a **factory wrapper** around traditional prototype patterns. It compiles down to standard prototype assignments, but installs engine-level guardrails:

* It forces strict mode.
* It blocks execution without `new` using `[[IsClassConstructor]]`.
* It hides prototype methods from `for...in` enumeration.
* It handles dual prototype linkage (static and instance) automatically via `extends`.
