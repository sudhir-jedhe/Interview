### **What is `prototype` in JavaScript?**

In JavaScript, **`prototype`** is an object that is attached to every JavaScript function (and classes) by default. Every function or class has a `prototype` property, and that property is used to define methods and properties that are shared among all instances of that function (or class).

When you create a new object from a constructor function (or class), the object inherits properties and methods from the constructor's `prototype`.

#### **How `prototype` works**:

- **Prototype Chain**: Every JavaScript object has a `[[Prototype]]` property (often accessible via `__proto__`), which is an internal property that refers to another object. When you attempt to access a property on an object, JavaScript will first check the object itself. If it doesn't find it there, it will look at the object's prototype and continue up the chain.
- **Shared Properties/Methods**: If you define a property or method on a constructor's `prototype`, all instances created from that constructor will inherit those properties or methods.

---

### **Prototype vs `__proto__`**

The terms **`prototype`** and **`__proto__`** are related but refer to different things:

1. **`prototype`**:
   - It is a property of a **function** (or a class in modern JavaScript) that is used to define methods and properties for instances created by the function.
   - **`prototype`** is used to add methods to objects that will be shared across all instances of a class or function.
2. **`__proto__`**:
   - **`__proto__`** is a property of **every object** in JavaScript, which points to the prototype object of the constructor function that created the object.
   - **`__proto__`** allows you to access the prototype chain of an object, but it's considered to be a non-standard, deprecated feature, and it's better to use `Object.getPrototypeOf(obj)` in modern JavaScript.

#### **Example of `prototype` and `__proto__`**:

```javascript
// Define a constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add a method to the prototype of Person
Person.prototype.sayHello = function () {
  console.log(`Hello, my name is ${this.name}`);
};

// Create an instance of Person
const person1 = new Person("Alice", 25);

// Access prototype via __proto__
console.log(person1.__proto__ === Person.prototype); // true

// Access method from prototype
person1.sayHello(); // "Hello, my name is Alice"
```

In this example:

- `Person.prototype` contains the `sayHello` method.
- `person1.__proto__` refers to `Person.prototype`, which gives access to the shared method.

---

### **What Happens When You Copy an Object?**

When you copy an object, you have to understand whether you are creating a **shallow copy** or a **deep copy**. The behavior of copying depends on whether the object properties are primitive values or reference types (like arrays or other objects).

1. **Shallow Copy**: A shallow copy means that the top-level properties are copied, but nested objects or arrays still reference the original objects.
2. **Deep Copy**: A deep copy means that all properties and nested objects are copied recursively, so no references to the original objects exist in the new copy.

#### **Example of Shallow Copy**:

```javascript
const person = {
  name: "Alice",
  age: 25,
  address: {
    city: "New York",
    zip: "10001",
  },
};

// Shallow copy using Object.assign
const shallowCopy = Object.assign({}, person);

// Modify the shallow copy's address
shallowCopy.address.city = "Los Angeles";

console.log(person.address.city); // "Los Angeles" (changes reflected in the original object)
```

**Explanation**:

- In the shallow copy example, `Object.assign()` only copies the top-level properties. The nested `address` object is still a reference to the original object. Therefore, modifying the nested `address` in the copy affects the original object.

#### **Example of Deep Copy**:

To make a deep copy, you need to ensure that the nested objects are also copied recursively. One way to do this is by using `JSON.parse()` and `JSON.stringify()`:

```javascript
const person = {
  name: "Alice",
  age: 25,
  address: {
    city: "New York",
    zip: "10001",
  },
};

// Deep copy using JSON methods
const deepCopy = JSON.parse(JSON.stringify(person));

// Modify the deep copy's address
deepCopy.address.city = "Los Angeles";

console.log(person.address.city); // "New York" (no change to the original object)
```

**Explanation**:

- `JSON.parse(JSON.stringify(person))` creates a full deep copy of the object, including the nested `address` object. Modifying the deep copy does not affect the original object because all nested objects are copied by value.

---

### **Shallow Copy vs Deep Copy Example with `__proto__`**

Consider the following case where we copy an object that has a prototype chain:

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.sayHello = function () {
  console.log(`Hello, I am ${this.name}`);
};

const dog = new Animal("Dog");

// Shallow copy using Object.assign
const dogShallowCopy = Object.assign({}, dog);

// Both the original and the copy share the same prototype chain
console.log(dogShallowCopy.__proto__ === dog.__proto__); // true

// Adding a new property to the shallow copy
dogShallowCopy.age = 5;

