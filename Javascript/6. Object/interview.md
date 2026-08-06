# What is the difference between `Object.assign()` and the spread operator?

- **`Object.assign()`**: Copies the values of all properties from one or more source objects to a target object.

  ```javascript
  Object.assign({}, obj1);
  ```

- **Spread Operator**: A shorthand for copying properties from an object or array.

  ```javascript
  const newObj = { ...obj1 };
  ```

You hit the nail on the head! Your explanation is spot-on.

In JavaScript, data types are split into two categories when it comes to memory and equality comparisons: **Primitives** and **Objects (Reference Types)**.

---

### How Memory & Equality Work Under the Hood

#### 1. Primitives (Compared by **Value**)

Primitive types (`Number`, `String`, `Boolean`, `null`, `undefined`, `Symbol`, `BigInt`) are immutable. When you compare two primitives, JavaScript checks whether their **actual values** are identical.

```javascript
let x = 10;
let y = 10;

console.log(x === y); // true (Both hold the exact value 10)

```

---

#### 2. Objects & Arrays (Compared by **Reference / Memory Address**)

Objects, arrays, and functions are mutable reference types. When you write `let a = { a: 1 }`, the object itself lives somewhere in heap memory (e.g., memory address `0x001`), and variable `a` merely holds a **pointer/reference** to that memory address.

```javascript
let a = { a: 1 }; // Stored at Memory Address 0x001
let b = { a: 1 }; // Stored at Memory Address 0x002 (A brand-new object allocation!)
let c = a;        // 'c' points to the exact same Memory Address as 'a' (0x001)

console.log(a === b); // false (0x001 === 0x002 is false!)
console.log(a === c); // true  (0x001 === 0x001 is true!)

```

Even though `{ a: 1 }` and `{ a: 1 }` look identical to us, JavaScript sees two completely separate objects occupying two different slots in system memory.

---

### How to Compare Objects by Value (Deep Equality)

If you actually want to check whether two different objects contain the **same key-value pairs**, you have a few options depending on the depth of the object:

#### Method A: JSON Serialization (Quick & Shallow)

For simple objects without functions, `undefined`, or circular references, converting them to strings works quickly:

```javascript
let a = { a: 1 };
let b = { a: 1 };

console.log(JSON.stringify(a) === JSON.stringify(b)); // true

```

> **Warning:** Order matters with `JSON.stringify()`. `{ a: 1, b: 2 }` and `{ b: 2, a: 1 }` will return `false`.

#### Method B: Recursive Deep Equality Function

