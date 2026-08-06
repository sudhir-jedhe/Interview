The behavior of `this` depends on whether code is running in **Script mode** vs **ES Modules**, whether **Strict Mode** (`'use strict'`) is active, and **how a function is invoked**.

---

### 1. `this` in the Global Scope

In the global scope (outside of any functions or classes), `this` always refers to the **global object** corresponding to the execution environment—regardless of whether strict mode is enabled.

* **In Web Browsers:** `this` refers to `window`.
* **In Node.js (CommonJS modules):** `this` in the top-level file scope refers to `module.exports` (an empty object `{}` initially).
* **In Node.js (REPL or standalone script):** `this` refers to `globalThis` / `global`.
* **In ES Modules (`<script type="module">` or `.mjs` files):** Top-level `this` is explicitly `undefined`.

```javascript
// Running in a standard browser script tag:
console.log(this === window); // true

// Modifying properties:
this.appName = "MyApp";
console.log(window.appName); // "MyApp"

```

---

### 2. `this` inside a Standard Function

Inside a regular function declaration or expression, `this` is **dynamically bound at call time**. What `this` points to depends directly on whether **Strict Mode** is enabled and **how the function is called**.

#### A. Direct Invocations (`func()`)

When a function is called standalone (without an attached object context):

* **In Non-Strict Mode (Default):** `this` automatically defaults ("falls back") to the **global object** (`window` or `globalThis`).
* **In Strict Mode (`'use strict'`):** Default binding is disabled. `this` remains **`undefined`**.

```javascript
// --- Non-Strict Mode ---
function showThisNonStrict() {
  console.log(this); 
}
showThisNonStrict(); // Logs: Window / globalThis


// --- Strict Mode ---
function showThisStrict() {
  'use strict';
  console.log(this); 
}
showThisStrict(); // Logs: undefined

```

---

#### B. Method Invocations (`obj.method()`)

When a regular function is invoked as a property/method of an object, `this` points to the **object preceding the dot**:

```javascript
const user = {
  name: 'Alice',
  greet() {
    console.log(this.name); // 'this' points to 'user'
  }
};

user.greet(); // Logs: "Alice"

// ⚠️ Beware of losing context when detaching methods:
const detachedGreet = user.greet;
detachedGreet(); // Logs: undefined (in strict mode) or throws Error

```

---

### 3. Arrow Functions: The Exception

Arrow functions (`() => {}`) do **not** have their own `this` binding. Instead, they inherit `this` lexically from the **surrounding scope** where the arrow function was defined.

```javascript
const obj = {
  name: 'Bob',
  regularFunc: function() {
    console.log('Regular:', this.name); // 'this' is obj
    
    const arrowFunc = () => {
      console.log('Arrow:', this.name); // Inherits 'this' from regularFunc (obj)
    };
    
    arrowFunc();
  }
};

obj.regularFunc(); 
// Output:
// Regular: Bob
// Arrow: Bob

```

If an arrow function is declared directly in the global scope, its lexical `this` will point to the global object (or `undefined` in ES modules).

---

### Summary Comparison Table

| Scope / Invocation                | Non-Strict Mode                         | Strict Mode (`'use strict'`)         |
| --------------------------------- | --------------------------------------- | ------------------------------------ |
| **Global Scope (Browser)**        | `window`                                | `window`                             |
| **Global Scope (Node.js CJS)**    | `module.exports` (`{}`)                 | `module.exports` (`{}`)              |
| **Global Scope (ES Modules)**     | `undefined`                             | `undefined`                          |
| **Standalone Function Call**      | Global Object (`window` / `globalThis`) | **`undefined`**                      |
| **Method Call (`obj.fn()`)**      | The calling object (`obj`)              | The calling object (`obj`)           |
| **Arrow Function**                | Lexically inherited from outer scope    | Lexically inherited from outer scope |
| **Constructor Call (`new Fn()`)** | Newly created object instance           | Newly created object instance        |

In JavaScript, `call()`, `apply()`, and `bind()` are built-in methods on `Function.prototype` used to explicitly control the value of **`this`** inside a function.

While regular function invocations bind `this` based on how or where the function is called, `call`, `apply`, and `bind` allow you to dictate what `this` points to regardless of the calling context.