console.log(dogShallowCopy.age); // 5
console.log(dog.age); // undefined (no change in the original object)
```

**Explanation**:

- `dogShallowCopy` shares the same prototype (`__proto__`) as `dog` since `Object.assign()` performs a shallow copy of the properties but doesn't clone the prototype chain.
- When we add a new property (`age`) to `dogShallowCopy`, it does not affect the original `dog` object because the shallow copy only copies the properties, not the prototype or nested objects.

---

### **Summary**:

- **`prototype`** is a property of constructor functions that allows you to define shared methods or properties for all instances created by that constructor.
- **`__proto__`** is a property of objects, which points to the prototype of the constructor function that created the object. It is used to access an object's prototype chain.
- **Shallow Copy**: Copies top-level properties but keeps references to nested objects (e.g., using `Object.assign()`).
- **Deep Copy**: Copies all properties, including nested objects, creating completely new copies of everything (e.g., using `JSON.parse(JSON.stringify(obj))`).

---

### **When to Use `prototype` and `__proto__`**:

- **`prototype`** is typically used to define methods for constructor functions or classes so that all instances can inherit them. It's used to implement inheritance in JavaScript.
- **`__proto__`** is mainly used to inspect or traverse the prototype chain of an object. However, it's better to use `Object.getPrototypeOf()` in modern JavaScript, as `__proto__` is considered deprecated in favor of more standardized methods.

In JavaScript, **prototypes** are the mechanism by which objects inherit features from one another. Every JavaScript object has a built-in property called its prototype, which is itself an object.

Here is a breakdown of how prototypes work, from foundational concepts to practical usage.

---

## 1. The Prototype Chain

When you try to access a property or method on an object, JavaScript searches for it in a specific order:

1. **The Object Itself:** It first checks if the property exists directly on the object.
2. **The Prototype:** If not found, it checks the object's prototype.
3. **Up the Chain:** If still not found, it checks the prototype's prototype, climbing up the **prototype chain**.
4. **End of Chain:** The top of the chain is `Object.prototype`. If the property isn't found anywhere, it returns `undefined`.

```javascript
const animal = {
  eats: true,
  walk() {
    console.log("Animal walks");
  },
};

const dog = Object.create(animal); // Set 'animal' as the prototype of 'dog'
dog.barks = true;

console.log(dog.barks); // true (found on dog)
console.log(dog.eats); // true (found on animal prototype)
dog.walk(); // "Animal walks" (found on animal prototype)
```

---

## 2. `__proto__` vs. `prototype`

This is one of the most common points of confusion in JavaScript:

### `[[Prototype]]` / `__proto__`

- Every created object has an internal link to its prototype, denoted as `[[Prototype]]`.
- Historically accessed via `obj.__proto__` (though `Object.getPrototypeOf(obj)` and `Object.setPrototypeOf(obj)` are the modern standard methods).

### `Function.prototype`

- Functions (specifically constructor functions) have a `.prototype` property.
- This property is **not** the prototype of the function itself; rather, it is the object that will become the prototype (`[[Prototype]]`) for all instances created using `new FunctionName()`.

```javascript
function User(name) {
  this.name = name;
}

// Add a method to the constructor's prototype
User.prototype.sayHi = function () {
  console.log(`Hi, I'm ${this.name}`);
};

const alice = new User("Alice");

alice.sayHi(); // "Hi, I'm Alice"

// The instance's prototype links to the function's prototype property
console.log(Object.getPrototypeOf(alice) === User.prototype); // true
```

---

## 3. How ES6 Classes Use Prototypes Under the Hood

JavaScript's `class` syntax introduced in ES6 is mostly syntactic sugar built on top of prototype-based inheritance.

```javascript
class Person {
  constructor(name) {
    this.name = name; // Attached directly to instance
  }

  // Method attached to Person.prototype
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const bob = new Person("Bob");

// Under the hood, this is identical to prototype methods:
console.log(bob.hasOwnProperty("name")); // true
console.log(bob.hasOwnProperty("greet")); // false (lives on Person.prototype)
```

---

## 4. Prototype Pollution (Security Concern)

Because prototypes are shared globally across object instances, mutating a built-in prototype (often called "prototype pollution" or "monkey patching") can introduce severe bugs or security vulnerabilities.

```javascript
// BAD PRACTICE: Modifying built-in prototypes
Array.prototype.first = function () {
  return this[0];
};

const nums = [10, 20, 30];
console.log(nums.first()); // 10

// Why it's dangerous: Third-party libraries or future JS spec additions
// might break or collide with your custom 'first()' implementation.
```

---

## Key Takeaways

- **Inheritance:** Objects delegate property lookups to their prototype rather than duplicating methods on every instance.
- **Memory Efficiency:** Attaching methods to `Constructor.prototype` or a `class` body ensures only one copy of the function exists in memory, shared by all instances.
- **Lookup Path:** `Instance` $\rightarrow$ `Constructor.prototype` $\rightarrow$ `Object.prototype` $\rightarrow$ `null`.
