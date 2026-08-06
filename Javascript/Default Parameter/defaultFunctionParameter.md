

In your code, you're calling the `sum` function with arguments `null` and `20`, and you're using default parameter values in the function definition. However, there's a subtle behavior here related to how JavaScript handles `null` and default parameters.

### The Code:

```javascript
function sum(a = 5, b = 7) {
    console.log(a + b);
}

sum(null, 20);
```

### What happens here?

1. **Default Parameters**:  
   The `sum` function has default values for parameters `a` and `b`:
   - If `a` is `undefined` when the function is called, it will default to `5`.
   - If `b` is `undefined`, it will default to `7`.

2. **Calling the function with `null` and `20`**:
   - When you call `sum(null, 20)`, you're explicitly passing `null` for `a` and `20` for `b`.
   - In JavaScript, the default value mechanism only kicks in if the argument is **`undefined`**, **not `null`**. 
   - `null` is considered a **valid value**, and it's **not replaced by the default value**. Thus, `a` will be `null`, and `b` will be `20`.

3. **Inside the function**:  
   - `a + 20` will be evaluated, where `a = null`. 
   - In JavaScript, **`null` is treated as `0` when used in arithmetic operations**. 
   - So, `null + 20` will be interpreted as `0 + 20`, which evaluates to `20`.

4. **Result**:  
   The result will be that `20` is logged to the console because `null + 20` evaluates to `20`.

### Output:

```javascript
20
```

### Explanation:

- **Default values** for function parameters only apply when the value is `undefined`. In this case, since `null` is passed explicitly, the default value for `a` is not used.
- JavaScript converts `null` to `0` when used in numeric operations (like addition), which is why `null + 7` gives `7`.

### What would happen if `undefined` were passed for `a`?

```javascript
sum(undefined, 20);  // This would use the default value of 5 for 'a'
```

- In this case, the result would be `5 + 20`, so it would log `25` to the console, because `undefined` would cause `a` to take the default value `5`.

### Summary:
- The default value mechanism in JavaScript only applies when the argument is `undefined`, not `null`.
- When `null` is passed, it is treated as a valid value, and JavaScript converts it to `0` when performing arithmetic operations like addition.

# Default Parameters in JavaScript (ES6)

Default parameters allow you to assign default values to function parameters when no argument (or `undefined`) is passed.

***

# Basic Syntax

```javascript
function greet(name = "Guest") {
  return `Hello ${name}`;
}

console.log(greet());
console.log(greet("Sudhir"));
```

Output:

```javascript
Hello Guest
Hello Sudhir
```

***

# Before ES6

```javascript
function greet(name) {
  name = name || "Guest";

  return `Hello ${name}`;
}
```

Problem:

```javascript
greet("");
```

Output:

```javascript
Hello Guest
```

because:

```javascript
"" => false
```

***

# Modern Solution

```javascript
function greet(name = "Guest") {
  return `Hello ${name}`;
}

console.log(greet(""));
```

Output:

```javascript
Hello
```

Correct behaviour.

***

# Multiple Default Parameters

```javascript
function createUser(
  name = "Guest",
  role = "User"
) {
  return {
    name,
    role
  };
}

console.log(createUser());
```

Output:

```javascript
{
  name: "Guest",
  role: "User"
}
```

***

# Default Parameter as Expression

```javascript
function calculateTax(
  amount,
  taxRate = 0.18
) {
  return amount * taxRate;
}

console.log(
  calculateTax(1000)
);
```

Output:

```javascript
180
```

***

# Using Function Call as Default

```javascript
function getCurrentYear() {
  return new Date().getFullYear();
}

function createReport(
  year = getCurrentYear()
) {
  console.log(year);
}

createReport();
```

Output:

```javascript
2026
```

***

# Parameter Depends on Earlier Parameter

```javascript
function welcome(
  name,
  message = `Hello ${name}`
) {
  return message;
}

console.log(
  welcome("Sudhir")
);
```

Output:

```javascript
Hello Sudhir
```

***

# Default Array Parameter

```javascript
function sum(
  numbers = []
) {
  return numbers.reduce(
    (acc, num) => acc + num,
    0
  );
}

console.log(sum());
```

