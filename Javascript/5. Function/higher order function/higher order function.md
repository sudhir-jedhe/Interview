Here's the explanation and implementation for understanding higher-order functions with examples in JavaScript:

### Higher-Order Functions
A **higher-order function** is a function that does at least one of the following:
1. Takes another function as an argument.
2. Returns a function as a result.

This is possible because functions in JavaScript are **first-class citizens**, meaning they can be treated like any other value (assigned to variables, passed as arguments, or returned from other functions).

---

### Example 1: Passing a Function as an Argument
Here’s an example using higher-order functions:

```javascript
const firstOrderFunc = () => console.log("Hello, I am a First order function");
const higherOrder = (callback) => callback(); // Takes a function as an argument
higherOrder(firstOrderFunc);
```

**Output:**
```
Hello, I am a First order function
```

In this example:
- `higherOrder` is a higher-order function because it takes `firstOrderFunc` as an argument and executes it.

---

### Example 2: Returning a Function from Another Function
Higher-order functions can also return other functions:

```javascript
const multiplier = (factor) => (num) => num * factor;

const double = multiplier(2); // Creates a function that doubles a number
const triple = multiplier(3); // Creates a function that triples a number

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

Here:
- `multiplier` is a higher-order function because it returns a function that multiplies a number by a given `factor`.

---

### Example 3: Using Higher-Order Functions with Arrays
JavaScript's array methods like `filter`, `map`, and `reduce` are examples of higher-order functions.

```javascript
const add = (a, b) => a + b;
const isEven = (num) => num % 2 === 0;

const data = [2, 3, 1, 5, 4, 6];

// Get even values
const evenValues = data.filter(isEven); // [2, 4, 6]

// Get the sum of even values
const evenSum = data.filter(isEven).reduce(add); // 12

console.log(evenValues); // [2, 4, 6]
console.log(evenSum); // 12
```

**Explanation:**
- `filter` takes `isEven` as a callback to filter the array.
- `reduce` takes `add` as a callback to accumulate the sum of even values.

---

### Benefits of Higher-Order Functions:
1. **Abstraction:** Hide implementation details and focus on what the function does.
2. **Reusability:** Functions like `add` or `isEven` can be reused in different contexts.
3. **Readability:** Clear separation of concerns enhances readability.
4. **Composition:** Create more complex behavior by combining small, reusable functions.

---

### Example 4: Composing Functions
Using higher-order functions for composition:

```javascript
const compose = (...fns) => (arg) => fns.reduce((acc, fn) => fn(acc), arg);

const increment = (num) => num + 1;
const square = (num) => num * num;

const incrementAndSquare = compose(increment, square);

console.log(incrementAndSquare(3)); // 16 -> (3 + 1)^2
```

**Explanation:**
- `compose` is a higher-order function that takes multiple functions and creates a new function that applies them in sequence.

---

Higher-order functions are foundational in functional programming and are used extensively in modern JavaScript development for their abstraction and reusability.


The React training material in your environment discusses currying, Redux middleware, and React-Redux's `connect()` API as examples of functions that receive and/or return other functions—core characteristics of **Higher-Order Functions (HOFs)**.

# 1. What is a Higher-Order Function (HOF)?

A **Higher-Order Function** is a function that:

```text
✅ Takes one or more functions as arguments
OR
✅ Returns a function
```

***

## Example 1: Function as Argument

```javascript
function greet(name) {
  return `Hello ${name}`;
}

function execute(fn, value) {
  return fn(value);
}

console.log(
  execute(greet, "Sudhir")
);
```

Output:

```text
Hello Sudhir
```

Here:

```javascript
execute()
```

is a Higher-Order Function.

***

## Example 2: Function Returning Function

```javascript
function multiplier(x) {

  return function(y) {
    return x * y;
  };
}

const double =
  multiplier(2);

console.log(
  double(10)
);
```

Output:

```text
20
```

This uses:

```text
Higher-Order Functions
+
Closures
```

***

# 2. Common JavaScript Higher-Order Functions

## map()

```javascript
const nums =
  [1, 2, 3];

const doubled =
  nums.map(
    num => num * 2
  );

