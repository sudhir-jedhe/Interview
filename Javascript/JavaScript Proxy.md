A **JavaScript `Proxy**` is an object that wraps a target object and acts as a custom gatekeeper for operations performed on that target.

Whenever code reads, writes, inspects, or calls a function on the proxied object, the `Proxy` intercepts the operation using handler functions called **traps**. This gives you complete control over object behavior at runtime.

---

## 1. Syntax & Core Terminology

```javascript
const proxy = new Proxy(target, handler);

```

* **Target:** The original object (e.g., Object, Array, Function) being wrapped.
* **Handler:** An object containing **trap functions** that define custom behavior when operations occur.
* **Proxy:** The wrapper instance that clients interact with instead of the target directly.

---

## 2. Examples of Common Traps

### 1. Reading a Property (`get`)

Intercepts property reads (e.g., `proxy.propertyName`).

```javascript
const user = { name: "Alice", age: 30 };

const handler = {
  get(target, prop, receiver) {
    if (!(prop in target)) {
      return `Property '${String(prop)}' does not exist on this object!`;
    }
    return Reflect.get(target, prop, receiver);
  }
};

const userProxy = new Proxy(user, handler);

console.log(userProxy.name);  // "Alice"
console.log(userProxy.email); // "Property 'email' does not exist on this object!"

```

---

### 2. Setting a Property (`set`)

Intercepts property writes (e.g., `proxy.propertyName = value`). Ideal for input validation and state management.

```javascript
const account = { balance: 100 };

const handler = {
  set(target, prop, value, receiver) {
    if (prop === "balance") {
      if (typeof value !== "number" || value < 0) {
        throw new TypeError("Balance must be a non-negative number!");
      }
    }
    return Reflect.set(target, prop, value, receiver);
  }
};

const accountProxy = new Proxy(account, handler);

accountProxy.balance = 250; // Works: balance updated to 250
// accountProxy.balance = -50; // Throws TypeError: Balance must be a non-negative number!

```

---

### 3. Deleting a Property (`deleteProperty`)

Intercepts `delete proxy.propertyName`. Used to protect critical properties from deletion.

```javascript
const config = { apiKey: "secret_12345", theme: "dark" };

const handler = {
  deleteProperty(target, prop) {
    if (prop === "apiKey") {
      console.warn("Deletion blocked: 'apiKey' is protected!");
      return false; // Blocks deletion
    }
    return Reflect.deleteProperty(target, prop);
  }
};

const configProxy = new Proxy(config, handler);

delete configProxy.theme;  // Deletes successfully
delete configProxy.apiKey; // Logs warning, deletion blocked

```

---

### 4. Checking Property Existence (`has`)

Intercepts property checks like `propertyName in proxy`.

```javascript
const internalData = { _id: "883a", publicName: "Project Alpha" };

const handler = {
  has(target, prop) {
    // Hide private properties starting with an underscore from 'in' checks
    if (typeof prop === "string" && prop.startsWith("_")) {
      return false;
    }
    return Reflect.has(target, prop);
  }
};

const dataProxy = new Proxy(internalData, handler);

console.log("publicName" in dataProxy); // true
console.log("_id" in dataProxy);        // false

```

---

### 5. Calling a Function (`apply`)

Intercepts function invocations (e.g., `proxyFunction(...args)`).

```javascript
function calculateTotal(price, taxRate) {
  return price + (price * taxRate);
}

const handler = {
  apply(target, thisArg, argumentsList) {
    console.log(`[LOG] Executing function '${target.name}' with args:`, argumentsList);
    const result = Reflect.apply(target, thisArg, argumentsList);
    console.log(`[LOG] Execution output: ${result}`);
    return result;
  }
};

const loggedCalculator = new Proxy(calculateTotal, handler);

loggedCalculator(100, 0.1); 
// Logs: [LOG] Executing function 'calculateTotal' with args: [100, 0.1]
// Logs: [LOG] Execution output: 110

```

---

### 6. Constructing an Object (`construct`)

Intercepts class instantiation via `new proxyConstructor(...args)`.

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
}

const handler = {
  construct(target, args, newTarget) {
    console.log(`[AUDIT] Instantiating new '${target.name}' with args:`, args);
    return Reflect.construct(target, args, newTarget);
  }
};

const PersonProxy = new Proxy(Person, handler);

const john = new PersonProxy("John");
// Logs: [AUDIT] Instantiating new 'Person' with args: ['John']

