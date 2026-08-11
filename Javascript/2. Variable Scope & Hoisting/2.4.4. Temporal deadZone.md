# Temporal Dead Zone (TDZ) in JavaScript

## What is TDZ?

**Temporal Dead Zone (TDZ)** is the period between:

```javascript
{
  // TDZ starts

  let count = 10;

  // TDZ ends
}
```

and the point where the variable is initialized.

A variable declared with `let`, `const`, or `class`:

- Is **hoisted**
- Exists in memory
- Is **not initialized**
- Cannot be accessed

Accessing it before initialization throws:

```text
ReferenceError
```

---

## TDZ vs var

### var

```javascript
console.log(x);

var x = 10;
```

Output:

```text
undefined
```

Internal Behaviour:

```javascript
var x;

console.log(x);

x = 10;
```

---

### let

```javascript
console.log(x);

let x = 10;
```

Output:

```text
ReferenceError:
Cannot access 'x'
before initialization
```

Internal Behaviour:

```text
x is hoisted
↓
x remains uninitialized
↓
TDZ
↓
let x = 10
↓
TDZ ends
```

---

# Block Scope TDZ

```javascript
{
  console.log(age);

  let age = 30;
}
```

Output:

```text
ReferenceError
```

Because:

```text
Block Scope Created
↓
age exists
↓
age in TDZ
↓
console.log(age)
↓
ReferenceError
```

---

# Tricky Interview Question #1

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

### Why?

```text
Function Scope Created
↓
Local x hoisted
↓
Local x enters TDZ
↓
console.log(x)
↓
ReferenceError
```

Many developers incorrectly answer:

```text
10
```

but the inner variable shadows the outer one.

---

# Tricky Interview Question #2

```javascript
var a = 10;

{
  console.log(a);

  let a = 20;
}
```

### Output

```text
ReferenceError
```

### Why?

```text
Block Scope Created
↓
Inner a hoisted
↓
Inner a enters TDZ
↓
console.log(a)
↓
ReferenceError
```

---

# Function Parameter TDZ

## Example 1

```javascript
function demo(a = b, b = 10) {
  console.log(a, b);
}

demo();
```

### Output

```text
ReferenceError
```

### Why?

Parameters are evaluated:

```text
Left → Right
```

Execution:

```text
Evaluate a = b
↓
b not initialized
↓
TDZ
↓
ReferenceError
```

---

## Example 2

```javascript
function demo(b = 10, a = b) {
  return [a, b];
}

console.log(demo());
```

### Output

```javascript
[10, 10];
```

### Why?

```text
b initialized first
↓
a reads initialized b
```

---

## Example 3 (Favourite Interview Question)

```javascript
let x = 1;

function test(x = x) {
  console.log(x);
}

test();
```

### Output

```text
ReferenceError
```

Most candidates answer:

```text
1
```

Wrong.

Execution:

```text
Parameter Scope Created
↓
Parameter x exists
↓
x still in TDZ
↓
x = x evaluated
↓
ReferenceError
```

The parameter `x` shadows the outer `x`.

---

# Class TDZ

```javascript
const user = new User();

class User {
  constructor() {
    this.name = "Sudhir";
  }
}
```

### Output

```text
ReferenceError
```

Classes also participate in TDZ.

```text
Class hoisted
↓
Not initialized
↓
new User()
↓
ReferenceError
```

---

# TDZ in Real React Bugs

## React Bug #1

```jsx
function UserList() {
  const users = fetchUsers();

  const fetchUsers = () => [];

  return <div>{users.length}</div>;
}
```

### Output

```text
ReferenceError
Cannot access
'fetchUsers'
before initialization
```

### Why?

Arrow functions assigned to `const` are subject to TDZ.

---

### Fix

```jsx
function UserList() {
  const fetchUsers = () => [];

  const users = fetchUsers();

  return <div>{users.length}</div>;
}
```

---

## React Bug #2

```jsx
function Dashboard() {
  const query = useQuery({
    queryFn: fetchUsers,
  });

  const fetchUsers = async () => {
    return api.getUsers();
  };
}
```

### Output

```text
ReferenceError
```

Because:

```text
fetchUsers
used before initialization
```

---

## React Bug #3

```jsx
const value = createTheme();

const createTheme = () => ({
  mode: "dark",
});
```

### Output

```text
ReferenceError
```

Very common during refactoring when developers convert:

```javascript
function createTheme() {}
```

to

```javascript
const createTheme = () => {};
```

---

# TDZ + Closures

## Example 1

```javascript
function createCounter() {
  return function () {
    return count;
  };

  let count = 0;
}
```

### Question

Will this throw?

### Answer

```text
No
```

### Why?

```text
Function created
↓
count initialized
↓
Closure references count
↓
Function called later
```

```javascript
const counter = createCounter();

console.log(counter());
```

Output:

```text
0
```

---

## Example 2

```javascript
function createCounter() {
  const fn = () => count;

  console.log(fn());

  let count = 10;
}

createCounter();
```

### Output

```text
ReferenceError
```

### Why?

```text
fn executes immediately
↓
count still in TDZ
↓
ReferenceError
```

---

## Example 3 (React)

```jsx
function App() {
  const handler = () => {
    console.log(config);
  };

  handler();

  const config = {
    theme: "dark",
  };
}
```

### Output

```text
ReferenceError
```

The closure is created successfully.

The problem occurs because it executes before `config` initialization.

---

# Architect-Level Question

```javascript
let user = "Sudhir";

function Profile(name = user) {
  let user = "Admin";

  return name;
}

console.log(Profile());
```

### Output

```text
Sudhir
```

### Why?

Execution:

