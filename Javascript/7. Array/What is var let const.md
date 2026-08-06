### What is var let const

var are function scoped, which means they are still accessible outside the block scope even though we have declared them inside it.

```javascript
//for loop is block scoped
for (var i = 0; i < 10; i++) {
var iAmInside = "I am available outside of the loop";
}

console.log(iAmInside);
// I am available outside of the loop

//block scope
if (true) {
var inside = "Inside";
}
console.log(inside);
// Inside

//Function scoped
function myFunc() {
var functionScoped = "I am available inside this function";
console.log(functionScoped);
}
myFunc();
// I am available inside this function
console.log(functionScoped);
// ReferenceError: functionScoped is not defined
```

The above code looks like as below to the interpreter,

```javascript
var inside; // hoisted on the top of the function. As there is no function so it is present in the global scope.
//block scope
if (true) {
var inside = "Inside";
}
console.log(inside);
//Inside

//Function scoped In this case value is hoisted inside the function
function getValue(condition) {
if (condition) {
var value = "blue";
return value;
} else {
// value exists here with a value of undefined
return value;
}

// value exists here with a value of undefined
}

console.log(getValue(true)); // blue
console.log(getValue(false)); // undefined

//While execution it is hoisted like this internally
function getValue(condition) {
var value; //value is hoisted as there is no value attached, so it is undefined.
if (condition) {
var value = "blue";
return value;
} else {
// value exists here with a value of undefined
return value;
}

// value exists here with a value of undefined
}
console.log(getValue(true)); // blue
console.log(getValue(false)); // undefined
```

In the same fashion, function declarations are hoisted too

```javascript
message("Good morning"); //Good morning

function message(name) {
console.log(name);
}
```

Scope in JavaScript is the area where we have valid access to variables or functions. JavaScript has three types of Scopes. Global Scope, Function Scope, and Block Scope(ES6).

Global Scope - variables or functions declared in the global namespace are in the global scope and therefore is accessible everywhere in our code.

```javascript
//global namespace
var g = "global";

function globalFunc() {
function innerFunc() {
console.log(g); // can access "g" because "g" is a global variable
}
innerFunc();
}
```

Function Scope - variables,functions and parameters declared within a function are accessible inside that function but not outside of it.

```javascript
function myFavoriteFunc(a) {
if (true) {
var b = "Hello " + a;
}
return b;
}
myFavoriteFunc("World");

console.log(a); // Throws a ReferenceError "a" is not defined
console.log(b); // does not continue here
```

Block Scope - variables (let,const) declared within a block {} can only be access within it.

```javascript
function testBlock() {
if (true) {
let z = 5;
}
return z;
}

testBlock(); // Throws a ReferenceError "z" is not defined
```

const in javascript
Like let const is also block scoped. But it differs from the fact that their variable cannot be redeclared or change by re-assigning the value. The value remains Constant.

```javascript
const abc = "XYZ";
let abc; //SyntaxError: Identifier 'abc' has already been declared
abc = "pqr"; //TypeError: Assignment to constant variable.
```

```javascript
//Should be initialised while declaring
const XYZ; //SyntaxError: Missing initializer in a const declaration
```

just like let, const is also blocked scoped.

```javascript
if (true) {
const a = "I am inside";
console.log(a); // I am inside
}
console.log(a); //ReferenceError: a is not defined
```

However, the value a constant holds may be modified if it is an object.

```javascript
const person = {
name: "Prashant",
age: 25,
};

person.age = 26;
console.log(person.age); // 26
```

```javascript
const person = {
name: "Prashant",
age: 25,
};
person = 26;
console.log(person); //  TypeError: Assignment to constant variable.
```

var
Used for function-scoped variables that can be hoisted. var declarations can be globally scoped or function-scoped. var variables can be updated and redeclared within their scope.

let
Used for block-scoped variables that can be reassigned. let variables can be updated but not redeclared.

const
Used for block-scoped variables that are constant and cannot be reassigned. const variables cannot be updated or redeclared. const declares variables that remain constant throughout the program.

`var`, `let`, and `const` are among the **most frequently asked JavaScript interview topics**. Interviewers often focus on **hoisting, scope, the Temporal Dead Zone (TDZ), redeclaration, and closures**.

Here are some commonly asked and tricky questions.

---

# 1. Difference between `var`, `let`, and `const`

| Feature                | `var`                | `let`         | `const`       |
| ---------------------- | -------------------- | ------------- | ------------- |
| Scope                  | Function             | Block         | Block         |
| Hoisted                | Yes                  | Yes           | Yes           |
| TDZ                    | No                   | Yes           | Yes           |
| Redeclaration          | ✅ Allowed            | ❌ Not allowed | ❌ Not allowed |
| Reassignment           | ✅ Allowed            | ✅ Allowed     | ❌ Not allowed |
| Global object property | ✅ Yes (global scope) | ❌ No          | ❌ No          |

---

# 2. What is the output?

```javascript
console.log(a);

var a = 10;
```

### Output

```text
undefined
```

**Why?**

`var` is hoisted and initialized with `undefined`.

Equivalent code:

```javascript
var a;

console.log(a);

a = 10;
```

---

# 3. What is the output?

```javascript
console.log(a);

let a = 10;
```

### Output

```text
ReferenceError
```

**Why?**

`let` is hoisted but remains in the **Temporal Dead Zone (TDZ)** until its declaration is executed.

---

# 4. What is the output?

```javascript
console.log(a);

const a = 10;
```

### Output