For nested objects with mixed types, write a recursive helper or use a library function (like Lodash's `_.isEqual()`):

```javascript
function isDeepEqual(obj1, obj2) {
  if (obj1 === obj2) return true; // Handles same reference or identical primitives

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

console.log(isDeepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true

```

Explain shallow copy vs deep copy in JavaScript with Object.assign, spread operator, and structuredClone.

When copying objects or arrays in JavaScript, understanding the difference between a **shallow copy** and a **deep copy** comes down to memory references—specifically, whether nested objects are duplicated or shared.

---

## 1. Shallow Copy vs. Deep Copy: The Core Difference

- **Shallow Copy:** Copies top-level primitive values by value, but **copies nested objects/arrays by reference**. If you mutate a nested property in the copied object, the original object will also change.
- **Deep Copy:** Creates a completely independent clone, recursively duplicating **all levels** of nested objects and arrays. Changes made to any nested level of the copy will never affect the original object.

```
SHALLOW COPY:
Original [ { a: 1 }, { nested: { x: 10 } } ]
                 │                │
Copy     [ { a: 1 },  ────────────┘  (Both point to the SAME nested object in memory)

DEEP COPY:
Original [ { a: 1 }, { nested: { x: 10 } } ]
Copy     [ { a: 1 }, { nested: { x: 10 } } ]  (Completely separate objects in memory)

```

---

## 2. Shallow Copy Methods

The two most common ways to make a shallow copy in modern JavaScript are the **spread operator (`...`)** and **`Object.assign()`**.

### A. Spread Operator (`...`)

```javascript
const original = {
  name: 'Alice',
  settings: { theme: 'dark' } // Nested object
};

// Create shallow copy using spread
const copy = { ...original };

// 1. Mutating a top-level primitive -> ONLY affects copy
copy.name = 'Bob';
console.log(original.name); // 'Alice' (Safe!)

// 2. Mutating a nested object property -> Affects BOTH!
copy.settings.theme = 'light';
console.log(original.settings.theme); // 'light' 🚨 (Shared memory reference!)

```

### B. `Object.assign()`

`Object.assign({}, target)` behaves identically to the spread operator regarding shallow copying.

```javascript
const original = {
  numbers: [1, 2, 3],
  details: { role: 'admin' }
};

const copy = Object.assign({}, original);

// Mutating a nested array
copy.numbers.push(4);
console.log(original.numbers); // [1, 2, 3, 4] 🚨 (Shared reference!)

```

---

## 3. Deep Copy Methods

### A. The Modern Native Standard: `structuredClone()`

Introduced to all modern browsers and Node.js (17+), **`structuredClone()`** is the official built-in Web API for deep copying objects.

```javascript
const original = {
  name: 'Alice',
  settings: { theme: 'dark' },
  items: ['pen', 'paper']
};

// Create a true deep copy
const deepCopy = structuredClone(original);

// Mutate nested properties in the deep copy
deepCopy.settings.theme = 'light';
deepCopy.items.push('ruler');

console.log(original.settings.theme); // 'dark'  ✅ (Unchanged!)
console.log(original.items);          // ['pen', 'paper'] ✅ (Unchanged!)

```

#### What `structuredClone()` Handles

- ✅ Nested objects, arrays, and primitives
- ✅ `Map`, `Set`, `Date`, and `RegExp` objects
- ✅ TypedArrays and `ArrayBuffer`
- ✅ **Circular references** (objects that reference themselves)

#### What `structuredClone()` Does NOT Support

- ❌ **Functions:** Throws a `DataCloneError` if the object contains function properties.
- ❌ **DOM Nodes:** Throws an error if you attempt to clone HTML elements.
- ❌ **Prototypes:** Clones property data, but does not preserve prototype chains or class instances (reverts custom class instances to plain objects).

---

### B. The Legacy JSON Trick (`JSON.parse(JSON.stringify(obj))`)

Before `structuredClone()`, developers often used JSON serialization for deep copying.

```javascript
const original = { a: 1, nested: { b: 2 } };
const deepCopy = JSON.parse(JSON.stringify(original));

deepCopy.nested.b = 99;
console.log(original.nested.b); // 2 ✅ (Deep copy worked!)

```

#### 🚨 Dangerous Pitfalls of the JSON Trick

- **Loses Data Types:** Converts `Date` objects into ISO strings.
- **Drops Keys:** Omits `undefined`, `Symbol`, and `Function` properties entirely.
- **Converts `NaN` & `Infinity`:** Replaces `NaN` and `Infinity` with `null`.
- **Crashes on Circular References:** Throws `TypeError: Converting circular structure to JSON`.

```javascript
const problematic = {
  date: new Date(),
  missing: undefined,
  notANumber: NaN,
};

const badCopy = JSON.parse(JSON.stringify(problematic));
console.log(badCopy);
// Output: { date: "2026-08-05T10:07:50.000Z", notANumber: null } 
// ('missing' was deleted entirely!)

```

---

## 4. Summary Comparison Matrix

| Feature / Method                | Spread (`...`) / `Object.assign` | `JSON.parse(JSON.stringify())` | `structuredClone()`         |
| ------------------------------- | -------------------------------- | ------------------------------ | --------------------------- |
| **Copy Depth**                  | Shallow                          | Deep                           | **Deep**                    |
| **Performance**                 | ⚡ Extremely Fast                 | 🐢 Slower                       | 🚀 Fast & Native             |
| **Nested Objects & Arrays**     | Shared Reference                 | Cloned                         | **Cloned**                  |
| **Handles `Date` & `RegExp**`   | ✅ Preserved                      | ❌ Converts to String/Empty     | **✅ Preserved**             |
| **Handles `Map` & `Set**`       | ✅ Preserved                      | ❌ Converts to `{}`             | **✅ Preserved**             |
| **Handles `undefined**`         | ✅ Preserved                      | ❌ Stripped out                 | **✅ Preserved**             |
| **Handles Circular References** | ✅ Shared                         | ❌ Throws Exception             | **✅ Handled automatically** |
| **Handles Functions**           | ✅ Preserved                      | ❌ Stripped out                 | ❌ Throws `DataCloneError`   |

---

## Recommended Rules of Thumb

1. **Use Spread (`...`) or `Object.assign()**` when you know your object is **flat** (1 level deep) or when you intentionally want to share nested references.
2. **Use `structuredClone()**` as your default choice for **deep copying** complex data structures in modern JavaScript.
3. **Avoid `JSON.parse(JSON.stringify())**` in modern applications due to data loss with `Date`, `undefined`, and `NaN`.
4. **Use Lodash's `_.cloneDeep()**` only if you need to deep copy custom class instances or objects containing functions.

Explain how Object.freeze() and Object.seal() work in JavaScript and whether they apply shallowly or deeply.

In JavaScript, **`Object.freeze()`** and **`Object.seal()`** are built-in methods used to restrict modifications to objects. Both apply **shallowly** by default—meaning nested objects remain fully mutable unless explicitly frozen or sealed themselves.

---

## 1. Quick Comparison Summary

| Capability                                    | Standard Object | `Object.seal()` | `Object.freeze()` |
| --------------------------------------------- | --------------- | --------------- | ----------------- |
| **Modify existing property values?**          | ✅ Yes           | ✅ **Yes**       | ❌ **No**          |
| **Add new properties?**                       | ✅ Yes           | ❌ **No**        | ❌ **No**          |
| **Delete existing properties?**               | ✅ Yes           | ❌ **No**        | ❌ **No**          |
| **Reconfigure descriptors (`configurable`)?** | ✅ Yes           | ❌ **No**        | ❌ **No**          |
| **Prevent prototype mutation?**               | ✅ Yes           | ❌ **No**        | ❌ **No**          |
| **Depth of restriction**                      | N/A             | **Shallow**     | **Shallow**       |

---

## 2. `Object.seal()`: Lock Structure, Allow Values

`Object.seal()` prevents adding or deleting properties and marks all existing properties as non-configurable (`configurable: false`). However, **it still allows you to update the values of existing writable properties**.

```javascript
const user = {
  name: 'Alice',
  role: 'Developer'
};

Object.seal(user);

// 1. Updating existing properties IS ALLOWED:
user.name = 'Bob'; 
console.log(user.name); // 'Bob' ✅

// 2. Adding new properties FAILS silently (or throws in 'use strict'):
user.age = 30;
console.log(user.age); // undefined ❌

// 3. Deleting properties FAILS:
delete user.role;
console.log(user.role); // 'Developer' ❌

// Check status
console.log(Object.isSealed(user)); // true

```

---

## 3. `Object.freeze()`: Complete Immutability

`Object.freeze()` does everything `Object.seal()` does, but additionally marks all existing data properties as non-writable (`writable: false`). **It makes top-level properties completely read-only.**

```javascript
const config = {
  env: 'production',
  port: 8080
};

Object.freeze(config);

// 1. Updating existing properties FAILS:
config.port = 9090;
console.log(config.port); // 8080 ❌

// 2. Adding new properties FAILS:
config.ssl = true;
console.log(config.ssl); // undefined ❌

// 3. Deleting properties FAILS:
delete config.env;
console.log(config.env); // 'production' ❌

// Check status
console.log(Object.isFrozen(config)); // true

```

---

## 4. The Shallow Constraint (Nested Objects Remain Mutable)

Neither `Object.freeze()` nor `Object.seal()` recurses down into nested objects or arrays. Only top-level property bindings are restricted.

### Example: Freeze is Shallow

```javascript
const userProfile = {
  username: 'SarahConnor',
  details: {
    theme: 'dark', // Nested object
    notifications: true
  }
};

Object.freeze(userProfile);

// Top-level property is protected:
userProfile.username = 'JohnDoe'; 
console.log(userProfile.username); // 'SarahConnor' (Protected!)

// NESTED property is NOT protected!
userProfile.details.theme = 'light'; 
console.log(userProfile.details.theme); // 'light' 🚨 (Mutated!)

// Check status
console.log(Object.isFrozen(userProfile));          // true
console.log(Object.isFrozen(userProfile.details));  // false!

```

---

## 5. How to Implement a Deep Freeze

To achieve complete immutability throughout an entire object hierarchy, you can write a recursive function that iterates through all properties and freezes any nested objects.

```javascript
function deepFreeze(obj) {
  // Retrieve property names defined on obj
  const propNames = Reflect.ownKeys(obj);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = obj[name];

    // Recursively freeze nested objects/arrays
    if (value && (typeof value === 'object' || typeof value === 'function')) {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
}

// Usage
const immutableConfig = deepFreeze({
  db: {
    host: 'localhost',
    credentials: { user: 'admin' }
  }
});

// Now nested properties are fully protected:
immutableConfig.db.credentials.user = 'hacker';
console.log(immutableConfig.db.credentials.user); // 'admin' ✅ (Protected!)

```

---

## Strict Mode Behavior

In non-strict mode, attempting to mutate a frozen or sealed property fails silently. In **strict mode** (`'use strict'`), JavaScript throws a `TypeError`:

```javascript
'use strict';

const settings = Object.freeze({ theme: 'dark' });

// Throws TypeError: Cannot assign to read only property 'theme' of object '#<Object>'
settings.theme = 'light'; 

```

Explain JavaScript Property Descriptors using Object.defineProperty (writable, enumerable, configurable, get, set).

In JavaScript, every property inside an object isn't just a key-value pair. Under the hood, properties are defined using **Property Descriptors**—a set of internal attributes that dictate how that property behaves (whether it can be overwritten, listed in loops, deleted, or intercepted via getters and setters).

You can inspect or manipulate these attributes using **`Object.getOwnPropertyDescriptor()`** and **`Object.defineProperty()`**.

---

## 1. The Two Types of Property Descriptors

A property descriptor can belong to one of two categories:

1. **Data Descriptors:** Properties that hold a direct value (`value`, `writable`, `enumerable`, `configurable`).
2. **Accessor Descriptors:** Properties defined by a getter-setter pair (`get`, `set`, `enumerable`, `configurable`).

> ⚠️ **Rule:** A descriptor cannot mix `value` or `writable` with `get` or `set`. Attempting to do so throws a `TypeError`.

---

## 2. Default Descriptor Values

When you assign a property using standard object literal notation (`obj.key = 'value'`), JavaScript creates a property with all descriptor flags set to **`true`**.

```javascript
const user = { name: 'Alice' };

console.log(Object.getOwnPropertyDescriptor(user, 'name'));
/*
Output:
{
  value: 'Alice',
  writable: true,      // Can be changed
  enumerable: true,    // Shows up in loops
  configurable: true   // Can be deleted or modified
}
*/

```

However, when you define a property using **`Object.defineProperty()`**, any omitted descriptor attribute defaults to **`false`** (or `undefined` for `value`, `get`, `set`).

```javascript
const user = {};

Object.defineProperty(user, 'name', {
  value: 'Alice'
  // writable, enumerable, and configurable automatically default to FALSE!
});

```

---

## 3. Data Descriptors: `writable`, `enumerable`, and `configurable`

### A. `writable` (Can the value be changed?)

- **`true`**: The property value can be reassigned using assignment operators (`=`).
- **`false`**: The property value is read-only. Attempts to reassign it fail silently in non-strict mode, and throw a `TypeError` in `'use strict'`.

```javascript
const car = {};

Object.defineProperty(car, 'vin', {
  value: '1HGCR2F83HA000000',
  writable: false, // Read-only property
  enumerable: true,
  configurable: true
});

car.vin = 'HACKED_VIN'; // Fails silently (or throws TypeError in 'use strict')
console.log(car.vin);   // '1HGCR2F83HA000000'

```

---

### B. `enumerable` (Does it appear in iterations?)

- **`true`**: The property is exposed during iteration loops (`for...in`, `Object.keys()`, `JSON.stringify()`, spread operator `...`).
- **`false`**: The property is hidden from standard iterations (though still accessible directly via `obj.key` or `Object.getOwnPropertyNames()`).

```javascript
const account = { id: 101 };

Object.defineProperty(account, 'secretPin', {
  value: '9988',
  enumerable: false, // Hidden property
  writable: true,
  configurable: true
});

console.log(account.secretPin); // '9988' (Direct access still works)

// 1. Object.keys skips non-enumerable properties:
console.log(Object.keys(account)); // ['id']

// 2. JSON.stringify skips non-enumerable properties:
console.log(JSON.stringify(account)); // '{"id":101}'

// 3. for...in skips non-enumerable properties:
for (let key in account) {
  console.log(key); // Prints only 'id'
}

```

---

### C. `configurable` (Can descriptor flags or property deletion be altered?)

- **`true`**: You can delete the property or change its descriptor flags (`writable`, `enumerable`, `configurable`).
- **`false`**:

1. The property **cannot be deleted** (`delete obj.prop` fails/throws).
2. The property **cannot be converted** between Data Descriptor and Accessor Descriptor.
3. Other flags cannot be changed (Exception: `writable` can be changed from `true` to `false`, but not back to `true`).

```javascript
const planet = {};

Object.defineProperty(planet, 'name', {
  value: 'Earth',
  configurable: false, // Locks the property descriptor configuration
  writable: true,
  enumerable: true
});

// 1. Deletion fails:
delete planet.name;
console.log(planet.name); // 'Earth'

// 2. Re-defining descriptor flags fails:
// Throws TypeError: Cannot redefine property: name
Object.defineProperty(planet, 'name', { enumerable: false });

```

---

## 4. Accessor Descriptors: `get` and `set`

Accessor descriptors allow you to attach functions that execute automatically whenever a property is read (`get`) or written (`set`). They are used to implement **computed properties, validation, and reactive state tracking**.

- **`get()`**: A function with no arguments that returns the property's computed value.
- **`set(newValue)`**: A function accepting the new assigned value to update underlying state or trigger side effects.

```javascript
function createTemperatureSensor() {
  let _celsius = 0; // Private backing variable held in closure

  const sensor = {};

  Object.defineProperty(sensor, 'celsius', {
    enumerable: true,
    configurable: true,
    get() {
      console.log('Reading temperature...');
      return _celsius;
    },
    set(newTemp) {
      if (typeof newTemp !== 'number') {
        throw new TypeError('Temperature must be a number');
      }
      if (newTemp < -273.15) {
        throw new RangeError('Temperature below absolute zero is impossible');
      }
      console.log(`Updating temperature to ${newTemp}°C`);
      _celsius = newTemp;
    }
  });

  return sensor;
}

const temp = createTemperatureSensor();

temp.celsius = 25;       // Output: "Updating temperature to 25°C"
console.log(temp.celsius); // Output: "Reading temperature..." -> 25

// temp.celsius = -300;   // Throws RangeError!

```

---

## 5. Defining Multiple Properties (`Object.defineProperties`)

If you need to configure multiple property descriptors at once, use **`Object.defineProperties()`**:

```javascript
const user = {};

Object.defineProperties(user, {
  firstName: {
    value: 'John',
    writable: true,
    enumerable: true,
    configurable: true
  },
  lastName: {
    value: 'Doe',
    writable: true,
    enumerable: true,
    configurable: true
  },
  fullName: {
    enumerable: true,
    configurable: true,
    get() {
      return `${this.firstName} ${this.lastName}`;
    }
  }
});

console.log(user.fullName); // 'John Doe'

```

---

## Summary Matrix

| Attribute          | Category | Description                                            | Default (`Object.defineProperty`) | Default (`obj.key = val`) |
| ------------------ | -------- | ------------------------------------------------------ | --------------------------------- | ------------------------- |
| **`value`**        | Data     | Actual value stored in property                        | `undefined`                       | Assigned Value            |
| **`writable`**     | Data     | Can the value be reassigned?                           | `false`                           | `true`                    |
| **`enumerable`**   | Both     | Is it listed during loops (`for...in`, `Object.keys`)? | `false`                           | `true`                    |
| **`configurable`** | Both     | Can it be deleted or descriptor redefined?             | `false`                           | `true`                    |
| **`get`**          | Accessor | Getter function invoked on read                        | `undefined`                       | N/A                       |
| **`set`**          | Accessor | Setter function invoked on write                       | `undefined`                       | N/A                       |

Explain how JavaScript Proxy and Reflect API work compared to Object.defineProperty getters and setters.
Both **`Object.defineProperty`** (getters/setters) and the **`Proxy` / `Reflect` API** allow you to intercept and customize object operations in JavaScript. However, they operate at completely different levels of the JavaScript engine.

While `Object.defineProperty` works by modifying **individual existing properties** on an object, `Proxy` creates a wrapper around the **entire object**, enabling you to intercept operations that `Object.defineProperty` cannot touch (such as property deletion, method invocation, or dynamically adding new properties).

---

## 1. `Object.defineProperty` Getters & Setters

`Object.defineProperty` allows you to attach custom getter and setter functions to a **specific property key**.

```javascript
const user = {};
let _name = 'Alice';

Object.defineProperty(user, 'name', {
  get() {
    console.log('GET name');
    return _name;
  },
  set(val) {
    console.log('SET name to:', val);
    _name = val;
  },
  enumerable: true,
  configurable: true
});

user.name = 'Bob'; // Triggers setter -> "SET name to: Bob"
console.log(user.name); // Triggers getter -> "GET name" -> "Bob"

```

### Limitations of `Object.defineProperty`

1. **Per-Property Setup:** You must know property keys in advance or iterate over every existing key.
2. **Cannot Detect New Properties:** Assigning `user.age = 30` bypasses the getter/setter entirely because `age` was not defined with `Object.defineProperty`.
3. **Array Mutation Limitations:** Modern Vue 2 famously struggled with arrays because `Object.defineProperty` could not easily intercept index modifications (`arr[0] = x`) or array length changes without heavy monkey-patching.
4. **Cannot Intercept Other Operations:** Cannot intercept operations like `delete obj.prop`, `prop in obj`, `Object.keys(obj)`, or function invocation.

---

## 2. The `Proxy` API

A **Proxy** wraps a target object and intercepts **fundamental language operations** through handler methods called **traps**.

Instead of listening to a single key, a Proxy intercepts operations across the **entire target object dynamically**.

```javascript
const target = { name: 'Alice' };

const handler = {
  // Trap for reading ANY property
  get(target, prop, receiver) {
    console.log(`GET property "${prop}"`);
    return target[prop] ?? 'Default Value';
  },

  // Trap for writing ANY property
  set(target, prop, value, receiver) {
    console.log(`SET property "${prop}" to "${value}"`);
    target[prop] = value;
    return true; // Indicates success
  },

  // Trap for 'delete obj.prop'
  deleteProperty(target, prop) {
    console.log(`DELETING property "${prop}"`);
    delete target[prop];
    return true;
  }
};

const proxyUser = new Proxy(target, handler);

// 1. Reading defined property
console.log(proxyUser.name); // Logs: GET property "name" -> "Alice"

// 2. Reading NON-EXISTENT property (Dynamic handling!)
console.log(proxyUser.age); // Logs: GET property "age" -> "Default Value"

// 3. Adding a BRAND NEW property (Intercepted automatically!)
proxyUser.role = 'Admin';   // Logs: SET property "role" to "Admin"

// 4. Deleting a property
delete proxyUser.name;      // Logs: DELETING property "name"

```

### What Proxy Traps Can Intercept

Proxy supports 13 different traps, including:

- `get` / `set` / `has` (`prop in obj`)
- `deleteProperty` (`delete obj.prop`)
- `apply` (intercepting function calls)
- `construct` (intercepting `new` invocations)
- `getPrototypeOf` / `setPrototypeOf`
- `ownKeys` (`Object.keys()`, `for...in`)

---

## 3. Where `Reflect` Fits In

The **`Reflect`** object is a built-in ES6 object that provides methods for interceptable JavaScript operations. Every Proxy trap has a corresponding method on `Reflect` with the exact same signature and parameters.

### Why Use `Reflect` Inside Proxy Traps?

1. **Default Behavioral Forwarding:** It allows you to forward operations to the original target without rewriting native JS behavior manually.
2. **Proper `this` Binding (`receiver`):** `Reflect.get(target, prop, receiver)` preserves prototype inheritance and correctly forwards the `this` context for getters defined on target prototypes.
3. **Boolean Return Values:** Native operations like `Object.defineProperty` throw errors on failure in strict mode, whereas `Reflect.defineProperty` returns `true` or `false`, making error handling cleaner.

```javascript
const target = {
  _firstName: 'John',
  _lastName: 'Doe',
  get fullName() {
    return `${this._firstName} ${this._lastName}`;
  }
};

const proxy = new Proxy(target, {
  get(target, prop, receiver) {
    console.log(`Accessing: ${prop}`);
    // Reflect.get preserves 'receiver' (this) correctly!
    return Reflect.get(target, prop, receiver);
  }
});

console.log(proxy.fullName); // "John Doe"

```

---

## 4. Feature Comparison Matrix

| Feature                  | `Object.defineProperty`                | `Proxy` + `Reflect`                                               |
| ------------------------ | -------------------------------------- | ----------------------------------------------------------------- |
| **Scope**                | Single property at a time              | Entire object dynamically                                         |
| **New Properties**       | ❌ Cannot detect dynamically added keys | ✅ Intercepts dynamically added keys                               |
| **Deletion**             | ❌ Cannot intercept `delete obj.prop`   | ✅ Intercepts via `deleteProperty` trap                            |
| **Array Mutations**      | ⚠️ Hard to track index/length mutations | ✅ Naturally handles arrays (`push`, `pop`, index assignments)     |
| **Function Invocations** | ❌ Not supported                        | ✅ Intercepts function calls via `apply` and `construct`           |
| **Performance**          | ⚡ Slightly faster creation time        | 🚀 Highly optimized in modern V8 engines (Powers Vue 3 reactivity) |
| **Original Object**      | Mutates original object in-place       | Wraps original object (Returns a distinct Proxy instance)         |

---

## Real-World Use Case: Vue 2 vs Vue 3 Reactivity

- **Vue 2 (Object.defineProperty):** Had to recursively loop through all properties at component initialization to attach getters/setters. Adding new properties required special utilities like `Vue.set(obj, key, val)`.
- **Vue 3 (Proxy):** Uses `Proxy` for its reactivity system (`reactive()`). It handles new properties, array mutations, and deletion seamlessly with significantly less initialization overhead.

Show how to build a simple reactive state management system (like Vue 3 reactivity) using Proxy and Reflect in vanilla JavaScript.

Here is how to build a lightweight, dependency-tracking reactivity engine using **`Proxy`** and **`Reflect`**—the exact core mechanism powering Vue 3's `reactive()` and `effect()` system.

---

## 1. How Proxy Reactivity Works

A reactive system consists of three main building blocks:

1. **`effect(fn)`**: Executes a function and registers it as the **active subscriber**.
2. **`track(target, key)`**: Runs inside the Proxy's `get` trap to record which effect depends on which object property.
3. **`trigger(target, key)`**: Runs inside the Proxy's `set` trap to re-execute all effects that depend on the mutated property.

```
       READ PROPERTY (get trap)                 MUTATE PROPERTY (set trap)
  ┌─────────────────────────────────┐      ┌──────────────────────────────────┐
  │  track(target, key)             │      │  trigger(target, key)            │
  │  - Associate activeEffect with  │      │  - Look up target -> key         │
  │    target -> key in targetMap   │      │  - Re-run all subscribed effects │
  └─────────────────────────────────┘      └──────────────────────────────────┘

```

---

## 2. The Core Reactivity Engine (`reactivity.js`)

```javascript
// --- Global Dependency Storage ---
// WeakMap<target, Map<key, Set<effect>>>
const targetMap = new WeakMap();

// Tracks the currently executing effect function
let activeEffect = null;

/**
 * Registers a side-effect function that automatically re-runs
 * whenever its reactive dependencies change.
 */
export function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn; // Set as current subscriber
    fn();                    // Run function (triggers 'get' traps & tracks dependencies)
    activeEffect = null;     // Reset subscriber
  };

  effectFn(); // Execute immediately on registration
}

/**
 * Tracks dependencies during property read ('get').
 */
function track(target, key) {
  if (!activeEffect) return; // No active subscriber running

  // 1. Get or create Map for the target object
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  // 2. Get or create Set of effects for the specific property key
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  // 3. Add current active effect to the property's dependency set
  dep.add(activeEffect);
}

/**
 * Triggers dependent effects during property write ('set').
 */
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;

  const dep = depsMap.get(key);
  if (dep) {
    // Re-run all subscribed effects
    dep.forEach((effectFn) => effectFn());
  }
}

/**
 * Wraps a target object in a Proxy to intercept read/write operations.
 */
export function reactive(target) {
  if (typeof target !== 'object' || target === null) {
    return target;
  }

  return new Proxy(target, {
    get(target, key, receiver) {
      // 1. Track subscriber dependency
      track(target, key);

      const result = Reflect.get(target, key, receiver);

      // 2. Deep reactivity: If property value is an object, make it reactive recursively
      if (typeof result === 'object' && result !== null) {
        return reactive(result);
      }

      return result;
    },

    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);

      // 3. Trigger effects only if value actually changed
      if (oldValue !== value) {
        trigger(target, key);
      }

      return result;
    }
  });
}

```

---

## 3. Adding a Computed Property Helper (`ref` / `computed`)

We can easily extend this system to support derived/computed values that cache results until their reactive dependencies update:

```javascript
/**
 * Creates a reactive computed value that auto-updates when its source reactive state changes.
 */
export function computed(getter) {
  let cachedValue;
  let isDirty = true;

  // Internal effect marks computed state as dirty when dependencies change
  const runner = effect(() => {
    isDirty = true;
  });

  return {
    get value() {
      if (isDirty) {
        cachedValue = getter();
        isDirty = false;
      }
      return cachedValue;
    }
  };
}

```

---

## 4. Complete Application Example: UI Counter & Shopping Cart

Here is how you use this engine to build a zero-framework reactive UI component that automatically updates DOM elements whenever state mutates:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Proxy Reactivity Engine</title>
</head>
<body>
  <div id="app">
    <h1 id="cart-title"></h1>
    <p id="total-price"></p>
    <button id="add-item-btn">Add Laptop ($1000)</button>
  </div>

  <script type="module">
    import { reactive, effect, computed } from './reactivity.js';

    // 1. Define Reactive State
    const cart = reactive({
      user: 'Sarah',
      items: [
        { name: 'Mouse', price: 25 },
        { name: 'Keyboard', price: 75 }
      ]
    });

    // 2. Define Computed Property
    const totalPrice = computed(() => {
      return cart.items.reduce((sum, item) => sum + item.price, 0);
    });

    // 3. Register UI Effects (Auto-renders when state mutates)
    effect(() => {
      document.getElementById('cart-title').textContent = `${cart.user}'s Shopping Cart (${cart.items.length} items)`;
    });

    effect(() => {
      document.getElementById('total-price').textContent = `Total Cost: $${totalPrice.value}`;
    });

    // 4. Attach Event Listeners to mutate state directly
    document.getElementById('add-item-btn').addEventListener('click', () => {
      // Direct array push triggers Proxy 'set' -> auto-updates DOM!
      cart.items.push({ name: 'Laptop', price: 1000 });
    });
  </script>
</body>
</html>

```

---

## Why `WeakMap` is Essential for Dependency Tracking

`targetMap` uses a **`WeakMap`** where keys are the target objects themselves (`WeakMap<Object, Map<Key, Set<Effect>>>`).

Using `WeakMap` prevents **memory leaks**: if a reactive object is no longer referenced anywhere else in your application, garbage collection automatically cleans up both the object and its associated dependency maps without requiring manual unbinding.

How do reactive Proxy systems like Vue 3 handle array mutations and array methods like push, pop, and splice?

Handling arrays in JavaScript Proxy systems is uniquely challenging because array operations mutate multiple internal targets simultaneously. When you call an array method like `push()`, `pop()`, or `splice()`, JavaScript updates both the **numeric index properties** (e.g., `arr[3] = 'x'`) and the **`length` property** under the hood.

In Vue 2 (which used `Object.defineProperty`), direct index updates (`arr[0] = 'a'`) and length changes (`arr.length = 0`) could not be intercepted natively, forcing developers to use prototype monkey-patching (`Vue.set()`).

In Vue 3, **JavaScript Proxies handle arrays natively**, but Vue must perform **method instrumentation** (overriding native methods) to prevent redundant triggers and infinite recursion loops.

---

## 1. How a Proxy Intercepts Array Operations

Because arrays are objects in JavaScript, calling `arr.push('item')` executes a series of low-level `get` and `set` operations that hit the Proxy traps:

```javascript
const list = reactive(['a', 'b']);
list.push('c');

```

What actually happens inside the Proxy when `push('c')` is called:

1. **`get` trap:** Reads `list.push` $\rightarrow$ Returns the `Array.prototype.push` method.
2. **`get` trap:** Reads `list.length` (internal engine read during push) $\rightarrow$ Tracks dependency on `length`.
3. **`set` trap:** Writes index `2` (`list[2] = 'c'`) $\rightarrow$ Triggers subscribers for index `2`.
4. **`set` trap:** Writes property `length` (`list.length = 3`) $\rightarrow$ Triggers subscribers for `length`.

While a raw Proxy can catch these operations, invoking methods natively causes **three major issues** that require custom handling.

---

## 2. The 3 Major Challenges Vue 3 Solves

### Challenge A: Preventing Duplicate Trigger Notifications

When `push()` runs, both the new index (`2`) and the `length` property are mutated. If Vue 3 triggered reactivity updates on *every* `set` trap invocation, effects listening to the array would run twice per single method call.

**How Vue 3 Solves It:**
Vue's reactivity system suppresses tracking during certain mutating methods and batches notifications:

```javascript
// Simplified Vue 3 method instrumentation concept
const arrayInstrumentations = {};

['push', 'pop', 'shift', 'unshift', 'splice'].forEach((key) => {
  const method = Array.prototype[key];
  
  arrayInstrumentations[key] = function (...args) {
    // 1. Pause dependency tracking while the native method executes
    pauseTracking();
    
    // 2. Call the native array method on the raw array target
    const res = method.apply(this, args);
    
    // 3. Resume dependency tracking
    resetTracking();
    
    return res;
  };
});

```

---

### Challenge B: Preventing Infinite Loops (`push` / `unshift` / `pop`)

Some array methods perform internal **reads** before writing. For instance, `push()` reads `length` before setting the new element.

If an `effect()` contains `arr.push(1)`, reading `length` adds the effect as a **subscriber**, while modifying `length` **triggers** the effect immediately. This creates an infinite call stack recursion loop (`RangeError: Maximum call stack size exceeded`).

```javascript
// Without method instrumentation, this causes an infinite loop!
effect(() => {
  arr.push(1); // Reads length (tracks) -> Writes length (triggers) -> Loop!
});

```

By temporarily **disabling dependency tracking** (`pauseTracking()`) while array mutation methods run, Vue 3 avoids registering the effect as a dependency during the method's internal read phase.

---

### Challenge C: Fixing Search & Lookup Methods (`indexOf`, `includes`, `lastIndexOf`)

When objects are added to a reactive array, Vue 3 automatically wraps nested objects inside Proxies (deep reactivity). This creates a identity mismatch problem:

```javascript
const rawObj = { id: 1 };
const list = reactive([rawObj]);

// The array actually contains Proxy(rawObj), not rawObj!
console.log(list.includes(rawObj)); // Expected: true | Raw Proxy: false!

```

**How Vue 3 Solves It:**
Vue 3 instrumentally rewrites lookup methods (`indexOf`, `lastIndexOf`, `includes`) to check both the **Proxy instance** AND the **raw unwrapped object**:

```javascript
['includes', 'indexOf', 'lastIndexOf'].forEach((methodName) => {
  const method = Array.prototype[methodName];

  arrayInstrumentations[methodName] = function (...args) {
    // 1. First, search using the Proxy target
    let res = method.apply(this, args);

    // 2. If not found, unwrap 'this' and the arguments to their raw objects and search again
    if (res === false || res === -1) {
      res = method.apply(toRaw(this), args.map(toRaw));
    }

    return res;
  };
});

```

---

## 3. Summary of Proxy Array Handling

| Array Method Type           | Methods                                               | How Vue 3 Proxy Handles Them                                                                                     |
| --------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Mutating Methods**        | `push()`, `pop()`, `shift()`, `unshift()`, `splice()` | Pauses dependency tracking during execution to prevent duplicate notifications and infinite recursion loops.     |
| **Lookup Methods**          | `indexOf()`, `lastIndexOf()`, `includes()`            | Wrapped to check both reactive proxies and raw target objects.                                                   |
| **Direct Index Assignment** | `arr[0] = 'new'`                                      | Handled natively by Proxy `set` trap. Checks if the index exists to decide between `ADD` or `SET` trigger types. |
| **Length Assignment**       | `arr.length = 0`                                      | Handled natively by Proxy `set` trap. Triggers effects for all deleted indices $\ge \text{newLength}$.           |
