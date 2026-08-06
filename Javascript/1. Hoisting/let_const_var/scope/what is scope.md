JavaScript has **five main types of scope** that define the accessibility of variables, functions, and objects. Here's a breakdown:

---

### **1. Global Scope**
- Variables declared outside of any function or block are in the global scope.
- They are accessible anywhere in your code.
- In browsers, global variables become properties of the `window` object.

```javascript
var globalVar = "I am global";

function showGlobal() {
  console.log(globalVar); // Accessible
}

console.log(globalVar); // Accessible
```

---

### **2. Function Scope**
- Variables declared with `var` inside a function are function-scoped.
- They are accessible only within the function where they are declared.
- This scope is created each time the function is invoked.

```javascript
function myFunction() {
  var functionScoped = "I am function scoped";
  console.log(functionScoped); // Accessible here
}

// console.log(functionScoped); // Error: not accessible outside the function
```

---

### **3. Block Scope**
- Variables declared with `let` and `const` are block-scoped.
- They are only accessible within the block `{}` in which they are defined.
- A block can be created using `if`, `for`, `while`, or any `{}` pair.

```javascript
if (true) {
  let blockScoped = "I am block scoped";
  const anotherBlockScoped = "Me too!";
  console.log(blockScoped); // Accessible here
}
// console.log(blockScoped); // Error: not accessible outside the block
```

---

### **4. Module Scope**
- Variables declared in a module are scoped to that module and are not accessible globally.
- This is used in ES6 modules where each module has its own scope.
- Use `export` and `import` to share variables/functions across modules.

**Module 1:**
```javascript
export const moduleScoped = "I am in Module 1";
```

**Module 2:**
```javascript
import { moduleScoped } from "./module1.js";
console.log(moduleScoped); // Accessible here
```

---

### **5. Lexical Scope (Static Scope)**
- Lexical scope refers to how variable accessibility is determined by the structure of the code at **write-time**, not runtime.
- A function has access to variables in its own scope, as well as in its parent scopes (closure).

```javascript
function outer() {
  let outerVar = "I am outer";

  function inner() {
    console.log(outerVar); // Accessible due to lexical scope
  }

  inner();
}

outer();
```

---

### **Summary Table**

| **Scope**       | **Description**                                     | **Declared Using**         |
|------------------|-----------------------------------------------------|-----------------------------|
| Global Scope     | Accessible everywhere in the code                   | `var`, `let`, `const`      |
| Function Scope   | Accessible only within the function                 | `var`                      |
| Block Scope      | Accessible only within the block `{}`               | `let`, `const`             |
| Module Scope     | Accessible only within the module                   | `export`, `import`         |
| Lexical Scope    | Accessibility determined by code structure          | Function/Closure rules      |

Understanding these scopes is essential to write clean, efficient, and bug-free JavaScript code.

block, function, global, script, module scope