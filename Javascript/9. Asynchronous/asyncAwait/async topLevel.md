In JavaScript, **top-level `await`** is supported in **ES Modules** (`.mjs` files or modules in browsers). It allows you to use `await` directly at the top level, without needing to wrap it inside an `async` function. This was introduced with **ES2022** (ECMAScript 2022), and it provides a cleaner way to write asynchronous code in modules.

### Example with top-level `await`:

```js
// module.js (or .mjs file)
console.log(await "Sudhir"); // "Sudhir"
```

In this example, `"Sudhir"` is a string, so `await` won't have much impact here since strings are not promises. However, if you were to await a promise, the behavior would be more obvious.

### Example with a promise:

```js
// module.js (or .mjs file)
const data = await fetch("https://jsonplaceholder.typicode.com/posts/1");
const jsonData = await data.json();
console.log(jsonData);
```

### Key Points:

1. **Top-level `await` in modules**: This works only in **modules** (either in `.mjs` files or by specifying `"type": "module"` in the `package.json` when using `.js` files). You **cannot** use top-level `await` in a regular script (e.g., in a `<script>` tag or non-module JavaScript).

2. **In browsers**: To use top-level `await` in browsers, make sure you use a `<script type="module">` tag:
   ```html
   <script type="module">
     console.log(await "Sudhir"); // Works in modules
   </script>
   ```

3. **In Node.js**: If you use Node.js with the `"type": "module"` field in `package.json` or use `.mjs` extensions, top-level `await` will work out of the box.

4. **Top-level code is **sequential**: The JavaScript engine will pause execution until the `await` is resolved (similar to how `await` works inside an `async` function).

### Example with `await` and Promise:

```js
// file.js (module)
const fetchData = () => new Promise(resolve => setTimeout(() => resolve("Data fetched!"), 2000));

console.log(await fetchData());  // "Data fetched!" after 2 seconds
```

In this case:
- **Top-level `await`** makes it easy to call `fetchData` without having to wrap it inside an `async` function.
- The execution will **pause** until the promise resolves.

### What to keep in mind:
- **Compatibility**: Make sure your environment (browser or Node.js) supports top-level `await`.
- **Modules only**: Top-level `await` works only in **ES Modules**. If you're using a regular script or older JavaScript files, you'll need to wrap your code inside an `async` function.

---

### Final Example with Async Fetch:
```js
// module.js (or .mjs)
const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
const post = await response.json();
console.log(post);
```

- In the example above, the code fetches data from an API using `fetch` and awaits the resolution of the promise. The results are then logged to the console.


In JavaScript, **top-level `await`** works even with non-promise values, but it doesn't really have any effect on such values. 

When you use `await` with **non-promise values** (like strings, numbers, objects, etc.), the value is immediately returned **without any delay** because `await` is designed to work with Promises. In these cases, `await` simply returns the value synchronously.

### Example with non-promise value:

```js
// module.js (or .mjs file)
console.log(await "Sudhir");  // Logs "Sudhir"
```

Here, `"Sudhir"` is a string, which is not a promise. When `await` is used, it essentially does nothing except immediately resolve the value. So the result is simply logging `"Sudhir"` to the console.

### Key Points:
1. **`await` on non-promise values**: If you `await` a non-promise value, JavaScript immediately returns that value, because `await` resolves the value synchronously. This doesn't cause any delay or asynchronous behavior.
  
2. **Promise behavior**: When you `await` a promise, JavaScript will pause the execution of the function (or top-level code in a module) until the promise resolves or rejects.

### Example with non-promise values:

```js
// module.js (or .mjs file)
console.log(await 10);  // Logs 10
console.log(await "Hello, World!");  // Logs "Hello, World!"
```

### Example with `await` and Promise:

```js
// module.js (or .mjs file)
const fetchData = () => new Promise(resolve => setTimeout(() => resolve("Data fetched!"), 2000));

console.log(await fetchData());  // Logs "Data fetched!" after 2 seconds
```

### Top-Level Await with Non-Promise Values:

When using top-level `await`, you can use it with any value, whether it’s a promise or a non-promise value, and it will behave like the following:

- **Non-promise value**: Resolves immediately.
- **Promise value**: Waits for resolution or rejection of the promise.

### In summary:

```js
// Example: Top-level await with a non-promise value
const result = await "Sudhir";
console.log(result);  // Output: "Sudhir"
```

Even though `await` is typically used for promises, it is allowed with non-promise values, but it doesn't have any asynchronous effect. It simply returns the value immediately.