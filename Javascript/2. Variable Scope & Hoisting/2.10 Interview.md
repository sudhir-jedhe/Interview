Here is a complete, in-depth breakdown of all 20 JavaScript hoisting and scope concepts, complete with code examples and execution context visualizers for each.

---

### 1. What happens when you access a `var` variable before declaration?

When the JavaScript engine compiles your code, it allocates memory for `var` declarations during the Creation Phase and initializes them with `undefined`. Thus, accessing a `var` variable before its assignment line evaluates to `undefined` rather than throwing an error.

```javascript
console.log(greeting); // Output: undefined

var greeting = 'Hello, JavaScript!';

console.log(greeting); // Output: "Hello, JavaScript!"

```

#### How the engine interprets it

```javascript
var greeting; // Hoisted & initialized with undefined
console.log(greeting);
greeting = 'Hello, JavaScript!';
console.log(greeting);

```

---

### 2. What happens when you access a `let` variable before declaration?

Variables declared with `let` and `const` are hoisted to the top of their enclosing block scope during the Creation Phase, but they are **not initialized**. They remain in the **Temporal Dead Zone (TDZ)** from the start of the block until the execution reaches the declaration statement. Accessing them in the TDZ throws a `ReferenceError`.

```javascript
console.log(username); // Throws ReferenceError: Cannot access 'username' before initialization

let username = 'Sudhir';

```

---

### 3. Can a function declaration be called before it is defined?

**Yes.** Function declarations are completely hoisted—both the function identifier and the entire function body are allocated in memory during the Creation Phase. This allows you to invoke the function anywhere within its scope prior to its visual declaration in the source code.

```javascript
// Function call BEFORE visual declaration
const result = calculateTax(1000);
console.log(result); // Output: 180

function calculateTax(amount) {
  return amount * 0.18;
}

```

---

### 4. Can a function expression be called before assignment?

**No.** A function expression assigns a function definition to a variable. If that variable is declared with `var`, only the variable declaration is hoisted (initialized to `undefined`). Attempting to call `undefined()` results in a **`TypeError: sum is not a function`**.

```javascript
try {
  sum(10, 20); // Throws TypeError: sum is not a function
} catch (error) {
  console.error(error.message);
}

var sum = function (a, b) {
  return a + b;
};

```

---

### 5. What happens when a local `var` shadows a global variable?

When a local `var` uses the same identifier as a global variable, the local `var` declaration is hoisted to the top of the function scope and initialized to `undefined`. During execution prior to assignment, reads of that variable resolve to the local `undefined` rather than falling back to the global value.

```javascript
var mode = 'DARK';

function setMode() {
  // Local 'mode' is hoisted to top of function, hiding global 'mode'
  console.log(mode); // Output: undefined (NOT "DARK")

  var mode = 'LIGHT';
  console.log(mode); // Output: "LIGHT"
}

setMode();

```

---

### 6. How does hoisting behave inside functions?

Hoisting is bounded by the current execution context scope. Variables declared with `var` inside a function are hoisted **only to the top of that function**, not to the global scope. They are completely inaccessible outside the function.

```javascript
function processData() {
  console.log(data); // Output: undefined (Hoisted locally)
  var data = [1, 2, 3];
}

processData();

try {
  console.log(data); // Throws ReferenceError: data is not defined
} catch (error) {
  console.error(error.message);
}

```

---

### 7. What is `typeof` of a hoisted `var` variable before assignment?

Since `var` variables are initialized with `undefined` during the Creation Phase, calling the `typeof` operator on a hoisted `var` before its assignment returns the string `"undefined"`.

```javascript
console.log(typeof age); // Output: "undefined"

var age = 30;

console.log(typeof age); // Output: "number"

```

---

### 8. What is `typeof` of a `let` variable before declaration?

Unlike `var` (or undeclared variables, which evaluate to `"undefined"` with `typeof`), accessing a `let` variable via `typeof` while it resides in the **Temporal Dead Zone (TDZ)** throws a `ReferenceError`.

