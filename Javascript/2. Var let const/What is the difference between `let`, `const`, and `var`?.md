In JavaScript, `var`, `let`, and `const` are used to declare variables, but they differ in three key areas: **scope**, **re-assignment/re-declaration**, and **hoisting**.

Here is a quick summary before diving into the details:

| Feature                     | `var`                    | `let`                        | `const`                       |
| --------------------------- | ------------------------ | ---------------------------- | ----------------------------- |
| **Scope**                   | Function Scope           | Block Scope (`{}`)           | Block Scope (`{}`)            |
| **Re-assignable?**          | ✅ Yes                    | ✅ Yes                        | ❌ No                          |
| **Re-declarable?**          | ✅ Yes                    | ❌ No                         | ❌ No                          |
| **Hoisting**                | Hoisted with `undefined` | Hoisted (Temporal Dead Zone) | Hoisted (Temporal Dead Zone)  |
| **Initial Value Required?** | ❌ No                     | ❌ No                         | ✅ Yes (e.g., `const x = 10;`) |

---

### 1. Scope: Function Scope vs. Block Scope

* **`var` is Function-Scoped:** A variable declared with `var` inside a function is available throughout that entire function. If declared outside a function, it becomes global. It ignores block boundaries like `if` statements or `for` loops.

```javascript
if (true) {
  var x = 10;
}
console.log(x); // 10 (Escapes the if-block!)

```

* **`let` and `const` are Block-Scoped:** They only exist inside the pair of curly braces `{}` where they are defined (e.g., inside an `if` block, `for` loop, or function).

```javascript
if (true) {
  let y = 20;
  const z = 30;
}
console.log(y); // ReferenceError: y is not defined
console.log(z); // ReferenceError: z is not defined

```

---

### 2. Re-assignment and Re-declaration

* **`var`:** Can be re-assigned AND re-declared within the same scope without throwing an error.

```javascript
var name = "Alice";
var name = "Bob"; // ✅ Allowed (re-declaration)
name = "Charlie"; // ✅ Allowed (re-assignment)

```

* **`let`:** Can be re-assigned, but **cannot** be re-declared within the same scope.

```javascript
let count = 1;
count = 2; // ✅ Allowed (re-assignment)

let count = 3; // ❌ SyntaxError: Identifier 'count' has already been declared

```

* **`const`:** Cannot be re-assigned or re-declared, and it must be initialized with a value at the time of declaration.

```javascript
const PI = 3.14159;
PI = 3.14; // ❌ TypeError: Assignment to constant variable

const age; // ❌ SyntaxError: Missing initializer in const declaration

```

> ⚠️ **Important Note on `const` with Objects and Arrays:**
> `const` prevents re-assigning the variable **binding**, but it does not make values immutable. You can still mutate properties inside a `const` object or array:
>
> ```javascript
> const user = { name: "Alice" };
> user.name = "Bob"; // ✅ Allowed! (Mutating property)
> user = { name: "Charlie" }; // ❌ TypeError (Re-assigning whole variable)
> 
> ```
>
>

---

### 3. Hoisting and the Temporal Dead Zone (TDZ)

Hoisting is JavaScript's default behavior of moving variable declarations to the top of their scope before code execution.

* **`var`:** Is hoisted and initialized with `undefined`. Accessing a `var` before its declaration line returns `undefined` instead of throwing an error.

```javascript
console.log(a); // undefined (Hoisted!)
var a = 5;

```

* **`let` and `const`:** Are also hoisted, but they are **not initialized**. They enter a state called the **Temporal Dead Zone (TDZ)** from the start of the block until the execution reaches the declaration line. Accessing them prematurely throws a `ReferenceError`.

```javascript
console.log(b); // ❌ ReferenceError: Cannot access 'b' before initialization
let b = 10;

```

---

### Modern Best Practices

1. **Use `const` by default** for all variables to prevent accidental re-assignments.
2. **Use `let**` only when you know the variable's value needs to change later (e.g., loop counters, flag toggles).
3. **Avoid `var**` in modern JavaScript to eliminate scope-related bugs and hoisting pitfalls.
