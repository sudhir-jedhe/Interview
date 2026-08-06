Let's break down your code and the situation you're describing. You have two functions with the same name `fetchData` but different implementations. The situation you're describing is also trying to `console.log(fetchData)` after defining these functions.

### Code Breakdown:

```js
async function fetchData() {}           // First definition of fetchData (empty async function)
async function fetchData() { return 1 } // Second definition of fetchData (async function that returns 1)
console.log(fetchData);                 // Log the function itself (not its result)
```

### Key Points:

1. **`async function` declaration**: 
   - `async` functions always return a **Promise**.
   - Even if you don't explicitly return anything, an `async` function returns a resolved Promise by default.

2. **Function Hoisting**: 
   - In JavaScript, function declarations are hoisted to the top of the scope.
   - If you define two functions with the same name in the same scope, the **last definition** will **overwrite** the previous ones.

### In your code:
- The first function `fetchData()` is declared as an `async` function, but it doesn't return anything, so it implicitly returns a `Promise.resolve()` (a resolved promise).
- The second function `fetchData()` is declared and returns `1`, which is wrapped in a `Promise` by the `async` nature of the function.

Since both functions are defined in the same scope with the same name, the second definition will **overwrite** the first one. This means that `fetchData` will point to the second function that returns `1`.

### What will `console.log(fetchData)` print?

- It will print the **function definition** itself, not the result of its execution.
- Specifically, it will log the latest definition of `fetchData` (the second one that returns `1`).

### Example Execution:

```js
async function fetchData() {}  // First definition, gets overwritten
async function fetchData() { return 1 }  // Second definition, overwrites the first one
console.log(fetchData);  // Logs the latest definition of fetchData
```

**Output:**

```js
[Function: fetchData]
```

### Explanation:
- `console.log(fetchData)` prints the **function definition** itself, not the return value (`1`).
- The second definition of `fetchData` is the one that's logged because function declarations are hoisted, and the second one overwrites the first.

### How to see the return value?

