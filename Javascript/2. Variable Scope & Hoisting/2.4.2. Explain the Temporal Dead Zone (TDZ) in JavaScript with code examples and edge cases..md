The **Temporal Dead Zone (TDZ)** is the period between entering a scope and the point where a variable declared with `let`, `const`, or `class` is initialized.

During this period, the variable **exists in memory** (it has been hoisted), but it is **uninitialized**. Attempting to access, read, or write to a variable while it is in its TDZ throws a `ReferenceError`.

---

### Why Does the TDZ Exist?

1. **Catch Bugs Early:** Accessing variables before initialization is usually a developer logic error. The TDZ fails fast by throwing a `ReferenceError` instead of silently returning `undefined` like `var`.
2. **Support `const`:** A `const` variable must never be reassigned. If `const` were initialized to `undefined` during hoisting, reading it before declaration would yield `undefined`, and its actual assignment would technically be a "reassignment." The TDZ enforces strict single-assignment semantics.

---

### 1. Basic TDZ Example

The TDZ starts when entering the block scope `{}` and ends when execution reaches the variable's declaration line.

```javascript
{
  // ─── TDZ STARTS HERE ─────────────────────────────────┐
  //                                                     │
  // console.log(age); // ❌ ReferenceError              │ TDZ for `age`
  // age = 30;         // ❌ ReferenceError              │
  //                                                     │
  let age = 25; // ◄── INITIALIZATION LINE ──────────────┘
  
  // ─── TDZ ENDS HERE ───────────────────────────────────
  console.log(age); // ✅ Output: 25
}

```

---

### 2. Difference Between `var` vs `let`/`const` in Hoisting

* **`var`:** Hoisted and initialized with `undefined`. Accessible immediately.
* **`let` / `const`:** Hoisted but kept **uninitialized** in the TDZ.

```javascript
console.log(aVar); // ✅ Output: undefined (no TDZ)
var aVar = 10;

console.log(aLet); // ❌ ReferenceError: Cannot access 'aLet' before initialization
let aLet = 20;

```

---

### 3. Edge Cases & Tricky Scenarios

#### Edge Case A: The `typeof` Operator is No Longer 100% Safe

Historically, `typeof` was considered completely safe because checking undeclared variables returned `"undefined"` without throwing errors. With `let` and `const`, **`typeof` throws a `ReferenceError` inside the TDZ**.

```javascript
// Checking a truly undeclared variable:
console.log(typeof nonExistentVar); // ✅ Output: "undefined"

// Checking a declared let variable inside its TDZ:
console.log(typeof tdzVar); // ❌ ReferenceError: Cannot access 'tdzVar' before initialization
let tdzVar = 100;

```

---

#### Edge Case B: Self-Referencing Initializers

Attempting to assign a variable to itself during declaration causes a `ReferenceError` because the right-hand side is evaluated *before* the variable leaves the TDZ.

```javascript
// The right side (a) is evaluated while 'a' is still in the TDZ!
let a = a; // ❌ ReferenceError: Cannot access 'a' before initialization

function sum(a = b, b = 2) {
  return a + b;
}
sum(); // ❌ ReferenceError: Cannot access 'b' before initialization (b is in TDZ when a evaluates)

```

---

#### Edge Case C: Temporal (Time-Based), Not Spatial (Location-Based)

The "T" in TDZ stands for **Temporal** (time). It depends on the **order of execution**, not where the code is physically written in the file.

```javascript
function printMessage() {
  // 'msg' is physically referenced ABOVE its declaration line,
  // BUT this function runs AFTER 'msg' has been initialized!
  console.log(msg); // ✅ Output: "Hello World!"
}

let msg = "Hello World!"; // Initialization line

printMessage(); // Function invoked here (TDZ for 'msg' has already ended)

```

However, if you invoke the function *before* the initialization line:

```javascript
function printMessage() {
  console.log(msg); 
}

printMessage(); // ❌ ReferenceError (invoked while 'msg' is still in TDZ!)

let msg = "Hello World!";

```

---

#### Edge Case D: Block Scopes Shadowing Outer Variables

In nested scopes, declaring a `let` variable inside an inner block creates a new TDZ for that inner variable, shadowing outer variables with the same name.

```javascript
let count = 10;

function run() {
  // Inside 'run', the inner 'count' is hoisted to the top of the function scope.
  // It enters the TDZ and SHADOWS the outer 'count = 10'!
  
  console.log(count); // ❌ ReferenceError (hits inner 'count' TDZ, ignores outer count=10)

  let count = 20;
}

run();

```

---

#### Edge Case E: Class Declarations Have TDZ Too

`class` declarations in ES6 behave like `let` and `const` regarding hoisting—they enter the TDZ until initialized.

```javascript
const user = new User("Alice"); // ❌ ReferenceError: Cannot access 'User' before initialization

class User {
  constructor(name) {
    this.name = name;
  }
}

```

---

### Summary Checklist

| Declaration | Hoisted? | Initial Value during Hoisting | Accessing Before Line   |
| ----------- | -------- | ----------------------------- | ----------------------- |
| **`var`**   | ✅ Yes    | `undefined`                   | Returns `undefined`     |
| **`let`**   | ✅ Yes    | *Uninitialized* (In TDZ)      | Throws `ReferenceError` |
| **`const`** | ✅ Yes    | *Uninitialized* (In TDZ)      | Throws `ReferenceError` |
| **`class`** | ✅ Yes    | *Uninitialized* (In TDZ)      | Throws `ReferenceError` |
