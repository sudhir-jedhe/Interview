In JavaScript, **almost everything is an object**. However, to understand the different "types" of objects, it helps to categorize them based on how they are created, their underlying runtime type, and their intended purpose.

Here is a comprehensive breakdown of object types in JavaScript, ranging from standard plain objects to specialized built-in and custom class objects.

---

### 1. Plain Object (Object Literal)

A **Plain Object** (often called an *Object Literal*) is a simple collection of key-value pairs created directly using `{}` syntax or `Object.create(Object.prototype)`.

* **Purpose:** Storing structured data or options.
* **Example:**

```javascript
const user = {
  name: "Alex",
  age: 30,
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

```

---

### 2. Built-in Data Structure Objects (Arrays, Sets, Maps)

JavaScript includes built-in objects designed specifically for holding and manipulating collections of data.

* **Array Object:** An ordered, zero-indexed list of values.

```javascript
const colors = ["red", "green", "blue"];
console.log(colors.length); // 3 (Arrays have built-in methods and properties)

```

* **Map Object:** A collection of keyed data items where keys can be **any type** (objects, functions, primitives).

```javascript
const myMap = new Map();
myMap.set(user, "Admin Role");

```

* **Set Object:** A collection of unique values (duplicates are automatically ignored).

```javascript
const uniqueNumbers = new Set([1, 2, 2, 3]); // Contains: 1, 2, 3

```

---

### 3. Function Objects

In JavaScript, **functions are first-class objects**. A function is an instance of the `Function` built-in object, meaning it can have properties attached to it, be passed as an argument, or be assigned to a variable.

* **Callable Object:** They can be executed using `()`.
* **Example:**

```javascript
function sayHello() {
  console.log("Hello!");
}

// Functions can hold properties just like plain objects!
sayHello.category = "Greeting";
console.log(sayHello.category); // "Greeting"

```

---

### 4. Custom Class Objects (Class Instances)

Created using ES6 `class` syntax or ES5 Constructor Functions. These objects inherit properties and methods defined on their class prototype.

* **Purpose:** Object-Oriented Programming (OOP) to create reusable blueprints for domain objects.
* **Example:**

```javascript
class BankAccount {
  constructor(owner, balance) {
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
  }
}

const myAccount = new BankAccount("Sarah", 500); // Custom Class Object
myAccount.deposit(200); // Calls method from BankAccount prototype

```

---

### 5. Constructor Objects (Constructor Functions)

Before ES6 classes, regular functions were used as **Constructor Objects** to instantiate new objects using the `new` keyword.

* **Example:**

```javascript
function Car(make, model) {
  this.make = make;
  this.model = model;
}

const myCar = new Car("Toyota", "Corolla"); // Instance created via Constructor

```

---

### 6. Standard Built-in Value Objects (Date, RegExp, Error)

JavaScript provides built-in constructor objects for specific, non-primitive data operations:

* **Date Object:** Represents dates and times.

```javascript
const now = new Date();
console.log(now.toISOString());

```

* **RegExp Object:** Represents regular expressions for string searching/matching.

```javascript
const emailPattern = new RegExp("^[a-zA-Z0-9]+@domain\\.com$");

```

* **Error Object:** Built-in objects thrown when runtime errors occur (`Error`, `TypeError`, `SyntaxError`).

```javascript
const myError = new TypeError("Invalid argument provided");

```

---

### 7. Wrapper Objects (Primitive Wrappers)

Primitive types like `string`, `number`, and `boolean` are not objects. However, JavaScript creates temporary **Wrapper Objects** behind the scenes when you invoke methods on primitives (e.g., `"hello".toUpperCase()`).

* **Explicit Wrapper Objects:**

```javascript
const numObj = new Number(42);   // typeof numObj === "object"
const strObj = new String("Hi"); // typeof strObj === "object"

```

*(Note: Creating wrapper objects explicitly using `new Number()` is generally discouraged in modern JS).*

---

### 8. Array of Objects & Array of Date Objects

These are **composite data structures** where an Array object holds a collection of other specific objects.

* **Array of Plain Objects:**

```javascript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

```

* **Array of Date Objects:**

```javascript
const eventTimestamps = [
  new Date("2026-01-01"),
  new Date("2026-06-15"),
  new Date("2026-12-31")
];

// Accessing methods on an element inside the array
console.log(eventTimestamps[0].getFullYear()); // 2026

```

---

### Summary Checklist of Object Types in JavaScript

| Object Category            | Example Creation          | Description                                          |
| -------------------------- | ------------------------- | ---------------------------------------------------- |
| **Plain Object**           | `{ name: "John" }`        | Basic key-value mapping                              |
| **Array**                  | `[1, 2, 3]`               | Ordered list of elements                             |
| **Function Object**        | `function foo() {}`       | Executable code object                               |
| **Class Instance**         | `new User("John")`        | Instance of ES6 `class`                              |
| **Built-in Objects**       | `new Date()`, `/abc/g`    | Native runtime utilities (`Date`, `RegExp`, `Error`) |
| **Collections**            | `new Map()`, `new Set()`  | Keyed or unique data collections                     |
| **Special Global Objects** | `Math`, `JSON`, `Reflect` | Static objects containing namespace functions        |
