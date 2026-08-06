# Parameters vs Arguments in JavaScript

This is a very common JavaScript interview question.

***

# Simple Definition

```javascript
function greet(name) {
  console.log(name);
}

greet("Sudhir");
```

### Parameter

```javascript
name
```

The variable declared in the function definition.

### Argument

```javascript
"Sudhir"
```

The actual value passed to the function call.

***

# Visual Representation

```javascript
function add(a, b) {
  return a + b;
}

add(10, 20);
```

### Parameters

```javascript
a, b
```

### Arguments

```javascript
10, 20
```

***

# Interview One-Liner

```text
Parameters are placeholders in the function definition.
Arguments are actual values supplied during the function call.
```

***

# Example 1: Single Parameter

```javascript
function welcome(name) {
  return `Hello ${name}`;
}

welcome("Sudhir");
```

| Type      | Value    |
| --------- | -------- |
| Parameter | name     |
| Argument  | "Sudhir" |

***

# Example 2: Multiple Parameters

```javascript
function createEmployee(
  name,
  role,
  salary
) {
  return {
    name,
    role,
    salary
  };
}

createEmployee(
  "Sudhir",
  "Project Lead",
  100000
);
```

### Parameters

```javascript
name
role
salary
```

### Arguments

```javascript
"Sudhir"
"Project Lead"
100000
```

***

# Default Parameters

```javascript
function greet(
  name = "Guest"
) {
  return name;
}

greet();
```

### Parameter

```javascript
name = "Guest"
```

### Argument

```javascript
No argument passed
```

Output:

```javascript
Guest
```

***

# Rest Parameters

Collect multiple arguments.

```javascript
function sum(...numbers) {
  return numbers.reduce(
    (total, num) =>
      total + num,
    0
  );
}

sum(1, 2, 3, 4, 5);
```

### Parameter

```javascript
...numbers
```

### Arguments

```javascript
1, 2, 3, 4, 5
```

***

# Arguments Object

Old JavaScript feature.

```javascript
function show() {
  console.log(arguments);
}

show(10, 20, 30);
```

Output:

```javascript
{
  0: 10,
  1: 20,
  2: 30
}
```

### Modern Alternative

```javascript
function show(...args) {
  console.log(args);
}
```

***

# React Props Example

```jsx
function Button({
  text,
  variant
}) {
  return (
    <button>
      {text}
    </button>
  );
}

<Button
  text="Save"
  variant="primary"
/>
```

### Parameters

```javascript
text
variant
```

### Arguments

```javascript
"Save"
"primary"
```

***

# Custom Hook Example

```jsx
function useCounter(
  initialValue = 0
) {
  const [count, setCount] =
    useState(initialValue);

  return count;
}

useCounter(10);
```

### Parameter

```javascript
initialValue
```

### Argument

```javascript
10
```

***

# Interview Tricky Question

```javascript
function test(a, b) {
  console.log(
    arguments.length
  );
}

test(1, 2, 3, 4);
```

Output:

```javascript
4
```

### Why?

Parameters:

```javascript
a, b
```

Arguments:

```javascript
1, 2, 3, 4
```

JavaScript allows more arguments than parameters.

***

# Too Few Arguments

```javascript
function test(a, b) {
  console.log(a);
  console.log(b);
}

test(10);
```

Output:

```javascript
10
undefined
```

Missing arguments become:

```javascript
undefined
```

***

# Memory Trick

### Parameter = Variable

```javascript
function add(a, b)
```

Think:

```text
Parameter = Placeholder
```

***

### Argument = Value

```javascript
add(10, 20)
```

Think:

```text
Argument = Actual Value
```

***

# Senior React Interview Answer

```text
Parameter → Variable declared in function definition.

Argument → Actual value passed during function invocation.
```

Example:

```javascript
function add(a, b) {}

add(10, 20);
```

Parameters:

```javascript
a, b
```

Arguments:

```javascript
10, 20
```

Modern JavaScript commonly uses:

* Default Parameters (`name = "Guest"`)
* Rest Parameters (`...args`)
* Destructured Parameters (`{ name, age }`)
* Function Arguments (values passed at runtime)

These concepts are fundamental to React props, custom hooks, API utilities, and reusable component design.


# `arguments` vs Rest Parameters (`...args`)

This is one of the most common JavaScript interview questions.

***

# 1. `arguments` Object (Old Way)

Every regular function has access to an `arguments` object.

```javascript
function show() {
  console.log(arguments);
}

show(10, 20, 30);
```

Output:

```javascript
{
  0: 10,
  1: 20,
  2: 30
}
```

***

## Access Arguments

```javascript
function show() {
  console.log(arguments[0]);
  console.log(arguments[1]);
}

show(100, 200);
```

Output:

```javascript
100
200
```

***

## Count Arguments

