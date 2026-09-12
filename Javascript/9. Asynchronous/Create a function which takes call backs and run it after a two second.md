Here are two common ways to implement this in JavaScript:

### 1. Using a Standard Callback

```javascript
function runAfterTwoSeconds(callback) {
  setTimeout(callback, 2000);
}

// Example usage:
runAfterTwoSeconds(() => {
  console.log("Executed after 2 seconds!");
});

```

---

### 2. Passing Arguments to the Callback

If your callback needs parameters, you can use rest parameters (`...args`):

```javascript
function runAfterTwoSeconds(callback, ...args) {
  setTimeout(() => {
    callback(...args);
  }, 2000);
}

// Example usage:
function greet(name, role) {
  console.log(`Hello, ${name}! Role: ${role}`);
}

runAfterTwoSeconds(greet, "Alice", "Developer");

```
