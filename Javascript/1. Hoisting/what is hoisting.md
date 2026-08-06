### Detailed Explanation with Code and Output for Hoisting

Below, I'll walk through various scenarios involving **hoisting**, including variables, function declarations, and `let`/`const`.

---

### **Scenario 1: Variable Hoisting with `var`**

#### Code
```javascript
console.log(y); // Output?
var y = 10;
console.log(y); // Output?
```

#### Compilation Phase
- The declaration `var y` is hoisted to the top and initialized to `undefined`.
- The assignment `y = 10` remains in place for execution.

#### Execution Phase
1. `console.log(y);` logs `undefined` because the variable `y` is declared but not yet assigned a value.
2. `y = 10;` assigns `10` to `y`.
3. `console.log(y);` logs `10`.

#### Output
```
undefined
10
```

---

### **Scenario 2: Function Hoisting**

#### Code
```javascript
greet(); // Output?

function greet() {
  console.log("Hello, World!");
}
```

#### Compilation Phase
- The entire function declaration `function greet() { ... }` is hoisted to the top of its scope.

#### Execution Phase
1. `greet();` is executed, and since the function is fully hoisted, it logs `"Hello, World!"`.

#### Output
```
Hello, World!
```

---

### **Scenario 3: Variables vs Function Hoisting**

#### Code
```javascript
console.log(greet); // Output?
console.log(greet()); // Output?

var greet = function() {
  return "Hello, World!";
};
```

#### Compilation Phase
- The variable `greet` is hoisted to the top and initialized to `undefined`.
- The function expression `greet = function() { ... }` remains in place for execution.

#### Execution Phase
1. `console.log(greet);` logs `undefined` because the variable is hoisted but not yet assigned.
2. `console.log(greet());` throws a `TypeError: greet is not a function` because `greet` is still `undefined` at this point.

#### Output
```
undefined
TypeError: greet is not a function
```

---

### **Scenario 4: `let` and `const` Hoisting**

#### Code
```javascript
console.log(x); // Output?

let x = 5;
```

#### Compilation Phase
- `let x` is hoisted but not initialized. It resides in the **temporal dead zone (TDZ)** until the declaration is executed.

#### Execution Phase
1. `console.log(x);` throws a `ReferenceError` because `x` is in the TDZ.
2. Once `let x = 5;` is reached, `x` is initialized to `5`.

#### Output
```
ReferenceError: Cannot access 'x' before initialization
```

---

### **Scenario 5: Function and Variable Interaction**

#### Code
```javascript
console.log(foo()); // Output?
console.log(bar);   // Output?

function foo() {
  return "I'm a function!";
}

var bar = "I'm a variable!";
```

#### Compilation Phase
- The function `foo` is hoisted with its full definition.
- The variable `bar` is hoisted and initialized to `undefined`.

#### Execution Phase
1. `console.log(foo());` logs `"I'm a function!"` because `foo` is fully hoisted.
2. `console.log(bar);` logs `undefined` because `bar` is hoisted but not yet assigned.

#### Output
```
I'm a function!
undefined
```

---

### **Scenario 6: Function Overriding in Hoisting**

#### Code
```javascript
console.log(greet()); // Output?

function greet() {
  return "Hello!";
}

function greet() {
  return "Hi!";
}
```

#### Compilation Phase
- Both function declarations are hoisted.
- The second declaration overrides the first.

#### Execution Phase
1. `console.log(greet());` calls the overridden function, which returns `"Hi!"`.

#### Output
```
Hi!
```

---

### **Scenario 7: Mixing Function Declarations and Expressions**

#### Code
```javascript
foo(); // Output?
bar(); // Output?

function foo() {
  console.log("I'm foo!");
}

var bar = function() {
  console.log("I'm bar!");
};
```

#### Compilation Phase
- `foo` is hoisted with its full definition.
- `bar` is hoisted as a variable and initialized to `undefined`.

#### Execution Phase
1. `foo();` logs `"I'm foo!"` because `foo` is fully hoisted.
2. `bar();` throws a `TypeError: bar is not a function` because `bar` is still `undefined`.

#### Output
```
I'm foo!
TypeError: bar is not a function
```

---

### **Scenario 8: Advanced Variable and Function Interaction**

#### Code
```javascript
console.log(a); // Output?
console.log(b); // Output?

var a = 1;
function b() {
  return 2;
}
```

#### Compilation Phase
- `var a` is hoisted and initialized to `undefined`.
- `b` is hoisted with its full definition.

#### Execution Phase
1. `console.log(a);` logs `undefined` because `a` is hoisted but not yet assigned.
2. `console.log(b);` logs `[Function: b]` because `b` is a fully hoisted function.

#### Output
```
undefined
[Function: b]
```

---

### **Scenario 9: Combining `let`, `const`, and `var`**

#### Code
```javascript
console.log(a); // Output?
console.log(b); // Output?
console.log(c); // Output?

var a = 1;
let b = 2;
const c = 3;
```

#### Compilation Phase
- `var a` is hoisted and initialized to `undefined`.
- `let b` and `const c` are hoisted but uninitialized (in the TDZ).

#### Execution Phase
1. `console.log(a);` logs `undefined` because `a` is hoisted.
2. `console.log(b);` throws a `ReferenceError` because `b` is in the TDZ.
3. `console.log(c);` is not executed because the code halts after the error on `b`.

#### Output
```
undefined
ReferenceError: Cannot access 'b' before initialization
```

---

### **Summary of Outputs**

| Scenario       | Output                                                                 |
|----------------|------------------------------------------------------------------------|
| Scenario 1     | `undefined`, `10`                                                     |
| Scenario 2     | `"Hello, World!"`                                                     |
| Scenario 3     | `undefined`, `TypeError: greet is not a function`                     |
| Scenario 4     | `ReferenceError: Cannot access 'x' before initialization`             |
| Scenario 5     | `"I'm a function!"`, `undefined`                                      |
| Scenario 6     | `"Hi!"`                                                               |
| Scenario 7     | `"I'm foo!"`, `TypeError: bar is not a function`                      |
| Scenario 8     | `undefined`, `[Function: b]`                                          |
| Scenario 9     | `undefined`, `ReferenceError: Cannot access 'b' before initialization`|

---

### Closing Notes
- Hoisting applies to **variable declarations (`var`)** and **function declarations**.
- Variables declared with `let` and `const` are hoisted but uninitialized, causing a **ReferenceError** when accessed before their declaration.
- Function expressions and arrow functions are not hoisted.