Output:

```javascript
0
```

***

# Default Object Parameter

```javascript
function createEmployee(
  employee = {}
) {
  const {
    name = "Unknown",
    role = "Developer"
  } = employee;

  return {
    name,
    role
  };
}

console.log(
  createEmployee()
);
```

Output:

```javascript
{
  name: "Unknown",
  role: "Developer"
}
```

***

# Destructuring + Default Parameters

Very common React interview question.

```javascript
function createUser({
  name = "Guest",
  role = "User"
} = {}) {
  return {
    name,
    role
  };
}

console.log(createUser());
```

Output:

```javascript
{
  name: "Guest",
  role: "User"
}
```

***

# React Component Example

```jsx
function Button({
  text = "Submit",
  variant = "primary"
}) {
  return (
    <button
      className={variant}
    >
      {text}
    </button>
  );
}
```

Usage:

```jsx
<Button />
```

Output:

```text
Submit
```

***

# Custom Hook Example

```jsx
function useCounter(
  initialValue = 0
) {
  const [count, setCount] =
    React.useState(
      initialValue
    );

  const increment = () =>
    setCount(
      prev => prev + 1
    );

  return {
    count,
    increment
  };
}
```

Usage:

```jsx
const counter =
  useCounter();
```

Count starts at:

```javascript
0
```

***

# `undefined` vs `null`

### With `undefined`

```javascript
function greet(
  name = "Guest"
) {
  return name;
}

console.log(
  greet(undefined)
);
```

Output:

```javascript
Guest
```

***

### With `null`

```javascript
console.log(
  greet(null)
);
```

Output:

```javascript
null
```

Important:

```text
Default parameters apply ONLY to undefined.
```

***

# Interview Tricky Question

```javascript
function test(
  a = 10,
  b = a * 2
) {
  return [a, b];
}

console.log(test());
```

Output:

```javascript
[10, 20]
```

***

# Real Interview Example

```javascript
function fetchUsers(
  page = 1,
  pageSize = 10,
  sortBy = "name"
) {
  console.log(
    page,
    pageSize,
    sortBy
  );
}

fetchUsers();
```

Output:

```javascript
1 10 name
```

***

# Senior Interview Answer

Default parameters are an ES6 feature that allows function parameters to be initialised with default values when the argument is `undefined`.

```javascript
function greet(
  name = "Guest"
) {
  return name;
}
```

### Advantages

✅ Cleaner than `||`

✅ Works with destructuring

✅ Supports expressions and function calls

✅ Common in React components and custom hooks

✅ Prevents `undefined` errors

### Most Common Real-World Uses

* React props defaults
* Custom hooks
* API utility functions
* Configuration objects
* Pagination helpers
* Form initialisation functions


# 1. Default Parameters in React Hooks

## Custom Counter Hook

```jsx
import { useState } from "react";

function useCounter(
  initialValue = 0,
  step = 1
) {
  const [count, setCount] =
    useState(initialValue);

  const increment = () => {
    setCount(prev => prev + step);
  };

  const decrement = () => {
    setCount(prev => prev - step);
  };

  return {
    count,
    increment,
    decrement
  };
}

function App() {
  const counter =
    useCounter();

  return (
    <>
      <h2>
        Count: {counter.count}
      </h2>

      <button
        onClick={
          counter.increment
        }
      >
        +
      </button>
    </>
  );
}
```

### Behaviour

```javascript
useCounter();
```

Uses:

```javascript
initialValue = 0
step = 1
```

***

## Custom Hook with Options Object

Very common in enterprise React apps.

```jsx
function usePagination({
  pageSize = 10,
  initialPage = 1
} = {}) {
  const [page, setPage] =
    useState(initialPage);

  return {
    page,
    pageSize,
    nextPage() {
      setPage(p => p + 1);
    }
  };
}
```

Usage:

```javascript
usePagination();

usePagination({
  pageSize: 25
});
```

***

# 2. React Props Defaults

## Component Props

```jsx
function Button({
  text = "Submit",
  variant = "primary",
  disabled = false
}) {
  return (
    <button
      disabled={disabled}
    >
      {text}
    </button>
  );
}
```

Usage:

```jsx
<Button />
```

