### Strict Mode in JavaScript

#### 1. **What is Strict Mode in JavaScript?**

Strict Mode is a feature introduced in **ECMAScript 5 (ES5)** that changes how JavaScript code behaves by applying a "stricter" set of rules. It helps catch common coding mistakes, improves performance, and makes JavaScript more secure by eliminating some problematic language features.

To enable strict mode, you use the directive:

```javascript
"use strict";
```

When this directive is placed at the beginning of a script or a function, it activates strict mode for the entire script or just the function.

#### 2. **Why Do You Need Strict Mode?**

Strict mode is useful because it helps identify and prevent certain types of programming errors that would otherwise go unnoticed in non-strict JavaScript. It also helps developers write more secure and optimized code.

Key benefits of strict mode:

- **Prevents the use of undeclared variables**: If you try to assign a value to a variable that hasn't been declared, it will throw an error, preventing accidental creation of global variables.
- **Eliminates assignments to read-only properties**: Trying to assign a value to a property that is non-writable (e.g., a getter-only property) will result in an error.
- **Makes it easier to debug**: In strict mode, more exceptions are thrown for problematic syntax, which helps identify bugs early.
- **Disallows `this` in the global context**: In strict mode, the value of `this` will be `undefined` in the global scope, unlike non-strict mode, where `this` refers to the global object.

#### 3. **How Do You Declare Strict Mode?**

There are two ways to declare strict mode in JavaScript:

1. **Global Strict Mode**:
   - If you want to apply strict mode to the entire script, add the `"use strict";` directive at the very beginning of the script.

```javascript
"use strict";
x = 3.14; // Error: x is not declared
```

This will cause an error because `x` is not declared first. In strict mode, undeclared variables are not allowed.

2. **Local Strict Mode**:
   - You can also enable strict mode inside individual functions by placing `"use strict";` at the beginning of the function. This will make strict mode apply only within that function, not globally.

```javascript
function myFunction() {
  "use strict";
  y = 3.14; // Error: y is not declared
}
```

In this case, the strict mode is applied only inside the `myFunction()` function, causing an error when `y` is used without being declared.

### Example of Strict Mode in Action:

```javascript
// Global Strict Mode
"use strict";
x = 3.14; // Error: x is not declared

// Function Strict Mode
function myFunction() {
  "use strict";
  y = 3.14; // Error: y is not declared
}

myFunction();
```

#### Key Differences Between Strict Mode and Non-Strict Mode:

- **Global variable creation**: In non-strict mode, a variable can be implicitly created if you forget to declare it with `let`, `const`, or `var`. In strict mode, this will throw an error.

  **Non-strict**:

  ```javascript
  x = 10; // No error, x becomes a global variable
  ```

  **Strict mode**:

  ```javascript
  "use strict";
  x = 10; // Error: x is not declared
  ```

- **Assignments to read-only properties**: In strict mode, trying to assign a value to a non-writable or getter-only property throws an error.

  ```javascript
  "use strict";
  Object.defineProperty(this, "x", { value: 10, writable: false });
  x = 20; // Error: Cannot assign to read-only property 'x'
  ```

- **The `this` value in functions**: In non-strict mode, `this` refers to the global object (in the browser, `window`) when a function is called in the global context. In strict mode, `this` is `undefined` in such cases.

  **Non-strict**:

  ```javascript
  function myFunction() {
    console.log(this); // Refers to the global object (window)
  }
  myFunction();
  ```

  **Strict mode**:

  ```javascript
  "use strict";
  function myFunction() {
    console.log(this); // Undefined
  }
  myFunction();
  ```

### Summary:

- Strict mode is a way to opt into a stricter set of rules that make your JavaScript code cleaner, safer, and more efficient.
- It can help catch common coding mistakes like accidentally creating global variables, assigning values to non-writable properties, or using `this` incorrectly.
- You can enable strict mode globally by adding `"use strict";` at the top of your script, or locally inside a function.
