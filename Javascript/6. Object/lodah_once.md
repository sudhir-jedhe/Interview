Here’s the **original code** with the explanation of the **customOnce** function:

### **Original Code:**

```javascript
function customOnce(func) {
    let hasBeenCalled = false;
    let result;

    return function(...args) {
        if (!hasBeenCalled) {
            hasBeenCalled = true;
            result = func.apply(this, args);
        }
        return result;
    };
}

// Usage
const myFunction = customOnce(function(x) {
    console.log('Function called with:', x);
    return x * 2;
});

console.log(myFunction(5)); // Logs: Function called with: 5
console.log(myFunction(10)); // Does not log anything
console.log(myFunction(15)); // Does not log anything
```

### **Explanation of the Code:**

1. **The `customOnce` Function:**
   - This function takes another function (`func`) as an argument and returns a new function that can be called only once.
   - **`hasBeenCalled`** is a flag that tracks whether the function has already been called. It starts as `false` (i.e., the function hasn't been called).
   - The `result` variable stores the result of the first invocation of `func`.

2. **Inside the Returned Function:**
   - It checks whether `hasBeenCalled` is `false` (meaning the function hasn't been invoked yet).
     - If it hasn’t been called, it sets `hasBeenCalled` to `true`, calls the original function (`func.apply(this, args)`), and stores the result.
     - If the function has already been called (i.e., `hasBeenCalled` is `true`), it returns the previously stored result without invoking the original function again.

3. **Usage Example:**
   - `myFunction` is created by calling `customOnce` with a function that logs its argument and returns `x * 2`.
   - On the first call (`myFunction(5)`), it logs `"Function called with: 5"`, and the result `10` is stored.
   - On the second and third calls (`myFunction(10)` and `myFunction(15)`), it does **not log anything** because the function is only executed once, and it returns the cached result (`10`).

### **How it Works:**

1. **First Call (`myFunction(5)`):**
   - `hasBeenCalled` is `false`, so the function is executed.
   - The log output: `"Function called with: 5"`.
   - The result `5 * 2 = 10` is stored in `result`.

2. **Second Call (`myFunction(10)`):**
   - `hasBeenCalled` is `true`, so the original function is not executed.
   - The stored result (`10`) is returned immediately without logging anything.

3. **Third Call (`myFunction(15)`):**
   - Similarly, `hasBeenCalled` is still `true`, so the original function is not executed.
   - The stored result (`10`) is returned again without logging anything.

### **Output:**
```javascript
Function called with: 5  // First call logs this
10                       // Returned result of first call
10                       // Returned result for the second and third calls (cached)
```

### **Key Points:**
- The function only executes once, and subsequent calls return the same cached result.
- `func.apply(this, args)` ensures the function is executed with the correct `this` context and arguments.
- The `hasBeenCalled` flag prevents the function from being executed more than once.

This pattern is useful when you want to run an expensive or important function (like an API call, initialization, or logging) only once and avoid redundant executions.