```text
ReferenceError
```

Same reason: `const` is also in the TDZ before initialization.

---

# 5. What is the output?

```javascript
var a = 10;

var a = 20;

console.log(a);
```

### Output

```text
20
```

`var` allows redeclaration.

---

# 6. What is the output?

```javascript
let a = 10;

let a = 20;
```

### Output

```text
SyntaxError
```

`let` cannot be redeclared in the same scope.

---

# 7. What is the output?

```javascript
const a = 10;

a = 20;
```

### Output

```text
TypeError: Assignment to constant variable.
```

`const` variables cannot be reassigned.

---

# 8. Can we modify a `const` object?

```javascript
const user = {
  name: "John"
};

user.name = "Alice";

console.log(user.name);
```

### Output

```text
Alice
```

`const` prevents reassignment of the variable, not mutation of the object's contents.

---

# 9. What is the output?

```javascript
const arr = [1, 2];

arr.push(3);

console.log(arr);
```

### Output

```text
[1, 2, 3]
```

The array contents can still be modified.

---

# 10. What is the output?

```javascript
{
    var a = 10;
}

console.log(a);
```

### Output

```text
10
```

`var` is not block-scoped.

---

# 11. What is the output?

```javascript
{
    let a = 10;
}

console.log(a);
```

### Output

```text
ReferenceError
```

`let` is block-scoped.

---

# 12. What is the output?

```javascript
{
    const a = 10;
}

console.log(a);
```

### Output

```text
ReferenceError
```

`const` is also block-scoped.

---

# 13. What is the output?

```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
```

### Output

```text
3
3
3
```

`var` has function scope, so all callbacks share the same `i`, which is `3` after the loop finishes.

---

# 14. What is the output?

```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
```

### Output

```text
0
1
2
```

Each iteration gets its own `i` binding.

---

# 15. Fix the previous `var` example

```javascript
for (var i = 0; i < 3; i++) {
    ((x) => {
        setTimeout(() => console.log(x), 0);
    })(i);
}
```

### Output

```text
0
1
2
```

The IIFE creates a new scope for each iteration.

---

# 16. What is the Temporal Dead Zone (TDZ)?

The TDZ is the period between entering a scope and executing the declaration of a `let` or `const` variable.

```javascript
{
    console.log(a);

    let a = 10;
}
```

### Output

```text
ReferenceError
```

---

# 17. What is the output?

```javascript
let a = 10;

{
    let a = 20;

    console.log(a);
}

console.log(a);
```

### Output

```text
20
10
```

The inner `a` shadows the outer `a`.

---

# 18. What is the output?

```javascript
var a = 10;

{
    var a = 20;
}

console.log(a);
```

### Output

```text
20
```

Because `var` ignores block scope.

---

# 19. What is the output?

```javascript
let a = 10;

{
    var b = 20;
}

console.log(a);
console.log(b);
```

### Output

```text
10
20
```

`let` is block-scoped, but `var` declared inside a block is still accessible outside that block (unless inside a function).

---

# 20. What is the output?

```javascript
console.log(a);

var a = 10;

function a() {}

console.log(a);
```

### Output

```text
function a() {}

10
```

Function declarations are hoisted before `var` initializations. Initially, `a` refers to the function. After `var a = 10` executes, `a` becomes `10`.

---

# 21. Is `const` immutable?

No.

```javascript
const obj = {
    x: 10
};

obj.x = 20;

console.log(obj.x);
```

Output:

```text
20
```

Only the binding is constant, not the object's contents.

---

# 22. What is the output?

```javascript
let x = 10;

function test() {
    console.log(x);

    let x = 20;
}

test();
```

### Output

```text
ReferenceError
```

The inner `x` shadows the outer `x` but is in the TDZ until initialized.

---

# 23. What is the output?

```javascript
var x = 10;

function test() {
    console.log(x);

    var x = 20;
}

test();
```

### Output

```text
undefined
```

Equivalent to:

```javascript
function test() {
    var x;

    console.log(x);

    x = 20;
}
```

---

# 24. Where are `var`, `let`, and `const` stored?

* `var`: In the function scope or global scope. At the top level in a browser, it also becomes a property of the global object (`window`).
* `let` and `const`: In the block scope and managed through lexical environments. They do **not** become properties of the global object.

Example:

```javascript
var a = 10;
let b = 20;

console.log(window.a); // 10 (in browsers)
console.log(window.b); // undefined
```

---

# 25. Which should you use in modern JavaScript?

A common recommendation is:

* Use **`const` by default**.
* Use **`let`** when reassignment is needed.
* Avoid **`var`** in new code because its function scope and hoisting behavior can lead to subtle bugs.

---

## Interview Cheat Sheet

| Question                          | Answer                        |
| --------------------------------- | ----------------------------- |
| Is `var` block scoped?            | ❌ No                          |
| Is `let` block scoped?            | ✅ Yes                         |
| Is `const` block scoped?          | ✅ Yes                         |
| Is `var` hoisted?                 | ✅ Yes (`undefined`)           |
| Are `let`/`const` hoisted?        | ✅ Yes (TDZ until initialized) |
| Can `var` be redeclared?          | ✅ Yes                         |
| Can `let` be redeclared?          | ❌ No                          |
| Can `const` be reassigned?        | ❌ No                          |
| Can a `const` object be modified? | ✅ Yes                         |
| Which is recommended by default?  | `const`                       |

These questions cover the concepts that interviewers most often use to assess understanding of JavaScript scoping, hoisting, and variable declarations.
