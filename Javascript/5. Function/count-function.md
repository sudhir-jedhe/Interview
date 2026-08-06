Please create a function count(), when called it should return how many times it has been called, count.reset() should also implemented.

```javascript
count(); // 1
count(); // 2
count(); // 3

count.reset();

count(); // 1
count(); // 2
count(); // 3

const count = (() => {
  let num = 0;
  const func = () => ++num;
  func.reset = () => (num = 0);
  return func;
})();
```

```javascript

function count() {
  count.val = count.val || 1;
  return count.val++;
}

count.reset = function () {
  count.val = 1;
};


```

To create a `count()` function that tracks how many times it has been called and provides a `reset()` method to reset the counter, we can encapsulate the counter state within a closure. This ensures that the counter is private and only accessible through the provided `count()` function and its `reset()` method.

### Here's how we can implement it:

```javascript
const count = (() => {
  // Private variable to hold the count value
  let num = 0;

  // The main function that increments and returns the count
  const func = () => {
    return ++num;
  };

  // Attach a reset method to reset the count to zero
  func.reset = () => {
    num = 0;
  };

  return func;
})();

// Example usage:

console.log(count()); // 1
console.log(count()); // 2
console.log(count()); // 3

count.reset();

console.log(count()); // 1
console.log(count()); // 2
console.log(count()); // 3
```

### Explanation:
- **`num`**: A private variable initialized to `0` that tracks the number of times `count()` has been called.
- **`func`**: The function that increments `num` by `1` and returns the current count. This is what the user will call each time to get the count.
- **`func.reset`**: A method added to `func` that resets `num` to `0`, effectively resetting the counter.

### How it works:
1. **`count()`**: When you call `count()`, it increments the internal `num` and returns the updated value.
2. **`count.reset()`**: This method resets the counter (`num`) back to `0`.

### Example Output:
```javascript
count(); // 1
count(); // 2
count(); // 3

count.reset();

count(); // 1
count(); // 2
count(); // 3
```

This solution provides a concise and encapsulated way of maintaining and resetting the counter. The counter is reset every time you call `count.reset()`, and the function works as expected when incremented.