```

---

## 3. Real-World Applications

* **Reactivity Engines:** Powers reactive state frameworks (like Vue 3 and MobX) by tracking read dependencies during `get` and triggering UI re-renders during `set`.
* **Validation & Schema Enforcement:** Throws runtime errors if callers attempt to assign invalid types or out-of-bounds values to objects.
* **Logging & Telemetry:** Monitors API performance, method calls, and property reads without modifying original codebase logic.
* **Revocable Proxies:** Created via `Proxy.revocable(target, handler)`, allowing you to instantly sever client access to an object using a `.revoke()` handle.

The reference table provided connects **JavaScript Internal Methods**, **Proxy Traps**, and **Reflect Methods**.

Below is a complete reference guide containing **13 runnable code examples**—one for each internal operation—showing how the **Internal Operation**, **Proxy Trap**, and **Reflect Method** work together in practice.

---

### 1. `[[Get]]` $\rightarrow$ `handler.get()` $\rightarrow$ `Reflect.get()`

Intercepts reading a property value (`obj.prop` or `obj['prop']`).

```javascript
const target = { name: "Alice", age: 30 };

const proxy = new Proxy(target, {
  get(target, prop, receiver) {
    console.log(`[TRAP: get] Reading property: '${String(prop)}'`);
    // Forward operation using Reflect
    return Reflect.get(target, prop, receiver);
  }
});

console.log(proxy.name); 
// Logs: [TRAP: get] Reading property: 'name'
// Output: "Alice"

```

---

### 2. `[[Set]]` $\rightarrow$ `handler.set()` $\rightarrow$ `Reflect.set()`

Intercepts writing or assigning a property value (`obj.prop = val`).

```javascript
const target = { balance: 100 };

const proxy = new Proxy(target, {
  set(target, prop, value, receiver) {
    console.log(`[TRAP: set] Setting '${String(prop)}' to ${value}`);
    if (prop === "balance" && value < 0) return false; // Reject negative balance
    return Reflect.set(target, prop, value, receiver);
  }
});

proxy.balance = 250; 
// Logs: [TRAP: set] Setting 'balance' to 250
console.log(target.balance); // 250

```

---

### 3. `[[HasProperty]]` $\rightarrow$ `handler.has()` $\rightarrow$ `Reflect.has()`

Intercepts the `in` operator check (`'prop' in obj`).

```javascript
const target = { _secret: "12345", publicData: "Hello" };

const proxy = new Proxy(target, {
  has(target, prop) {
    console.log(`[TRAP: has] Checking existence of: '${String(prop)}'`);
    // Hide private properties starting with _
    if (typeof prop === "string" && prop.startsWith("_")) return false;
    return Reflect.has(target, prop);
  }
});

console.log("publicData" in proxy); // Logs: [TRAP: has] ... -> true
console.log("_secret" in proxy);    // Logs: [TRAP: has] ... -> false

```

---

### 4. `[[Delete]]` $\rightarrow$ `handler.deleteProperty()` $\rightarrow$ `Reflect.deleteProperty()`

Intercepts property deletion (`delete obj.prop`).

```javascript
const target = { role: "admin", id: 42 };

const proxy = new Proxy(target, {
  deleteProperty(target, prop) {
    console.log(`[TRAP: deleteProperty] Attempting to delete: '${String(prop)}'`);
    if (prop === "id") return false; // Prevent deletion of ID
    return Reflect.deleteProperty(target, prop);
  }
});

delete proxy.role; // Logs: [TRAP: deleteProperty] ... -> Deleted successfully
delete proxy.id;   // Logs: [TRAP: deleteProperty] ... -> Blocked (returns false)

```

---

### 5. `[[Call]]` $\rightarrow$ `handler.apply()` $\rightarrow$ `Reflect.apply()`

Intercepts calling a target function (`fn(...args)` or `fn.call(...)`).

```javascript
function add(a, b) {
  return a + b;
}

const proxyFn = new Proxy(add, {
  apply(target, thisArg, argList) {
    console.log(`[TRAP: apply] Calling function with args:`, argList);
    return Reflect.apply(target, thisArg, argList);
  }
});

console.log(proxyFn(10, 20)); 
// Logs: [TRAP: apply] Calling function with args: [10, 20]
// Output: 30

```

---

### 6. `[[Construct]]` $\rightarrow$ `handler.construct()` $\rightarrow$ `Reflect.construct()`

Intercepts class/constructor instantiation (`new Constructor(...args)`).

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
}

const UserProxy = new Proxy(User, {
  construct(target, argList, newTarget) {
    console.log(`[TRAP: construct] Creating new instance with args:`, argList);
    return Reflect.construct(target, argList, newTarget);
  }
});

const user = new UserProxy("Bob");
// Logs: [TRAP: construct] Creating new instance with args: ['Bob']
console.log(user.name); // "Bob"

```