Output:

```text
Submit
```

***

# 3. API Utility Functions

Very common interview question.

## API Request Helper

```javascript
async function fetchUsers(
  page = 1,
  limit = 10,
  sortBy = "name"
) {
  const response =
    await fetch(
      `/api/users?page=${page}&limit=${limit}&sortBy=${sortBy}`
    );

  return response.json();
}
```

Usage:

```javascript
fetchUsers();
```

Becomes:

```javascript
fetchUsers(
  1,
  10,
  "name"
);
```

***

## Configuration Object Pattern

Preferred in React apps.

```javascript
async function fetchProducts({
  page = 1,
  pageSize = 20,
  search = "",
  sort = "name"
} = {}) {
  console.log(
    page,
    pageSize,
    search,
    sort
  );
}
```

Usage:

```javascript
fetchProducts({
  search: "react"
});
```

Output:

```javascript
1 20 react name
```

***

# 4. undefined vs null

The most common interview trick question.

***

## undefined Triggers Default

```javascript
function greet(
  name = "Guest"
) {
  return name;
}

console.log(
  greet(undefined)
);
```

Output:

```javascript
Guest
```

Because:

```javascript
undefined
```

activates the default value.

***

## null Does NOT Trigger Default

```javascript
console.log(
  greet(null)
);
```

Output:

```javascript
null
```

Because:

```javascript
null !== undefined
```

***

## Example

```javascript
function test(
  value = 100
) {
  console.log(value);
}

test();
```

Output:

```javascript
100
```

***

```javascript
test(undefined);
```

Output:

```javascript
100
```

***

```javascript
test(null);
```

Output:

```javascript
null
```

***

# 5. Tips for API Functions

## ✅ Prefer Configuration Objects

Instead of:

```javascript
fetchUsers(
  1,
  20,
  "react",
  "name",
  true
);
```

Use:

```javascript
fetchUsers({
  page: 1,
  pageSize: 20,
  search: "react"
});
```

***

## ✅ Default Empty Object

Avoid:

```javascript
function fetchUsers({
  page = 1
}) {}
```

This crashes:

```javascript
fetchUsers();
```

Error:

```javascript
Cannot destructure
undefined
```

***

### Correct

```javascript
function fetchUsers({
  page = 1
} = {}) {}
```

***

## ✅ Keep Defaults Close to API

```javascript
function getStudents({
  page = 1,
  pageSize = 20,
  active = true
} = {}) {}
```

Makes behaviour predictable.

***

## ✅ Avoid Mutable Defaults

❌

```javascript
function addUser(
  users = []
) {
  users.push("Sudhir");
}
```

Safer:

```javascript
function addUser(
  users = []
) {
  return [
    ...users,
    "Sudhir"
  ];
}
```

***

## ✅ Use Meaningful Defaults

Bad:

```javascript
pageSize = 9999
```

Good:

```javascript
pageSize = 20
```

***

# Interview Questions

## Q1

```javascript
function test(
  x = 10
) {
  return x;
}

console.log(
  test(null)
);
```

Output:

```javascript
null
```

***

## Q2

```javascript
function test(
  x = 10
) {
  return x;
}

console.log(
  test(undefined)
);
```

Output:

```javascript
10
```

***

## Q3

```javascript
function fetchData({
  page = 1
} = {}) {
  console.log(page);
}

fetchData();
```

Output:

```javascript
1
```

***

# Senior React Interview Answer

Default parameters are most useful in:

* React component props
* Custom hooks
* API utility functions
* Pagination helpers
* Configuration objects
* Form initialisation functions

The key rule is:

```text
Default values are used only when the argument is undefined.
null does NOT trigger the default.
```

For production React applications, prefer:

```javascript
function apiCall({
  page = 1,
  pageSize = 20,
  sort = "name"
} = {}) {}
```

because it makes APIs self-documenting, scalable, and easy to extend without breaking existing callers.


# Common Mistakes with `undefined` vs `null` in Default Parameters

This is a **very common JavaScript interview topic**.

## Key Rule

Default parameters are applied **only when the value is `undefined`**.

```javascript
function greet(name = "Guest") {
  return name;
}
```

***

