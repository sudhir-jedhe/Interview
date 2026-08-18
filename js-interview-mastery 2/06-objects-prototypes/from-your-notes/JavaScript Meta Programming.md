**Metaprogramming** is the practice of writing code that inspects, modifies, intercepts, or generates other code at runtime. Rather than just operating on data, metaprogramming allows JavaScript programs to treat the code itself as data.

Modern JavaScript organizes metaprogramming into three core categories: **Introspection**, **Self-Modification**, and **Intercession**.

---

## 1. Inspect Objects at Runtime (Introspection)

**Introspection** is the ability of a program to examine its own structure, type, and properties at runtime.

### A. Basic Property and Type Inspection

JavaScript provides reflective operators (`typeof`, `instanceof`, `in`) and static `Object` methods to inspect structures:

```javascript
const user = { id: 101, name: "Alice", role: "admin" };

console.log(typeof user);              // "object"
console.log("role" in user);           // true
console.log(Object.keys(user));        // ["id", "name", "role"]
console.log(Object.getOwnPropertyDescriptor(user, "name")); 
// { value: 'Alice', writable: true, enumerable: true, configurable: true }

```

### B. The `Reflect` API (Cleaner Introspection)

Introduced in ES6, the `Reflect` object standardizes reflective introspection calls into functional syntax rather than operators:

```javascript
const car = { make: "Tesla", model: "Model 3" };

// Check property existence
console.log(Reflect.has(car, "make")); // true (same as: "make" in car)

// Read property
console.log(Reflect.get(car, "model")); // "Model 3" (same as: car.model)

// Get prototype
console.log(Reflect.getPrototypeOf(car) === Object.prototype); // true

```

---

## 2. Modify Objects, Functions, and Classes at Runtime (Self-Modification)

**Self-modification** occurs when a running program changes its own internal structure, such as adding/deleting properties, reassigning prototypes, or applying class decorators.

### A. Dynamic Property Mutation and Property Descriptors

```javascript
const config = {};

// Dynamically modify object configuration
Object.defineProperty(config, "API_KEY", {
  value: "secret-key-123",
  writable: false,      // Read-only
  configurable: false,  // Prevents deletion
  enumerable: true
});

// Reflect equivalent:
Reflect.defineProperty(config, "PORT", { value: 8080, writable: true });

```

### B. Modifying Prototype Chains dynamically

```javascript
const animal = { eats: true };
const dog = { barks: true };

// Change prototype at runtime
Object.setPrototypeOf(dog, animal);
console.log(dog.eats); // true

```

### C. Decorators (Modifying Classes and Functions)

Class Decorators allow meta-modification of classes and class members during declaration:

```javascript
// Decorator function that modifies class behavior
function logInstantiation(target, context) {
  if (context.kind === "class") {
    return class extends target {
      constructor(...args) {
        super(...args);
        console.log(`[Class Decorator] New instance created for: ${context.name}`);
      }
    };
  }
}

@logInstantiation
class UserService {
  constructor(name) {
    this.name = name;
  }
}

const service = new UserService("MainService"); // Logs: New instance created for: UserService

```

---

## 3. Intercept Running Operations (Intercession)

**Intercession** is the most powerful tier of metaprogramming: intercepting and overriding low-level language operations (e.g., property access, function invocation, `delete`, or `in` checks) using **`Proxy`** and **`Reflect`**.

### A. Custom Property Traps with `Proxy`

```javascript
const target = { name: "John", age: 30 };

const handler = {
  // Intercept property reading (get trap)
  get(target, prop, receiver) {
    if (!(prop in target)) {
      return `Property '${prop}' does not exist!`; // Custom default fallback
    }
    return Reflect.get(target, prop, receiver);
  },

  // Intercept property assignment (set trap)
  set(target, prop, value, receiver) {
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("Age must be a number!");
    }
    return Reflect.set(target, prop, value, receiver);
  }
};

const userProxy = new Proxy(target, handler);

console.log(userProxy.name);     // "John"
console.log(userProxy.address);  // "Property 'address' does not exist!"

userProxy.age = 35;              // Works
// userProxy.age = "thirty";     // Throws TypeError: Age must be a number!

```

### B. Intercepting Function Calls (`apply` trap)

```javascript
function sum(a, b) {
  return a + b;
}

const loggedSum = new Proxy(sum, {
  apply(target, thisArg, args) {
    console.log(`Function '${target.name}' called with args:`, args);
    return Reflect.apply(target, thisArg, args);
  }
});

console.log(loggedSum(10, 20)); 
// Logs: Function 'sum' called with args: [10, 20]
// Returns: 30

```

---

## 4. Controlling Objects via Well-Known Symbols