console.log(doubled);
```

Output:

```javascript
[2, 4, 6]
```

***

## filter()

```javascript
const nums =
  [1, 2, 3, 4];

const even =
  nums.filter(
    num => num % 2 === 0
  );

console.log(even);
```

Output:

```javascript
[2, 4]
```

***

## reduce()

```javascript
const nums =
  [1, 2, 3, 4];

const sum =
  nums.reduce(
    (acc, num) =>
      acc + num,
    0
  );

console.log(sum);
```

Output:

```text
10
```

***

# 3. React Example Using First-Class Functions

Because JavaScript has **first-class functions**, functions can be passed around like variables.

### Parent Component

```jsx
function Parent() {

  const handleSave =
    data => {

      console.log(
        "Saved:",
        data
      );

    };

  return (
    <Child
      onSave={handleSave}
    />
  );
}
```

***

### Child Component

```jsx
function Child({
  onSave
}) {

  return (
    <button
      onClick={() =>
        onSave("React")
      }
    >
      Save
    </button>
  );
}
```

Here:

```javascript
handleSave
```

is:

```text
✅ Assigned to variable
✅ Passed as prop
✅ Executed later
```

This is possible because functions are first-class citizens.

***

# 4. React Example: HOF Event Handler

```jsx
function App() {

  const createClickHandler =
    id =>
      () => {

        console.log(
          "Clicked:",
          id
        );

      };

  return (
    <button
      onClick={
        createClickHandler(
          101
        )
      }
    >
      Edit
    </button>
  );
}
```

Output:

```text
Clicked: 101
```

Here:

```javascript
createClickHandler()
```

returns another function.

***

# 5. Real React Examples

## React.memo

```jsx
const UserCard =
  React.memo(
    function UserCard({
      user
    }) {
      return (
        <div>
          {user.name}
        </div>
      );
    }
  );
```

`React.memo()` is a Higher-Order Function because it takes a component and returns an enhanced component.

***

## Redux Middleware

The training material contains a middleware example:

```javascript
const myLogger =
  store =>
    next =>
      action => {

        console.log(action);

        next(action);
      };
```

This is a classic Higher-Order Function and currying pattern.

***

# 6. First-Class Functions vs Higher-Order Functions

## First-Class Function

Functions can be treated like values.

```javascript
const fn = () => {};
```

***

## Higher-Order Function

A function that uses functions as arguments or return values.

```javascript
function execute(fn) {
  fn();
}
```

***

# Common Interview Questions

### Q1. What are First-Class Functions?

**Answer:**

Functions can be:

```text
✅ Assigned to variables
✅ Passed as arguments
✅ Returned from functions
✅ Stored in arrays/objects
```

***

### Q2. What is a Higher-Order Function?

**Answer:**

A function that:

```text
Receives a function
OR
Returns a function
```

***

### Q3. Are `map()`, `filter()`, and `reduce()` Higher-Order Functions?

✅ Yes

Because they accept callback functions.

***

### Q4. Why are First-Class Functions Important?

They enable:

```text
✅ Callbacks
✅ Closures
✅ Currying
✅ Event Handlers
✅ Promises
✅ Functional Programming
✅ React Component Patterns
```

***

### Q5. Is `React.memo()` a Higher-Order Function?

✅ Yes

It takes a component and returns an optimised component.

***

# Senior React Interview Answer

> JavaScript supports first-class functions, meaning functions can be treated like any other value—they can be assigned, passed, returned, and stored. Higher-order functions build upon this capability by accepting functions as parameters or returning functions. Common examples include `map`, `filter`, `reduce`, React event handlers, `React.memo`, currying, Redux middleware, and custom hooks. These concepts form the foundation of modern React and functional programming patterns.


## Higher-Order Functions (HOF) in React

A **Higher-Order Function** is a function that:

```text
✅ Accepts a function as an argument
✅ Returns a function
✅ Or both
```

Examples in JavaScript:

```javascript
map()
filter()
reduce()
forEach()
setTimeout()
```

***

# React Example 1: Event Handler HOF

Very common interview question.

```jsx
function UserList() {

  const handleClick =
    (id) =>
      () => {

        console.log(
          "User Id:",
          id
        );

      };

  return (
    <>
      <button onClick={handleClick(101)}>
        Edit User 101
      </button>

      <button onClick={handleClick(102)}>
        Edit User 102
      </button>
    </>
  );
}
```

### Output

```text
Edit User 101
→ User Id: 101