---

## 1. Quick Comparison Overview

| Method        | Executes Function Immediately? | Argument Passing Format                            | Return Value             |
| ------------- | ------------------------------ | -------------------------------------------------- | ------------------------ |
| **`call()`**  | ✅ **Yes**                      | Arguments passed individually (`arg1, arg2, ...`)  | The function's output    |
| **`apply()`** | ✅ **Yes**                      | Arguments passed as an array (`[arg1, arg2, ...]`) | The function's output    |
| **`bind()`**  | ❌ **No**                       | Arguments passed individually or partially         | A **new bound function** |

---

## 2. `Function.prototype.call()`

`call()` invokes a function immediately, setting `this` to the first parameter passed into it, followed by individual arguments separated by commas.

### Syntax

```javascript
fn.call(thisArg, arg1, arg2, ...);

```

### Practical Example: Function Borrowing

You can use `call()` to borrow a method from one object and run it in the context of another object:

```javascript
const user1 = {
  firstName: 'Alice',
  lastName: 'Smith',
  getFullName(greeting, punctuation) {
    return `${greeting}, ${this.firstName} ${this.lastName}${punctuation}`;
  }
};

const user2 = {
  firstName: 'Bob',
  lastName: 'Jones'
  // user2 does not have a getFullName method
};

// Borrow user1's getFullName method for user2
const result = user1.getFullName.call(user2, 'Hello', '!');

console.log(result); // Output: "Hello, Bob Jones!"

```

---

## 3. `Function.prototype.apply()`

`apply()` behaves identically to `call()`, with one single difference: **it takes function arguments as a single array** (or array-like object) instead of individual parameters.

### Syntax

```javascript
fn.apply(thisArg, [arg1, arg2, ...]);

```

### Practical Example: Array Parameter Passing

`apply()` is useful when the arguments you want to pass to a function are already in an array.

```javascript
const numbers = [5, 6, 2, 8, 1];

// Math.max expects individual arguments: Math.max(5, 6, 2, 8, 1)
// We pass null for thisArg because Math.max doesn't rely on 'this'
const maxNumber = Math.max.apply(null, numbers);

console.log(maxNumber); // Output: 8

/* Note: In modern JS (ES6+), the spread operator achieves this cleanly:
   Math.max(...numbers) 
   However, apply() remains important for dynamic array argument binding. */

```

---

## 4. `Function.prototype.bind()`

Unlike `call()` and `apply()`, **`bind()` does not execute the function immediately**. Instead, it returns a **new copy of the function** with `this` permanently bound to the specified object.

### Syntax

```javascript
const boundFn = fn.bind(thisArg, arg1, arg2, ...);

```

### Practical Example 1: Fixing Detached Methods in Callbacks / Event Handlers

When passing object methods as callbacks (such as in `setTimeout` or DOM event listeners), the original `this` context is often lost. `bind()` solves this:

```javascript
const buttonHandler = {
  label: 'Save Changes',
  click() {
    console.log(`Action triggered for: ${this.label}`);
  }
};

// ❌ DETACHED CONTEXT PROBLEM:
// setTimeout(buttonHandler.click, 500); 
// Output: "Action triggered for: undefined" (this points to global/window)

// ✅ FIXED WITH BIND:
const boundClick = buttonHandler.click.bind(buttonHandler);
setTimeout(boundClick, 500); 
// Output: "Action triggered for: Save Changes"

```

---

### Practical Example 2: Partial Application (Currying)

`bind()` allows you to preset (pre-fill) initial arguments ahead of time:

```javascript
function multiply(a, b) {
  return a * b;
}

// Create a reusable 'double' function by pre-filling the first parameter (a = 2)
const double = multiply.bind(null, 2);

console.log(double(5));  // 10 (2 * 5)
console.log(double(10)); // 20 (2 * 10)

```

---

## 5. Summary Mental Model

When deciding which method to use, remember this mnemonic:

* `c`all $\rightarrow$ **C**omma-separated parameters (invokes immediately).
* `a`pply $\rightarrow$ **A**rray of parameters (invokes immediately).
* `b`ind $\rightarrow$ **B**inds for later execution (returns a new function).
