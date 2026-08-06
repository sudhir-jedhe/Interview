### Callback Functions in JavaScript

A **callback function** is a function passed as an argument to another function, and it is typically invoked within the outer function to complete an action. Callbacks are fundamental in JavaScript, particularly when working with asynchronous operations like I/O tasks, API calls, and timers.

---

### Simple Example of Callback Function

```javascript
function callbackFunction(name) {
  console.log("Hello " + name);
}

function outerFunction(callback) {
  let name = prompt("Please enter your name.");
  callback(name);
}

outerFunction(callbackFunction);
```

- **Explanation**:  
  - `callbackFunction(name)` is passed as an argument to `outerFunction`.
  - Inside `outerFunction`, the callback is invoked with the `name` entered by the user.

---

### Why Do We Need Callbacks?

In JavaScript, **callbacks** are used to manage asynchronous behavior. JavaScript is event-driven and non-blocking, which means it can continue executing while waiting for other tasks (like API responses, timers, or user inputs) to complete.

**Example**: Simulating an API call with `setTimeout`.

```javascript
function firstFunction() {
  setTimeout(function () {
    console.log("First function called");
  }, 1000);
}

function secondFunction() {
  console.log("Second function called");
}

firstFunction(); // Call first function
secondFunction(); // Call second function
```

**Output**:
```
Second function called
First function called
```

- **Explanation**:  
  - The `firstFunction` does not block the execution of the second function because it is asynchronous (handled by `setTimeout`).
  - JavaScript continues executing `secondFunction` immediately after calling `firstFunction` without waiting for the `setTimeout` to finish.

---

### Callback Hell (Pyramid of Doom)

When you have multiple callbacks nested within each other, the code becomes difficult to read, maintain, and debug. This is known as **Callback Hell**.

**Example** of Callback Hell:

```javascript
async1(function () {
  async2(function () {
    async3(function () {
      async4(function () {
        console.log("Task completed");
      });
    });
  });
});
```

- **Explanation**:  
  - This kind of nested structure quickly becomes hard to maintain, especially when you have many asynchronous operations.
  - In this case, each asynchronous function calls another function, leading to a pyramid-like structure, which makes the code difficult to follow.

---

### Callback in Callback

Sometimes, you might need to execute actions in sequence, which means calling one callback inside another. This is common when dealing with multiple asynchronous tasks that depend on each other.

**Example**: Loading scripts sequentially with nested callbacks.

```javascript
loadScript("/script1.js", function (script) {
  console.log("First script is loaded");

  loadScript("/script2.js", function (script) {
    console.log("Second script is loaded");

    loadScript("/script3.js", function (script) {
      console.log("Third script is loaded");
      // After all scripts are loaded
    });
  });
});
```

- **Explanation**:  
  - Here, each script is loaded sequentially, one after the other.
  - The next script is loaded only after the previous one has finished, making sure each script executes in order.

---

### Solutions to Callback Hell

- **Promises**: Promises provide a cleaner, more readable way to handle asynchronous tasks.
- **Async/Await**: The `async`/`await` syntax makes asynchronous code look synchronous, which improves readability and reduces nested callbacks.

By understanding and using callbacks effectively, you can handle asynchronous operations in JavaScript. However, for more complex asynchronous workflows, consider using **Promises** or **Async/Await** to avoid callback hell.



A **callback function** is a function that is passed as an argument to another function and is executed later when a specific task is completed.

This is one of the most common JavaScript interview topics and appears in the interview preparation material found in your environment alongside promises, async/await, callback hell, and higher-order functions.

# Basic Example

```javascript
function greet(name) {
  console.log(`Hello ${name}`);
}

function processUser(callback) {
  const name = "Sudhir";

  callback(name);
}

processUser(greet);
```

Output:

```text
Hello Sudhir
```

Here:

```javascript
greet
```

is the callback function.

***

# Anonymous Callback

```javascript
function processUser(callback) {
  callback("Sudhir");
}

processUser(function(name) {
  console.log(name);
});
```

Output:

```text
Sudhir
```

***

# Arrow Function Callback

```javascript
function processUser(callback) {
  callback("Sudhir");
}

processUser(
  name => console.log(name)
);
```

Output:

```text
Sudhir
```

***

# Callback with Array Methods

## `forEach()`

```javascript
const nums = [1, 2, 3];

nums.forEach(num => {
  console.log(num);
});
```

Output:

```text
1
2
3
```

The function passed to `forEach()` is a callback.

***

## `map()`

```javascript
const nums = [1, 2, 3];

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

# Asynchronous Callback

Callbacks are commonly used when a task finishes later.

```javascript
console.log("Start");

setTimeout(() => {
  console.log("API Response");
}, 2000);

console.log("End");
```

Output:

```text
Start
End
API Response
```

The function passed to:

```javascript
setTimeout()
```

is a callback.

***

# Real API Style Example

```javascript
function fetchData(callback) {

  setTimeout(() => {

    const data = {
      id: 1,
      name: "Sudhir"
    };

    callback(data);

  }, 1000);
}

fetchData(user => {
  console.log(user);
});
```

Output:

```javascript
{
  id: 1,
  name: "Sudhir"
}
```

***

# Callback Hell

When callbacks become deeply nested.

```javascript
getUser(user => {

  getOrders(user.id, orders => {

    getPayment(
      orders[0].id,
      payment => {

        console.log(payment);

      }
    );

  });

});
```

Problem:

```text
❌ Difficult to read
❌ Difficult to maintain
❌ Error handling becomes complex
```

This is known as:

```text
Callback Hell
Pyramid of Doom
```

and is one reason Promises and async/await became popular.

***

# Modern Alternative: Promise

### Callback

```javascript
fetchUser(callback);
```

### Promise

```javascript
fetchUser()
  .then(user => {
    console.log(user);
  });
```

***

# Modern Alternative: Async/Await

```javascript
async function loadUser() {

  const user =
    await fetchUser();

  console.log(user);
}
```

***

# Callback vs Higher-Order Function

```javascript
function calculate(
  a,
  b,
  operation
) {

  return operation(a, b);
}
```

Callback:

```javascript
const add =
  (a, b) => a + b;

calculate(10, 20, add);
```

Output:

```text
30
```

***

# React Example

```jsx
function Child({
  onClick
}) {

  return (
    <button
      onClick={onClick}
    >
      Click
    </button>
  );
}

function Parent() {

  const handleClick =
    () => {
      console.log(
        "Clicked"
      );
    };

  return (
    <Child
      onClick={
        handleClick
      }
    />
  );
}
```

`handleClick` is passed as a callback prop.

***

# Interview Answer

```text
A callback function is a function passed as an argument to another function and executed later. Callbacks are commonly used for event handling, asynchronous programming, array methods (map, filter, forEach), and React event handlers. Excessive nested callbacks can lead to callback hell, which is typically solved using Promises and async/await.
```

### One-Line Definition

```javascript
function execute(callback) {
  callback();
}
```

Here, `callback` is simply a function that another function executes later.