```text
Parameter initialization starts
↓
Outer user resolved
↓
Parameters completed
↓
Function body starts
↓
Inner user enters TDZ
↓
Inner user initialized
```

The TDZ of the inner `user` starts only inside the function body.

---

# Senior Interview Summary

### What Interviewers Expect

✅ `let`, `const`, and `class` are hoisted

✅ They are not initialized immediately

✅ TDZ exists until declaration executes

✅ TDZ affects:

- Block scope
- Function scope
- Classes
- Default parameters

✅ TDZ can combine with:

- Closures
- Shadowing
- React hooks
- Arrow functions
- Nested scopes

---

# Perfect Architect Answer

> The Temporal Dead Zone is the period between scope creation and variable initialization for `let`, `const`, and `class` declarations. Although these declarations are hoisted, they remain uninitialized until execution reaches their declaration. Accessing them during this period throws a `ReferenceError`. TDZ commonly appears in React when arrow functions, hook callbacks, configuration objects, closures, or default parameters are referenced before initialization. Understanding TDZ requires understanding hoisting, lexical scope, closures, and parameter evaluation order.

1. TDZ Impact on React Hooks (Interview Summary)

TDZ is not a React concept, but it frequently appears when hooks reference variables, callbacks, or configuration objects before initialization. Variables declared with let and const are hoisted but remain inaccessible until initialization.

Common Hook-Related TDZ Bugs
Bug 1: useQuery
function Users() {

const query = useQuery({
queryFn: fetchUsers
});

const fetchUsers = async () => {
return api.getUsers();
};
}

Result
ReferenceError
Cannot access 'fetchUsers'
before initialization

Fix
function Users() {

const fetchUsers = async () => {
return api.getUsers();
};

const query = useQuery({
queryFn: fetchUsers
});
}

Bug 2: useEffect
function App() {

useEffect(() => {
loadData();
}, []);

const loadData = () => {
console.log("loaded");
};
}

Result
ReferenceError

Why?
Render Starts
↓
useEffect callback created
↓
loadData in TDZ
↓
ReferenceError

Bug 3: useMemo
const config = useMemo(
() => createConfig(),
[]
);

const createConfig = () => ({
theme: "dark"
});

Output:

ReferenceError

Senior Interview Takeaway

A common React TDZ rule:

Function declarations can usually be used before they appear in the file, but arrow functions assigned to const cannot. TDZ-related React bugs often occur during refactoring when function declarations are converted to arrow functions.

2. TDZ + Closures (Advanced Examples)

Many developers misunderstand the relationship between closures and TDZ.

A closure does not automatically cause a TDZ error.

The timing of execution matters.

Example 1: Closure Executes After TDZ
function createUser() {

const getName = () => name;

let name = "Sudhir";

return getName;
}

const fn = createUser();

console.log(fn());

Output
Sudhir

Why?
Closure created
↓
name initialized
↓
Function returned
↓
Closure invoked later

TDZ already ended.

Example 2: Closure Executes During TDZ
function createUser() {

const getName = () => name;

console.log(
getName()
);

let name = "Sudhir";
}

createUser();

Output
ReferenceError

Why?
Closure executes
↓
name still in TDZ
↓
ReferenceError

Example 3: Nested Closure
let name = "Global";

function outer() {

const getName =
() => name;

let name = "Local";

return getName;
}

const fn = outer();

console.log(fn());

Output
Local

Because:

Closure references local name
↓
name initialized
↓
Function executed later

Example 4: React Closure Bug
function App() {

const handleClick =
() => {

      console.log(
        config.theme
      );

    };

handleClick();

const config = {
theme: "dark"
};
}

Output
ReferenceError

The closure exists.

The problem is:

closure executes
before config initializes

Example 5 (Architect Level)
function test() {

const fn1 =
() => value;

let value = 10;

const fn2 =
() => value;

value = 20;

console.log(fn1());
console.log(fn2());
}

test();

Output
20
20

Why?

Closures store a reference to the variable, not a snapshot of its value.

This tests:

Closures
Lexical Scope
TDZ
Variable References

3. Common TDZ Interview Pitfalls

These are the mistakes that candidates frequently make.

Pitfall #1
Wrong Assumption
let is not hoisted.

Correct Answer
let is hoisted
but not initialized.

TDZ only exists because hoisting occurs.

Pitfall #2
Wrong Answer
let x = 10;

function test() {
console.log(x);

let x = 20;
}

Many answer:

10

Actual answer:

ReferenceError

because the inner x shadows the outer one.

Pitfall #3

Function Parameters

function demo(
a = b,
b = 10
) {}

demo();

Many answer:

a = 10

Actual answer:

ReferenceError

because parameters are initialized left-to-right and b is still in TDZ.

Pitfall #4
let x = 1;

function test(
x = x
) {}

test();

Many answer:

1

Actual:

ReferenceError

because the parameter x shadows the outer variable and is still in TDZ.

Pitfall #5

Assuming Closures Ignore TDZ

Wrong:

Closures bypass TDZ.

Correct:

Closures obey TDZ.

The important factor is when the closure executes.

Pitfall #6

Arrow Function vs Function Declaration

Works
sayHello();

function sayHello() {
console.log("Hi");
}

Fails
sayHello();

const sayHello = () => {
console.log("Hi");
};

Output:

ReferenceError

Very common in React projects.

Architect-Level One-Liner

TDZ bugs usually appear when developers confuse hoisting with initialization. In React, the most common sources are arrow functions, hook callbacks, memoized values, configuration objects, and default parameter evaluation. With closures, the key question is not whether a variable is captured but whether the closure executes before or after the variable leaves its Temporal Dead Zone.
