Both of the examples you've provided are great demonstrations of how to implement delays in JavaScript using `setTimeout` and `Promise`. Let's break them down:

---

### 1. **`delay` function using `setTimeout`:**

The `delay` function allows you to run a function (`fn`) after a specified delay (`ms`) and pass any arguments to it.

```javascript
const delay = (fn, ms, ...args) => setTimeout(fn, ms, ...args);

const greet = (name) => console.log(`Hello ${name}!`);

delay(greet, 300, 'world');
// Logs: Hello world! (after 300ms)
```

- **Explanation:**
  - `delay(greet, 300, 'world')` calls the `greet` function after a delay of 300ms, passing `'world'` as an argument.
  - The `setTimeout` method is used to delay the execution of `greet` by 300ms, and the `...args` syntax ensures that any number of arguments can be passed to the function.

- **Why it works:**
  - `setTimeout(fn, ms, ...args)` works by calling `fn` after a delay of `ms` milliseconds, passing any provided arguments (`...args`) to the function when it is executed.

---

### 2. **`sleep` function using `Promise` and `async/await`:**

This example uses a `sleep` function, which returns a promise that resolves after the specified delay. You can then use `await` to delay the execution of code within an `async` function.

```javascript
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const greet = async () => {
  console.log('I will be with you in just a moment.');
  await sleep(300);
  console.log('Hello there!');
};

greet();
// Logs: I will be with you in just a moment.
// Logs: Hello there! (after 300ms)
```

- **Explanation:**
  - `sleep(ms)` creates a `Promise` that resolves after the specified delay (`ms`) using `setTimeout`.
  - `await sleep(300)` pauses the execution of the `greet` function for 300ms before logging `'Hello there!'`.
  - `await` ensures that the `sleep` promise is resolved before continuing with the next line of code.

- **Why it works:**
  - `setTimeout(resolve, ms)` ensures that the promise resolves after `ms` milliseconds, allowing you to use `await` to pause execution.
  - Using `async/await` makes the code more readable and avoids callback hell, as opposed to using nested callbacks like `setTimeout`.

---

### Summary:

1. **`delay` function**: This is great for executing a function after a delay using `setTimeout`. It's flexible as you can pass arguments to the function.
   
2. **`sleep` function**: This is ideal for using `async/await` to pause execution of asynchronous code for a set amount of time. It's particularly useful in `async` functions to make the flow more synchronous and easy to follow.

Both of these patterns are useful in different contexts, and understanding them helps in writing cleaner, asynchronous code in JavaScript.