To **see the return value** (which is `1` in this case), you need to invoke the function and `await` its result (because it's an `async` function, and it returns a `Promise`):

```js
async function fetchData() { return 1; }

fetchData().then(result => {
  console.log(result);  // Logs 1
});
```

Or, if you are inside an `async` function:

```js
async function test() {
  const result = await fetchData();  // Wait for the promise to resolve
  console.log(result);  // Logs 1
}

test();
```

### Conclusion:

- `console.log(fetchData)` logs the **function definition**.
- To get the result of the function, you need to **invoke** the function (and use `await` if needed, since it's an `async` function).

Let's go through the code and break it down step-by-step to understand why you're seeing the output `Promise { <fulfilled>: undefined }` when calling `fetchData()`.

### Code:
```js
async function fetchData() {}  // First definition, gets overwritten
console.log(fetchData());  // Logs undefined
```

### Step-by-Step Explanation:

1. **First `async` function definition**:
   ```js
   async function fetchData() {}
   ```
   - This is an **async function** definition. It doesn't have a `return` statement, so when it's called, it implicitly returns a `Promise` that resolves to `undefined`.
   - **Why does this return `undefined`?** 
     - The function is asynchronous (`async`), so it always returns a `Promise`.
     - Since there is no explicit `return` statement in the function, the `Promise` will resolve to the default value, which is `undefined`.

2. **Calling `fetchData()`**:
   ```js
   console.log(fetchData());  // Logs undefined
   ```
   - Calling an `async` function always returns a `Promise`.
   - Since `fetchData()` doesn't have an explicit return statement, the `Promise` resolves to `undefined`. However, this `Promise` is still **pending** when logged.
   - When you log `fetchData()`, you're logging the `Promise` object itself, which is in the "pending" state because the function hasn’t finished executing yet.

3. **Why the `Promise { <fulfilled>: undefined }`?**
   - **Promise Resolution**: Even though the function has no `return` value, it **still returns a `Promise`** that eventually resolves to `undefined`.
   - **Fulfilled State**: The `Promise` will eventually **resolve** (fulfill), and it will resolve with the value `undefined`, since there’s no explicit return in the `async` function.
   - In the console, once the function is executed, the state of the `Promise` is reported as `fulfilled`, with the resolution value being `undefined`.

### Output:

```js
Promise { <fulfilled>: undefined }
```

### Why Not `undefined` Directly?

In your initial expectation, you were probably expecting `undefined` directly. However, the behavior of `async` functions is special:

- **Async functions always return a `Promise`**, even if there is no `return` value.
- **Since `console.log(fetchData())` logs the `Promise`**, and this `Promise` resolves with `undefined`, the console reports that the `Promise` is **fulfilled** with `undefined`.

### How to "unwrap" the value (get `undefined`):

If you want to actually log the **resolved value** of the `Promise` (which is `undefined`), you need to `await` the `Promise` in an asynchronous context.

Here’s how you can modify your code to log the resolved value:

#### Using `await` (inside an `async` function):

```js
async function fetchData() {}
console.log(await fetchData());  // Logs: undefined
```

- This will correctly log `undefined`, because you're `await`ing the `Promise` returned by the `async` function.

#### Without `await` (using `.then()`):

```js
async function fetchData() {}
fetchData().then(result => console.log(result));  // Logs: undefined
```

- The `.then()` approach allows you to wait for the `Promise` to resolve and then log the result.

### Conclusion:

When you call `fetchData()`, it returns a `Promise`, and since the function doesn't have a return value, that `Promise` resolves to `undefined`. The console shows this as `Promise { <fulfilled>: undefined }`. If you want to access the resolved value, you can use `await` or `.then()`.


Let's break down the behavior you're seeing with your `async` function:

### Code:
```js
async function fetchData() { return 1; } 
console.log(fetchData());  // Logs undefined
```

### Explanation:

1. **The `async` function `fetchData`**:
   ```js
   async function fetchData() { return 1; }
   ```
   - The `async` keyword marks the function as asynchronous, which means it will **always return a `Promise`**, regardless of what is inside the function.
   - Inside `fetchData()`, you're returning the value `1`.
   - **What happens when an `async` function returns a value?**
     - When an `async` function returns a value (e.g., `1`), JavaScript automatically wraps that value in a `Promise`.
     - In this case, `fetchData()` returns `1`, but it **implicitly returns a `Promise` that resolves to `1`**.
     - **So `fetchData()` returns a `Promise` that resolves to `1`.**

2. **The `console.log(fetchData());`**:
   ```js
   console.log(fetchData());  // Logs undefined
   ```
   - When you call `fetchData()`, you're logging the return value, which is **not `1` directly**, but a `Promise` that is pending.
   - Since `fetchData()` is an asynchronous function, it returns a `Promise` immediately when called, even though that `Promise` will eventually resolve to `1`. 
   - The `Promise` is **in a pending state** when you log it, so you see:
     ```js
     Promise { <pending> }
     ```
   
   - However, the state of the `Promise` changes when the asynchronous operation completes (in this case, it resolves to `1`), which results in the `Promise` being fulfilled with that value.

3. **The `Promise { <fulfilled>: 1 }`**:
   After the function is executed and the `Promise` is resolved, the actual value (`1`) will be the result of the `Promise`. 
   - **In the console**, once the `Promise` resolves, you will see the logged output like this:
     ```js
     Promise { <fulfilled>: 1 }
     ```
   - This indicates that the `Promise` is **fulfilled** and the result is `1`.

### Why does it log `Promise { <fulfilled>: 1 }`?

This is because `console.log(fetchData())` logs the `Promise` object itself. When the `Promise` is resolved (which happens asynchronously), it gets logged as a `Promise` with the value it resolved to (`1` in this case).

### What you expected (`1`) vs. the actual output (`Promise { <fulfilled>: 1 }`):

- **What happens when you log an async function?**:
  - When you call an `async` function, it returns a `Promise`.
  - This `Promise` is **in a pending state initially** and will resolve later with the returned value of the `async` function.
  - That's why you see `Promise { <fulfilled>: 1 }` when you log it: you are logging the `Promise`, not its resolved value.

### How to see the resolved value directly:

If you want to log the **resolved value** (which is `1`), you need to **wait** for the `Promise` to resolve. You can do this using either `await` or `.then()`.

#### Option 1: Using `await` inside an `async` function:

```js
async function fetchData() { return 1; }
(async () => {
  const result = await fetchData();
  console.log(result);  // Logs: 1
})();
```

#### Option 2: Using `.then()` to handle the resolved value:

```js
async function fetchData() { return 1; }
fetchData().then(result => console.log(result));  // Logs: 1
```

### Key Takeaways:

- **Async functions** always return a `Promise`, regardless of whether a value is explicitly returned.
- When you call an `async` function, the `Promise` is in a **pending** state at the time you log it.
- To log the resolved value (`1` in your case), you can either use `await` or `.then()`.

### Explanation:

In the code snippet you provided:

```js
function fetchData() {}  // First definition, gets overwritten
console.log(fetchData());  // Logs undefined
```

Here’s what's happening:

1. **Function Declaration (`function fetchData() {}`)**:
   - You declare a function `fetchData()` with no implementation (i.e., it doesn't return anything).
   - **Function declarations are hoisted** in JavaScript. This means that the entire function declaration (`fetchData()`) is moved to the top of the scope during the compilation phase, and you can call `fetchData()` before its definition in the code.

2. **Overwriting the function**:
   - In the second line of your code, you immediately redefine the `fetchData()` function, but since there is no new definition (you just define it as an empty function again), the function doesn't change anything in this case.
   - The function is overwritten, and after the second declaration, `fetchData()` remains an empty function.

3. **`console.log(fetchData())`**:
   - When you call `console.log(fetchData())`, you are invoking the function `fetchData()`.
   - Since the function is defined as `function fetchData() {}`, it doesn't have a `return` statement, so it returns `undefined` by default.
   - Hence, `console.log(fetchData())` will log `undefined` because the function `fetchData()` doesn't return anything.

### Example Breakdown:

```js
function fetchData() {}  // Declaration of fetchData (hoisted)
console.log(fetchData());  // Logs: undefined because fetchData() does not return anything

// Later in the code (no effect here, the function is already declared)
function fetchData() {}  // Function redefinition (same as the first)
```

### Key Concepts:

1. **Hoisting**:
   - **Function declarations** are hoisted in JavaScript. This means that they are moved to the top of their scope before the code is executed, so you can call them even before they are written in the code.
   - This is why `console.log(fetchData())` works even though `fetchData()` appears to be called before its definition.

2. **No Return Value**:
   - Since `fetchData()` does not have a `return` statement, it implicitly returns `undefined`.
   
### Final Answer:
- The output of `console.log(fetchData())` will be `undefined`, because `fetchData()` is an empty function that doesn't return anything.



In your code:

```javascript
async function getLion() {
  return "🦁"; // Returning the lion emoji
}

const lion = getLion();  
console.log(lion === "🦁");
```

### Issue:
The function `getLion()` is **asynchronous**, meaning it returns a `Promise`, not the value `"🦁"` directly. So, when you assign `const lion = getLion();`, the value of `lion` is actually a **Promise** that will resolve to `"🦁"`, not the string `"🦁"` itself.

### Why `lion === "🦁"` will be `false`:
Since `lion` is a `Promise` and `"🦁"` is a string, the comparison will always be `false` because a `Promise` and a string are not equal.

### Solution:
To get the value from the `Promise`, you need to either:
1. Use `await` inside an `async` function.
2. Use `.then()` to handle the resolved value.

Here are the two solutions:

### Solution 1: Using `await` inside an `async` function:

```javascript
async function getLion() {
  return "🦁"; // Returning the lion emoji
}

async function checkLion() {
  const lion = await getLion();  // Wait for the promise to resolve
  console.log(lion === "🦁");    // Now, it compares the resolved value
}

checkLion();  // Call the async function
```

### Explanation:
- `await getLion()` ensures that the resolved value of the promise (which is `"🦁"`) is assigned to `lion`, so you can compare it directly with the string `"🦁"`.
- The comparison `lion === "🦁"` will now log `true`.

### Solution 2: Using `.then()`:

```javascript
async function getLion() {
  return "🦁"; // Returning the lion emoji
}

getLion().then(lion => {
  console.log(lion === "🦁");  // Now, it compares the resolved value
});
```

### Explanation:
- `getLion()` returns a promise, and `.then()` is used to handle the resolved value (which is `"🦁"`).
- The comparison `lion === "🦁"` will now log `true` as expected.

### Output for both solutions:

```javascript
true
```

### Summary:
- Since `getLion()` is an async function, it returns a `Promise`, not a direct value.
- To access the resolved value of the promise, you must use `await` or `.then()`.
- Without this, the comparison will fail because you're comparing a `Promise` with a string.