```javascript
function show() {
  console.log(arguments.length);
}

show(1, 2, 3, 4);
```

Output:

```javascript
4
```

***

# Problems with `arguments`

## Not a Real Array

```javascript
function show() {
  arguments.map(x => x);
}
```

Output:

```javascript
TypeError
```

Because:

```javascript
arguments
```

is array-like, not an actual array.

***

## Conversion Required

```javascript
function show() {
  const arr =
    Array.from(arguments);

  console.log(arr);
}

show(1, 2, 3);
```

***

# 2. Rest Parameters (`...args`) - Modern Way

```javascript
function show(...args) {
  console.log(args);
}

show(10, 20, 30);
```

Output:

```javascript
[10, 20, 30]
```

***

## Rest Parameter is an Actual Array

```javascript
function show(...args) {
  console.log(
    args.map(x => x * 2)
  );
}

show(1, 2, 3);
```

Output:

```javascript
[2, 4, 6]
```

***

# Sum Example

```javascript
function sum(...numbers) {
  return numbers.reduce(
    (total, num) =>
      total + num,
    0
  );
}

console.log(
  sum(1, 2, 3, 4, 5)
);
```

Output:

```javascript
15
```

***

# Rest with Normal Parameters

```javascript
function test(
  name,
  age,
  ...skills
) {
  console.log(name);
  console.log(age);
  console.log(skills);
}

test(
  "Sudhir",
  35,
  "React",
  "Node",
  "TypeScript"
);
```

Output:

```javascript
Sudhir

35

[
  "React",
  "Node",
  "TypeScript"
]
```

***

# React Example

## Custom Hook

```jsx
function useLogger(...messages) {
  console.log(messages);
}

useLogger(
  "API Started",
  "Loading Users"
);
```

Output:

```javascript
[
  "API Started",
  "Loading Users"
]
```

***

# API Utility Example

```javascript
function createURL(
  endpoint,
  ...params
) {
  return `${endpoint}/${params.join("/")}`;
}

console.log(
  createURL(
    "/users",
    100,
    "details"
  )
);
```

Output:

```text
/users/100/details
```

***

# Interview Question

## Can Arrow Functions Use `arguments`?

```javascript
const show = () => {
  console.log(arguments);
};
```

Output:

```javascript
ReferenceError
```

Arrow functions don't have their own `arguments`.

***

## Solution

```javascript
const show = (
  ...args
) => {
  console.log(args);
};

show(1, 2, 3);
```

Output:

```javascript
[1, 2, 3]
```

***

# Interview Comparison

| Feature                 | arguments | ...args |
| ----------------------- | --------- | ------- |
| Array-like              | ✅         | ❌       |
| Real Array              | ❌         | ✅       |
| map()                   | ❌         | ✅       |
| reduce()                | ❌         | ✅       |
| Works in Arrow Function | ❌         | ✅       |
| ES6 Modern              | ❌         | ✅       |
| Recommended Today       | ❌         | ✅       |

***

# Tricky Interview Questions

## Q1

```javascript
function test(
  a,
  b,
  ...rest
) {
  console.log(rest);
}

test(
  1,
  2,
  3,
  4,
  5
);
```

Output:

```javascript
[3, 4, 5]
```

***

## Q2

```javascript
function test(...args) {
  console.log(args.length);
}

test();
```

Output:

```javascript
0
```

***

## Q3

```javascript
function test(...args) {
  return Math.max(...args);
}

console.log(
  test(
    10,
    20,
    30
  )
);
```

Output:

```javascript
30
```

***

# Rest vs Spread (Very Common Interview Question)

## Rest (`...` in Parameters)

Collects values.

```javascript
function sum(...nums) {}
```

Input:

```javascript
1,2,3
```

Output:

```javascript
[1,2,3]
```

***

## Spread (`...` in Calls)

Expands values.

```javascript
const nums =
  [1, 2, 3];

console.log(
  Math.max(...nums)
);
```

Output:

```javascript
Math.max(
  1,
  2,
  3
);
```

***

# Senior Interview Answer

```javascript
function test(...args) {}
```

Rest parameters collect function arguments into a real array.

Benefits:

✅ Works in arrow functions

✅ Supports `map`, `filter`, `reduce`

✅ Cleaner syntax

✅ Replaces the old `arguments` object

✅ Preferred in React and modern JavaScript

In modern applications, always prefer:

```javascript
(...args)
```

over:

```javascript
arguments
```

unless you're maintaining legacy code.



# `arguments` Object vs Rest Parameters (`...args`)

This is a very common **JavaScript + React interview question**.

***

# Example 1: `arguments` Object

```javascript
function sum() {
  console.log(arguments);
}

sum(10, 20, 30);
```

Output:

```javascript
{
  0: 10,
  1: 20,
  2: 30
}
```