Edit User 102
→ User Id: 102
```

Here:

```javascript
handleClick(id)
```

returns another function.

Therefore:

```text
Higher-Order Function ✅
```

***

# React Example 2: Authentication HOF

```jsx
const withAuth =
  (Component) => {

    return function(props) {

      const isAuthenticated =
        true;

      if (!isAuthenticated) {

        return (
          <h2>
            Access Denied
          </h2>
        );
      }

      return (
        <Component
          {...props}
        />
      );
    };
  };
```

Usage:

```jsx
function Dashboard() {
  return <h1>Dashboard</h1>;
}

const SecureDashboard =
  withAuth(Dashboard);
```

This is a classic HOF pattern.

***

# React Example 3: Logging Wrapper

```jsx
function withLogger(fn) {

  return (...args) => {

    console.log(
      "Arguments:",
      args
    );

    return fn(...args);
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd =
  withLogger(add);

console.log(
  loggedAdd(10, 20)
);
```

Output:

```text
Arguments: [10,20]
30
```

***

# React Example 4: Array Methods

### map()

```jsx
const users = [
  "Sudhir",
  "John",
  "Apoorva"
];

function App() {

  return (
    <ul>
      {users.map(user => (
        <li key={user}>
          {user}
        </li>
      ))}
    </ul>
  );
}
```

Because:

```javascript
map()
```

accepts a function.

It is a Higher-Order Function.

***

# Most Asked Higher-Order Function Interview Questions

### 1. What is a Higher-Order Function?

**Answer**

A function that accepts another function as an argument or returns a function.

***

### 2. Difference Between First-Class Function and Higher-Order Function?

#### First-Class Function

Functions can:

```text
Store
Pass
Return
```

like normal values.

```javascript
const fn = () => {};
```

***

#### Higher-Order Function

```javascript
function execute(fn) {
  fn();
}
```

Uses functions as input/output.

***

### 3. Is `map()` a Higher-Order Function?

✅ Yes

```javascript
arr.map(item => item * 2);
```

Because it accepts a callback function.

***

### 4. Is `filter()` a Higher-Order Function?

✅ Yes

```javascript
arr.filter(
  item => item.age > 18
);
```

***

### 5. Is `reduce()` a Higher-Order Function?

✅ Yes

```javascript
arr.reduce(
  (acc, item) =>
    acc + item,
  0
);
```

***

### 6. Give Real React Examples of HOF

```text
React.memo()

Event Handlers

Custom Hooks

Redux Middleware

Array Methods

Authentication Wrappers
```

***

### 7. What is a Higher-Order Component (HOC)?

```jsx
const Enhanced =
  withAuth(Component);
```

A function that:

```text
Accepts Component
Returns New Component
```

***

### 8. Why Are HOFs Important?

They enable:

```text
✅ Code Reuse

✅ Composition

✅ Currying

✅ Closures

✅ Functional Programming

✅ React Optimisations
```

***

### 9. Is `setTimeout()` a Higher-Order Function?

✅ Yes

```javascript
setTimeout(
  () => console.log("Hi"),
  1000
);
```

It accepts a callback.

***

### 10. Implement a Custom map()

```javascript
Array.prototype.customMap =
  function(callback) {

    const result = [];

    for (
      let i = 0;
      i < this.length;
      i++
    ) {

      result.push(
        callback(
          this[i],
          i,
          this
        )
      );
    }

    return result;
  };
```

***

# Senior React Interview Answer

> Higher-Order Functions are functions that either accept other functions as arguments or return functions. JavaScript's first-class function support makes HOFs possible. Common examples include `map`, `filter`, `reduce`, `setTimeout`, currying functions, React event handlers, `React.memo`, custom hooks, and higher-order components. HOFs are widely used in React because they promote code reuse, composition, and cleaner application architecture.
