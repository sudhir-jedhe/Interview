### 20. Explain how promises can be chained in JavaScript

Promises can be chained by using the `then()` method, which returns a new promise.

Example:

```javascript
fetch("url")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

### 21. What are the differences between `Promise.all()`, `Promise.any()`, `Promise.allSettled()`, and `Promise.race()`?

- **`Promise.all()`**: Resolves when all promises are fulfilled or rejects as soon as one promise rejects.
- **`Promise.any()`**: Resolves when any of the promises are fulfilled, rejects if all are rejected.
- **`Promise.allSettled()`**: Resolves when all promises have settled (either fulfilled or rejected).
- **`Promise.race()`**: Resolves or rejects as soon as any of the promises resolves or rejects.
