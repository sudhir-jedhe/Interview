### **Execution Context in JavaScript**

**Execution context** is a concept that refers to the environment in which JavaScript code is executed. Understanding execution context is essential for grasping how the JavaScript engine handles code execution, variable scope, and function calls.

In simpler terms, the **execution context** is a container for the code being evaluated and executed. It defines the variables, functions, and the value of `this` that are available at any given point in the program.

There are three primary types of execution contexts in JavaScript:

1. **Global Execution Context (GEC)**
2. **Function Execution Context (FEC)**
3. **Eval Execution Context (rarely used)**

### **1. Global Execution Context (GEC)**

The **global execution context** is the default or base context in which all JavaScript code is executed. When the JavaScript engine first runs the code, it sets up a global execution context. It’s created when the script is first loaded into memory and remains in place until the script finishes running.

- **Global Object**: In a browser, this is the `window` object. In Node.js, it's `global`.
- **`this` in GEC**: In the global context, `this` refers to the global object (`window` in browsers).

**Example:**

```javascript
console.log(this); // In browser, logs the `window` object
let x = 10; // `x` is accessible globally
```

### **2. Function Execution Context (FEC)**

When a function is invoked, a new **execution context** is created for that function. A new function execution context is created every time a function is called. Inside a function execution context, JavaScript maintains:

- **Variable Object (VO)**: Contains all the function’s local variables and function parameters.
- **Scope Chain**: A list of all the variables in the function's scope (local and from outer functions).
- **`this`**: Refers to the value of `this` based on how the function was called.

When the function is invoked, it gets added to the **execution stack** (also known as the **call stack**).

**Example:**

```javascript
function myFunction() {
  let y = 20; // `y` is in the function's local scope
  console.log(x); // Logs 10, because `x` is in the global scope
}

let x = 10;
myFunction(); // Creates a new execution context for `myFunction`
```

### **3. Eval Execution Context**

The **eval execution context** arises when code is executed inside the `eval()` function. This is an unsafe function that executes code passed to it as a string and is rarely used in modern JavaScript.

**Example:**

```javascript
eval("let a = 5; console.log(a);"); // The eval function runs the string as code
```

In general, **eval** should be avoided because it can execute arbitrary code and may introduce security risks.

### **Execution Stack (Call Stack)**

The **execution stack** is a stack data structure that tracks the function execution contexts. Whenever a function is invoked, its execution context is pushed onto the stack. Once the function finishes execution, its context is popped from the stack.

- The **global execution context** is always at the bottom of the stack.
- When the first function is called, a new **function execution context** is created and pushed to the stack.
- As more functions are invoked, more execution contexts are added.
- When a function returns, it is popped off the stack.

### **How JavaScript Handles Execution Context:**

1. **Creation Phase**: When the execution context is created (either global or function), JavaScript performs the following tasks:
   - Sets up the **scope chain**.
   - Creates a **variable object (VO)** or **activation object (AO)** for functions, containing function parameters, declared variables, and function declarations.
   - Sets the value of `this` according to how the function was invoked.
   - Sets up hoisting (declaring functions and variables).

2. **Execution Phase**: After the creation phase, JavaScript begins executing the code line-by-line, referring to variables and functions in the context.

### **Example to Understand Execution Context:**

Consider the following code snippet:

```javascript
var a = 10;

function foo() {
  var b = 20;
  function bar() {
    var c = 30;
    console.log(a, b, c); // Accessing variables from outer scopes
  }
  bar();
}

foo();
```

#### **Step-by-step Breakdown:**

1. **Global Execution Context (GEC)** is created:
   - Global variable `a` is initialized with value `10`.
   - The `foo` function is declared.

2. **Function `foo` is invoked**:
   - A new **function execution context (FEC)** for `foo` is created.
   - The `foo` function's local variable `b` is declared and initialized to `20`.
   - The `bar` function is declared within `foo`.

3. **Function `bar` is invoked inside `foo`**:
   - A new **function execution context (FEC)** for `bar` is created.
   - The `bar` function’s local variable `c` is declared and initialized to `30`.
   - Inside `bar`, `console.log(a, b, c)` is called, and JavaScript looks for `a`, `b`, and `c` in the following order:
     - **Local Scope (bar)**: Finds `c` (value `30`).
     - **Outer Scope (foo)**: Finds `b` (value `20`).
     - **Global Scope**: Finds `a` (value `10`).
   - Finally, the values are logged: `10 20 30`.

#### **Execution Stack:**

1. **Global Context** is pushed onto the stack.
2. **`foo` context** is pushed onto the stack.
3. **`bar` context** is pushed onto the stack.
4. After `bar` finishes executing, its context is popped.
5. After `foo` finishes executing, its context is popped.
6. The **Global Context** remains at the bottom.

### **Hoisting and Execution Context:**

JavaScript hoists function and variable declarations during the **creation phase**. This means that functions and variables are moved to the top of their containing scope before any code is executed.

```javascript
console.log(x); // undefined, not ReferenceError
var x = 10;

foo(); // Works fine, even though it's called before declaration

function foo() {
  console.log("Hello");
}
```

#### How Hoisting Works:

- **Variables**: Only the declaration (`var x`) is hoisted, but not the initialization (`x = 10`). Hence, `x` is `undefined` before the assignment happens.
- **Functions**: Function declarations (`function foo() {}`) are fully hoisted, so `foo()` can be called before the actual definition in the code.

### **Summary**

- **Execution Context** is an environment that helps manage variables, functions, and `this` during code execution.
- **Global Execution Context**: It’s the default context and serves as the base for code execution.
- **Function Execution Context**: It’s created when a function is invoked, with its own variable environment.
- **Execution Stack**: A stack structure that keeps track of execution contexts, and helps JavaScript manage function calls.
- **Hoisting**: A JavaScript feature that lifts function and variable declarations to the top of their respective scopes during the creation phase.

Understanding the execution context is essential for mastering JavaScript, as it influences scope, closures, and the value of `this`.
