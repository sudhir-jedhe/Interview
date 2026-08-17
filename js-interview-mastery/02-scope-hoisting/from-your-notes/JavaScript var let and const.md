You have summarized the core distinctions, rules, and best practices regarding `var`, `let`, and `const` accurately.

Here is a quick refinement of those concepts, along with a minor correction regarding **Hoisting**:

---

## Fact Check: Are `let` and `const` Hoisted?

Your summary notes in one section that *"let and const are not hoisted."*

To be precise: **`let` and `const` *are* hoisted by the JavaScript engine, but they are not *initialized*.**

```javascript
let x = "global";

function test() {
  // If 'let x' were not hoisted, this would log "global".
  // Instead, it throws a ReferenceError because the inner 'let x' IS hoisted
  // and creates a Temporal Dead Zone (TDZ) inside this block before line 8.
  console.log(x); // ❌ ReferenceError: Cannot access 'x' before initialization
  
  let x = "local"; 
}

test();

```

---

## 1. Feature Comparison Matrix

| Feature                    | `var`                                | `let`                                           | `const`                                         |
| -------------------------- | ------------------------------------ | ----------------------------------------------- | ----------------------------------------------- |
| **Scope**                  | Function or Global                   | Block `{}`                                      | Block `{}`                                      |
| **Redeclaration**          | Allowed                              | ❌ SyntaxError                                   | ❌ SyntaxError                                   |
| **Reassignment**           | Allowed                              | Allowed                                         | ❌ TypeError                                     |
| **Hoisting Behavior**      | Hoisted & initialized as `undefined` | Hoisted (in Temporal Dead Zone until line runs) | Hoisted (in Temporal Dead Zone until line runs) |
| **Global Window Binding**  | Attaches to `window` (in browser)    | No                                              | No                                              |
| **Initial Value Required** | No (defaults to `undefined`)         | No (defaults to `undefined`)                    | **Yes** (must assign at declaration)            |

---

## 2. Deep Dive: `const` Mutability (Objects & Arrays)

A common misconception is that `const` makes values immutable. `const` creates an **immutable binding** (the variable reference cannot point to a new memory address), but the **underlying value remains mutable** if it is an object or array.

```javascript
// 1. Mutating an array declared with const
const colors = ["red", "green"];
colors.push("blue"); // ✅ Allowed! Modifies the object in place.
console.log(colors); // ["red", "green", "blue"]

// ❌ Reassigning the binding fails
// colors = ["yellow"]; // TypeError: Assignment to constant variable.

// 2. Making an object truly immutable
const user = Object.freeze({ name: "Alice" });
user.name = "Bob"; // Silently fails (or throws TypeError in strict mode)
console.log(user.name); // "Alice"

```

---

## 3. Practical Code Examples

### A. Loop Leaks (`var` vs `let`)

```javascript
// ❌ Problem with var in loops (closure leak)
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var i:", i), 100);
}
// Logs: 3, 3, 3 (because 'i' is shared across iterations in function scope)

// ✅ Solution with let (creates a new binding per iteration)
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let j:", j), 100);
}
// Logs: 0, 1, 2

```

---

### B. Temporal Dead Zone (TDZ) Visualized

```javascript
{ // ─── TDZ Starts for 'myVar' ───
  
  // console.log(myVar); // ❌ ReferenceError: Cannot access 'myVar' before initialization
  
  let myVar = 42; // ─── TDZ Ends for 'myVar' (Initialized here) ───
  
  console.log(myVar); // ✅ Logs 42
}

```

---

## 4. Modern Best Practice Checklist

1. **Use `const` by default:** Use it for all variables, functions, imported modules, objects, and arrays.
2. **Use `let` only when necessary:** Use it when values must be updated (e.g., loop counters, accumulators, toggles).
3. **Avoid `var` entirely:** Its function-scoping and property-leaking behavior introduce unnecessary risk.

Explain JavaScript Hoisting and the Temporal Dead Zone with code examples

**Hoisting** is JavaScript's default behavior of moving variable and function declarations to the top of their respective scopes during the compilation phase, before the code is executed line by line.

While hoisting applies to all variable declarations (`var`, `let`, `const`, and `function`), they behave differently during execution, which gives rise to the **Temporal Dead Zone (TDZ)**.

---

## 1. How Hoisting Works

### A. Function Declarations (Fully Hoisted)

Function declarations are hoisted completely, meaning both the function name and its body are moved to the top. You can invoke a function *before* it appears in the code:

```javascript
// Works perfectly!
sayHello(); 

function sayHello() {
  console.log("Hello, World!");
}

```

### B. `var` Variables (Hoisted with `undefined`)

Variables declared with `var` are hoisted to the top of their function or global scope and automatically initialized with a default value of **`undefined`**.

```javascript
console.log(score); // Output: undefined (does not crash)

var score = 100;

console.log(score); // Output: 100

```

*Behind the scenes, JavaScript interprets the code above like this:*

```javascript
var score; // Hoisted
console.log(score); // undefined
score = 100;
console.log(score); // 100

```

---

## 2. `let`, `const`, and the Temporal Dead Zone (TDZ)

Variables declared with `let` and `const` **are also hoisted**, but unlike `var`, they are **not initialized** with a default value.

### What is the Temporal Dead Zone (TDZ)?

The **Temporal Dead Zone** is the region of code from the start of the scope (or block) up until the line where the variable is explicitly declared and initialized.

Accessing a `let` or `const` variable inside its TDZ throws a **`ReferenceError`** instead of returning `undefined`.

```javascript
{
  // ─── TDZ STARTS FOR 'username' ───
  
  // console.log(username); // ❌ ReferenceError: Cannot access 'username' before initialization
  
  let username = "Alice"; // ─── TDZ ENDS (Variable is initialized) ───
  
  console.log(username); // ✅ Output: "Alice"
}

```

### Why Does the TDZ Exist?

The TDZ was introduced in ES6 to catch programming errors early. Attempting to use a variable before it has been defined is almost always a bug, and throwing a `ReferenceError` helps developers identify scoping issues immediately.

---

## 3. Function Expressions vs. Function Declarations

Note that only **function declarations** are fully hoisted. **Function expressions** assigned to `let`, `const`, or `var` variables inherit the hoisting behavior of those respective keywords:

```javascript
// ❌ Fails because 'greet' is declared with 'const' (in TDZ)
// greet(); 

const greet = function() {
  console.log("Hi!");
};

greet(); // Works here

```

---

## 4. Class Hoisting

Like `let` and `const`, JavaScript `class` declarations are hoisted to the top of their scope, but they remain uninitialized in the TDZ:

```javascript
// ❌ ReferenceError: Cannot access 'User' before initialization
const u = new User(); 

class User {
  constructor(name) {
    this.name = name;
  }
}

```

---

## Summary Cheat Sheet

| Declaration Type    | Hoisted? | Initialized Value  | Behavior Before Declaration   |
| ------------------- | -------- | ------------------ | ----------------------------- |
| **`function`**      | Yes      | Full function body | Executes successfully         |
| **`var`**           | Yes      | `undefined`        | Returns `undefined`           |
| **`let` / `const**` | Yes      | **Uninitialized**  | Throws `ReferenceError` (TDZ) |
| **`class`**         | Yes      | **Uninitialized**  | Throws `ReferenceError` (TDZ) |