---

### 7. `[[DefineProperty]]` $\rightarrow$ `handler.defineProperty()` $\rightarrow$ `Reflect.defineProperty()`

Intercepts `Object.defineProperty(obj, prop, descriptor)`.

```javascript
const target = {};

const proxy = new Proxy(target, {
  defineProperty(target, prop, descriptor) {
    console.log(`[TRAP: defineProperty] Defining prop: '${String(prop)}'`);
    return Reflect.defineProperty(target, prop, descriptor);
  }
});

Object.defineProperty(proxy, "version", { value: "1.0.0", writable: true });
// Logs: [TRAP: defineProperty] Defining prop: 'version'

```

---

### 8. `[[GetOwnProperty]]` $\rightarrow$ `handler.getOwnPropertyDescriptor()` $\rightarrow$ `Reflect.getOwnPropertyDescriptor()`

Intercepts reading property descriptors (`Object.getOwnPropertyDescriptor(obj, prop)`).

```javascript
const target = { title: "Reflect Guide" };

const proxy = new Proxy(target, {
  getOwnPropertyDescriptor(target, prop) {
    console.log(`[TRAP: getOwnPropertyDescriptor] Inspecting prop: '${String(prop)}'`);
    return Reflect.getOwnPropertyDescriptor(target, prop);
  }
});

console.log(Object.getOwnPropertyDescriptor(proxy, "title"));
// Logs: [TRAP: getOwnPropertyDescriptor] Inspecting prop: 'title'
// Output: { value: 'Reflect Guide', writable: true, enumerable: true, configurable: true }

```

---

### 9. `[[OwnPropertyKeys]]` $\rightarrow$ `handler.ownKeys()` $\rightarrow$ `Reflect.ownKeys()`

Intercepts operations fetching all property keys (`Object.keys()`, `Reflect.ownKeys()`, `for...in`).

```javascript
const idSymbol = Symbol("id");
const target = { name: "Charlie", [idSymbol]: 101 };

const proxy = new Proxy(target, {
  ownKeys(target) {
    console.log(`[TRAP: ownKeys] Fetching all keys`);
    return Reflect.ownKeys(target);
  }
});

console.log(Reflect.ownKeys(proxy)); 
// Logs: [TRAP: ownKeys] Fetching all keys
// Output: ['name', Symbol(id)]

```

---

### 10. `[[GetPrototypeOf]]` $\rightarrow$ `handler.getPrototypeOf()` $\rightarrow$ `Reflect.getPrototypeOf()`

Intercepts checking an object's prototype (`Object.getPrototypeOf(obj)` or `obj.__proto__`).

```javascript
const proto = { species: "Human" };
const target = Object.create(proto);

const proxy = new Proxy(target, {
  getPrototypeOf(target) {
    console.log(`[TRAP: getPrototypeOf] Fetching prototype`);
    return Reflect.getPrototypeOf(target);
  }
});

console.log(Object.getPrototypeOf(proxy) === proto); 
// Logs: [TRAP: getPrototypeOf] Fetching prototype
// Output: true

```

---

### 11. `[[SetPrototypeOf]]` $\rightarrow$ `handler.setPrototypeOf()` $\rightarrow$ `Reflect.setPrototypeOf()`

Intercepts changing an object's prototype (`Object.setPrototypeOf(obj, newProto)`).

```javascript
const target = {};
const newProto = { type: "Vehicle" };

const proxy = new Proxy(target, {
  setPrototypeOf(target, prototype) {
    console.log(`[TRAP: setPrototypeOf] Changing prototype`);
    return Reflect.setPrototypeOf(target, prototype);
  }
});

Object.setPrototypeOf(proxy, newProto);
// Logs: [TRAP: setPrototypeOf] Changing prototype
console.log(Object.getPrototypeOf(target) === newProto); // true

```

---

### 12. `[[IsExtensible]]` $\rightarrow$ `handler.isExtensible()` $\rightarrow$ `Reflect.isExtensible()`

Intercepts checking if new properties can be added (`Object.isExtensible(obj)`).

```javascript
const target = {};

const proxy = new Proxy(target, {
  isExtensible(target) {
    console.log(`[TRAP: isExtensible] Checking extensibility`);
    return Reflect.isExtensible(target);
  }
});

console.log(Object.isExtensible(proxy)); 
// Logs: [TRAP: isExtensible] Checking extensibility -> true

```

---

### 13. `[[PreventExtensions]]` $\rightarrow$ `handler.preventExtensions()` $\rightarrow$ `Reflect.preventExtensions()`

Intercepts locking an object to stop new properties from being added (`Object.preventExtensions(obj)`).

