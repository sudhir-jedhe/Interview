The code you've provided will throw an error. Let's walk through it:

### Code Breakdown

```javascript
function a() {
  "use strict"; // Enabling strict mode
  dev = "BFE"; // Implicit assignment to an undeclared variable
  console.log(dev);
}

a();
```

### **Strict Mode in JavaScript:**

- **Strict mode** (`"use strict";`) enforces stricter parsing and error handling in JavaScript. Some of the key rules it imposes are:
  - Variables must be declared before they are used (i.e., you cannot assign a value to an undeclared variable).
  - Assigning to a non-writable global variable or function is not allowed.
  - `this` behaves differently in some situations (e.g., it doesn't default to the global object).
  - Duplicate parameters are not allowed.

### **Issue with the Code:**

In the function `a`, you are trying to assign a value to the variable `dev` without declaring it first. Specifically:

```javascript
dev = "BFE";
```

- **Without strict mode**, JavaScript would implicitly create a global variable `dev` when you assign it, even though it hasn't been declared with `let`, `const`, or `var`.
- **With strict mode enabled** (`"use strict";`), JavaScript **throws an error** because it prevents the creation of undeclared variables.

### **What happens:**

- Since you're running the function in strict mode, the assignment `dev = "BFE";` will fail, and JavaScript will throw a **`ReferenceError`** indicating that `dev` is not defined.

### **Expected Error Output:**

```
Uncaught ReferenceError: dev is not defined
    at a (<anonymous>:3:3)
    at <anonymous>:5:1
```

### **Solution:**

To avoid this error, you need to declare the variable `dev` before assigning a value to it. You can do this by using `let`, `const`, or `var`:

```javascript
function a() {
  "use strict";
  let dev = "BFE"; // Declare 'dev' properly
  console.log(dev);
}

a(); // Logs: "BFE"
```

Now, the code will work as expected and log `BFE`.

### **Summary:**

- The code throws a `ReferenceError` because of strict mode, which prevents the use of undeclared variables.
- To fix the error, you need to explicitly declare the variable (`let dev = "BFE";`) before using it.

**Strict Mode** is a feature in JavaScript introduced in ECMAScript 5 (ES5) that opts your code into a **stricter, cleaner, and safer operating context**.

It catches common coding mistakes, prevents silent errors from failing silently, disables confusing language features, and helps JavaScript engines better optimize your code.

---

## 1. How to Enable Strict Mode

You activate strict mode by placing the directive `"use strict";` at the top of a file or function.

### A. Entire File / Script Scope

```javascript
"use strict";

// Entire script operates in strict mode
let message = "Hello, strict mode!";
```

### B. Function Scope

```javascript
function myFunction() {
  "use strict";
  // Only code inside this function runs in strict mode
}
```

> **Note:** Modern JavaScript features—such as **ES6 Modules** (`import`/`export`) and **ES6 Classes**—enable strict mode **automatically** by default.

---

## 2. Key Changes & Behaviors in Strict Mode

### 1. Prevents Accidental Global Variables

In normal JS, assigning a value to an undeclared variable implicitly creates a global variable. In strict mode, it throws a `ReferenceError`.

```javascript
// Non-strict mode: Creates window.x = 10 silently
// Strict mode: Throws ReferenceError: x is not defined
"use strict";

x = 10;
```

---

### 2. Throws Errors on Silent Failures

In non-strict mode, modifying a read-only property or deleting an undeclarable property silently fails. In strict mode, an error is thrown.

```javascript
"use strict";

// Attempting to overwrite a read-only property
const obj = {};
Object.defineProperty(obj, "readOnlyProp", { value: 42, writable: false });

obj.readOnlyProp = 100; // ❌ TypeError: Cannot assign to read-only property
```

---

### 3. Changes `this` Behavior in Standalone Functions

In non-strict mode, `this` in a standalone function defaults to the global object (`window` in browsers). In strict mode, `this` remains `undefined`.

```javascript
"use strict";

function showThis() {
  console.log(this);
}

showThis(); // Output: undefined (In non-strict mode: window)
```

---

### 4. Eliminates Duplicate Parameter Names

In non-strict mode, duplicate function parameter names are allowed. In strict mode, this is a syntax error.

```javascript
"use strict";

// ❌ SyntaxError: Duplicate parameter name not allowed in this context
function sum(a, a, c) {
  return a + a + c;
}
```

---

### 5. Secures `eval()` Scope

In strict mode, variables created inside an `eval()` call do not leak into the surrounding scope.

```javascript
"use strict";

eval("var hiddenVar = 10;");
console.log(hiddenVar); // ❌ ReferenceError: hiddenVar is not defined
```

---

### 6. Bans Deprecated / Unsafe Features

- **Bans `with` statement:** The `with` statement makes code ambiguous and hard to optimize.
- **Disallows Octal Literals:** Writing zero-prefixed octals like `015` throws a syntax error (use `0o15` instead).

---

## Summary Comparison

| Scenario                              | Non-Strict Mode                      | Strict Mode (`"use strict"`)  |
| ------------------------------------- | ------------------------------------ | ----------------------------- |
| **Undeclared Variables (`x = 10`)**   | Creates global variable              | Throws `ReferenceError`       |
| **`this` in standalone functions**    | Points to `window` / `globalThis`    | Remains `undefined`           |
| **Duplicate Parameters (`fn(a, a)`)** | Silently accepted (second overrides) | Throws `SyntaxError`          |
| **Assigning to Read-Only Props**      | Silently fails                       | Throws `TypeError`            |
| **ES Modules / ES6 Classes**          | Optional                             | **Always enabled by default** |

**18. What is the purpose of the use strict directive in JavaScript?**

The "use strict" directive in JavaScript is used to enable a stricter interpretation of the code, catching common mistakes and preventing the use of certain error-prone features. When this directive is applied, the JavaScript engine enforces stricter rules for writing code.

1. Purpose:
   It helps in writing more reliable and maintainable code by identifying and disallowing potentially error-prone behavior.
   It prevents the accidental creation of global variables by enforcing block scope rules with let and const.
   It disallows the use of certain language features that are deprecated or considered bad practice.

2. Example:

```js
// Without "use strict"
function withoutStrict() {
  variable = 10; // This will create a global variable accidentally
  console.log(variable);
}

withoutStrict(); // Output: 10

// With "use strict"
function withStrict() {
  "use strict";
  variable = 20; // This will throw a ReferenceError
  console.log(variable);
}

withStrict(); // Error: variable is not defined
```

In the first example without "use strict," variable is mistakenly created as a global variable, which can lead to unexpected behavior and bugs in a larger codebase.

In the second example with "use strict," attempting to assign a value to variable without declaring it with var, let, or const will throw a ReferenceError, indicating that variable is not defined. This helps catch potential bugs and encourages better coding practices.

To enable "use strict" globally in a script, you can add it at the beginning of your JavaScript file or within a function. For modern JavaScript development, it's recommended to use "use strict" to enhance code quality and reduce the risk of errors.

Restrictions that Strict Mode gives us.

**Assigning or Accessing a variable that is not declared**.

```js
function returnY() {
  "use strict";
  y = 123;
  return y;
}
```

**Assigning a value to a read-only or non-writable global variable;**

```js
"use strict";
var NaN = NaN;
var undefined = undefined;
var Infinity = "and beyond";
```

**Deleting an undeletable property.**

```
   "use strict";
   const obj = {};

   Object.defineProperty(obj, 'x', {
      value : '1'
   });

   delete obj.x;
```

**Duplicate parameter names.**

```js
"use strict";

function someFunc(a, b, b, c) {}
```

**Creating variables with the use of the eval function.**

```js
"use strict";

eval("var x = 1;");

console.log(x); //Throws a Reference Error x is not defined
```

**The default value of this will be undefined.**

```js
"use strict";

function showMeThis() {
  return this;
}

showMeThis(); //returns undefined
```
