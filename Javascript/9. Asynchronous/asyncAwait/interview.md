### 28. Explain how `async` and `await` work in JavaScript

**`async`** makes a function return a promise, and **`await`** pauses the execution of the function until the promise resolves.

Example:

```javascript
async function fetchData() {
  let response = await fetch("url");
  let data = await response.json();
  console.log(data);
}
