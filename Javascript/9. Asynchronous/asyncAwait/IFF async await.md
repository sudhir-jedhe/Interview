### Explanation:

The code you provided uses an **Immediately Invoked Function Expression (IIFE)** with `async/await`. Let's break down the behavior step by step.

### Code:

```js
(async function() {
    const data = await 1;
    console.log(data);
})();

console.log(2);
```

### Steps:

1. **Immediately Invoked Function Expression (IIFE)**:
   - `(async function() { ... })()` is a self-executing function.
   - The `async` keyword makes this function asynchronous, meaning it returns a **Promise** and allows you to use `await` inside it.
   
2. **Inside the async function**:
   - `const data = await 1;` is where `await` is used.
     - `await` pauses the execution of the async function until the **promise is resolved**.
     - In this case, `1` is a **non-Promise value**. Since `await` works with promises, it **wraps `1` into a resolved Promise** with the value `1`. So, `data` will be assigned the value `1`.
     - This doesn't make the code synchronous — it just resolves the `1` as if it was a promise (like `Promise.resolve(1)`).
   
3. **Logging the result**:
   - `console.log(data);` will log the value of `data` (which is `1`), but only **after** the `await` resolves, i.e., after the async function completes.
   
4. **Outside the async function**:
   - `console.log(2);` will be executed immediately **after the IIFE is invoked**, even though the `await` inside the IIFE hasn't completed yet.
   - JavaScript handles asynchronous code using the **event loop**, so the `console.log(2)` runs first, as it’s synchronous.

### Output:

```
2
1
```

### Reasoning Behind the Output:

1. **`console.log(2)`** executes first because it’s synchronous. The `console.log(2)` is executed before the async function completes.
   
2. The **async function** executes asynchronously, meaning the **promise** created by `await` is processed in the event loop, and **`console.log(data)`** logs `1` after the asynchronous work is done.

### Summary:
- **Synchronous** code (`console.log(2)`) executes first.
- The **asynchronous function** logs `1` after the `await` resolves.