JavaScript provides **Well-Known Symbols** that act as hooks, allowing custom objects to override built-in language semantics (such as iteration, type conversion, or regex matching).

```javascript
const range = {
  start: 1,
  end: 3,

  // Override standard iteration (for...of loop) using Symbol.iterator
  [Symbol.iterator]() {
    let current = this.start;
    const last = this.end;

    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  },

  // Override string type casting using Symbol.toPrimitive
  [Symbol.toPrimitive](hint) {
    if (hint === "string") {
      return `Range(${this.start}..${this.end})`;
    }
    return this.start;
  }
};

// 1. Iteration hook
for (const num of range) {
  console.log(num); // 1, 2, 3
}

// 2. String conversion hook
console.log(String(range)); // "Range(1..3)"

```

---

## 5. Generate Dynamic Code (Generative Metaprogramming)

**Generative metaprogramming** involves constructing executable code at runtime from text strings.

> ⚠️ **Warning:** Dynamic code generation using `eval()` or `Function()` introduces severe **security risks** (XSS vulnerabilities) and **performance penalties** because modern engines cannot optimize string-parsed code.

### A. The `Function` Constructor (Safer than `eval`)

Instead of `eval()`, the `Function` constructor creates dynamically evaluated scope blocks:

```javascript
// Dynamically construct a function from strings
const mathOperator = "multiply";
const operationBody = "return a * b;";

const dynamicMath = new Function("a", "b", operationBody);

console.log(dynamicMath(6, 7)); // 42

```

---

## Metaprogramming Tool Matrix

| Technique              | Category                | Key APIs / Syntax                          | Primary Use Cases                                          |
| ---------------------- | ----------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| **Introspection**      | Inspecting Structure    | `Object.keys()`, `Reflect.has()`, `typeof` | Schema validation, debugging tools.                        |
| **Self-Modification**  | Altering Structures     | `Object.defineProperty()`, Decorators      | Class extension, reactive state, polyfills.                |
| **Intercession**       | Intercepting Operations | `new Proxy()`, `Reflect.get()`             | Vue/MobX reactivity engines, mock testing, access control. |
| **Well-Known Symbols** | Overriding Semantics    | `Symbol.iterator`, `Symbol.toPrimitive`    | Custom iterables, custom type casting.                     |
| **Generative**         | Dynamic Code Generation | `new Function()`, `eval()`                 | Template engines, dynamic DSL interpreters.                |

**Metaprogramming** is the practice of writing code that inspects, modifies, intercepts, or generates other code at runtime. Instead of operating purely on standard application data, metaprogramming allows a JavaScript application to treat the code itself as data.

Modern JavaScript categorizes metaprogramming into three core concepts: **Introspection**, **Self-Modification**, and **Intercession**.

---

## 1. Introspection (Inspecting Code at Runtime)

**Introspection** is a program’s ability to examine its own internal structure, properties, types, and prototypes during execution.

### Basic Operators vs. The `Reflect` API

While traditional operators like `typeof`, `instanceof`, and `in` perform basic inspection, the ES6 **`Reflect` API** standardizes introspection methods into a single, clean functional interface.

```javascript
const user = {
  id: 101,
  name: "Alice",
  role: "admin"
};

// 1. Traditional Introspection
console.log("role" in user);                     // true
console.log(Object.keys(user));                  // ["id", "name", "role"]

// 2. Functional Introspection with Reflect
console.log(Reflect.has(user, "name"));          // true (Equivalent to: "name" in user)
console.log(Reflect.get(user, "role"));          // "admin"
console.log(Reflect.ownKeys(user));              // ["id", "name", "role"]
console.log(Reflect.getPrototypeOf(user));       // Object.prototype

```

---

## 2. Self-Modification (Mutating Structure at Runtime)

**Self-modification** occurs when a program alters its own internal properties, prototypes, function behavior, or class structures while running.

### A. Modifying Property Descriptors

Property descriptors allow you to alter how properties behave (read-only, non-enumerable, non-configurable):

```javascript
const config = {};

// Define a read-only property at runtime
Reflect.defineProperty(config, "API_ENDPOINT", {
  value: "https://api.example.com/v1",
  writable: false,      // Cannot be overwritten
  configurable: false,  // Cannot be deleted
  enumerable: true
});

console.log(config.API_ENDPOINT); // "https://api.example.com/v1"
config.API_ENDPOINT = "https://hacked.com"; // Silently fails (or throws in strict mode)
console.log(config.API_ENDPOINT); // "https://api.example.com/v1"

```

### B. Modifying Prototype Chains

```javascript
const runner = {
  run() { return "Running fast!"; }
};

const athlete = { name: "Jordan" };

// Dynamically mutate prototype chain at runtime
Reflect.setPrototypeOf(athlete, runner);

console.log(athlete.run()); // "Running fast!"

```