```javascript
const target = { status: "active" };

const proxy = new Proxy(target, {
  preventExtensions(target) {
    console.log(`[TRAP: preventExtensions] Locking object extension`);
    return Reflect.preventExtensions(target);
  }
});

Object.preventExtensions(proxy);
// Logs: [TRAP: preventExtensions] Locking object extension
console.log(Object.isExtensible(target)); // false

```

---

## Key Rule of Handlers & Traps

Notice how every trap uses **`Reflect[methodName](target, ...args)`**.

Because **every Proxy trap matches the exact signature of a Reflect method**, using `Reflect` inside your traps guarantees that the default language behavior is preserved safely without breaking scope binding, prototypes, or getter contexts (`receiver`).

While **`Proxy`** and **`Reflect`** are designed to work together, they serve complementary halves of JavaScript's metaprogramming system: **`Proxy` intercepts operations**, while **`Reflect` performs operations**.

---

## Core Differences

| Feature              | `Proxy`                                                                  | `Reflect`                                                              |
| -------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Role**             | **Interception / Gatekeeper**                                            | **Execution / Utility**                                                |
| **What it is**       | A constructor (`new Proxy()`) that wraps a target object.                | A static global object (like `Math`) that cannot be instantiated.      |
| **Primary Function** | Triggers custom code (traps) when operations are performed on an object. | Executes standard default language operations explicitly as functions. |
| **Return Value**     | Returns a proxied wrapper object.                                        | Returns operational results (value, boolean status, or descriptor).    |
| **Analogy**          | A security guard standing at a door checking credentials.                | The key that actually unlocks the door.                                |

---

## How They Work Together

When you create a `Proxy`, your handler traps intercept actions (like reading a property, writing a value, or calling a function). To execute the default behavior safely inside that trap, you call the corresponding **`Reflect`** method.

```javascript
const target = { name: "Alice", age: 30 };

const proxy = new Proxy(target, {
  // 1. PROXY INTERCEPTS the property read
  get(target, prop, receiver) {
    console.log(`[Proxy] Reading property: "${String(prop)}"`);

    // 2. REFLECT EXECUTES the default get operation safely
    return Reflect.get(target, prop, receiver);
  },

  // 1. PROXY INTERCEPTS the property write
  set(target, prop, value, receiver) {
    if (prop === "age" && value < 0) {
      throw new Error("Age cannot be negative");
    }

    // 2. REFLECT EXECUTES the default set operation
    return Reflect.set(target, prop, value, receiver);
  }
});

proxy.name;      // Logs: [Proxy] Reading property: "name" -> "Alice"
proxy.age = 31;  // Updates age to 31 via Reflect.set

```

---

## 3 Reasons Why `Reflect` is Used Inside `Proxy`

### 1. 1-to-1 Matching Signatures

Every `Proxy` handler trap matches the exact name and parameter signature of a `Reflect` method. This allows you to forward arguments directly without manually reinventing default engine logic:

```javascript
// A transparent logging proxy forwarding ALL operations automatically
const transparentProxy = new Proxy(target, {
  get(...args) {
    console.log("Read detected");
    return Reflect.get(...args);
  }
});

```

### 2. Preserving Prototypes and Getters (`receiver`)

When accessing getter properties on inherited objects, using standard `target[prop]` inside a Proxy breaks `this` context binding. Passing the **`receiver`** parameter to `Reflect.get()` ensures `this` correctly points to the proxy instance.

```javascript
const parent = {
  get greeting() {
    return `Hello, I am ${this.name}`;
  }
};

const child = Object.create(parent);
child.name = "Bob";

const proxy = new Proxy(child, {
  get(target, prop, receiver) {
    // Passing 'receiver' guarantees 'this' inside parent.greeting refers to 'child'
    return Reflect.get(target, prop, receiver);
  }
});

console.log(proxy.greeting); // "Hello, I am Bob"

```

### 3. Safer Operational Results

Standard `Object` methods often throw `TypeError` exceptions on failure (such as defining a property on a frozen object). `Reflect` methods return boolean statuses (`true` or `false`), preventing unexpected runtime crashes:

```javascript
const frozen = Object.freeze({});

// ❌ Throws TypeError in strict mode:
// Object.defineProperty(frozen, "a", { value: 1 });

// ✅ Returns false cleanly without crashing:
const success = Reflect.defineProperty(frozen, "a", { value: 1 });
console.log(success); // false

```

---

## Summary

* Use **`Proxy`** when you want to **listen to, validate, log, or override** object operations.
* Use **`Reflect`** inside your Proxy traps to **safely execute the default operational behavior** of JavaScript.
