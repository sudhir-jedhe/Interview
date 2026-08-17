JavaScript Scope

**Scope** in JavaScript determines the accessibility (visibility) of variables, functions, and objects in different parts of your code during runtime.

JavaScript uses **Lexical Scoping** (also called static scoping), meaning that variable access is determined by where variables and blocks are physically written in the source code.

---

## 1. The 4 Types of Scope in JavaScript

| Scope Type         | Description                                             | Created By                                                      |
| ------------------ | ------------------------------------------------------- | --------------------------------------------------------------- |
| **Global Scope**   | Accessible from anywhere in the JavaScript application. | Declared outside any function or block.                         |
| **Function Scope** | Accessible only *inside* the function where declared.   | Declared with `var`, `let`, or `const` inside a `function`.     |
| **Block Scope**    | Accessible only within curly braces `{ ... }`.          | Declared with `let` or `const` inside `{}` (e.g., `if`, `for`). |
| **Module Scope**   | Accessible only within the specific ES Module file.     | Declared at root of code in an ES Module (`import`/`export`).   |

---

## 2. Global Scope

Variables declared outside any function or block live in the **Global Scope**. They can be read or modified from any script or function on the page.

```javascript
// Global variable
const appName = "My Dashboard";

function printAppName() {
  console.log(appName); // Accessible: "My Dashboard"
}

printAppName();
console.log(window.appName); // In browsers, 'var' attaches to window, 'let/const' do not

```

> **Warning:** Avoid overusing global variables. They pollute the global namespace, risk naming collisions, and make debugging difficult.

---

## 3. Function (Local) Scope

Variables declared inside a function using `var`, `let`, or `const` are local to that function. They are created when the function starts and destroyed when the function finishes executing.

```javascript
function calculateTotal() {
  const taxRate = 0.08; // Function-scoped
  var discount = 5;      // Function-scoped
  
  console.log(taxRate); // 0.08
}

calculateTotal();

// ❌ ReferenceError: taxRate is not defined
console.log(taxRate); 

// ❌ ReferenceError: discount is not defined
console.log(discount); 

```

---

## 4. Block Scope (`let` and `const` vs. `var`)

ES6 introduced `let` and `const`, which enforce **Block Scope**. A block is any code enclosed by curly braces `{ ... }` (such as `if` statements, `for` loops, or standalone `{}` blocks).

In contrast, `var` **ignores block scope** and leaks into the enclosing function or global scope.

```javascript
if (true) {
  var varVariable = "I leak out of blocks!";
  let letVariable = "I am trapped in this block!";
  const constVariable = "I am also trapped in this block!";
}

console.log(varVariable); // "I leak out of blocks!" (var is NOT block-scoped)

// ❌ ReferenceError: letVariable is not defined
console.log(letVariable); 

// ❌ ReferenceError: constVariable is not defined
console.log(constVariable); 

```

### Block Scope in Loops

```javascript
// Using var in a loop (leaks 'i' to outer scope)
for (var i = 0; i < 3; i++) {
  // ...
}
console.log(i); // 3 (Leaked!)

// Using let in a loop (keeps 'j' block-scoped)
for (let j = 0; j < 3; j++) {
  // ...
}
// ❌ ReferenceError: j is not defined
console.log(j); 

```

---

## 5. The Scope Chain & Lexical Scope

When JavaScript looks for a variable, it starts at the **innermost current scope**. If it cannot find it there, it moves **upward** step-by-step through parent scopes until it reaches the global scope. This lookup sequence is called the **Scope Chain**.

If the variable is not found in the global scope, JavaScript throws a `ReferenceError`.

```javascript
const globalName = "Alice"; // 1. Global Scope

function outerFunction() {
  const outerVar = "Outer"; // 2. Outer Function Scope

  function innerFunction() {
    const innerVar = "Inner"; // 3. Inner Function Scope

    // Scope lookup:
    console.log(innerVar);   // Found locally in innerFunction
    console.log(outerVar);   // Not found locally -> moves up to outerFunction
    console.log(globalName); // Not found in inner or outer -> moves up to Global
  }

  innerFunction();
}

outerFunction();

```

---

## 6. Closures (Scope Preserving)

A **closure** occurs when an inner function "remembers" and continues to access variables from its outer (lexical) scope even **after** the outer function has finished executing and returned.

```javascript
function createCounter() {
  let count = 0; // Local variable preserved via closure

  return function increment() {
    count++;
    return count;
  };
}

const counter = createCounter(); // createCounter() finishes executing

console.log(counter()); // 1 (Accesses 'count' via closure)
console.log(counter()); // 2
console.log(counter()); // 3

```

---

## Variable Scope Comparison Summary

| Keyword     | Scope Level    | Hoisted?                         | Can Re-declare? | Can Re-assign? |
| ----------- | -------------- | -------------------------------- | --------------- | -------------- |
| **`var`**   | Function Scope | Yes (initialized as `undefined`) | Yes             | Yes            |
| **`let`**   | Block Scope    | Yes (Temporal Dead Zone - TDZ)   | No              | Yes            |
| **`const`** | Block Scope    | Yes (Temporal Dead Zone - TDZ)   | No              | No             |
