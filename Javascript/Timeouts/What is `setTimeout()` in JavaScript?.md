### 2. What is `setTimeout()` in JavaScript?

`setTimeout()` is a function that executes a specified function or code block after a delay in milliseconds.

Syntax:

```javascript
setTimeout(callback, delay);
```

- `callback`: The function to execute.
- `delay`: The time (in milliseconds) before the function is executed.

Example:

```javascript
setTimeout(() => {
  console.log("Executed after 2 seconds");
}, 2000);
```

### 3. What is `setInterval()` in JavaScript?

`setInterval()` is similar to `setTimeout()`, but it repeatedly executes a function at specified intervals (in milliseconds).

Syntax:

```javascript
setInterval(callback, interval);
```

- `callback`: The function to execute.
- `interval`: The time (in milliseconds) between each function execution.

Example:

```javascript
setInterval(() => {
  console.log("This will repeat every 3 seconds");
}, 3000);
