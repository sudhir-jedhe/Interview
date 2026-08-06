The `setTimeout` function expects a callback function as the first argument, not a string. If you pass a string, JavaScript will evaluate that string as code, which is similar to using `eval()` internally.

### Example with a callback function

```js
setTimeout(() => {
  console.log("Sudhir");
}, 100);
```

### Example with a string (similar to `eval()` behavior)

```js
const str = `let n1 = 2; let n2 = 2; console.log(n1 + n2);`;
setTimeout(str, 1000);
```

### Explanation

1. **Callback Function (Proper Way):**

   ```js
   setTimeout(() => {
     console.log("Sudhir");
   }, 100);
   ```

   This is the recommended way to pass a callback function. The function inside `setTimeout` will be executed after the specified delay (100 milliseconds in this case).

2. **Passing a String (Legacy Behavior):**

   ```js
   const str = `let n1 = 2; let n2 = 2; console.log(n1 + n2);`;
   setTimeout(str, 1000);
   ```

   In this case, you're passing a string. JavaScript will evaluate the string as code using `eval()` internally. So, after 1000 milliseconds, the string will be executed as JavaScript code, which results in `let n1 = 2; let n2 = 2; console.log(n1 + n2)` being executed, and the result is `4` printed in the console.

### Important Points

- **Using a string as a callback** in `setTimeout` is a **legacy feature** and generally not recommended because it relies on `eval()` behind the scenes, which can have security and performance concerns.
- **Arrow functions or regular functions** are the preferred way to handle delayed operations, as they are more readable and safer.
- **`eval()`** can execute arbitrary code, which can open your application to potential vulnerabilities, especially when the string is coming from an untrusted source.

### Best Practice (Avoid String)

Instead of passing a string, you should always use a function as the callback:

```js
const str = `let n1 = 2; let n2 = 2; console.log(n1 + n2);`;
setTimeout(() => {
  eval(str); // Use eval() here explicitly if needed
}, 1000);
```

In this corrected version, `eval()` is used explicitly inside the arrow function, making it clear that the string will be executed as code after the timeout.