# Mistake 1: Expecting `null` to Use Default Value

## ❌ Wrong Assumption

```javascript
function greet(name = "Guest") {
  return name;
}

console.log(greet(null));
```

Output:

```javascript
null
```

Many developers expect:

```javascript
"Guest"
```

But default parameters only work for:

```javascript
undefined
```

***

## ✅ Actual Behaviour

```javascript
console.log(greet(undefined));
```

Output:

```javascript
Guest
```

***

# Mistake 2: API Response Returns `null`

Imagine:

```javascript
const response = {
  theme: null
};

function setup(theme = "dark") {
  console.log(theme);
}

setup(response.theme);
```

Output:

```javascript
null
```

Not:

```javascript
dark
```

***

## ✅ Fix with Nullish Coalescing

```javascript
function setup(theme) {
  const finalTheme =
    theme ?? "dark";

  console.log(finalTheme);
}
```

Now:

```javascript
setup(null);
```

Output:

```javascript
dark
```

***

# Mistake 3: React Props

```jsx
function Button({
  text = "Submit"
}) {
  return <button>{text}</button>;
}
```

### Works

```jsx
<Button />
```

Output:

```text
Submit
```

***

### Works

```jsx
<Button text={undefined} />
```

Output:

```text
Submit
```

***

### Problem

```jsx
<Button text={null} />
```

Output:

```text
(empty)
```

Because:

```javascript
null
```

does not trigger the default.

***

## Fix

```jsx
function Button({
  text
}) {
  return (
    <button>
      {text ?? "Submit"}
    </button>
  );
}
```

***

# Mistake 4: Destructuring Without Default Object

## ❌ Crash

```javascript
function fetchUsers({
  page = 1
}) {
  console.log(page);
}

fetchUsers();
```

Output:

```javascript
TypeError
```

***

## ✅ Correct

```javascript
function fetchUsers({
  page = 1
} = {}) {
  console.log(page);
}

fetchUsers();
```

Output:

```javascript
1
```

***

# Mistake 5: Using `||` Instead of Defaults

### Old Pattern

```javascript
function getValue(value) {
  return value || 100;
}
```

***

### Problem

```javascript
getValue(0);
```

Output:

```javascript
100
```

Wrong because `0` is valid.

***

## ✅ Better

```javascript
function getValue(
  value = 100
) {
  return value;
}
```

or

```javascript
function getValue(value) {
  return value ?? 100;
}
```

***

# Compare `||` vs `??`

| Value     | value \|\| "default" | value ?? "default" |
| --------- | -------------------- | ------------------ |
| undefined | default              | default            |
| null      | default              | default            |
| ""        | default              | ""                 |
| 0         | default              | 0                  |
| false     | default              | false              |

***

# React Hook Example

```jsx
function usePagination({
  page = 1,
  pageSize = 20
} = {}) {
  return {
    page,
    pageSize
  };
}
```

### Good

```javascript
usePagination();
```

Output:

```javascript
{
  page: 1,
  pageSize: 20
}
```

***

### Problem

```javascript
usePagination({
  page: null
});
```

Output:

```javascript
{
  page: null
}
```

Default is ignored.

***

## Fix

```javascript
function usePagination({
  page,
  pageSize
} = {}) {
  return {
    page: page ?? 1,
    pageSize:
      pageSize ?? 20
  };
}
```

***

# Interview Questions

### Q1

```javascript
function test(x = 10) {
  return x;
}

console.log(test(undefined));
```

Output:

```javascript
10
```

***

### Q2

```javascript
console.log(test(null));
```

Output:

```javascript
null
```

***

### Q3

```javascript
console.log(test(0));
```

Output:

```javascript
0
```

***

# Senior Interview Answer

> A common mistake is assuming that `null` triggers default parameters. In JavaScript, default parameters are only applied when an argument is `undefined`. If you need both `null` and `undefined` to fall back to a default value, use the nullish coalescing operator (`??`).

```javascript
const value =
  userInput ?? "default";
```

Use:

```javascript
=
```

for parameter defaults.

Use:

```javascript
??
```

when handling values that may be either `null` or `undefined`.

This distinction is especially important in React props, hooks, API responses, and configuration objects.