```javascript
// TDZ for 'score' starts here
try {
  console.log(typeof score); // Throws ReferenceError!
} catch (error) {
  console.error(error.message); // Cannot access 'score' before initialization
}

let score = 100;

```

---

### 9. How does `var` behave inside an `if` block?

Because `var` is **function-scoped** (or globally scoped if declared outside a function), it completely ignores block boundaries like `if`, `else`, `for`, or `while` blocks. The variable declaration is hoisted to the top of the enclosing function or global scope.

```javascript
if (true) {
  var isMember = true;
}

// 'isMember' leaks outside the if block!
console.log(isMember); // Output: true

```

---

### 10. How does `let` behave inside an `if` block?

`let` and `const` adhere strictly to **block scoping** (anything bounded by `{ ... }`). A `let` variable declared inside an `if` block exists only within that block and is garbage-collected or out of scope once execution leaves the block.

```javascript
if (true) {
  let isMember = true;
  console.log(isMember); // Output: true
}

try {
  console.log(isMember); // Throws ReferenceError: isMember is not defined
} catch (error) {
  console.error(error.message);
}

```

---

### 11. Why does a local `var` return `undefined` instead of a global value?

JavaScript uses **lexical scope resolution**. When a variable is accessed inside a function, JS checks the immediate local scope first. If a local `var` with that name exists anywhere in the function, it is hoisted to the top, occupying the local binding. Scope lookup stops at the local level and never reaches the global outer scope.

```javascript
var token = 'GLOBAL_123';

function authenticate() {
  // Local 'token' is hoisted here as 'var token = undefined;'
  // JS finds 'token' in local scope, so it does NOT look up to global.
  if (!token) {
    console.log('Token is currently:', token); // Output: "Token is currently: undefined"
  }
  var token = 'LOCAL_456';
}

authenticate();

```

---

### 12. What happens when two functions have the same name?

When multiple function declarations share the exact same identifier in the same scope, the JavaScript engine hoists both during the Creation Phase, but **the last function declaration overwrites any previous ones**.

```javascript
render(); // Output: "Render Version 2"

function render() {
  console.log('Render Version 1');
}

function render() {
  console.log('Render Version 2'); // Overwrites Version 1 during hoisting
}

```

---

### 13. If a variable and a function have the same name, which gets priority?

During the Creation Phase, **function declarations are hoisted before variable declarations**. A function declaration takes precedence over an uninitialized `var`. However, during the Execution Phase, an explicit variable assignment (`=`) will overwrite the function reference.

```javascript
console.log(typeof item); // Output: "function" (Function declaration wins during creation)

var item = 'Shirt'; // Execution Phase: 'item' is reassigned to a string

console.log(typeof item); // Output: "string"

function item() {
  return 'I am a function';
}

```

---

### 14. What happens to function declarations inside another function?

Function declarations nested inside an outer function are hoisted to the top of that **inner function's local scope**. They are accessible anywhere inside that parent function, but remain hidden from the outer/global scope.

```javascript
function parentFunction() {
  console.log(nestedFunction()); // Output: "Inside nested function"

  function nestedFunction() {
    return 'Inside nested function';
  }
}

parentFunction();

try {
  nestedFunction(); // Throws ReferenceError: nestedFunction is not defined
} catch (error) {
  console.error(error.message);
}

```

---

### 15. How is a function expression different from a function declaration?

* **Function Declaration:** Fully hoisted (both identifier and body). Can be invoked before its appearance in code.
* **Function Expression:** Only the variable container is hoisted (as `undefined` for `var` or uninitialized TDZ for `let`/`const`). The function assignment occurs strictly when execution reaches that line.

```javascript
// Declaration
console.log(declaredFn()); // Output: "I am declared"
function declaredFn() {
  return 'I am declared';
}

// Expression
try {
  expressedFn(); // Throws TypeError: expressedFn is not a function
} catch (err) {
  console.error(err.message);
}

var expressedFn = function () {
  return 'I am expressed';
};

```