### Characteristics

✅ Available in regular functions

✅ Contains all passed arguments

❌ Not a real array

❌ Cannot use `map()`, `filter()`, `reduce()` directly

***

# Example 2: Rest Parameters

```javascript
function sum(...args) {
  console.log(args);
}

sum(10, 20, 30);
```

Output:

```javascript
[10, 20, 30]
```

### Characteristics

✅ Real Array

✅ Supports:

```javascript
map()
filter()
reduce()
forEach()
```

✅ Modern ES6 syntax

✅ Works with arrow functions

***

# Example 3: Sum Numbers

## Using `arguments`

```javascript
function sum() {
  let total = 0;

  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }

  return total;
}

console.log(sum(1, 2, 3, 4));
```

Output:

```javascript
10
```

***

## Using Rest Parameters

```javascript
function sum(...numbers) {
  return numbers.reduce(
    (total, num) => total + num,
    0
  );
}

console.log(sum(1, 2, 3, 4));
```

Output:

```javascript
10
```

Cleaner ✅

***

# Example 4: Filtering Values

## arguments

```javascript
function getEven() {
  const arr = Array.from(arguments);

  return arr.filter(
    num => num % 2 === 0
  );
}

console.log(getEven(1, 2, 3, 4));
```

***

## Rest Parameter

```javascript
function getEven(...nums) {
  return nums.filter(
    num => num % 2 === 0
  );
}

console.log(getEven(1, 2, 3, 4));
```

Output:

```javascript
[2, 4]
```

***

# Arrow Functions & `arguments` Limitation

## ❌ Doesn't Work

```javascript
const test = () => {
  console.log(arguments);
};

test(1, 2, 3);
```

Output:

```javascript
ReferenceError
```

Why?

Arrow functions don't create their own:

```javascript
this
arguments
super
```

They inherit from the parent scope.

***

## ✅ Use Rest Parameters

```javascript
const test = (...args) => {
  console.log(args);
};

test(1, 2, 3);
```

Output:

```javascript
[1, 2, 3]
```

***

# Tricky Interview Question

```javascript
function outer() {
  const inner = () => {
    console.log(arguments);
  };

  inner();
}

outer(10, 20);
```

Output:

```javascript
{
  0: 10,
  1: 20
}
```

Why?

Arrow function inherits:

```javascript
arguments
```

from:

```javascript
outer()
```

***

# React Hook Examples Using Rest Parameters

## 1. Logger Hook

```jsx
function useLogger(...messages) {
  React.useEffect(() => {
    console.log(messages);
  }, [messages]);
}

function App() {
  useLogger(
    "API Started",
    "Fetching Users"
  );

  return <div>Hello</div>;
}
```

***

## 2. Event Tracking Hook

```jsx
function useAnalytics(...events) {
  React.useEffect(() => {
    events.forEach(event =>
      console.log(
        "Tracking:",
        event
      )
    );
  }, [events]);
}
```

Usage:

```jsx
useAnalytics(
  "page-view",
  "search",
  "login"
);
```

***

## 3. API Helper Hook

```jsx
function useFetch(
  url,
  ...dependencies
) {
  React.useEffect(() => {
    fetch(url);
  }, dependencies);
}
```

Usage:

```jsx
useFetch(
  "/api/users",
  page,
  sortBy,
  filters
);
```

***

# Interview Tips for React

## ✅ Prefer Rest Parameters

```javascript
function handler(...args) {}
```

Instead of:

```javascript
function handler() {
  console.log(arguments);
}
```

***

## ✅ Useful for Callbacks

```javascript
const handleClick = (...args) => {
  console.log(args);
};
```

***

## ✅ Useful in Custom Hooks

```javascript
function useTracker(...events) {}
```

***

## ✅ Combine with Destructuring

```javascript
function add(first, ...rest) {
  console.log(first);
  console.log(rest);
}

add(1, 2, 3, 4);
```

Output:

```javascript
1
[2, 3, 4]
```

***

# Interview Comparison Table

| Feature                        | `arguments` | `...args` |
| ------------------------------ | ----------- | --------- |
| Available in regular functions | ✅           | ✅         |
| Available in arrow functions   | ❌           | ✅         |
| Real Array                     | ❌           | ✅         |
| Supports map/filter/reduce     | ❌           | ✅         |
| ES6 Modern Syntax              | ❌           | ✅         |
| Recommended Today              | ❌           | ✅         |

***

# Senior Interview Answer

> `arguments` is a legacy array-like object available only in regular functions, whereas rest parameters (`...args`) are an ES6 feature that collects all remaining arguments into a real array. Rest parameters work with arrow functions, support array methods directly, and are the preferred approach in modern JavaScript and React applications. They are especially useful in custom hooks, reusable utilities, event handlers, and higher-order functions.
