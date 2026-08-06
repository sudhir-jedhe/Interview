# How does `this` behave in different JavaScript contexts?

- **Global context**: `this` refers to the global object (`window` in browsers).
- **Inside a function**: In non-strict mode, `this` refers to the global object; in strict mode, `this` is `undefined`.
- **Inside an object method**: `this` refers to the object the method is called on.
- **Inside a class method**: `this` refers to the instance of the class.

### 17. What is debouncing in JavaScript, and how is it implemented?

**Debouncing** ensures that a function is not called multiple times within a short period, especially for events like resizing or typing. It delays the execution of a function until after a specified time has passed since the last call.

Example:

```javascript
let timeout;
function debounce(func, delay) {
  clearTimeout(timeout);
  timeout = setTimeout(func, delay);
}
```

### 18. What is throttling in JavaScript, and what are its benefits?

**Throttling** limits the number of times a function can be executed over time, ensuring it is executed at most once in a specific time interval. It’s useful for controlling resource-heavy functions like scroll or resize events.