---

### 16. Is `var` block-scoped?

**No.** `var` is exclusively **function-scoped** or **globally-scoped**. It does not recognize block boundaries created by curly braces `{}` unless those braces belong to a `function`.

```javascript
{
  var blockVariable = 'Leaked outside block';
}

console.log(blockVariable); // Output: "Leaked outside block"

```

---

### 17. Why does accessing `let` before declaration fail?

It fails because of the **Temporal Dead Zone (TDZ)** design choice in ECMAScript 6. TDZ was introduced to enforce safer coding practices, prevent silent bugs caused by using uninitialized state, and ensure `const` bindings remain truly immutable from the moment they are declared.

```javascript
function tdzDemo() {
  // --- TDZ Starts for 'status' ---
  // console.log(status); // ReferenceError
  
  let status = 'ACTIVE'; // --- TDZ Ends for 'status' ---
  console.log(status); // Output: "ACTIVE"
}

tdzDemo();

```

---

### 18. What happens when a function and variable share the same identifier?

1. **Creation Phase:** The function declaration is hoisted and assigned to the identifier first. The `var` declaration is evaluated, but since the identifier already exists as a function, the uninitialized `var` declaration is ignored.
2. **Execution Phase:** If the code contains an explicit assignment (`identifier = value`), the function reference is replaced by that value.

```javascript
var config; // Ignored in creation phase because function 'config' exists

function config() {
  return 'App Config';
}

console.log(typeof config); // Output: "function"

config = { env: 'production' }; // Reassigned during execution

console.log(typeof config); // Output: "object"

```

---

### 19. Are arrow functions hoisted like function declarations?

**No.** Arrow functions are syntactically function expressions assigned to variables (`const`, `let`, or `var`). They follow the exact hoisting rules of their variable declaration type:

* If declared with `var`: Hoisted as `undefined` (invoking causes `TypeError`).
* If declared with `let`/`const`: Hoisted into the TDZ (invoking causes `ReferenceError`).

```javascript
try {
  arrowFn(); // Throws TypeError: arrowFn is not a function
} catch (err) {
  console.error(err.message);
}

var arrowFn = () => {
  return 'Arrow function response';
};

```

---

### 20. What happens when an IIFE contains a variable with the same name as a global variable?

An **Immediately Invoked Function Expression (IIFE)** creates a completely isolated, new execution context. If a variable inside the IIFE shares a name with a global variable, the local variable is hoisted to the top of the IIFE scope as `undefined`, temporarily shadowing the global variable within that IIFE.

```javascript
var theme = 'DARK_THEME';

(function () {
  // Local 'theme' hoisted to top of IIFE scope as undefined
  console.log('Inside IIFE (before declaration):', theme); // Output: undefined

  var theme = 'LIGHT_THEME';

  console.log('Inside IIFE (after declaration):', theme); // Output: "LIGHT_THEME"
})();

// Global scope remains untouched
console.log('Global Scope:', theme); // Output: "DARK_THEME"

```

---

### Summary Cheat Sheet

| Declaration Type                   | Hoisted? | Initialized Value   | Scope             | Pre-declaration Access Result |
| ---------------------------------- | -------- | ------------------- | ----------------- | ----------------------------- |
| **`var`**                          | Yes      | `undefined`         | Function / Global | `undefined`                   |
| **`let`**                          | Yes      | Uninitialized (TDZ) | Block             | `ReferenceError`              |
| **`const`**                        | Yes      | Uninitialized (TDZ) | Block             | `ReferenceError`              |
| **Function Declaration**           | Yes      | Full Function Body  | Function / Global | Executes Successfully         |
| **Function Expression (`var`)**    | Yes      | `undefined`         | Function / Global | `TypeError`                   |
| **Arrow Function (`let`/`const`)** | Yes      | Uninitialized (TDZ) | Block             | `ReferenceError`              |