---

## 3. Intercession (Intercepting Operations with `Proxy`)

**Intercession** is the most powerful tier of metaprogramming: intercepting and redefining low-level language operations (such as property reads, writes, function invocations, or deletion) using **`Proxy`** and **`Reflect`**.

### A. Trapping Object Reads and Writes

```javascript
const targetUser = { name: "Bob", age: 25 };

const userProxy = new Proxy(targetUser, {
  // Trap property access (get)
  get(target, prop, receiver) {
    if (!(prop in target)) {
      return `Property '${String(prop)}' does not exist!`; // Fallback value
    }
    return Reflect.get(target, prop, receiver);
  },

  // Trap property mutation (set)
  set(target, prop, value, receiver) {
    if (prop === "age") {
      if (typeof value !== "number" || value < 0) {
        throw new TypeError("Age must be a positive number.");
      }
    }
    return Reflect.set(target, prop, value, receiver);
  }
});

console.log(userProxy.name);    // "Bob"
console.log(userProxy.email);   // "Property 'email' does not exist!"

userProxy.age = 30;             // Works successfully
// userProxy.age = -5;          // Throws TypeError: Age must be a positive number.

```

### B. Trapping Function Execution (`apply` trap)

```javascript
function calculateDiscount(price, discountRatio) {
  return price * (1 - discountRatio);
}

// Intercept function calls for automatic logging/telemetry
const loggedDiscount = new Proxy(calculateDiscount, {
  apply(target, thisArg, argumentsList) {
    console.log(`[LOG] Calling '${target.name}' with args:`, argumentsList);
    const result = Reflect.apply(target, thisArg, argumentsList);
    console.log(`[LOG] Result: ${result}`);
    return result;
  }
});

loggedDiscount(100, 0.2);
// Logs: [LOG] Calling 'calculateDiscount' with args: [100, 0.2]
// Logs: [LOG] Result: 80

```

---

## 4. Well-Known Symbols (Overriding Language Semantics)

JavaScript provides built-in **Well-Known Symbols** that act as metaprogramming hooks, letting custom objects override built-in language mechanisms (such as iteration or type coercion).

```javascript
const customCollection = {
  items: ["Apple", "Banana", "Cherry"],

  // 1. Hook into for...of loops using Symbol.iterator
  [Symbol.iterator]() {
    let index = 0;
    const items = this.items;
    return {
      next() {
        if (index < items.length) {
          return { value: items[index++], done: false };
        }
        return { done: true };
      }
    };
  },

  // 2. Hook into type conversion using Symbol.toPrimitive
  [Symbol.toPrimitive](hint) {
    if (hint === "string") {
      return `Collection containing ${this.items.length} items`;
    }
    return this.items.length;
  }
};

// Iteration Metaprogramming
for (const item of customCollection) {
  console.log(item); // "Apple", "Banana", "Cherry"
}

// Type Conversion Metaprogramming
console.log(String(customCollection)); // "Collection containing 3 items"
console.log(Number(customCollection)); // 3

```

---

## 5. Generative Metaprogramming (Dynamic Code Execution)

**Generative metaprogramming** refers to constructing and executing source code dynamically from strings at runtime.

```javascript
// Dynamically construct a function from string variables
const paramName = "itemPrice";
const taxRate = 0.08;
const functionBody = `return ${paramName} + (${paramName} * ${taxRate});`;

// Safer than eval() because it evaluates in its own scope block
const calculateTotal = new Function(paramName, functionBody);

console.log(calculateTotal(100)); // 108

```

> **Warning:** Generative code execution via `eval()` or `new Function()` should be avoided when possible because it creates security risks (XSS vulnerabilities) and prevents modern JIT compilers from optimizing the code.

---

## Summary Matrix

| Concept                | Action                  | Primary APIs / Syntax                        | Primary Use Case                                                |
| ---------------------- | ----------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| **Introspection**      | Read structure          | `Reflect.has()`, `Object.keys()`, `typeof`   | Schema validation, type checking, debugging.                    |
| **Self-Modification**  | Modify structure        | `Reflect.defineProperty()`, Prototype chains | Polyfills, dynamic class extensions.                            |
| **Intercession**       | Intercept execution     | `new Proxy()`, `Reflect.get() / set()`       | Reactive state systems (Vue 3/MobX), input validation, mocking. |
| **Well-Known Symbols** | Override language hooks | `Symbol.iterator`, `Symbol.toPrimitive`      | Custom iterable structures, custom coercion.                    |
| **Generative**         | Construct dynamic code  | `new Function("a", "b", "...")`              | Dynamic template compilers, DSL interpreters.                   |
